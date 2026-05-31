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

    <template v-if="kind === 'distance'">
      <path
        class="rw-chart-icon__stroke"
        pathLength="1"
        d="M8 36 L18 28 L28 32 L40 16"
      />
      <circle
        class="rw-chart-wire__node"
        cx="8"
        cy="36"
        r="1.75"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="40"
        cy="16"
        r="2.25"
      />
    </template>

    <template v-else-if="kind === 'city'">
      <circle
        class="rw-chart-icon__ring"
        cx="24"
        cy="24"
        r="14"
      />
      <line
        class="rw-chart-wire__guide"
        x1="24"
        y1="10"
        x2="24"
        y2="38"
      />
      <line
        class="rw-chart-wire__guide"
        x1="10"
        y1="24"
        x2="38"
        y2="24"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="24"
        cy="24"
        r="2.25"
      />
    </template>

    <template v-else-if="kind === 'vehicle'">
      <rect
        class="rw-chart-icon__body"
        x="10"
        y="18"
        width="28"
        height="12"
        rx="3"
      />
      <circle
        class="rw-chart-icon__wheel"
        cx="18"
        cy="34"
        r="3.5"
      />
      <circle
        class="rw-chart-icon__wheel"
        cx="32"
        cy="34"
        r="3.5"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="36"
        cy="22"
        r="1.75"
      />
    </template>

    <template v-else>
      <circle
        class="rw-chart-icon__coin"
        cx="24"
        cy="24"
        r="13"
      />
      <path
        class="rw-chart-icon__stroke"
        d="M24 16 v16 M18 20 h8 M18 28 h8"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="24"
        cy="24"
        r="2"
      />
    </template>
  </svg>
</template>
