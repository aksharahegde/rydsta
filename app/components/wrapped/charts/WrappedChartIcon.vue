<script setup lang="ts">
import WrappedChartWireGrid from '~/components/wrapped/charts/WrappedChartWireGrid.vue'
import type { MapStatIconKind } from '#shared/lib/bento-charts'

const props = withDefaults(
  defineProps<{
    kind: MapStatIconKind
    animate?: boolean
    gridId?: string
  }>(),
  { animate: true },
)

const uid = useId()
const patternId = computed(() => props.gridId ?? `rw-icon-${props.kind}${uid}`)

// City skyline building heights and x positions
const buildings = [
  { x: 4,  w: 6, h: 14, y: 34 },
  { x: 12, w: 5, h: 22, y: 26 },
  { x: 19, w: 7, h: 18, y: 30 },
  { x: 28, w: 6, h: 28, y: 20 },  // tallest = primary city
  { x: 36, w: 5, h: 16, y: 32 },
  { x: 43, w: 6, h: 20, y: 28 },
]
</script>

<template>
  <svg
    class="rw-chart-icon"
    :class="[
      `rw-chart-icon--${kind}`,
      { 'rw-chart-icon--static': !animate },
    ]"
    viewBox="0 0 48 48"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <WrappedChartWireGrid
      :id="patternId"
      :width="48"
      :height="48"
    />

    <!-- ── Distance: route path with amber fill under curve ────── -->
    <template v-if="kind === 'distance'">
      <path
        class="rw-chart-icon__area"
        d="M6 38 C 14 20, 28 30, 42 14 L42 42 L6 42 Z"
      />
      <path
        class="rw-chart-icon__stroke"
        pathLength="1"
        d="M6 38 C 14 20, 28 30, 42 14"
      />
      <circle
        class="rw-chart-wire__node"
        cx="6"
        cy="38"
        r="2"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="42"
        cy="14"
        r="2.5"
      />
    </template>

    <!-- ── City: skyline silhouette ──────────────────────────────── -->
    <template v-else-if="kind === 'city'">
      <!-- Ground line -->
      <line
        class="rw-chart-wire__guide"
        x1="2"
        y1="48"
        x2="50"
        y2="48"
        style="opacity: 0.35;"
      />
      <!-- Buildings: rise from bottom, tallest (index 3) is accent -->
      <rect
        v-for="(b, i) in buildings"
        :key="i"
        class="rw-chart-icon__building"
        :class="{ 'rw-chart-icon__building--peak': i === 3 }"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        :style="{ '--viz-i': i }"
      />
      <!-- Windows on tallest building -->
      <rect
        class="rw-chart-icon__window"
        x="30"
        y="23"
        width="2"
        height="2"
        :style="{ '--viz-i': 4 }"
      />
      <rect
        class="rw-chart-icon__window"
        x="34"
        y="23"
        width="2"
        height="2"
        :style="{ '--viz-i': 5 }"
      />
    </template>

    <!-- ── Vehicle: car body + motion speed lines ─────────────────── -->
    <template v-else-if="kind === 'vehicle'">
      <!-- Speed lines -->
      <line
        class="rw-chart-icon__speed"
        x1="4"
        y1="20"
        x2="14"
        y2="20"
        :style="{ '--viz-i': 0 }"
      />
      <line
        class="rw-chart-icon__speed"
        x1="2"
        y1="24"
        x2="12"
        y2="24"
        :style="{ '--viz-i': 1 }"
      />
      <line
        class="rw-chart-icon__speed"
        x1="4"
        y1="28"
        x2="12"
        y2="28"
        :style="{ '--viz-i': 2 }"
      />
      <!-- Car body -->
      <rect
        class="rw-chart-icon__body"
        x="14"
        y="18"
        width="28"
        height="12"
        rx="3"
      />
      <!-- Car roof/cabin -->
      <path
        class="rw-chart-icon__stroke"
        pathLength="1"
        d="M18 18 L21 11 L34 11 L38 18"
        style="animation-delay: 100ms;"
      />
      <!-- Wheels -->
      <circle
        class="rw-chart-icon__wheel"
        cx="21"
        cy="34"
        r="4"
      />
      <circle
        class="rw-chart-icon__wheel"
        cx="36"
        cy="34"
        r="4"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="38"
        cy="22"
        r="1.75"
      />
    </template>

    <!-- ── Fare: receipt strip + coin ────────────────────────────── -->
    <template v-else>
      <!-- Receipt strip -->
      <rect
        class="rw-chart-icon__receipt"
        x="8"
        y="8"
        width="22"
        height="34"
        rx="2"
      />
      <!-- Receipt lines -->
      <line
        class="rw-chart-icon__receipt-line"
        x1="12"
        y1="16"
        x2="26"
        y2="16"
        :style="{ '--viz-i': 0 }"
      />
      <line
        class="rw-chart-icon__receipt-line"
        x1="12"
        y1="22"
        x2="26"
        y2="22"
        :style="{ '--viz-i': 1 }"
      />
      <line
        class="rw-chart-icon__receipt-line"
        x1="12"
        y1="28"
        x2="20"
        y2="28"
        :style="{ '--viz-i': 2 }"
      />
      <!-- Coin overlapping receipt -->
      <circle
        class="rw-chart-icon__coin"
        cx="34"
        cy="34"
        r="9"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="34"
        cy="34"
        r="2"
      />
    </template>
  </svg>
</template>

<style scoped>
/* Distance area fill */
.rw-chart-icon__area {
  fill: currentColor;
  fill-opacity: 0;
  stroke: none;
  animation: rw-viz-area-in 600ms var(--ease-out) 200ms both;
}

/* City buildings */
.rw-chart-icon__building {
  fill: currentColor;
  fill-opacity: 0.12;
  stroke: currentColor;
  stroke-width: 0.75;
  vector-effect: non-scaling-stroke;
  transform-origin: bottom;
  transform: scaleY(0);
  opacity: 0;
  animation:
    rw-viz-rise 480ms var(--ease-out) both,
    rw-viz-fade-in 300ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 55ms + 80ms);
}

.rw-chart-icon__building--peak {
  fill: currentColor;
  fill-opacity: 0.3;
}

.rw-chart-icon__window {
  fill: currentColor;
  fill-opacity: 0;
  animation: rw-viz-fade-in 350ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 80ms + 480ms);
}

/* Vehicle speed lines */
.rw-chart-icon__speed {
  stroke: currentColor;
  stroke-width: 1.25;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 300ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 60ms + 80ms);
}

/* Vehicle body */
.rw-chart-icon__body {
  fill: currentColor;
  fill-opacity: 0.1;
  stroke: currentColor;
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 400ms var(--ease-out) 200ms both;
}

.rw-chart-icon__wheel {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 380ms var(--ease-out) 320ms both;
}

/* Fare receipt */
.rw-chart-icon__receipt {
  fill: currentColor;
  fill-opacity: 0.08;
  stroke: currentColor;
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 420ms var(--ease-out) 80ms both;
}

.rw-chart-icon__receipt-line {
  stroke: currentColor;
  stroke-width: 1;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 320ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 80ms + 220ms);
}

.rw-chart-icon__coin {
  fill: currentColor;
  fill-opacity: 0.14;
  stroke: currentColor;
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 440ms var(--ease-out) 380ms both;
}

/* Static fallback */
.rw-chart-icon--static .rw-chart-icon__building,
.rw-chart-icon--static .rw-chart-icon__window,
.rw-chart-icon--static .rw-chart-icon__speed,
.rw-chart-icon--static .rw-chart-icon__body,
.rw-chart-icon--static .rw-chart-icon__wheel,
.rw-chart-icon--static .rw-chart-icon__receipt,
.rw-chart-icon--static .rw-chart-icon__receipt-line,
.rw-chart-icon--static .rw-chart-icon__coin,
.rw-chart-icon--static .rw-chart-icon__area {
  animation: none;
  opacity: 1;
  transform: scaleY(1);
  fill-opacity: inherit;
}
</style>
