<script setup lang="ts">
import {
  formatPlaybackSpeedLabel,
  isPlaybackSpeed,
  PLAYBACK_SPEED_OPTIONS,
} from '#shared/lib/map-playback-speed'
import { mapPlaybackMessageAt } from '#shared/lib/map-playback-messages'
import { tripsWithCoordinates } from '#shared/lib/trip-map-playback'
import { formatDisplayLabel } from '#shared/lib/wrapped-stats'
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
  goTo,
  reset,
} = useTripMapPlayback(yearTripsRef)

const speedOptions = PLAYBACK_SPEED_OPTIONS

const MESSAGE_CYCLE_MS = 2200

const mapRef = ref<{ zoomIn: () => void; zoomOut: () => void; fitView: () => void; replayArc: () => void } | null>(null)
const mapReady = ref(false)
const initialPlaybackReady = ref(false)
const initialLoadDone = ref(false)
const messageIndex = ref(0)
const hasEverPlayed = ref(false)

const showAllPointsOnMap = computed(
  () => !isPlaying.value && !hasEverPlayed.value && currentIndex.value === 0,
)

let messageTimer: ReturnType<typeof setInterval> | null = null

// ── Swipe gesture state ───────────────────────────────────────────
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0]!.clientX
  touchStartY = e.touches[0]!.clientY
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0]!.clientX - touchStartX
  const dy = e.changedTouches[0]!.clientY - touchStartY
  // Only trigger for mostly-horizontal swipes (avoids conflict with map pan)
  if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
    if (dx < 0) next()
    else prev()
  }
}

// ── Trip meta ─────────────────────────────────────────────────────
const timeOfDay = computed(() => {
  const h = currentTrip.value?.startedAt.getHours() ?? -1
  if (h < 0) return null
  if (h >= 22 || h < 5) return { label: 'Night ride', cls: 'rw-tod--night' }
  if (h < 10) return { label: 'Morning', cls: 'rw-tod--morning' }
  if (h < 17) return { label: 'Midday', cls: 'rw-tod--midday' }
  return { label: 'Evening', cls: 'rw-tod--evening' }
})

const fareLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip?.fare) return null
  const sym = trip.currency === 'INR' ? '₹' : (trip.currency ?? '')
  return `${sym}${Math.round(trip.fare)}`
})

const distanceLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip?.distanceKm) return null
  return `${trip.distanceKm.toFixed(1)} km`
})

const durationLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip?.startedAt || !trip?.endedAt) return null
  const mins = Math.round((trip.endedAt.getTime() - trip.startedAt.getTime()) / 60000)
  if (mins <= 0) return null
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
})

const pickupLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip?.pickup?.trim() && !trip?.dropoff) return ''
  return formatDisplayLabel(trip.pickup) ?? 'Pickup'
})

const dropoffLabel = computed(() => {
  const trip = currentTrip.value
  if (!trip?.pickup?.trim() && !trip?.dropoff) return ''
  return formatDisplayLabel(trip.dropoff) ?? 'Dropoff'
})

const hasRoute = computed(
  () => !!(pickupLabel.value || dropoffLabel.value),
)

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

const hasStats = computed(
  () => !!(fareLabel.value || distanceLabel.value || durationLabel.value),
)

// ── Playback overlay ──────────────────────────────────────────────
const showPlaybackOverlay = computed(
  () =>
    !initialLoadDone.value
    && isPlaying.value
    && (!mapReady.value || !initialPlaybackReady.value),
)

const playbackMessage = computed(() =>
  mapPlaybackMessageAt(messageIndex.value),
)

function clearMessageTimer() {
  if (messageTimer !== null) { clearInterval(messageTimer); messageTimer = null }
}

function startMessageCycle() {
  clearMessageTimer()
  messageTimer = setInterval(() => { messageIndex.value += 1 }, MESSAGE_CYCLE_MS)
}

function resetOverlayState() {
  mapReady.value = false
  initialPlaybackReady.value = false
  initialLoadDone.value = false
  hasEverPlayed.value = false
  messageIndex.value = 0
  clearMessageTimer()
}

function onMapReady() { mapReady.value = true }

function onPlaybackSettled() {
  if (!initialPlaybackReady.value) initialPlaybackReady.value = true
}

function markInitialLoadDone() {
  if (initialLoadDone.value) return
  if (!isPlaying.value) return
  if (!mapReady.value || !initialPlaybackReady.value) return
  initialLoadDone.value = true
}

watch(showPlaybackOverlay, (visible) => {
  if (visible) startMessageCycle()
  else clearMessageTimer()
})

watch([mapReady, initialPlaybackReady, isPlaying], markInitialLoadDone)

watch(isPlaying, (playing) => {
  if (playing) {
    hasEverPlayed.value = true
    initialPlaybackReady.value = false
  }
})

watch(() => props.year, () => {
  resetOverlayState()
  reset()
})

function onSpeedChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  if (isPlaybackSpeed(value)) setPlaybackSpeed(value)
}

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
    <div
      class="rw-trip-map-stage__backdrop"
      @click="onClose"
    />

    <div class="rw-trip-map-stage__panel">
      <!-- Header -->
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
            <span
              v-if="timeOfDay"
              class="rw-tod-badge"
              :class="timeOfDay.cls"
            >{{ timeOfDay.label }}</span>
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

      <!-- Map area -->
      <div
        class="rw-trip-map-stage__map"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <ClientOnly>
          <WrappedTripMap
            v-if="hasTrips"
            :key="year"
            ref="mapRef"
            :trips="playbackTrips"
            mode="playback"
            :show-all-points="showAllPointsOnMap"
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

        <!-- Map overlay controls: zoom + fit -->
        <div class="rw-map-overlay-controls">
          <button
            type="button"
            class="rw-map-overlay-btn"
            aria-label="Zoom in"
            @click="mapRef?.zoomIn()"
          >
            +
          </button>
          <button
            type="button"
            class="rw-map-overlay-btn"
            aria-label="Zoom out"
            @click="mapRef?.zoomOut()"
          >
            −
          </button>
          <button
            type="button"
            class="rw-map-overlay-btn rw-map-overlay-btn--fit"
            aria-label="Fit trip in view"
            title="Fit to trip"
            @click="mapRef?.fitView()"
          >
            ⤢
          </button>
        </div>
      </div>

      <!-- Timeline scrubber -->
      <WrappedTripTimeline
        v-if="tripCount > 1"
        :trips="playbackTrips"
        :active-index="currentIndex"
        @select="goTo"
      />

      <!-- Trip detail strip -->
      <div
        v-if="hasRoute || hasStats"
        class="rw-trip-map-stage__detail"
      >
        <div
          v-if="hasRoute"
          class="rw-trip-detail__route"
        >
          <div
            class="rw-trip-detail__rail"
            aria-hidden="true"
          >
            <span class="rw-trip-detail__dot rw-trip-detail__dot--pickup" />
            <span class="rw-trip-detail__rail-line" />
            <span class="rw-trip-detail__dot rw-trip-detail__dot--dropoff" />
          </div>
          <div class="rw-trip-detail__stops">
            <p class="rw-trip-detail__stop rw-tile-clamp rw-tile-clamp--2">
              {{ pickupLabel }}
            </p>
            <p class="rw-trip-detail__stop rw-tile-clamp rw-tile-clamp--2">
              {{ dropoffLabel }}
            </p>
          </div>
        </div>
        <div
          v-if="hasStats"
          class="rw-trip-detail__stats"
        >
          <span
            v-if="fareLabel"
            class="rw-trip-detail__stat"
          >{{ fareLabel }}</span>
          <span
            v-if="fareLabel && (distanceLabel || durationLabel)"
            class="rw-trip-detail__sep"
          >·</span>
          <span
            v-if="distanceLabel"
            class="rw-trip-detail__stat"
          >{{ distanceLabel }}</span>
          <span
            v-if="distanceLabel && durationLabel"
            class="rw-trip-detail__sep"
          >·</span>
          <span
            v-if="durationLabel"
            class="rw-trip-detail__stat"
          >{{ durationLabel }}</span>
        </div>
      </div>

      <!-- Controls footer -->
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
        <!-- Replay arc animation -->
        <button
          type="button"
          class="rw-trip-map-stage__btn rw-trip-map-stage__btn--replay"
          aria-label="Replay route animation"
          :disabled="!hasTrips"
          @click="mapRef?.replayArc()"
        >
          ↺
        </button>
      </footer>
    </div>
  </div>
</template>
