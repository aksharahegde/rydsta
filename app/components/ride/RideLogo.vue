<script setup lang="ts">
withDefaults(
  defineProps<{
    size?: 'sm' | 'md'
  }>(),
  { size: 'md' },
)
</script>

<template>
  <img
    src="/logo/rydsta.svg"
    alt="Rydsta"
    class="rw-logo"
    :class="{ 'rw-logo--sm': size === 'sm' }"
    width="32"
    height="32"
  >
</template>
