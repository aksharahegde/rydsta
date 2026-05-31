<script setup lang="ts">
import { tripsWithCoordinates } from '#shared/lib/trip-map-playback'
import type { Trip } from '#shared/types/trip'

const props = defineProps<{
  trips: Trip[]
  year: number
}>()

const emit = defineEmits<{
  close: []
}>()

const yearTripsRef = computed(() => props.trips)

const {
  playbackTrips,
  currentIndex,
  currentTrip,
  tripCount,
  hasTrips,
  isPlaying,
  togglePlay,
  next,
  prev,
  reset,
} = useTripMapPlayback(yearTripsRef)

const routeLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip?.pickup && !trip?.dropoff) return ''
  const from = trip.pickup?.trim() || 'Pickup'
  const to = trip.dropoff?.trim() || 'Dropoff'
  return `${from} → ${to}`
})

const dateLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip) return ''
  return trip.startedAt.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
})

function onClose() {
  reset()
  emit('close')
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') onClose()
  if (event.key === 'ArrowRight') next()
  if (event.key === 'ArrowLeft') prev()
}

onMounted(() => {
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
  reset()
})
</script>

<template>
  <div
    class="rw-trip-map-stage"
    data-testid="wrapped-trip-map-stage"
    role="dialog"
    aria-modal="true"
    aria-label="Trip map playback"
  >
    <div class="rw-trip-map-stage__backdrop" @click="onClose" />

    <div class="rw-trip-map-stage__panel">
      <header class="rw-trip-map-stage__header">
        <div>
          <p class="rw-trip-map-stage__title">
            Your routes · {{ year }}
          </p>
          <p
            v-if="currentTrip"
            class="rw-trip-map-stage__subtitle"
          >
            <span data-testid="wrapped-trip-map-counter">
              {{ currentIndex + 1 }} / {{ tripCount }}
            </span>
            <span v-if="dateLabel"> · {{ dateLabel }}</span>
          </p>
        </div>
        <button
          type="button"
          class="rw-trip-map-stage__close"
          data-testid="wrapped-trip-map-close"
          aria-label="Close map"
          @click="onClose"
        >
          Close
        </button>
      </header>

      <div class="rw-trip-map-stage__map">
        <ClientOnly>
          <WrappedTripMap
            v-if="hasTrips"
            :trips="playbackTrips"
            mode="playback"
            :active-index="currentIndex"
            :interactive="true"
          />
        </ClientOnly>
      </div>

      <p
        v-if="routeLabel"
        class="rw-trip-map-stage__route rw-tile-clamp rw-tile-clamp--2"
      >
        {{ routeLabel }}
      </p>

      <footer class="rw-trip-map-stage__controls">
        <button
          type="button"
          class="rw-trip-map-stage__btn"
          data-testid="wrapped-trip-map-prev"
          :disabled="!hasTrips || currentIndex <= 0"
          @click="prev"
        >
          Prev
        </button>
        <button
          type="button"
          class="rw-trip-map-stage__btn rw-trip-map-stage__btn--primary"
          :data-testid="isPlaying ? 'wrapped-trip-map-pause' : 'wrapped-trip-map-play'"
          :disabled="!hasTrips"
          @click="togglePlay"
        >
          {{ isPlaying ? 'Pause' : 'Play' }}
        </button>
        <button
          type="button"
          class="rw-trip-map-stage__btn"
          data-testid="wrapped-trip-map-next"
          :disabled="!hasTrips || currentIndex >= tripCount - 1"
          @click="next"
        >
          Next
        </button>
      </footer>
    </div>
  </div>
</template>
