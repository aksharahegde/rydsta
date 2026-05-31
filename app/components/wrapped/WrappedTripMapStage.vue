<script setup lang="ts">
import {
  formatPlaybackSpeedLabel,
  isPlaybackSpeed,
  PLAYBACK_SPEED_OPTIONS,
} from '#shared/lib/map-playback-speed'
import { mapPlaybackMessageAt } from '#shared/lib/map-playback-messages'
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
  playbackSpeed,
  setPlaybackSpeed,
  togglePlay,
  next,
  prev,
  reset,
} = useTripMapPlayback(yearTripsRef)

const speedOptions = PLAYBACK_SPEED_OPTIONS

const MAP_WARMUP_MS = 700
const MESSAGE_CYCLE_MS = 2200

const mapReady = ref(false)
const initialPlaybackReady = ref(false)
const initialLoadDone = ref(false)
const playWarmup = ref(false)
const messageIndex = ref(0)

let warmupTimer: ReturnType<typeof setTimeout> | null = null
let messageTimer: ReturnType<typeof setInterval> | null = null

const showPlaybackOverlay = computed(
  () =>
    !initialLoadDone.value
    && isPlaying.value
    && (playWarmup.value
      || !mapReady.value
      || !initialPlaybackReady.value),
)

const playbackMessage = computed(() =>
  mapPlaybackMessageAt(messageIndex.value),
)

function clearWarmupTimer() {
  if (warmupTimer !== null) {
    clearTimeout(warmupTimer)
    warmupTimer = null
  }
}

function clearMessageTimer() {
  if (messageTimer !== null) {
    clearInterval(messageTimer)
    messageTimer = null
  }
}

function startMessageCycle() {
  clearMessageTimer()
  messageTimer = setInterval(() => {
    messageIndex.value += 1
  }, MESSAGE_CYCLE_MS)
}

function beginPlayWarmup() {
  playWarmup.value = true
  clearWarmupTimer()
  warmupTimer = setTimeout(() => {
    playWarmup.value = false
    warmupTimer = null
  }, MAP_WARMUP_MS)
}

function resetOverlayState() {
  mapReady.value = false
  initialPlaybackReady.value = false
  initialLoadDone.value = false
  playWarmup.value = false
  messageIndex.value = 0
  clearWarmupTimer()
  clearMessageTimer()
}

function onMapReady() {
  mapReady.value = true
}

function onPlaybackSettled() {
  if (!initialPlaybackReady.value) initialPlaybackReady.value = true
}

function markInitialLoadDone() {
  if (initialLoadDone.value) return
  if (!isPlaying.value) return
  if (playWarmup.value || !mapReady.value || !initialPlaybackReady.value) return
  initialLoadDone.value = true
}

watch(showPlaybackOverlay, (visible) => {
  if (visible) startMessageCycle()
  else clearMessageTimer()
})

watch(isPlaying, (playing) => {
  if (playing) {
    if (!initialLoadDone.value) beginPlayWarmup()
    return
  }
  playWarmup.value = false
  clearWarmupTimer()
})

watch([mapReady, initialPlaybackReady, playWarmup, isPlaying], markInitialLoadDone)

function onSpeedChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  if (isPlaybackSpeed(value)) setPlaybackSpeed(value)
}

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
  resetOverlayState()
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
  resetOverlayState()
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
            :playback-speed="playbackSpeed"
            :interactive="true"
            @ready="onMapReady"
            @playback-settled="onPlaybackSettled"
          />
        </ClientOnly>
        <WrappedTripMapPlaybackOverlay
          v-if="showPlaybackOverlay"
          :message="playbackMessage"
          :trip-index="currentIndex + 1"
          :trip-count="tripCount"
        />
      </div>

      <p
        v-if="routeLabel"
        class="rw-trip-map-stage__route rw-tile-clamp rw-tile-clamp--2"
      >
        {{ routeLabel }}
      </p>

      <footer class="rw-trip-map-stage__controls">
        <select
          class="rw-trip-map-stage__speed-select"
          data-testid="wrapped-trip-map-speed"
          :value="playbackSpeed"
          :disabled="!hasTrips"
          aria-label="Playback speed"
          @change="onSpeedChange"
        >
          <option
            v-for="speed in speedOptions"
            :key="speed"
            :value="speed"
          >
            {{ formatPlaybackSpeedLabel(speed) }}
          </option>
        </select>
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
