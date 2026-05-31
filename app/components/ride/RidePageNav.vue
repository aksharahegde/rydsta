<script setup lang="ts">
defineProps<{
  current?: string
}>()
</script>

<template>
  <nav
    class="rw-page-nav rw-content"
    aria-label="Breadcrumb"
  >
    <NuxtLink
      to="/"
      class="rw-page-nav__home"
      data-testid="ride-nav-home"
    >
      Ride Wrapped
    </NuxtLink>
    <template v-if="current">
      <span
        class="rw-page-nav__sep"
        aria-hidden="true"
      >/</span>
      <span
        class="rw-page-nav__current"
        aria-current="page"
      >{{ current }}</span>
    </template>
  </nav>
</template>
