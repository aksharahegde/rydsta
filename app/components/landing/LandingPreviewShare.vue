<template>
  <div
    class="rw-landing-preview rw-landing-preview-share"
    aria-hidden="true"
  >
    <div class="rw-landing-preview-share__thumb">
      <div class="rw-landing-preview-share__mini-grid">
        <span class="rw-landing-preview-share__block rw-landing-preview-share__block--lg" />
        <span class="rw-landing-preview-share__block rw-landing-preview-share__block--dark" />
        <span class="rw-landing-preview-share__block" />
        <span class="rw-landing-preview-share__block" />
      </div>
    </div>
    <div class="rw-landing-preview-share__action">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M12 3v12M7 10l5 5 5-5M5 21h14"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <span>Download PNG</span>
    </div>
  </div>
</template>

<style scoped>
.rw-landing-preview-share {
  padding: var(--space-sm);
  gap: var(--space-sm);
}

.rw-landing-preview-share__thumb {
  flex: 1;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-rule);
  background: var(--color-paper);
}

.rw-landing-preview-share__mini-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1.2fr 0.8fr;
  gap: 3px;
  min-height: 4rem;
}

.rw-landing-preview-share__block {
  border-radius: 3px;
  background: var(--color-paper-2);
  border: 1px solid var(--color-rule);
}

.rw-landing-preview-share__block--lg {
  grid-row: span 2;
}

.rw-landing-preview-share__block--dark {
  background: var(--color-night);
  border-color: var(--color-night);
}

.rw-landing-preview-share__action {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2xs);
  padding: var(--space-2xs) var(--space-sm);
  border-radius: var(--radius-pill);
  background: var(--color-accent-bg);
  border: 1px solid var(--color-accent-border);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-ink);
}

.rw-landing-preview-share__action svg {
  width: 1rem;
  height: 1rem;
}
</style>
