<script setup lang="ts">
const props = defineProps<{
  years: { year: number, count: number }[]
  selectedYear: number
}>()

const emit = defineEmits<{
  select: [year: number]
}>()

function onSelect(year: number) {
  if (year !== props.selectedYear) emit('select', year)
}
</script>

<template>
  <nav
    class="rw-year-rail"
    data-testid="wrapped-year-rail"
    aria-label="Select year"
  >
    <button
      v-for="{ year, count } in years"
      :key="year"
      type="button"
      class="rw-year-rail__btn"
      :class="{ 'rw-year-rail__btn--active': year === selectedYear }"
      :data-testid="`wrapped-year-${year}`"
      :aria-pressed="year === selectedYear"
      @click="onSelect(year)"
    >
      <span class="rw-year-rail__year">{{ year }}</span>
      <span class="rw-year-rail__count">{{ count }}</span>
    </button>
  </nav>
</template>
