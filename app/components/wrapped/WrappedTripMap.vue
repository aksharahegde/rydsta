<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  MAP_OVERVIEW_MAX_ZOOM,
  MAP_OVERVIEW_MIN_ZOOM,
  MAP_PLAYBACK_MAX_ZOOM,
  MAP_STYLE_LIGHT,
} from '~/constants/map-styles'
import {
  allTripPointsGeoJson,
  boundsForOverview,
  boundsForTrips,
  boundsForTrip,
  mapCenterForOverview,
  sliceArcCoordinates,
  tripArcGeoJson,
  tripsForMapOverview,
  tripsWithCoordinates,
} from '#shared/lib/trip-map-playback'
import { arcDrawMsForSpeed } from '#shared/lib/map-playback-speed'
import type { Trip } from '#shared/types/trip'

const emit = defineEmits<{
  ready: []
  playbackSettled: [index: number]
}>()

const props = withDefaults(
  defineProps<{
    trips: Trip[]
    activeIndex?: number
    mode?: 'overview' | 'playback'
    /** Idle preview: all pickup/dropoff points before first play at trip 0. */
    showAllPoints?: boolean
    /** Overview tile: plot every trip with coordinates, not only the primary-city subset. */
    overviewAllCoordinates?: boolean
    interactive?: boolean
    playbackSpeed?: number
  }>(),
  {
    activeIndex: 0,
    mode: 'overview',
    showAllPoints: false,
    overviewAllCoordinates: false,
    interactive: true,
    playbackSpeed: 1,
  },
)

let hasEmittedReady = false
let playbackSyncGen = 0
let syncRaf = 0
let lastPlaybackArcIndex = -1

const arcDrawMs = computed(() => arcDrawMsForSpeed(props.playbackSpeed))

const ROUTE_COLOR = '#1c2233'

const containerRef = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let containerObserver: ResizeObserver | null = null
let arcFrame = 0
let arcStart = 0
let layersReady = false

const coordTrips = computed(() => tripsWithCoordinates(props.trips))
const overviewTrips = computed(() => tripsForMapOverview(props.trips))

const tripsSyncKey = computed(() => {
  const trips = props.trips
  if (trips.length === 0) return 'empty'
  const first = trips[0]!.startedAt.getTime()
  const last = trips[trips.length - 1]!.startedAt.getTime()
  return `${trips.length}:${first}:${last}`
})

function mapStyleUrl(): string {
  return MAP_STYLE_LIGHT
}

function addTripLayers() {
  if (!map || map.getSource('trip-points')) {
    layersReady = Boolean(map?.getSource('trip-points'))
    return
  }

  map.addSource('trip-points', {
    type: 'geojson',
    data: allTripPointsGeoJson([]),
  })

  map.addLayer({
    id: 'trip-points-pickup',
    type: 'circle',
    source: 'trip-points',
    filter: ['==', ['get', 'kind'], 'pickup'],
    paint: {
      'circle-radius': 3,
      'circle-color': '#c88a2e',
      'circle-opacity': 0.55,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#f8f6f2',
    },
  })

  map.addLayer({
    id: 'trip-points-dropoff',
    type: 'circle',
    source: 'trip-points',
    filter: ['==', ['get', 'kind'], 'dropoff'],
    paint: {
      'circle-radius': 2.5,
      'circle-color': '#1c2233',
      'circle-opacity': 0.45,
      'circle-stroke-width': 1,
      'circle-stroke-color': '#c88a2e',
    },
  })

  map.addSource('trip-arc', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  })

  map.addLayer({
    id: 'trip-arc-line',
    type: 'line',
    source: 'trip-arc',
    paint: {
      'line-color': ROUTE_COLOR,
      'line-width': 4,
      'line-opacity': 0.95,
    },
    layout: {
      'line-cap': 'round',
      'line-join': 'round',
    },
  })

  map.addSource('trip-active-pickup', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  })

  map.addSource('trip-active-dropoff', {
    type: 'geojson',
    data: { type: 'FeatureCollection', features: [] },
  })

  map.addLayer({
    id: 'trip-active-pickup',
    type: 'circle',
    source: 'trip-active-pickup',
    paint: {
      'circle-radius': 9,
      'circle-color': '#c88a2e',
      'circle-stroke-width': 2.5,
      'circle-stroke-color': '#f8f6f2',
    },
  })

  map.addLayer({
    id: 'trip-active-dropoff',
    type: 'circle',
    source: 'trip-active-dropoff',
    paint: {
      'circle-radius': 8,
      'circle-color': '#1c2233',
      'circle-stroke-width': 2.5,
      'circle-stroke-color': '#c88a2e',
    },
  })

  layersReady = true
}

function onStyleReady() {
  if (!map) return
  addTripLayers()
  scheduleSync()
}

function scheduleSync() {
  if (!map) return
  if (syncRaf) cancelAnimationFrame(syncRaf)
  syncRaf = requestAnimationFrame(() => {
    syncRaf = 0
    if (!map) return
    if (!map.isStyleLoaded() || !layersReady) {
      map.once('idle', scheduleSync)
      return
    }
    syncMap()
  })
}

function tryCreateMap() {
  if (!containerRef.value || map) return

  const { clientWidth, clientHeight } = containerRef.value
  if (clientWidth < 2 || clientHeight < 2) return

  const center = mapCenterForOverview(props.trips) ?? [77.59, 12.97]

  map = new maplibregl.Map({
    container: containerRef.value,
    style: mapStyleUrl(),
    center,
    zoom: MAP_OVERVIEW_MIN_ZOOM,
    attributionControl: false,
    interactive: props.interactive,
    fadeDuration: 0,
    maxPitch: 0,
    renderWorldCopies: false,
  })

  map.on('load', () => {
    map?.resize()
    onStyleReady()
    requestAnimationFrame(() => map?.resize())
  })
  map.on('error', (event) => {
    console.error('[WrappedTripMap]', event.error ?? event)
  })
  map.on('styledata', () => {
    if (!map?.isStyleLoaded()) return
    if (!layersReady) onStyleReady()
  })
}

function setGeoJson(sourceId: string, data: object) {
  const source = map?.getSource(sourceId) as maplibregl.GeoJSONSource | undefined
  source?.setData(data as maplibregl.GeoJSONSource['data'])
}

function updateRouteColor() {
  if (!map?.getLayer('trip-arc-line')) return
  map.setPaintProperty('trip-arc-line', 'line-color', ROUTE_COLOR)
}

function cancelArcAnimation() {
  if (arcFrame) cancelAnimationFrame(arcFrame)
  arcFrame = 0
}

function animateArc(fullCoords: ReturnType<typeof sliceArcCoordinates>) {
  cancelArcAnimation()
  if (!map || fullCoords.length === 0) return

  arcStart = performance.now()

  const tick = (now: number) => {
    const progress = Math.min(1, (now - arcStart) / arcDrawMs.value)
    const slice = sliceArcCoordinates(fullCoords, progress)
    const feature = {
      type: 'Feature' as const,
      properties: {},
      geometry: { type: 'LineString' as const, coordinates: slice },
    }
    setGeoJson('trip-arc', {
      type: 'FeatureCollection',
      features: slice.length >= 2 ? [feature] : [],
    })

    if (progress < 1) {
      arcFrame = requestAnimationFrame(tick)
    } else {
      arcFrame = 0
    }
  }

  arcFrame = requestAnimationFrame(tick)
}

function fitCamera(padding = 40, overviewBounds: ReturnType<typeof boundsForOverview> = null) {
  if (!map) return

  const showAllCoordPoints = props.mode === 'playback' && props.showAllPoints
  const isActivePlaybackTrip = props.mode === 'playback' && !props.showAllPoints
  const bounds = isActivePlaybackTrip
    ? boundsForTrip(coordTrips.value[props.activeIndex]!)
    : showAllCoordPoints
      ? boundsForTrips(coordTrips.value)
      : overviewBounds ?? boundsForOverview(props.trips)

  if (bounds) {
    map.fitBounds(bounds, {
      padding,
      duration: isActivePlaybackTrip ? 900 : 0,
      maxZoom: isActivePlaybackTrip ? MAP_PLAYBACK_MAX_ZOOM : MAP_OVERVIEW_MAX_ZOOM,
      minZoom: MAP_OVERVIEW_MIN_ZOOM,
      // ease-out cubic: quick departure, smooth arrival
      easing: isActivePlaybackTrip ? (t: number) => 1 - Math.pow(1 - t, 3) : undefined,
      // curve=1 keeps zoom level stable during the pan — less "fly up and dive down"
      curve: isActivePlaybackTrip ? 1 : 1.42,
    })
    return
  }

  const center = showAllCoordPoints
    ? (() => {
        const b = boundsForTrips(coordTrips.value)
        return b
          ? [(b[0][0] + b[1][0]) / 2, (b[0][1] + b[1][1]) / 2] as [number, number]
          : null
      })()
    : mapCenterForOverview(props.trips)
  if (center) {
    map.flyTo({
      center,
      zoom: MAP_OVERVIEW_MAX_ZOOM,
      duration: isActivePlaybackTrip ? 900 : 0,
      easing: isActivePlaybackTrip ? (t: number) => 1 - Math.pow(1 - t, 3) : undefined,
      curve: isActivePlaybackTrip ? 1 : 1.42,
    })
  }
}

function syncOverview() {
  if (!map?.isStyleLoaded() || !layersReady) return

  updateRouteColor()

  const pointTrips =
    props.mode === 'playback'
      ? coordTrips.value
      : props.overviewAllCoordinates
        ? coordTrips.value
        : overviewTrips.value
  setGeoJson('trip-points', allTripPointsGeoJson(pointTrips))
  setGeoJson('trip-arc', { type: 'FeatureCollection', features: [] })
  setGeoJson('trip-active-pickup', { type: 'FeatureCollection', features: [] })
  setGeoJson('trip-active-dropoff', { type: 'FeatureCollection', features: [] })

  const layers = [
    'trip-points-pickup',
    'trip-points-dropoff',
    'trip-arc-line',
    'trip-active-pickup',
    'trip-active-dropoff',
  ]
  for (const id of layers) {
    map.setLayoutProperty(
      id,
      'visibility',
      id.startsWith('trip-active') || id === 'trip-arc-line' ? 'none' : 'visible',
    )
  }

  const overviewBounds = props.overviewAllCoordinates
    ? boundsForTrips(coordTrips.value)
    : boundsForOverview(props.trips)
  fitCamera(
    props.mode === 'overview' && !props.interactive ? 16 : 28,
    overviewBounds,
  )
}

function syncPlayback() {
  if (!map?.isStyleLoaded() || !layersReady) return

  const settleGen = ++playbackSyncGen
  const settledIndex = props.activeIndex

  updateRouteColor()

  const trip = coordTrips.value[props.activeIndex]
  if (!trip) {
    setGeoJson('trip-arc', { type: 'FeatureCollection', features: [] })
    if (settleGen === playbackSyncGen) emit('playbackSettled', settledIndex)
    return
  }

  map.setLayoutProperty('trip-points-pickup', 'visibility', 'none')
  map.setLayoutProperty('trip-points-dropoff', 'visibility', 'none')
  map.setLayoutProperty('trip-arc-line', 'visibility', 'visible')
  map.setLayoutProperty('trip-active-pickup', 'visibility', 'visible')
  map.setLayoutProperty('trip-active-dropoff', 'visibility', 'visible')

  setGeoJson('trip-points', { type: 'FeatureCollection', features: [] })

  setGeoJson('trip-active-pickup', {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [trip.pickupLng!, trip.pickupLat!],
        },
      },
    ],
  })

  setGeoJson('trip-active-dropoff', {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'Point',
          coordinates: [trip.dropoffLng!, trip.dropoffLat!],
        },
      },
    ],
  })

  const arc = tripArcGeoJson(trip)
  cancelArcAnimation()
  setGeoJson('trip-arc', { type: 'FeatureCollection', features: [] })

  if (arc) {
    const sameTrip = lastPlaybackArcIndex === props.activeIndex
    lastPlaybackArcIndex = props.activeIndex
    if (sameTrip) {
      setGeoJson('trip-arc', { type: 'FeatureCollection', features: [arc] })
    } else {
      animateArc(arc.geometry.coordinates)
    }
  } else {
    lastPlaybackArcIndex = props.activeIndex
  }

  fitCamera(48)

  if (settleGen === playbackSyncGen) {
    emit('playbackSettled', settledIndex)
  }
}

function shouldShowAllPoints(): boolean {
  return props.mode === 'overview' || props.showAllPoints
}

function syncMap() {
  if (!map?.isStyleLoaded() || !layersReady) return
  if (shouldShowAllPoints()) syncOverview()
  else syncPlayback()

  if (!hasEmittedReady) {
    hasEmittedReady = true
    emit('ready')
  }
}

watch(
  () =>
    [
      tripsSyncKey.value,
      props.activeIndex,
      props.mode,
      props.showAllPoints,
      props.overviewAllCoordinates,
    ] as const,
  ([key, index], [prevKey, prevIndex]) => {
    if (key !== prevKey) hasEmittedReady = false
    if (index !== prevIndex) lastPlaybackArcIndex = -1
    scheduleSync()
  },
)

function bindContainer(el: HTMLElement | null) {
  containerObserver?.disconnect()
  containerObserver = null
  if (!el) return

  containerObserver = new ResizeObserver(() => {
    if (map) {
      map.resize()
      scheduleSync()
      return
    }
    tryCreateMap()
  })
  containerObserver.observe(el)
  tryCreateMap()
}

watch(containerRef, (el, prev) => {
  if (el && el !== prev) bindContainer(el)
})

onMounted(() => {
  if (containerRef.value) bindContainer(containerRef.value)
})

function zoomIn() { map?.zoomIn({ duration: 300 }) }
function zoomOut() { map?.zoomOut({ duration: 300 }) }
function fitView() { fitCamera(props.mode === 'playback' ? 48 : 28) }
function replayArc() {
  if (props.mode !== 'playback') return
  const trip = coordTrips.value[props.activeIndex]
  if (!trip) return
  const arc = tripArcGeoJson(trip)
  if (!arc) return
  setGeoJson('trip-arc', { type: 'FeatureCollection', features: [] })
  animateArc(arc.geometry.coordinates)
}

defineExpose({ zoomIn, zoomOut, fitView, replayArc })

onUnmounted(() => {
  cancelArcAnimation()
  if (syncRaf) cancelAnimationFrame(syncRaf)
  containerObserver?.disconnect()
  containerObserver = null
  map?.remove()
  map = null
  layersReady = false
  hasEmittedReady = false
  lastPlaybackArcIndex = -1
})
</script>

<template>
  <div
    ref="containerRef"
    class="rw-trip-map"
    role="img"
    :aria-label="mode === 'overview' ? 'Trip map overview' : 'Trip map playback'"
  />
</template>

<style scoped>
.rw-trip-map {
  width: 100%;
  height: 100%;
  min-height: 0;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-paper-2);
}

:deep(.maplibregl-canvas) {
  outline: none;
}
</style>
