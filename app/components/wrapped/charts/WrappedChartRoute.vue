<script setup lang="ts">
import WrappedChartWireGrid from '~/components/wrapped/charts/WrappedChartWireGrid.vue'

const props = withDefaults(
  defineProps<{
    animate?: boolean
    gridId?: string
  }>(),
  { animate: true },
)

const uid = useId()
const patternId = computed(() => props.gridId ?? `rw-route${uid}`)
</script>

<template>
  <svg
    class="rw-chart-route"
    :class="{ 'rw-chart-route--static': !animate }"
    viewBox="0 0 120 72"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
  >
    <WrappedChartWireGrid
      :id="patternId"
      :width="120"
      :height="72"
    />

    <!-- Guide lines at endpoints -->
    <line
      class="rw-chart-wire__guide"
      x1="12"
      y1="58"
      x2="12"
      y2="38"
    />
    <line
      class="rw-chart-wire__guide"
      x1="108"
      y1="12"
      x2="86"
      y2="12"
    />

    <!-- Topographic contour lines (offset parallels, decreasing opacity) -->
    <path
      class="rw-chart-route__contour rw-chart-route__contour--3"
      pathLength="1"
      d="M12 62 C 38 30, 68 58, 108 18"
    />
    <path
      class="rw-chart-route__contour rw-chart-route__contour--2"
      pathLength="1"
      d="M12 60 C 38 27, 68 55, 108 15"
    />
    <path
      class="rw-chart-route__contour rw-chart-route__contour--1"
      pathLength="1"
      d="M12 56 C 38 20, 68 50, 108 9"
    />

    <!-- Main route path -->
    <circle
      class="rw-chart-wire__node"
      cx="12"
      cy="58"
      r="2"
    />
    <path
      class="rw-chart-route__path"
      pathLength="1"
      d="M12 58 C 38 24, 68 52, 108 12"
    />
    <circle
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      cx="108"
      cy="12"
      r="3"
    />
  </svg>
</template>

<style scoped>
@keyframes rw-contour-in-hi {
  from { stroke-dashoffset: 1; opacity: 0; }
  to   { stroke-dashoffset: 0; opacity: 0.25; }
}

@keyframes rw-contour-in-md {
  from { stroke-dashoffset: 1; opacity: 0; }
  to   { stroke-dashoffset: 0; opacity: 0.15; }
}

@keyframes rw-contour-in-lo {
  from { stroke-dashoffset: 1; opacity: 0; }
  to   { stroke-dashoffset: 0; opacity: 0.08; }
}

.rw-chart-route__contour {
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
}

.rw-chart-route__contour--1 {
  stroke-width: 0.75;
  animation: rw-contour-in-hi 950ms var(--ease-out) 120ms both;
}

.rw-chart-route__contour--2 {
  stroke-width: 0.5;
  animation: rw-contour-in-md 950ms var(--ease-out) 60ms both;
}

.rw-chart-route__contour--3 {
  stroke-width: 0.35;
  animation: rw-contour-in-lo 950ms var(--ease-out) 0ms both;
}

.rw-chart-route--static .rw-chart-route__contour--1 {
  animation: none; stroke-dashoffset: 0; opacity: 0.25;
}
.rw-chart-route--static .rw-chart-route__contour--2 {
  animation: none; stroke-dashoffset: 0; opacity: 0.15;
}
.rw-chart-route--static .rw-chart-route__contour--3 {
  animation: none; stroke-dashoffset: 0; opacity: 0.08;
}
</style>
