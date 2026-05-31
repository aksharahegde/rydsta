<template>
  <div class="wrapped-layout">
    <slot />
  </div>
</template>

<style scoped>
.wrapped-layout {
  min-height: 100dvh;
  background: var(--color-paper);
  color: var(--color-ink);
}
</style>
