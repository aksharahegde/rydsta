<script setup lang="ts">
import { palette } from '~/constants/palette'

const props = withDefaults(
  defineProps<{
    values: number[]
    animate?: boolean
    gridId?: string
  }>(),
  { animate: true },
)

const CX = 50
const CY = 50
const R = 34
const STROKE_BASE = 4
const STROKE_PEAK = 8

const normalized = computed(() => {
  const max = Math.max(...props.values, 1)
  return props.values.map(v => v / max)
})

const peakIndex = computed(() => {
  let peak = 0
  let idx = 0
  normalized.value.forEach((v, i) => { if (v > peak) { peak = v; idx = i } })
  return idx
})

const N = computed(() => props.values.length || 7)
const sweepDeg = computed(() => (360 / N.value) * 0.8)
const gapDeg = computed(() => (360 / N.value) * 0.2)

function polarXY(deg: number, r: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

interface ArcSeg {
  d: string
  isPeak: boolean
  opacity: number
  vizI: number
  strokeW: number
}

const segments = computed((): ArcSeg[] =>
  normalized.value.map((norm, i) => {
    const start = i * (sweepDeg.value + gapDeg.value)
    const end = start + sweepDeg.value
    const isPeak = i === peakIndex.value
    const sw = isPeak ? STROKE_PEAK : STROKE_BASE
    const r = R + (isPeak ? 2 : 0)
    const large = sweepDeg.value > 180 ? 1 : 0

    const p1 = polarXY(start, r)
    const p2 = polarXY(end, r)

    const d = `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${large} 1 ${p2.x} ${p2.y}`

    const opacity = isPeak ? 0.9 : Math.max(0.15, norm * 0.6)

    return { d, isPeak, opacity, vizI: i, strokeW: sw }
  }),
)
</script>

<template>
  <svg
    class="rw-chart-arc-ring"
    :class="{ 'rw-chart-arc-ring--static': !animate }"
    viewBox="0 0 100 100"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <path
      v-for="(seg, i) in segments"
      :key="i"
      class="rw-chart-arc-ring__seg"
      :class="{ 'rw-chart-arc-ring__seg--peak': seg.isPeak }"
      :d="seg.d"
      :stroke="!animate ? palette.gold : undefined"
      :stroke-width="!animate ? seg.strokeW : undefined"
      :opacity="!animate ? seg.opacity : undefined"
      :style="{
        '--viz-i': seg.vizI,
        '--seg-opacity': seg.opacity,
        '--seg-sw': seg.strokeW,
      }"
    />

    <!-- Center glow dot -->
    <circle
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      :cx="CX"
      :cy="CY"
      r="2.5"
    />
  </svg>
</template>

<style scoped>
.rw-chart-arc-ring__seg {
  fill: none;
  stroke: var(--rw-viz-amber, var(--color-accent));
  stroke-width: var(--seg-sw, 4);
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-arc-in 520ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 55ms + 60ms);
}

.rw-chart-arc-ring__seg[style] {
  opacity: var(--seg-opacity, 0.4);
  animation-fill-mode: both;
}

.rw-chart-arc-ring__seg--peak {
  filter: drop-shadow(0 0 5px oklch(58% 0.19 48 / 0.5));
}

.dark .rw-chart-arc-ring__seg--peak {
  filter: drop-shadow(0 0 6px oklch(75% 0.17 70 / 0.55));
}

.rw-chart-arc-ring--static .rw-chart-arc-ring__seg {
  animation: none;
  opacity: var(--seg-opacity, 0.4);
}
</style>
