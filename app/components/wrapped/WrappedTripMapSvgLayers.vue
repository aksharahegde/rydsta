<script setup lang="ts">
import { buildTripMapExportSvg } from '#shared/lib/trip-map-export-svg'
import type { Trip } from '#shared/types/trip'

const props = withDefaults(
  defineProps<{
    trips: Trip[]
    /** When true, plot every trip with coordinates (tile preview). */
    allCoordinates?: boolean
  }>(),
  { allCoordinates: false },
)

const svg = computed(() =>
  buildTripMapExportSvg(props.trips, { allCoordinates: props.allCoordinates }),
)
</script>

<template>
  <svg
    v-if="svg"
    class="rw-trip-map-svg"
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
</template>
