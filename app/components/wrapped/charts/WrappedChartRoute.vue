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
