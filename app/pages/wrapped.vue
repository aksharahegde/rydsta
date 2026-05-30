<script setup lang="ts">
import { computeWrappedStats } from '#shared/lib/wrapped-stats'
import { pickPersonality } from '#shared/lib/personality'
import type { Trip } from '#shared/types/trip'

definePageMeta({ layout: 'wrapped' })

const trips = useState<Trip[]>('ride-trips', () => [])
const { buildStorySlides } = useWrappedStory()

const slides = computed(() => buildStorySlides(trips.value))

const validTrips = computed(() =>
  trips.value.filter(
    t => Boolean(t.startedAt) && !Number.isNaN(t.startedAt.getTime()),
  ),
)

const share = computed(() => {
  if (validTrips.value.length === 0) return undefined
  const stats = computeWrappedStats(trips.value)
  return {
    stats,
    personality: pickPersonality(stats, validTrips.value),
  }
})

watch(
  trips,
  (value) => {
    if (value.length === 0) navigateTo('/upload')
  },
  { immediate: true },
)
</script>

<template>
  <main class="wrapped-page">
    <WrappedSlidePlayer
      v-if="slides.length"
      :slides="slides"
      :share="share"
    />
  </main>
</template>

<style scoped>
.wrapped-page {
  min-height: 100dvh;
}
</style>
