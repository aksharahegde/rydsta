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
const patternId = computed(() => props.gridId ?? `rw-pin${uid}`)
</script>

<template>
  <svg
    class="rw-chart-pin"
    :class="{ 'rw-chart-pin--static': !animate }"
    viewBox="0 0 80 80"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
  >
    <WrappedChartWireGrid
      :id="patternId"
      :width="80"
      :height="80"
    />
    <circle
      class="rw-chart-pin__ring"
      :style="{ '--viz-i': 0 }"
      cx="40"
      cy="32"
      r="22"
    />
    <circle
      class="rw-chart-pin__ring"
      :style="{ '--viz-i': 1 }"
      cx="40"
      cy="32"
      r="12"
    />
    <path
      class="rw-chart-pin__marker"
      pathLength="1"
      d="M40 12 C30 12 22 20 22 30 C22 42 40 66 40 66 C40 66 58 42 58 30 C58 20 50 12 40 12 Z"
    />
    <circle
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      cx="40"
      cy="28"
      r="2.5"
    />
  </svg>
</template>
