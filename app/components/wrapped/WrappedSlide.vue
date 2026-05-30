<script setup lang="ts">
import type { StorySlide } from '#shared/types/story'

defineProps<{
  slide: StorySlide
}>()
</script>

<template>
  <article
    class="wrapped-slide"
    :class="`wrapped-slide--${slide.kind}`"
    :data-testid="`wrapped-slide-${slide.id}`"
  >
    <p
      v-if="slide.value && slide.visual === 'emoji'"
      class="wrapped-slide__emoji"
      aria-hidden="true"
    >
      {{ slide.value }}
    </p>
    <h2 class="wrapped-slide__headline">
      {{ slide.headline }}
    </h2>
    <p
      v-if="slide.value && slide.visual !== 'emoji'"
      class="wrapped-slide__value"
    >
      {{ slide.value }}
    </p>
    <p
      v-if="slide.subline"
      class="wrapped-slide__subline"
    >
      {{ slide.subline }}
    </p>
  </article>
</template>

<style scoped>
.wrapped-slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1.5rem;
  min-height: 60vh;
}

.wrapped-slide__emoji {
  margin: 0 0 1rem;
  font-size: 4rem;
  line-height: 1;
}

.wrapped-slide__headline {
  margin: 0;
  font-size: clamp(1.75rem, 6vw, 2.75rem);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
  max-width: 18ch;
}

.wrapped-slide--hook .wrapped-slide__headline,
.wrapped-slide--cta .wrapped-slide__headline {
  font-size: clamp(2rem, 7vw, 3.25rem);
}

.wrapped-slide__value {
  margin: 1rem 0 0;
  font-size: clamp(2.5rem, 10vw, 4.5rem);
  font-weight: 700;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.wrapped-slide__subline {
  margin: 1rem 0 0;
  font-size: clamp(1rem, 3.5vw, 1.25rem);
  color: #94a3b8;
  line-height: 1.4;
  max-width: 28ch;
}

.wrapped-slide--personality .wrapped-slide__headline {
  font-size: clamp(2rem, 8vw, 3.5rem);
}
</style>
