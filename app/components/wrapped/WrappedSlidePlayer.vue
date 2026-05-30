<script setup lang="ts">
import type { StorySlide } from '#shared/types/story'
import { usePreferredReducedMotion } from '@vueuse/core'

const props = defineProps<{
  slides: StorySlide[]
}>()

const index = ref(0)
const reducedMotion = usePreferredReducedMotion()

const currentSlide = computed(() => props.slides[index.value] ?? null)
const canGoPrev = computed(() => index.value > 0)
const canGoNext = computed(() => index.value < props.slides.length - 1)

function goPrev() {
  if (canGoPrev.value) index.value -= 1
}

function goNext() {
  if (canGoNext.value) index.value += 1
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    goPrev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    goNext()
  }
}

watch(
  () => props.slides.length,
  (len) => {
    if (index.value >= len) index.value = Math.max(0, len - 1)
  },
)

onMounted(() => window.addEventListener('keydown', onKeydown))
onUnmounted(() => window.removeEventListener('keydown', onKeydown))
</script>

<template>
  <div
    class="wrapped-player"
    data-testid="wrapped-slide-player"
  >
    <Transition
      :name="reducedMotion === 'reduce' ? '' : 'wrapped-slide-fade'"
      mode="out-in"
    >
      <WrappedSlide
        v-if="currentSlide"
        :key="currentSlide.id"
        :slide="currentSlide"
      />
    </Transition>

    <nav
      class="wrapped-player__nav"
      aria-label="Story navigation"
    >
      <button
        type="button"
        class="wrapped-player__btn"
        :disabled="!canGoPrev"
        aria-label="Previous slide"
        @click="goPrev"
      >
        ←
      </button>
      <span
        class="wrapped-player__counter"
        aria-live="polite"
      >
        {{ slides.length ? index + 1 : 0 }} / {{ slides.length }}
      </span>
      <button
        type="button"
        class="wrapped-player__btn"
        :disabled="!canGoNext"
        aria-label="Next slide"
        @click="goNext"
      >
        →
      </button>
    </nav>
  </div>
</template>

<style scoped>
.wrapped-player {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  padding: 1.5rem 1rem 2rem;
}

.wrapped-player__nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1.5rem;
  margin-top: auto;
  padding-top: 1.5rem;
}

.wrapped-player__btn {
  width: 3rem;
  height: 3rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.5);
  color: #f8fafc;
  font-size: 1.25rem;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease;
}

.wrapped-player__btn:hover:not(:disabled) {
  background: rgba(99, 102, 241, 0.35);
  border-color: rgba(165, 180, 252, 0.6);
}

.wrapped-player__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.wrapped-player__counter {
  font-size: 0.875rem;
  color: #94a3b8;
  min-width: 4rem;
  text-align: center;
}

.wrapped-slide-fade-enter-active,
.wrapped-slide-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.wrapped-slide-fade-enter-from,
.wrapped-slide-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
