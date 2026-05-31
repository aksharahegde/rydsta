<template>
  <div
    class="rw-landing-preview rw-landing-preview-trip-stats"
    aria-hidden="true"
  >
    <div class="rw-landing-preview-trip-stats__grid">
      <div class="rw-landing-preview-trip-stats__item">
        <p class="rw-landing-preview-trip-stats__eyebrow">Distance traveled</p>
        <p class="rw-landing-preview-trip-stats__value">412 km</p>
      </div>
      <div class="rw-landing-preview-trip-stats__item">
        <p class="rw-landing-preview-trip-stats__eyebrow">Primary city</p>
        <p class="rw-landing-preview-trip-stats__value">Bengaluru</p>
      </div>
      <div class="rw-landing-preview-trip-stats__item">
        <p class="rw-landing-preview-trip-stats__eyebrow">Go-to ride</p>
        <p class="rw-landing-preview-trip-stats__value">Economy</p>
      </div>
      <div class="rw-landing-preview-trip-stats__item">
        <p class="rw-landing-preview-trip-stats__eyebrow">Avg fare</p>
        <p class="rw-landing-preview-trip-stats__value">₹285</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.rw-landing-preview-trip-stats {
  padding: var(--space-sm);
  min-height: 8rem;
}

.rw-landing-preview-trip-stats__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-xs);
  height: 100%;
}

.rw-landing-preview-trip-stats__item {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--space-sm);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-sm);
  background: var(--color-paper);
}

.rw-landing-preview-trip-stats__eyebrow {
  margin: 0;
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-2);
}

.rw-landing-preview-trip-stats__value {
  margin: var(--space-2xs) 0 0;
  font-family: var(--font-display);
  font-size: var(--text-sm);
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}
</style>
