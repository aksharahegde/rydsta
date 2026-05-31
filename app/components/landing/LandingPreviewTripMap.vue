<template>
  <div
    class="rw-landing-preview rw-landing-preview--fill rw-landing-preview-map"
    aria-hidden="true"
  >
    <div class="rw-landing-preview-map__surface">
      <svg
        class="rw-landing-preview-map__route"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <path
          d="M20 80 C 60 20, 100 90, 180 30"
          fill="none"
          stroke="var(--color-accent)"
          stroke-width="3"
          stroke-linecap="round"
        />
        <circle
          cx="20"
          cy="80"
          r="4"
          fill="var(--color-accent)"
        />
        <circle
          cx="180"
          cy="30"
          r="4"
          fill="var(--color-accent)"
        />
      </svg>
      <span class="rw-landing-preview-map__play">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </div>
    <p class="rw-landing-preview-map__meta">12 routes · Mumbai</p>
  </div>
</template>

<style scoped>
.rw-landing-preview-map {
  padding: var(--space-sm);
  gap: var(--space-xs);
}

.rw-landing-preview-map__surface {
  position: relative;
  flex: 1;
  min-height: 5.5rem;
  border-radius: var(--radius-sm);
  background:
    linear-gradient(180deg, var(--color-sky) 0%, var(--color-paper-2) 100%);
  overflow: hidden;
}

.rw-landing-preview-map__route {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.rw-landing-preview-map__play {
  position: absolute;
  bottom: var(--space-xs);
  right: var(--space-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: var(--color-accent);
  color: var(--color-hero-cta-fg);
  box-shadow: 0 4px 12px -4px var(--color-shadow);
}

.rw-landing-preview-map__play svg {
  width: 0.875rem;
  height: 0.875rem;
  margin-left: 1px;
}

.rw-landing-preview-map__meta {
  margin: 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}
</style>
