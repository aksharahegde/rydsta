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
const patternId = computed(() => props.gridId ?? `rw-download${uid}`)
</script>

<template>
  <svg
    class="rw-chart-download"
    :class="{ 'rw-chart-download--static': !animate }"
    viewBox="0 0 64 64"
    preserveAspectRatio="xMidYMid meet"
    aria-hidden="true"
  >
    <WrappedChartWireGrid
      :id="patternId"
      :width="64"
      :height="64"
    />
    <rect
      class="rw-chart-download__frame"
      x="14"
      y="10"
      width="36"
      height="44"
      rx="5"
    />
    <path
      class="rw-chart-download__arrow"
      pathLength="1"
      d="M32 22 V40 M24 34 L32 44 L40 34"
    />
    <circle
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      cx="32"
      cy="44"
      r="2"
    />
  </svg>
</template>
