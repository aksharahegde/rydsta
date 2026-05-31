<script setup lang="ts">
import type { YearHeatmap } from '#shared/lib/ride-heatmap'

defineProps<{
  heatmap: YearHeatmap
}>()

const weekdayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const
</script>

<template>
  <div
    class="rw-heatmap"
    data-testid="wrapped-activity-heatmap"
    role="img"
    :aria-label="`Ride activity in ${heatmap.year}`"
  >
    <div class="rw-heatmap__months" aria-hidden="true">
      <span
        v-for="(month, i) in heatmap.monthLabels"
        :key="`${month.weekIndex}-${month.label}`"
        class="rw-heatmap__month"
        :style="{ gridColumn: month.weekIndex + 2 }"
      >
        {{ month.label }}
      </span>
    </div>

    <div class="rw-heatmap__body">
      <div
        class="rw-heatmap__weekdays"
        aria-hidden="true"
      >
        <span
          v-for="(label, i) in weekdayLabels"
          :key="i"
          class="rw-heatmap__weekday"
        >{{ label }}</span>
      </div>

      <div class="rw-heatmap__grid">
        <div
          v-for="(week, wi) in heatmap.weeks"
          :key="wi"
          class="rw-heatmap__week"
        >
          <span
            v-for="(cell, di) in week.days"
            :key="`${wi}-${di}`"
            class="rw-heatmap__cell"
            :class="cell.date ? `rw-heatmap__cell--level-${cell.level}` : 'rw-heatmap__cell--empty'"
            :title="cell.date ? `${cell.date}: ${cell.count} ride${cell.count === 1 ? '' : 's'}` : undefined"
          />
        </div>
      </div>
    </div>
  </div>
</template>
