<script setup lang="ts">
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

const coordCount = computed(() => tripsWithCoordinates(props.trips).length)
const hasSvg = computed(() => buildTripMapExportSvg(props.trips) !== null)

const primaryCity = computed(() => primaryCityFromTrips(props.trips))

const mapTitle = computed(() => {
  const city = primaryCity.value
  if (city?.fromCityField && city.label) {
    return `${city.label} · ${props.year}`
  }
  return `Your routes · ${props.year}`
})
</script>

<template>
  <article
    v-if="hasSvg"
    class="rw-tile rw-tile--trip-map rw-tile--trip-map--export"
    data-testid="wrapped-trip-map-export-preview"
  >
    <div class="rw-tile--trip-map-body rw-tile--trip-map-body--export">
      <WrappedTripMapSvgLayers :trips="trips" />
      <div class="rw-tile--trip-map-overlay">
        <p class="rw-tile-eyebrow rw-tile--trip-map-eyebrow">
          {{ mapTitle }}
        </p>
        <p class="rw-tile--trip-map-meta">
          {{ coordCount }} trips mapped
        </p>
      </div>
    </div>
  </article>
</template>
