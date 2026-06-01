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

// Normalize to [0..1]
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

const CX = 80
const CY = 90
const R_INNER = 28
const R_MAX = 68
const TOTAL = computed(() => props.values.length || 12)

// Each segment: sweep angle, gap between segments
const SWEEP = computed(() => (360 / TOTAL.value) * 0.78)
const GAP_ANGLE = computed(() => (360 / TOTAL.value) * 0.22)

function polarToXY(angleDeg: number, r: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) }
}

function arcPath(index: number, normVal: number): string {
  if (normVal <= 0) return ''
  const startAngle = index * (SWEEP.value + GAP_ANGLE.value)
  const endAngle = startAngle + SWEEP.value
  const rOuter = R_INNER + Math.max((R_MAX - R_INNER) * normVal, 6)

  const p1 = polarToXY(startAngle, R_INNER)
  const p2 = polarToXY(startAngle, rOuter)
  const p3 = polarToXY(endAngle, rOuter)
  const p4 = polarToXY(endAngle, R_INNER)

  const largeArc = SWEEP.value > 180 ? 1 : 0

  return [
    `M ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p3.x} ${p3.y}`,
    `L ${p4.x} ${p4.y}`,
    `A ${R_INNER} ${R_INNER} 0 ${largeArc} 0 ${p1.x} ${p1.y}`,
    'Z',
  ].join(' ')
}

// Glow dot at tip of peak arc
const peakDot = computed(() => {
  const norm = normalized.value[peakIndex.value] ?? 0
  const rOuter = R_INNER + Math.max((R_MAX - R_INNER) * norm, 6)
  const midAngle = peakIndex.value * (SWEEP.value + GAP_ANGLE.value) + SWEEP.value / 2
  return polarToXY(midAngle, rOuter)
})
</script>

<template>
  <svg
    class="rw-chart-radial"
    :class="{ 'rw-chart-radial--static': !animate }"
    viewBox="0 0 160 120"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
  >
    <defs>
      <radialGradient
        id="rw-radial-fill-peak"
        cx="50%"
        cy="50%"
        r="50%"
      >
        <stop
          offset="0%"
          :stop-color="`var(--rw-viz-amber)`"
          stop-opacity="0.9"
        />
        <stop
          offset="100%"
          :stop-color="`var(--rw-viz-amber)`"
          stop-opacity="0.55"
        />
      </radialGradient>
    </defs>

    <!-- Guide arcs for all slots (always visible at low opacity) — give structure to sparse data -->
    <template
      v-for="(norm, i) in normalized"
      :key="`guide-${i}`"
    >
      <path
        class="rw-chart-radial__arc rw-chart-radial__arc--guide"
        :d="arcPath(i, 0.08)"
        :style="{ '--viz-i': i }"
      />
    </template>

    <!-- Data arcs — rendered on top of guides -->
    <template
      v-for="(norm, i) in normalized"
      :key="`data-${i}`"
    >
      <path
        v-if="norm > 0"
        class="rw-chart-radial__arc"
        :class="{ 'rw-chart-radial__arc--peak': i === peakIndex }"
        :d="arcPath(i, norm)"
        :fill="!animate ? palette.gold : undefined"
        :fill-opacity="!animate ? (i === peakIndex ? 0.88 : Math.max(0.15, norm * 0.65)) : undefined"
        :style="{
          '--viz-i': i,
          '--arc-opacity': i === peakIndex ? 0.88 : Math.max(0.15, norm * 0.65),
        }"
      />
    </template>

    <!-- Glow node at peak tip -->
    <circle
      v-if="normalized[peakIndex] > 0"
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      :cx="peakDot.x"
      :cy="peakDot.y"
      r="3"
    />
  </svg>
</template>

<style scoped>
/* Guide arcs: always-present thin rings showing all month slots */
.rw-chart-radial__arc--guide {
  fill: var(--rw-viz-amber);
  fill-opacity: 0.07;
  stroke: none;
  opacity: 1;
  animation: rw-viz-fade-in 300ms var(--ease-out) 50ms both;
}

.rw-chart-radial__arc {
  fill: var(--rw-viz-amber);
  fill-opacity: var(--arc-opacity, 0.3);
  stroke: none;
  opacity: 0;
  animation: rw-viz-fade-in 480ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 42ms + 80ms);
}

.rw-chart-radial__arc--peak {
  fill: var(--rw-viz-amber);
  filter: drop-shadow(0 0 6px oklch(58% 0.19 48 / 0.45));
}

.dark .rw-chart-radial__arc--peak {
  filter: drop-shadow(0 0 7px oklch(75% 0.17 70 / 0.5));
}

.rw-chart-radial--static .rw-chart-radial__arc {
  animation: none;
  opacity: 1;
}
</style>
