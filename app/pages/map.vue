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
  padding: 2rem 1.25rem 3rem;
}

.map-page__header {
  margin-bottom: 1.5rem;
}

.map-page h1 {
  margin: 0;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}
</style>
