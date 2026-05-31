<script setup lang="ts">
import WrappedTripMap from '~/components/wrapped/WrappedTripMap.vue'
import WrappedTripMapSvgLayers from '~/components/wrapped/WrappedTripMapSvgLayers.vue'
import { buildTripMapExportSvg } from '#shared/lib/trip-map-export-svg'
import {
  primaryCityFromTrips,
  tripsWithCoordinates,
} from '#shared/lib/trip-map-playback'
import type { Trip } from '#shared/types/trip'

const props = defineProps<{
  trips: Trip[]
  year: number
}>()

const emit = defineEmits<{
  expand: []
}>()

const coordCount = computed(() => tripsWithCoordinates(props.trips).length)
const hasCoords = computed(() => coordCount.value > 0)
const hasSvg = computed(() =>
  buildTripMapExportSvg(props.trips, { allCoordinates: true }) !== null,
)

const mapHostReady = ref(false)
const mapLive = ref(false)

const primaryCity = computed(() => primaryCityFromTrips(props.trips))

const mapTitle = computed(() => {
  const city = primaryCity.value
  if (city?.fromCityField && city.label) {
    return `${city.label} · ${props.year}`
  }
  return `Your routes · ${props.year}`
})

onMounted(async () => {
  await nextTick()
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  })
  mapHostReady.value = true
})

function onMapReady() {
  mapLive.value = true
}

function onExpand() {
  if (!hasCoords.value) return
  emit('expand')
}

function onExpandKeydown(event: KeyboardEvent) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    onExpand()
  }
}
</script>

<template>
  <article
    class="rw-tile rw-tile--trip-map"
    data-testid="wrapped-trip-map-tile"
    :class="{ 'rw-tile--trip-map--empty': !hasCoords }"
  >
    <template v-if="hasCoords">
      <div
        role="button"
        tabindex="0"
        class="rw-tile--trip-map-body"
        data-testid="wrapped-trip-map-expand"
        @click="onExpand"
        @keydown="onExpandKeydown"
      >
        <WrappedTripMapSvgLayers
          v-if="hasSvg"
          :trips="trips"
          all-coordinates
          class="rw-trip-map-svg-underlay"
        />
        <WrappedTripMap
          v-if="mapHostReady"
          class="rw-trip-map--tile"
          :class="{ 'rw-trip-map--tile-live': mapLive }"
          :trips="trips"
          mode="overview"
          overview-all-coordinates
          :interactive="false"
          @ready="onMapReady"
        />
        <div class="rw-tile--trip-map-overlay">
          <p class="rw-tile-eyebrow rw-tile--trip-map-eyebrow">
            {{ mapTitle }}
          </p>
          <p class="rw-tile--trip-map-meta">
            {{ coordCount }} trips mapped
          </p>
          <span class="rw-tile--trip-map-expand-label">Expand map</span>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="rw-tile--trip-map-header">
        <p class="rw-tile-eyebrow">
          Your routes · {{ year }}
        </p>
        <p class="rw-tile--trip-map-meta">
          No coordinates in this export
        </p>
      </div>
      <p class="rw-tile--trip-map-empty">
        Upload an export with latitude and longitude columns to see your routes.
        <NuxtLink
          to="/upload"
          class="rw-tile--trip-map-upload"
        >
          Upload again
        </NuxtLink>
      </p>
    </template>
  </article>
</template>
