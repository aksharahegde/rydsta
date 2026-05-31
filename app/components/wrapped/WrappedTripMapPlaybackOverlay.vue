<script setup lang="ts">
defineProps<{
  message: string
  tripIndex?: number
  tripCount?: number
}>()
</script>

<template>
  <div
    class="rw-trip-map-playback-overlay"
    data-testid="wrapped-trip-map-playback-overlay"
    role="status"
    aria-live="polite"
    aria-busy="true"
  >
    <div class="rw-trip-map-playback-overlay__card">
      <p class="rw-trip-map-playback-overlay__eyebrow">
        Now playing
      </p>
      <div
        class="rw-trip-map-playback-overlay__pulse"
        aria-hidden="true"
      >
        <span />
        <span />
        <span />
      </div>
      <p class="rw-trip-map-playback-overlay__message">
        {{ message }}
      </p>
      <p
        v-if="tripCount && tripCount > 0"
        class="rw-trip-map-playback-overlay__meta"
      >
        Trip {{ tripIndex ?? 1 }} of {{ tripCount }}
      </p>
    </div>
  </div>
</template>
