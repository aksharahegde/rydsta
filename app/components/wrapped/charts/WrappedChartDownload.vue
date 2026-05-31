<script setup lang="ts">
withDefaults(
  defineProps<{
    animate?: boolean
    gridId?: string
  }>(),
  { animate: true },
)
</script>

<template>
  <svg
    class="rw-chart-download"
    :class="{ 'rw-chart-download--static': !animate }"
    viewBox="0 0 64 64"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <!-- 2×2 mini bento grid squares -->
    <rect
      class="rw-chart-share__sq"
      x="10"
      y="10"
      width="18"
      height="18"
      rx="3"
      :style="{ '--viz-i': 0 }"
    />
    <rect
      class="rw-chart-share__sq"
      x="32"
      y="10"
      width="18"
      height="18"
      rx="3"
      :style="{ '--viz-i': 1 }"
    />
    <rect
      class="rw-chart-share__sq"
      x="10"
      y="32"
      width="18"
      height="18"
      rx="3"
      :style="{ '--viz-i': 2 }"
    />
    <!-- Top-right square: highlighted (the "share" source) -->
    <rect
      class="rw-chart-share__sq rw-chart-share__sq--hi"
      x="32"
      y="32"
      width="18"
      height="18"
      rx="3"
      :style="{ '--viz-i': 3 }"
    />

    <!-- Export arrow from top-right square -->
    <path
      class="rw-chart-share__arrow"
      pathLength="1"
      d="M44 28 L52 20 M46 20 L52 20 L52 26"
    />

    <!-- Glow node at arrow tip -->
    <circle
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      cx="52"
      cy="20"
      r="2"
    />
  </svg>
</template>

<style scoped>
.rw-chart-share__sq {
  fill: currentColor;
  fill-opacity: 0.14;
  stroke: currentColor;
  stroke-width: 1.25;
  vector-effect: non-scaling-stroke;
  opacity: 0;
  animation: rw-viz-fade-in 380ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 70ms + 100ms);
}

.rw-chart-share__sq--hi {
  fill-opacity: 0.32;
}

.rw-chart-share__arrow {
  fill: none;
  stroke: currentColor;
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-linejoin: round;
  vector-effect: non-scaling-stroke;
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  animation: rw-viz-stroke-in 600ms var(--ease-out) 400ms both;
}

.rw-chart-download--static .rw-chart-share__sq,
.rw-chart-download--static .rw-chart-share__arrow {
  animation: none;
  opacity: 1;
  stroke-dashoffset: 0;
}
</style>
