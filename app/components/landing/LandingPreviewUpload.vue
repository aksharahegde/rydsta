<template>
  <div class="rw-landing-preview rw-landing-preview-upload">
    <div class="rw-landing-preview-upload__zone">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 16V4M8 8l4-4 4 4M4 20h16"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <p class="rw-landing-preview-upload__label">Drop your export</p>
      <p class="rw-landing-preview-upload__types">CSV · XLSX · ZIP</p>
    </div>
  </div>
</template>

<style scoped>
.rw-landing-preview-upload {
  padding: var(--space-sm);
}

.rw-landing-preview-upload__zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  min-height: 6.5rem;
  padding: var(--space-md);
  border: 1.5px dashed var(--color-rule);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
  text-align: center;
}

.rw-landing-preview-upload__zone svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-ink-2);
}

.rw-landing-preview-upload__label {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink);
}

.rw-landing-preview-upload__types {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}
</style>
