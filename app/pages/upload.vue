<script setup lang="ts">
import { CONFIDENCE_THRESHOLD, useRideImport } from '~/composables/useRideImport'

const { progress, error, trips, importConfidence, ingest } = useRideImport()
const isImporting = ref(false)

async function onFilesSelected(files: File[]) {
  if (isImporting.value) return
  isImporting.value = true
  try {
    await ingest(files)
    if (error.value) return

    if (importConfidence.value >= CONFIDENCE_THRESHOLD && trips.value.length > 0) {
      await navigateTo('/wrapped')
    } else {
      await navigateTo('/map')
    }
  } finally {
    isImporting.value = false
  }
}
</script>

<template>
  <main class="upload-page">
    <header class="upload-page__header">
      <h1>Upload your rides</h1>
      <p class="upload-page__lede">
        Import an export from Uber, Ola, or Rapido. Everything stays on your device—we never upload your files.
      </p>
    </header>

    <RideUploadDropzone
      :class="{ 'upload-page__dropzone--disabled': isImporting }"
      :progress="progress"
      :show-progress="isImporting"
      @files="onFilesSelected"
    />

    <p
      v-if="error"
      class="upload-page__error"
      data-testid="ride-upload-error"
      role="alert"
    >
      {{ error }}
    </p>

    <p class="upload-page__privacy">
      Your trip data is parsed locally in your browser. No account, no server upload.
    </p>
  </main>
</template>

<style scoped>
.upload-page {
  max-width: 32rem;
  margin: 0 auto;
  padding: 2rem 1.25rem 3rem;
}

.upload-page__header {
  margin-bottom: 1.5rem;
}

.upload-page h1 {
  margin: 0 0 0.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
}

.upload-page__lede {
  margin: 0;
  color: #475569;
  line-height: 1.5;
}

.upload-page__dropzone--disabled {
  pointer-events: none;
  opacity: 0.6;
}

.upload-page__error {
  margin: 1rem 0 0;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 0.875rem;
}

.upload-page__privacy {
  margin: 1.5rem 0 0;
  font-size: 0.8125rem;
  color: #94a3b8;
  line-height: 1.5;
}
</style>
