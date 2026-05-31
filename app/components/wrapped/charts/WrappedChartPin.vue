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
    class="rw-chart-pin"
    :class="{ 'rw-chart-pin--static': !animate }"
    viewBox="0 0 80 80"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <!-- Radar ping rings — scale out and fade -->
    <circle
      class="rw-chart-ping__ring"
      cx="40"
      cy="40"
      r="30"
      :style="{ '--ping-delay': '0ms' }"
    />
    <circle
      class="rw-chart-ping__ring"
      cx="40"
      cy="40"
      r="30"
      :style="{ '--ping-delay': '600ms' }"
    />
    <circle
      class="rw-chart-ping__ring"
      cx="40"
      cy="40"
      r="30"
      :style="{ '--ping-delay': '1200ms' }"
    />

    <!-- Center fill dot -->
    <circle
      class="rw-chart-ping__dot"
      cx="40"
      cy="40"
      r="5"
    />

    <!-- Inner filled ring -->
    <circle
      class="rw-chart-ping__inner"
      cx="40"
      cy="40"
      r="12"
    />
  </svg>
</template>

<style scoped>
.rw-chart-ping__ring {
  fill: none;
  stroke: var(--rw-viz-amber, var(--color-accent));
  stroke-width: 1.5;
  transform-origin: 40px 40px;
  opacity: 0;
  animation: rw-viz-ping-ring 2.4s var(--ease-out) infinite;
  animation-delay: var(--ping-delay, 0ms);
}

.rw-chart-ping__dot {
  fill: var(--rw-viz-amber, var(--color-accent));
  opacity: 0.85;
  animation: rw-viz-ping-dot 2.4s ease-in-out infinite;
}

.rw-chart-ping__inner {
  fill: none;
  stroke: var(--rw-viz-amber, var(--color-accent));
  stroke-width: 1;
  opacity: 0.28;
}

/* Static export: just show the rings at final state */
.rw-chart-pin--static .rw-chart-ping__ring {
  animation: none;
  transform: scale(1);
  opacity: 0.2;
}

.rw-chart-pin--static .rw-chart-ping__dot {
  animation: none;
}
</style>
