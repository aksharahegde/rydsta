<script setup lang="ts">
withDefaults(
  defineProps<{
    id: string
    width: number | string
    height: number | string
  }>(),
  {},
)
</script>

<template>
  <defs>
    <pattern
      :id="id"
      width="12"
      height="12"
      patternUnits="userSpaceOnUse"
    >
      <path
        d="M 12 0 L 0 0 0 12"
        fill="none"
        stroke="currentColor"
        stroke-width="0.35"
        opacity="0.16"
      />
    </pattern>
  </defs>
  <rect
    class="rw-chart-wire__grid"
    :width="width"
    :height="height"
    :fill="`url(#${id})`"
  />
</template>
