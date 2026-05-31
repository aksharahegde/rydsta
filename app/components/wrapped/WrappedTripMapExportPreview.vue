<script setup lang="ts">
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
const svg = computed(() => buildTripMapExportSvg(props.trips))

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
    v-if="svg"
    class="rw-tile rw-tile--trip-map rw-tile--trip-map--export"
    data-testid="wrapped-trip-map-export-preview"
  >
    <div class="rw-tile--trip-map-body rw-tile--trip-map-body--export">
      <svg
        class="rw-trip-map-export"
        :viewBox="svg.viewBox"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <path
          v-for="(d, index) in svg.arcPaths"
          :key="index"
          :d="d"
          class="rw-trip-map-export__arc"
        />
        <circle
          v-for="(point, index) in svg.pickups"
          :key="`p-${index}`"
          class="rw-trip-map-export__pickup"
          :cx="point.x"
          :cy="point.y"
          r="3.5"
        />
        <circle
          v-for="(point, index) in svg.dropoffs"
          :key="`d-${index}`"
          class="rw-trip-map-export__dropoff"
          :cx="point.x"
          :cy="point.y"
          r="2.5"
        />
      </svg>
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
