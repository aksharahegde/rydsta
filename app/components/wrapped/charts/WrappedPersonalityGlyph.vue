<script setup lang="ts">
import WrappedChartWireGrid from '~/components/wrapped/charts/WrappedChartWireGrid.vue'
import { buildBarSeries } from '#shared/lib/bento-charts'

const props = withDefaults(
  defineProps<{
    personality: string
    hourCounts?: number[]
    animate?: boolean
  }>(),
  {
    hourCounts: () => [],
    animate: true,
  },
)

const uid = useId()
const gridId = computed(
  () => `rw-personality-${props.personality.replace(/\s+/g, '-').toLowerCase()}-${uid}`,
)

const nightHours = computed(() => {
  const slice = props.hourCounts.length === 24
    ? props.hourCounts
    : Array.from({ length: 24 }, () => 0)
  return [...slice.slice(22), ...slice.slice(0, 5)]
})

const nightSeries = computed(() => buildBarSeries(nightHours.value))

const peakNightIndex = computed(() => {
  let peak = 0
  let index = 0
  nightSeries.value.normalized.forEach((value, i) => {
    if (value > peak) {
      peak = value
      index = i
    }
  })
  return index
})
</script>

<template>
  <svg
    class="rw-chart-personality"
    :class="[
      `rw-chart-personality--${personality.replace(/\s+/g, '-').toLowerCase()}`,
      { 'rw-chart-personality--static': !animate },
    ]"
    viewBox="0 0 120 80"
    preserveAspectRatio="xMidYMax meet"
    aria-hidden="true"
  >
    <WrappedChartWireGrid
      :id="gridId"
      :width="120"
      :height="80"
    />

    <template v-if="personality === 'Night Owl'">
      <line
        class="rw-chart-wire__guide"
        x1="8"
        y1="68"
        x2="112"
        y2="68"
      />
      <path
        class="rw-chart-personality__moon rw-chart-wire__stroke"
        pathLength="1"
        d="M92 16 A 14 14 0 1 0 106 38 A 10 10 0 1 1 92 16"
      />
      <template
        v-for="(height, index) in nightSeries.normalized"
        :key="index"
      >
        <line
          class="rw-chart-personality__bar-stem rw-chart-wire__stem"
          :style="{ '--viz-i': index }"
          :x1="10 + index * 6.4"
          :y1="68"
          :x2="10 + index * 6.4"
          :y2="68 - Math.max(height * 34, height > 0 ? 6 : 0)"
        />
        <line
          v-if="height > 0"
          class="rw-chart-personality__bar-cap rw-chart-wire__cap"
          :style="{ '--viz-i': index }"
          :x1="7 + index * 6.4"
          :y1="68 - Math.max(height * 34, 6)"
          :x2="13 + index * 6.4"
          :y2="68 - Math.max(height * 34, 6)"
        />
      </template>
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        :cx="10 + peakNightIndex * 6.4"
        :cy="68 - Math.max(nightSeries.normalized[peakNightIndex] * 34, 6)"
        r="2.5"
      />
    </template>

    <template v-else-if="personality === 'Airport Regular'">
      <rect
        class="rw-chart-personality__terminal rw-chart-wire__stroke"
        x="8"
        y="14"
        width="28"
        height="18"
        rx="2"
      />
      <line
        class="rw-chart-wire__guide"
        x1="22"
        y1="32"
        x2="22"
        y2="44"
      />
      <path
        class="rw-chart-personality__runway rw-chart-wire__stroke"
        pathLength="1"
        d="M4 62 H116"
      />
      <path
        class="rw-chart-personality__runway-mark rw-chart-wire__mark"
        d="M58 58 V66 M72 58 V66 M86 58 V66"
      />
      <path
        class="rw-chart-personality__plane rw-chart-wire__stroke"
        pathLength="1"
        d="M12 54 L38 46 L96 30 L54 50 L54 62 L42 66 L48 48 Z"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="96"
        cy="30"
        r="2.5"
      />
    </template>

    <template v-else>
      <line
        class="rw-chart-wire__guide"
        x1="10"
        y1="70"
        x2="10"
        y2="46"
      />
      <line
        class="rw-chart-wire__guide"
        x1="110"
        y1="8"
        x2="88"
        y2="8"
      />
      <path
        class="rw-chart-personality__route rw-chart-wire__stroke"
        pathLength="1"
        d="M10 70 C 30 70, 40 26, 64 36 S 98 10, 110 8"
      />
      <path
        class="rw-chart-personality__route-mark rw-chart-wire__mark"
        d="M34 70 V64 M58 42 V36 M82 18 V12"
      />
      <circle
        class="rw-chart-wire__node"
        cx="10"
        cy="70"
        r="2"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="110"
        cy="8"
        r="3"
      />
    </template>
  </svg>
</template>
