<script setup lang="ts">
import type { Trip } from '#shared/types/trip'

const props = defineProps<{
  trips: Trip[]
  activeIndex: number
}>()

const emit = defineEmits<{
  select: [index: number]
}>()

// Group trips by month label, tracking original index
type TripDot = {
  index: number
  month: string
  monthKey: string   // YYYY-MM for grouping
}

const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const dots = computed((): TripDot[] =>
  props.trips.map((trip, index) => {
    const d = trip.startedAt
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const month = MONTH_ABBR[d.getMonth()]!
    return { index, month, monthKey }
  }),
)

// First dot index per month — for showing the label
const monthLabelAt = computed(() => {
  const seen = new Set<string>()
  const result = new Map<number, string>()
  for (const dot of dots.value) {
    if (!seen.has(dot.monthKey)) {
      seen.add(dot.monthKey)
      result.set(dot.index, dot.month)
    }
  }
  return result
})

const scrollRef = ref<HTMLElement | null>(null)

// Auto-scroll active dot into view
watch(() => props.activeIndex, (idx) => {
  nextTick(() => {
    const el = scrollRef.value
    if (!el) return
    const dot = el.querySelector<HTMLElement>(`[data-dot-index="${idx}"]`)
    dot?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
  })
})
</script>

<template>
  <div
    ref="scrollRef"
    class="rw-timeline"
    role="listbox"
    aria-label="Trip timeline"
  >
    <div
      v-for="dot in dots"
      :key="dot.index"
      class="rw-timeline__slot"
    >
      <!-- Month label above first dot of each month -->
      <span
        v-if="monthLabelAt.has(dot.index)"
        class="rw-timeline__month"
        aria-hidden="true"
      >{{ monthLabelAt.get(dot.index) }}</span>
      <button
        type="button"
        class="rw-timeline__dot"
        :class="{
          'rw-timeline__dot--active': dot.index === activeIndex,
          'rw-timeline__dot--past': dot.index < activeIndex,
        }"
        :aria-label="`Trip ${dot.index + 1}, ${dot.month}`"
        :aria-selected="dot.index === activeIndex"
        role="option"
        :data-dot-index="dot.index"
        @click="emit('select', dot.index)"
      />
    </div>
  </div>
</template>
