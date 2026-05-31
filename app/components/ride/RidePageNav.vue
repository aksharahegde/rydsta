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
    <div class="rw-page-nav__trail">
      <NuxtLink
        to="/"
        class="rw-page-nav__home"
        aria-label="Rydsta home"
        data-testid="ride-nav-home"
      >
        <RideLogo size="sm" />
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
    </div>
    <RideThemeToggle />
  </nav>
</template>
