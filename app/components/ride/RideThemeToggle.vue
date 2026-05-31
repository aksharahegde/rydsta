<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const { isDark, toggle } = useRideTheme()
</script>

<template>
  <button
    type="button"
    class="rw-theme-toggle"
    data-testid="ride-theme-toggle"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    @click="toggle"
  >
    <Sun
      v-if="isDark"
      class="rw-theme-toggle__icon"
      aria-hidden="true"
    />
    <Moon
      v-else
      class="rw-theme-toggle__icon"
      aria-hidden="true"
    />
    <span class="rw-theme-toggle__label">{{ isDark ? 'Light' : 'Dark' }}</span>
  </button>
</template>
