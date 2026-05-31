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

// ── Night Owl: 24-segment radial hour clock ──────────────────────
const HOUR_CX = 60
const HOUR_CY = 45
const HOUR_R_INNER = 12
const HOUR_R_MAX = 34

const hourNorm = computed(() => {
  const src = props.hourCounts.length === 24
    ? props.hourCounts
    : Array.from({ length: 24 }, () => 0)
  const max = Math.max(...src, 1)
  return src.map(v => v / max)
})

function hourArcPath(index: number, norm: number): string {
  if (norm <= 0) return ''
  const sweepAngle = (360 / 24) * 0.75
  const gapAngle = (360 / 24) * 0.25
  const startAngle = index * (sweepAngle + gapAngle)
  const endAngle = startAngle + sweepAngle
  const rOuter = HOUR_R_INNER + Math.max((HOUR_R_MAX - HOUR_R_INNER) * norm, 4)

  const toXY = (deg: number, r: number) => {
    const rad = ((deg - 90) * Math.PI) / 180
    return { x: HOUR_CX + r * Math.cos(rad), y: HOUR_CY + r * Math.sin(rad) }
  }

  const p1 = toXY(startAngle, HOUR_R_INNER)
  const p2 = toXY(startAngle, rOuter)
  const p3 = toXY(endAngle, rOuter)
  const p4 = toXY(endAngle, HOUR_R_INNER)
  const large = sweepAngle > 180 ? 1 : 0

  return [
    `M ${p1.x} ${p1.y}`,
    `L ${p2.x} ${p2.y}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${p3.x} ${p3.y}`,
    `L ${p4.x} ${p4.y}`,
    `A ${HOUR_R_INNER} ${HOUR_R_INNER} 0 ${large} 0 ${p1.x} ${p1.y}`,
    'Z',
  ].join(' ')
}

// Night hours: 22,23,0,1,2,3,4 (indices in 24-hour array)
const nightIndices = new Set([22, 23, 0, 1, 2, 3, 4])
function isNightHour(i: number) { return nightIndices.has(i) }

// ── Road Warrior: multi-path spaghetti routes ─────────────────────
const warriorPaths = [
  'M10 70 C 30 68, 42 28, 66 38 S 100 12, 112 10',
  'M10 72 C 28 55, 48 44, 70 50 S 96 26, 112 18',
  'M12 68 C 34 62, 44 22, 68 32 S 98 8, 110 6',
  'M8 74 C 32 72, 50 50, 72 46 S 100 30, 112 22',
]
const warriorOpacities = [0.72, 0.45, 0.28, 0.18]
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

    <!-- ── Night Owl ─────────────────────────────────────────────── -->
    <template v-if="personality === 'Night Owl'">
      <!-- 24-segment radial hour clock -->
      <template
        v-for="(norm, i) in hourNorm"
        :key="`hour-${i}`"
      >
        <path
          v-if="norm > 0"
          class="rw-personality-hour-arc"
          :class="{ 'rw-personality-hour-arc--night': isNightHour(i) }"
          :d="hourArcPath(i, norm)"
          :style="{
            '--viz-i': i,
            '--arc-op': isNightHour(i)
              ? Math.max(0.55, norm * 0.9)
              : Math.max(0.12, norm * 0.35),
          }"
        />
      </template>

      <!-- Moon disc top-right -->
      <circle
        class="rw-personality-moon-disc rw-chart-wire__node"
        cx="102"
        cy="14"
        r="10"
        style="--viz-i: 24; fill-opacity: 0.08;"
      />
      <path
        class="rw-chart-personality__moon rw-chart-wire__stroke"
        pathLength="1"
        d="M96 8 A 11 11 0 1 0 112 22 A 7.5 7.5 0 1 1 96 8"
        style="stroke-width: 1.15;"
      />

      <!-- Baseline -->
      <line
        class="rw-chart-wire__guide"
        x1="6"
        y1="76"
        x2="114"
        y2="76"
        style="opacity: 0.4;"
      />
    </template>

    <!-- ── Airport Regular ───────────────────────────────────────── -->
    <template v-else-if="personality === 'Airport Regular'">
      <!-- Runway horizon -->
      <line
        class="rw-chart-wire__guide"
        x1="4"
        y1="64"
        x2="116"
        y2="64"
        style="opacity: 0.5;"
      />
      <!-- Runway centerline dashes -->
      <path
        class="rw-chart-personality__runway-mark rw-chart-wire__mark"
        d="M54 60 V68 M68 60 V68 M82 60 V68"
      />

      <!-- Great-circle arc from bottom-left to top-right -->
      <path
        class="rw-chart-personality__arc rw-chart-wire__stroke"
        pathLength="1"
        d="M14 70 Q 48 8, 108 10"
        style="stroke-width: 1.35;"
      />

      <!-- Origin: concentric rings -->
      <circle
        class="rw-chart-pin__ring"
        cx="14"
        cy="70"
        r="9"
        :style="{ '--viz-i': 0 }"
      />
      <circle
        class="rw-chart-pin__ring"
        cx="14"
        cy="70"
        r="4"
        :style="{ '--viz-i': 1 }"
      />

      <!-- Destination: glow node -->
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="108"
        cy="10"
        r="3"
      />

      <!-- Plane silhouette along path (midpoint ~Q(48,8)) -->
      <path
        class="rw-chart-personality__plane rw-chart-wire__stroke"
        pathLength="1"
        d="M52 34 L62 28 L100 18 L66 36 L66 44 L58 47 L62 32 Z"
        style="stroke-width: 1; animation-delay: 400ms;"
      />
    </template>

    <!-- ── Road Warrior (default) ─────────────────────────────────── -->
    <template v-else>
      <!-- Multiple overlapping route paths — spaghetti density effect -->
      <path
        v-for="(d, i) in warriorPaths"
        :key="`wp-${i}`"
        class="rw-chart-personality__warrior-route rw-chart-wire__stroke"
        pathLength="1"
        :d="d"
        :style="{
          '--viz-i': i,
          '--warrior-op': warriorOpacities[i],
          'animation-delay': `${i * 160}ms`,
        }"
      />

      <!-- Guide lines at start/end -->
      <line
        class="rw-chart-wire__guide"
        x1="10"
        y1="72"
        x2="10"
        y2="48"
        style="opacity: 0.4;"
      />
      <line
        class="rw-chart-wire__guide"
        x1="112"
        y1="10"
        x2="88"
        y2="10"
        style="opacity: 0.4;"
      />

      <!-- Origin and destination nodes -->
      <circle
        class="rw-chart-wire__node"
        cx="10"
        cy="70"
        r="2"
      />
      <circle
        class="rw-chart-wire__node rw-chart-wire__node--glow"
        cx="112"
        cy="10"
        r="3"
      />
    </template>
  </svg>
</template>

<style scoped>
/* Night Owl hour arcs */
.rw-personality-hour-arc {
  fill: var(--rw-personality-wire);
  fill-opacity: var(--arc-op, 0.2);
  stroke: none;
  opacity: 0;
  animation: rw-viz-fade-in 420ms var(--ease-out) both;
  animation-delay: calc(var(--viz-i, 0) * 28ms + 100ms);
}

.rw-personality-hour-arc--night {
  fill: var(--rw-personality-glow);
}

/* Moon background disc */
.rw-personality-moon-disc {
  fill: var(--rw-personality-glow);
}

/* Road Warrior multi-route opacity */
.rw-chart-personality__warrior-route {
  opacity: var(--warrior-op, 0.4);
}

/* Static fallback */
.rw-chart-personality--static .rw-personality-hour-arc {
  animation: none;
  opacity: 1;
}
</style>
