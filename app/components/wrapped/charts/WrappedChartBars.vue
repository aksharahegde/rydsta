<script setup lang="ts">
import WrappedChartWireGrid from '~/components/wrapped/charts/WrappedChartWireGrid.vue'
import { buildBarSeries, peakSeriesIndex } from '#shared/lib/bento-charts'

const props = withDefaults(
  defineProps<{
    values: number[]
    animate?: boolean
    barWidth?: number
    gap?: number
    gridId?: string
  }>(),
  {
    animate: true,
    barWidth: 6,
    gap: 3,
  },
)

const uid = useId()
const patternId = computed(() => props.gridId ?? `rw-bars${uid}`)
const series = computed(() => buildBarSeries(props.values))
const peakIndex = computed(() => peakSeriesIndex(series.value.normalized))
const viewWidth = computed(
  () => props.values.length * props.barWidth + (props.values.length - 1) * props.gap,
)

const chartTop = 34
const chartBase = 96

function barHeight(normalized: number): number {
  if (normalized <= 0) return 0
  return Math.max(normalized * (chartBase - chartTop - 4), 6)
}

function barY(normalized: number): number {
  return chartBase - barHeight(normalized)
}

function barCenterX(index: number): number {
  return index * (props.barWidth + props.gap) + props.barWidth / 2
}
</script>

<template>
  <svg
    class="rw-chart-bars"
    :class="{ 'rw-chart-bars--static': !animate }"
    :viewBox="`0 0 ${viewWidth} 100`"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <WrappedChartWireGrid
      :id="patternId"
      :width="viewWidth"
      :height="100"
    />
    <line
      class="rw-chart-wire__guide"
      :x1="0"
      :y1="chartBase"
      :x2="viewWidth"
      :y2="chartBase"
    />
    <template
      v-for="(height, index) in series.normalized"
      :key="index"
    >
      <line
        class="rw-chart-bars__stem"
        :style="{ '--viz-i': index }"
        :x1="barCenterX(index)"
        :y1="chartBase"
        :x2="barCenterX(index)"
        :y2="barY(height)"
      />
      <line
        v-if="height > 0"
        class="rw-chart-bars__cap"
        :style="{ '--viz-i': index }"
        :x1="barCenterX(index) - props.barWidth / 2 + 0.5"
        :y1="barY(height)"
        :x2="barCenterX(index) + props.barWidth / 2 - 0.5"
        :y2="barY(height)"
      />
    </template>
    <circle
      v-if="series.normalized[peakIndex] > 0"
      class="rw-chart-wire__node rw-chart-wire__node--glow"
      :cx="barCenterX(peakIndex)"
      :cy="barY(series.normalized[peakIndex])"
      r="2.5"
    />
  </svg>
</template>
