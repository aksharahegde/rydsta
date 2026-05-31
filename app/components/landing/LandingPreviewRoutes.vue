<template>
  <div class="rw-landing-preview rw-landing-preview-routes">
    <p class="rw-landing-preview-routes__eyebrow">Top pickup</p>
    <p class="rw-landing-preview-routes__address">
      <mark class="rw-landing-preview-routes__highlight">Terminal 2</mark>, Chhatrapati Shivaji Intl
    </p>
    <p class="rw-landing-preview-routes__meta">47 trips from here</p>
  </div>
</template>

<style scoped>
.rw-landing-preview-routes {
  align-items: flex-start;
  padding: var(--space-md);
  gap: var(--space-2xs);
}

.rw-landing-preview-routes__eyebrow {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.rw-landing-preview-routes__address {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 500;
  line-height: 1.4;
  color: var(--color-ink);
}

.rw-landing-preview-routes__highlight {
  padding: 0 0.15em;
  border-radius: 2px;
  background: var(--color-accent-bg);
  color: var(--color-ink);
  font-weight: 600;
}

.rw-landing-preview-routes__meta {
  margin: var(--space-2xs) 0 0;
  font-size: var(--text-xs);
  color: var(--color-ink-2);
}
</style>
