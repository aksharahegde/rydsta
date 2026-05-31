import { tripsWithCoordinates } from '#shared/lib/trip-map-playback'
import type { Trip } from '#shared/types/trip'

const AUTO_ADVANCE_MS = 2500

export function useTripMapPlayback(tripsSource: Ref<Trip[]>) {
  const playbackTrips = computed(() => tripsWithCoordinates(tripsSource.value))
  const currentIndex = ref(0)
  const isPlaying = ref(false)
  let advanceTimer: ReturnType<typeof setInterval> | null = null

  const currentTrip = computed(() => {
    const list = playbackTrips.value
    if (list.length === 0) return null
    const idx = Math.min(currentIndex.value, list.length - 1)
    return list[idx] ?? null
  })

  const tripCount = computed(() => playbackTrips.value.length)
  const hasTrips = computed(() => tripCount.value > 0)

  function clearTimer() {
    if (advanceTimer !== null) {
      clearInterval(advanceTimer)
      advanceTimer = null
    }
  }

  function clampIndex(index: number): number {
    const max = Math.max(0, playbackTrips.value.length - 1)
    return Math.max(0, Math.min(index, max))
  }

  function goTo(index: number) {
    currentIndex.value = clampIndex(index)
  }

  function next() {
    const max = playbackTrips.value.length - 1
    if (currentIndex.value >= max) {
      pause()
      return
    }
    currentIndex.value += 1
  }

  function prev() {
    if (currentIndex.value <= 0) {
      currentIndex.value = 0
      return
    }
    currentIndex.value -= 1
  }

  function play() {
    if (!hasTrips.value) return
    if (currentIndex.value >= playbackTrips.value.length - 1) {
      currentIndex.value = 0
    }
    isPlaying.value = true
    clearTimer()
    advanceTimer = setInterval(() => {
      if (currentIndex.value >= playbackTrips.value.length - 1) {
        pause()
        return
      }
      next()
    }, AUTO_ADVANCE_MS)
  }

  function pause() {
    isPlaying.value = false
    clearTimer()
  }

  function togglePlay() {
    if (isPlaying.value) pause()
    else play()
  }

  function reset() {
    pause()
    currentIndex.value = 0
  }

  watch(playbackTrips, (list) => {
    if (list.length === 0) {
      reset()
      return
    }
    if (currentIndex.value > list.length - 1) {
      currentIndex.value = list.length - 1
    }
  })

  onUnmounted(() => {
    clearTimer()
  })

  return {
    playbackTrips,
    currentIndex,
    currentTrip,
    tripCount,
    hasTrips,
    isPlaying,
    play,
    pause,
    togglePlay,
    next,
    prev,
    goTo,
    reset,
  }
}
