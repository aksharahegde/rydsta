<script setup lang="ts">
import { tripsWithCoordinates } from '#shared/lib/trip-map-playback'
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

function onExpand() {
  if (!hasCoords.value) return
  emit('expand')
}
</script>

<template>
  <article
    class="rw-tile rw-tile--trip-map"
    data-testid="wrapped-trip-map-tile"
    :class="{ 'rw-tile--trip-map--empty': !hasCoords }"
  >
    <div class="rw-tile--trip-map-header">
      <p class="rw-tile-eyebrow">
        Your routes · {{ year }}
      </p>
      <p
        v-if="hasCoords"
        class="rw-tile--trip-map-meta"
      >
        {{ coordCount }} trips with locations
      </p>
      <p
        v-else
        class="rw-tile--trip-map-meta"
      >
        No coordinates in this export
      </p>
    </div>

    <button
      v-if="hasCoords"
      type="button"
      class="rw-tile--trip-map-body"
      data-testid="wrapped-trip-map-expand"
      @click="onExpand"
    >
      <ClientOnly>
        <WrappedTripMap
          :trips="trips"
          mode="overview"
          :interactive="false"
        />
        <template #fallback>
          <div class="rw-tile--trip-map-fallback" />
        </template>
      </ClientOnly>
      <span class="rw-tile--trip-map-expand-label">Expand map</span>
    </button>

    <p
      v-else
      class="rw-tile--trip-map-empty"
    >
      Upload an Uber rider export with latitude and longitude columns to see your routes.
      <NuxtLink
        to="/upload"
        class="rw-tile--trip-map-upload"
      >
        Upload again
      </NuxtLink>
    </p>
  </article>
</template>
