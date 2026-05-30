<script setup lang="ts">
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
      or click to browse — .zip, .csv, or .xlsx
    </p>
  </div>
</template>

<style scoped>
.dropzone {
  border: 2px dashed #94a3b8;
  border-radius: 12px;
  padding: 2.5rem 1.5rem;
  text-align: center;
  cursor: pointer;
  background: #f8fafc;
  transition:
    border-color 0.15s ease,
    background 0.15s ease;
}

.dropzone--active,
.dropzone:hover {
  border-color: #6366f1;
  background: #eef2ff;
}

.dropzone__input {
  display: none;
}

.dropzone__title {
  margin: 0 0 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
}

.dropzone__hint {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}
</style>
