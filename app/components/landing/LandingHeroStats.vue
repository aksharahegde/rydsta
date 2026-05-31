<script setup lang="ts">
const stats = [
  { value: '3', label: 'providers' },
  { value: '100%', label: 'in-browser' },
  { value: '0', label: 'accounts' },
  { value: '1', label: 'shareable card' },
] as const
</script>

<template>
  <div
    class="rw-landing-stats"
    aria-label="Product highlights"
  >
    <div
      v-for="item in stats"
      :key="item.label"
      class="rw-landing-stats__item"
    >
      <span class="rw-landing-stats__value">{{ item.value }}</span>
      <span class="rw-landing-stats__label">{{ item.label }}</span>
    </div>
  </div>
</template>
