<script setup lang="ts">
import WrappedChartWireGrid from '~/components/wrapped/charts/WrappedChartWireGrid.vue'
import { normalizeBarSeries, peakSeriesIndex, sparklineArea, sparklinePoints, sparklinePolyline } from '#shared/lib/bento-charts'

const props = withDefaults(
  defineProps<{
    values: number[]
    animate?: boolean
    gridId?: string
  }>(),
  { animate: true },
)

const uid = useId()
const patternId = computed(() => props.gridId ?? `rw-spark${uid}`)
const linePoints = computed(() => sparklinePolyline(props.values))
const areaPath = computed(() => sparklineArea(props.values))
const points = computed(() => sparklinePoints(props.values))
const peakIndex = computed(() => peakSeriesIndex(normalizeBarSeries(props.values)))
const peakPoint = computed(() => points.value[peakIndex.value])
</script>

<template>
  <svg
    class="rw-chart-sparkline"
    :class="{ 'rw-chart-sparkline--static': !animate }"
    viewBox="0 0 100 100"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <defs>
      <linearGradient
        :id="`${patternId}-fill`"
        x1="0"
        y1="0"
        x2="0"
        y2="1"
      >
        <stop
          offset="0%"
          stop-color="currentColor"
          stop-opacity="0.38"
        />
        <stop
          offset="100%"
          stop-color="currentColor"
          stop-opacity="0.04"
        />
      </linearGradient>
    </defs>
    <WrappedChartWireGrid
      :id="patternId"
      :width="100"
      :height="100"
    />
    <line
      class="rw-chart-wire__guide"
      x1="0"
      y1="92"
      x2="100"
      y2="92"
    />
    <path
      v-if="areaPath"
      class="rw-chart-sparkline__area"
      :d="areaPath"
      :fill="`url(#${patternId}-fill)`"
    />
    <polyline
      v-if="linePoints"
      class="rw-chart-sparkline__line"
      pathLength="1"
      :points="linePoints"
    />
    <circle
      v-if="peakPoint"
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      :cx="peakPoint.x"
      :cy="peakPoint.y"
      r="2.5"
    />
  </svg>
</template>
