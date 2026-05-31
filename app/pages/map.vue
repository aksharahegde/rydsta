<script setup lang="ts">
const { pendingMapping, trips } = useRideImport()

onMounted(() => {
  if (!pendingMapping.value && trips.value.length === 0) {
    navigateTo('/upload')
  }
})

function onMappingSubmit() {
  navigateTo('/wrapped')
}
</script>

<template>
  <main class="map-page">
    <RidePageNav current="Map columns" />

    <header class="map-page__header">
      <h1>Map columns</h1>
    </header>

    <RideMappingConfirm
      v-if="pendingMapping"
      @submit="onMappingSubmit"
    />
  </main>
</template>

<style scoped>
.map-page {
  max-width: 40rem;
  margin: 0 auto;
  padding: 0 1.25rem 3rem;
  background:
    radial-gradient(ellipse 120% 70% at 50% -15%, var(--color-glow), transparent 55%),
    var(--color-paper);
  color: var(--color-ink);
  min-height: 100dvh;
}

.map-page__header {
  margin-bottom: 1.5rem;
}

.map-page h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-ink);
}
</style>
