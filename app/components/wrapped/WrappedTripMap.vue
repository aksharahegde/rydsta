<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  MAP_OVERVIEW_MAX_ZOOM,
  MAP_OVERVIEW_MIN_ZOOM,
  MAP_PLAYBACK_MAX_ZOOM,
  MAP_STYLE_DARK,
  MAP_STYLE_LIGHT,
} from '~/constants/map-styles'
import {
  allTripPointsGeoJson,
  boundsForOverview,
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
    interactive?: boolean
    playbackSpeed?: number
    forceNight?: boolean
  }>(),
  {
    activeIndex: 0,
    mode: 'overview',
    interactive: true,
    playbackSpeed: 1,
    forceNight: false,
  },
)

let hasEmittedReady = false
let playbackSyncGen = 0
let syncRaf = 0
let lastPlaybackArcIndex = -1

const arcDrawMs = computed(() => arcDrawMsForSpeed(props.playbackSpeed))

const { isDark } = useRideTheme()

const containerRef = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let resizeObserver: ResizeObserver | null = null
let arcFrame = 0
let arcStart = 0
let layersReady = false

const coordTrips = computed(() => tripsWithCoordinates(props.trips))
const overviewTrips = computed(() => tripsForMapOverview(props.trips))

const routeColor = computed(() => (isDark.value ? '#f8f6f2' : '#1c2233'))

function mapStyleUrl(): string {
  return (isDark.value || props.forceNight) ? MAP_STYLE_DARK : MAP_STYLE_LIGHT
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
      'line-color': routeColor.value,
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

function ensureMap() {
  if (!containerRef.value || map) return

  const { clientWidth, clientHeight } = containerRef.value
  if (clientWidth < 2 || clientHeight < 2) {
    requestAnimationFrame(ensureMap)
    return
  }

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
  map.setPaintProperty('trip-arc-line', 'line-color', routeColor.value)
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

function fitCamera(padding = 40) {
  if (!map) return

  const isPlayback = props.mode === 'playback'
  const bounds = isPlayback
    ? boundsForTrip(coordTrips.value[props.activeIndex]!)
    : boundsForOverview(props.trips)

  if (bounds) {
    map.fitBounds(bounds, {
      padding,
      duration: isPlayback ? 900 : 0,
      maxZoom: isPlayback ? MAP_PLAYBACK_MAX_ZOOM : MAP_OVERVIEW_MAX_ZOOM,
      minZoom: MAP_OVERVIEW_MIN_ZOOM,
      // ease-out cubic: quick departure, smooth arrival
      easing: isPlayback ? (t: number) => 1 - Math.pow(1 - t, 3) : undefined,
      // curve=1 keeps zoom level stable during the pan — less "fly up and dive down"
      curve: isPlayback ? 1 : 1.42,
    })
    return
  }

  const center = mapCenterForOverview(props.trips)
  if (center) {
    map.flyTo({
      center,
      zoom: MAP_OVERVIEW_MAX_ZOOM,
      duration: isPlayback ? 900 : 0,
      easing: isPlayback ? (t: number) => 1 - Math.pow(1 - t, 3) : undefined,
      curve: isPlayback ? 1 : 1.42,
    })
  }
}

function syncOverview() {
  if (!map?.isStyleLoaded() || !layersReady) return

  updateRouteColor()

  setGeoJson('trip-points', allTripPointsGeoJson(overviewTrips.value))
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

  fitCamera(props.mode === 'overview' && !props.interactive ? 16 : 28)
}

function syncPlayback() {
  if (!map?.isStyleLoaded() || !layersReady) return

  const settleGen = ++playbackSyncGen
  const settledIndex = props.activeIndex

  updateRouteColor()

  const trip = coordTrips.value[props.activeIndex]
  if (!trip) {
    setGeoJson('trip-arc', { type: 'FeatureCollection', features: [] })
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

  map.once('idle', () => {
    if (settleGen !== playbackSyncGen) return
    emit('playbackSettled', settledIndex)
  })
}

function syncMap() {
  if (!map?.isStyleLoaded() || !layersReady) return
  if (props.mode === 'overview') syncOverview()
  else syncPlayback()

  if (!hasEmittedReady) {
    hasEmittedReady = true
    emit('ready')
  }
}

function reloadStyle() {
  if (!map) return
  layersReady = false
  map.setStyle(mapStyleUrl())
}

watch(
  () => [props.trips, props.activeIndex, props.mode] as const,
  () => scheduleSync(),
  { deep: true },
)

watch(isDark, () => {
  reloadStyle()
})

watch(() => props.forceNight, () => {
  reloadStyle()
})

watch(routeColor, () => {
  updateRouteColor()
})

watch(containerRef, (el) => {
  if (el) ensureMap()
})

onMounted(() => {
  ensureMap()
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      map?.resize()
      scheduleSync()
    })
    resizeObserver.observe(containerRef.value)
  }
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
  resizeObserver?.disconnect()
  map?.remove()
  map = null
  layersReady = false
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
