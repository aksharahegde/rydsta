<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    progress?: number
    showProgress?: boolean
  }>(),
  {
    progress: 0,
    showProgress: false,
  },
)

const emit = defineEmits<{
  files: [files: File[]]
}>()

const inputRef = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

const accept = '.zip,.csv,.xlsx'

function emitFiles(fileList: FileList | null | undefined) {
  if (!fileList?.length) return
  emit('files', Array.from(fileList))
}

function onInputChange(event: Event) {
  const target = event.target as HTMLInputElement
  emitFiles(target.files)
  target.value = ''
}

function onDrop(event: DragEvent) {
  event.preventDefault()
  isDragging.value = false
  emitFiles(event.dataTransfer?.files)
}

function onDragOver(event: DragEvent) {
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave() {
  isDragging.value = false
}

function openPicker() {
  inputRef.value?.click()
}
</script>

<template>
  <div class="dropzone-wrap">
    <div
      data-testid="ride-upload-dropzone"
      class="dropzone"
      :class="{ 'dropzone--active': isDragging }"
      role="button"
      tabindex="0"
      @click="openPicker"
      @keydown.enter.prevent="openPicker"
      @keydown.space.prevent="openPicker"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
    >
      <input
        ref="inputRef"
        data-testid="ride-upload-input"
        type="file"
        class="dropzone__input"
        :accept="accept"
        multiple
        @change="onInputChange"
        @click.stop
      >
      <p class="dropzone__title">
        Drop your ride export here
      </p>
      <p class="dropzone__hint">
        or click to browse · .zip, .csv, or .xlsx
      </p>
    </div>

    <div
      v-if="showProgress || props.progress > 0"
      class="dropzone-wrap__progress"
      data-testid="ride-upload-progress"
      role="progressbar"
      :aria-valuenow="props.progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <Progress
        :model-value="props.progress"
        class="dropzone-wrap__progress-bar"
      />
      <span class="dropzone-wrap__progress-label">{{ props.progress }}%</span>
    </div>
  </div>
</template>

<style scoped>
.dropzone-wrap__progress {
  margin-top: 1.25rem;
}

.dropzone-wrap__progress-bar {
  height: 0.5rem;
}

.dropzone-wrap__progress-label {
  display: block;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--muted-foreground);
  text-align: center;
}

.dropzone {
  border: 2px dashed var(--border);
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  cursor: pointer;
  background: var(--muted);
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.dropzone--active,
.dropzone:hover {
  border-color: var(--primary);
  background: color-mix(in oklch, var(--primary) 8%, var(--muted));
}

.dropzone__input {
  display: none;
}

.dropzone__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--foreground);
}

.dropzone__hint {
  margin: 0;
  font-size: 0.875rem;
  color: var(--muted-foreground);
}
</style>
