<script setup lang="ts">
import type { Trip } from '#shared/types/trip'

definePageMeta({ layout: 'wrapped' })

const trips = useState<Trip[]>('ride-trips', () => [])
const { buildStorySlides } = useWrappedStory()

const slides = computed(() => buildStorySlides(trips.value))

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
    />
  </main>
</template>

<style scoped>
.wrapped-page {
  min-height: 100dvh;
}
</style>
