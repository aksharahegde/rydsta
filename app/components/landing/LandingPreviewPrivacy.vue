<template>
  <div class="rw-landing-preview rw-landing-preview-privacy">
    <svg
      class="rw-landing-preview-privacy__icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="11"
        width="14"
        height="10"
        rx="2"
        stroke="currentColor"
        stroke-width="1.5"
      />
      <path
        d="M8 11V7a4 4 0 0 1 8 0v4"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
      />
    </svg>
    <p class="rw-landing-preview-privacy__text">
      Files never leave your browser
    </p>
  </div>
</template>

<style scoped>
.rw-landing-preview-privacy {
  align-items: center;
  text-align: center;
  padding: var(--space-md);
  gap: var(--space-sm);
}

.rw-landing-preview-privacy__icon {
  width: 1.75rem;
  height: 1.75rem;
  color: var(--color-ink-2);
}

.rw-landing-preview-privacy__text {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.35;
  color: var(--color-ink);
  max-width: 14ch;
}
</style>
