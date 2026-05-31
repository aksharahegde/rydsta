<template>
  <div class="rw-landing-preview rw-landing-preview--fill rw-landing-preview-stats">
    <p class="rw-landing-preview-stats__eyebrow">Example · 2024</p>
    <p
      class="rw-landing-preview-stats__big"
      aria-hidden="true"
    >234</p>
    <p class="rw-landing-preview-stats__sub">rides this year</p>
    <p class="rw-landing-preview-stats__spend">₹ 18,400 spent</p>
    <p class="rw-landing-preview-stats__note">Your numbers will be different</p>
  </div>
</template>

<style scoped>
.rw-landing-preview-stats {
  align-items: flex-start;
  justify-content: flex-end;
  padding: var(--space-sm);
  min-height: 12rem;
}

.rw-landing-preview-stats__eyebrow {
  margin: 0 0 var(--space-xs);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.rw-landing-preview-stats__big {
  margin: 0;
  font-family: var(--font-display);
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 800;
  line-height: 0.95;
  letter-spacing: -0.04em;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}

.rw-landing-preview-stats__sub {
  margin: var(--space-2xs) 0 0;
  font-size: var(--text-base);
  color: var(--color-ink-2);
}

.rw-landing-preview-stats__spend {
  margin: var(--space-sm) 0 0;
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-ink);
}

.rw-landing-preview-stats__note {
  margin: var(--space-xs) 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  opacity: 0.8;
}
</style>
