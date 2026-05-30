<script setup lang="ts">
import type { WrappedStats } from '#shared/lib/wrapped-stats'
import type { StorySlide } from '#shared/types/story'
import { usePreferredReducedMotion } from '@vueuse/core'

export type WrappedShareContext = {
  stats: WrappedStats
  personality: string
}

const props = defineProps<{
  slides: StorySlide[]
  share?: WrappedShareContext
}>()

const index = ref(0)
const reducedMotion = usePreferredReducedMotion()
const shareAspect = ref<'story' | 'square'>('story')
const shareDownloading = ref(false)
const shareCardRef = ref<{ $el: HTMLElement } | null>(null)
const { downloadSharePng } = useWrappedShare()

const currentSlide = computed(() => props.slides[index.value] ?? null)
const canGoPrev = computed(() => index.value > 0)
const canGoNext = computed(() => index.value < props.slides.length - 1)
const isCtaSlide = computed(() => currentSlide.value?.kind === 'cta')
const shareExportSize = computed(() =>
  shareAspect.value === 'square'
    ? { width: 1080, height: 1080 }
    : { width: 1080, height: 1920 },
)

function goPrev() {
  if (canGoPrev.value) index.value -= 1
}

function goNext() {
  if (canGoNext.value) index.value += 1
}

async function onDownloadShare() {
  const el = shareCardRef.value?.$el
  if (!el || !props.share || shareDownloading.value) return

  shareDownloading.value = true
  try {
    const { width, height } = shareExportSize.value
    await downloadSharePng(el, {
      width,
      height,
      filename: `ride-wrapped-${props.share.stats.year}.png`,
    })
  } finally {
    shareDownloading.value = false
  }
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

    <section
      v-if="isCtaSlide && share"
      class="wrapped-player__share"
      aria-label="Share export"
    >
      <fieldset class="wrapped-player__aspect">
        <legend class="wrapped-player__aspect-legend">
          Export size
        </legend>
        <label class="wrapped-player__aspect-option">
          <input
            v-model="shareAspect"
            type="radio"
            name="wrapped-share-aspect"
            value="story"
          >
          Story (1080×1920)
        </label>
        <label class="wrapped-player__aspect-option">
          <input
            v-model="shareAspect"
            type="radio"
            name="wrapped-share-aspect"
            value="square"
          >
          Square (1080×1080)
        </label>
      </fieldset>
      <button
        type="button"
        class="wrapped-player__download"
        data-testid="wrapped-share-download"
        :disabled="shareDownloading"
        @click="onDownloadShare"
      >
        {{ shareDownloading ? 'Exporting…' : 'Download' }}
      </button>
    </section>

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

    <div
      v-if="share"
      class="wrapped-player__share-export"
      aria-hidden="true"
    >
      <WrappedShareCard
        ref="shareCardRef"
        :stats="share.stats"
        :personality="share.personality"
        :aspect="shareAspect"
      />
    </div>
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

.wrapped-player__share {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
  padding: 0 0.5rem;
}

.wrapped-player__aspect {
  margin: 0;
  padding: 0;
  border: none;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem 1.25rem;
}

.wrapped-player__aspect-legend {
  width: 100%;
  text-align: center;
  font-size: 0.75rem;
  color: #94a3b8;
  margin-bottom: 0.25rem;
}

.wrapped-player__aspect-option {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.875rem;
  color: #e2e8f0;
  cursor: pointer;
}

.wrapped-player__download {
  padding: 0.75rem 1.75rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #818cf8 0%, #ec4899 100%);
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.wrapped-player__download:hover:not(:disabled) {
  opacity: 0.92;
}

.wrapped-player__download:disabled {
  opacity: 0.55;
  cursor: wait;
}

.wrapped-player__share-export {
  position: fixed;
  left: -10000px;
  top: 0;
  pointer-events: none;
  z-index: -1;
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
