<script setup lang="ts">
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import {
  allTripPointsGeoJson,
  boundsForTrip,
  boundsForTrips,
  sliceArcCoordinates,
  tripArcGeoJson,
  tripsWithCoordinates,
} from '#shared/lib/trip-map-playback'
import type { Trip } from '#shared/types/trip'

const MAP_STYLE = 'https://demotiles.maplibre.org/style.json'
const ARC_DRAW_MS = 450

const props = withDefaults(
  defineProps<{
    trips: Trip[]
    activeIndex?: number
    mode?: 'overview' | 'playback'
    interactive?: boolean
  }>(),
  {
    activeIndex: 0,
    mode: 'overview',
    interactive: true,
  },
)

const containerRef = ref<HTMLElement | null>(null)
let map: maplibregl.Map | null = null
let resizeObserver: ResizeObserver | null = null
let arcFrame = 0
let arcStart = 0

const coordTrips = computed(() => tripsWithCoordinates(props.trips))

function ensureMap() {
  if (!containerRef.value || map) return

  map = new maplibregl.Map({
    container: containerRef.value,
    style: MAP_STYLE,
    attributionControl: false,
    interactive: props.interactive,
    fadeDuration: 0,
  })

  map.on('load', () => {
    if (!map) return

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
        'circle-radius': 4,
        'circle-color': '#c88a2e',
        'circle-opacity': 0.85,
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
        'circle-radius': 3,
        'circle-color': '#1c2233',
        'circle-opacity': 0.9,
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
        'line-color': '#c88a2e',
        'line-width': 3,
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
        'circle-radius': 8,
        'circle-color': '#c88a2e',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#f8f6f2',
      },
    })

    map.addLayer({
      id: 'trip-active-dropoff',
      type: 'circle',
      source: 'trip-active-dropoff',
      paint: {
        'circle-radius': 7,
        'circle-color': '#1c2233',
        'circle-stroke-width': 2,
        'circle-stroke-color': '#c88a2e',
      },
    })

    syncMap()
  })
}

function setGeoJson(sourceId: string, data: object) {
  const source = map?.getSource(sourceId) as maplibregl.GeoJSONSource | undefined
  source?.setData(data as maplibregl.GeoJSONSource['data'])
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
    const progress = Math.min(1, (now - arcStart) / ARC_DRAW_MS)
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

function fitBounds(padding = 40) {
  if (!map) return
  const bounds =
    props.mode === 'playback'
      ? boundsForTrip(coordTrips.value[props.activeIndex]!)
      : boundsForTrips(props.trips)

  if (!bounds) return

  map.fitBounds(bounds, {
    padding,
    duration: props.mode === 'playback' ? 600 : 0,
    maxZoom: props.mode === 'playback' ? 14 : 12,
  })
}

function syncOverview() {
  if (!map?.isStyleLoaded()) return

  setGeoJson('trip-points', allTripPointsGeoJson(props.trips))
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

  fitBounds(24)
}

function syncPlayback() {
  if (!map?.isStyleLoaded()) return

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
  if (arc) {
    animateArc(arc.geometry.coordinates)
  }

  fitBounds(props.mode === 'playback' ? 56 : 40)
}

function syncMap() {
  if (!map?.isStyleLoaded()) return
  if (props.mode === 'overview') syncOverview()
  else syncPlayback()
}

watch(
  () => [props.trips, props.activeIndex, props.mode] as const,
  () => syncMap(),
  { deep: true },
)

watch(containerRef, (el) => {
  if (el) ensureMap()
})

onMounted(() => {
  ensureMap()
  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => map?.resize())
    resizeObserver.observe(containerRef.value)
  }
})

onUnmounted(() => {
  cancelArcAnimation()
  resizeObserver?.disconnect()
  map?.remove()
  map = null
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
  min-height: 10rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-paper-2);
}

:deep(.maplibregl-canvas) {
  outline: none;
}
</style>
