<template>
  <div class="wrapped-layout">
    <slot />
  </div>
</template>

<style scoped>
.wrapped-layout {
  min-height: 100dvh;
  background: linear-gradient(165deg, #0a0a12 0%, #141428 45%, #1e1b4b 100%);
  color: #f8fafc;
}
</style>
