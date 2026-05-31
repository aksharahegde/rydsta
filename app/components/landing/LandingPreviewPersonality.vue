<template>
  <div class="rw-landing-preview rw-landing-preview--fill rw-landing-preview-personality">
    <div
      class="rw-landing-preview-personality__stars"
      aria-hidden="true"
    />
    <p class="rw-landing-preview-personality__time">22:00 – 05:00</p>
    <p class="rw-landing-preview-personality__name">Night<br>Owl</p>
  </div>
</template>

<style scoped>
.rw-landing-preview-personality {
  position: relative;
  align-items: flex-start;
  justify-content: flex-end;
  padding: var(--space-md);
  min-height: 12rem;
  background-color: var(--color-night);
  border-radius: var(--radius-sm);
  overflow: hidden;
}

.rw-landing-preview-personality__stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.rw-landing-preview-personality__stars::before,
.rw-landing-preview-personality__stars::after {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  background: var(--color-night-star-hi);
}

.rw-landing-preview-personality__stars::before {
  top: 18%;
  left: 22%;
  box-shadow:
    12px -8px 0 var(--color-night-star-md),
    -15px 22px 0 var(--color-night-star-hi),
    28px 10px 0 var(--color-night-star-lo),
    -5px 40px 0 var(--color-night-star-md),
    35px -15px 0 var(--color-night-star-md);
}

.rw-landing-preview-personality__stars::after {
  top: 55%;
  left: 60%;
  box-shadow:
    -20px 8px 0 var(--color-night-star-md),
    15px -12px 0 var(--color-night-star-hi),
    -8px -25px 0 var(--color-night-star-lo);
}

.rw-landing-preview-personality__time {
  position: relative;
  margin: 0 0 var(--space-sm);
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  color: var(--color-night-ink);
  opacity: 0.65;
}

.rw-landing-preview-personality__name {
  position: relative;
  margin: 0;
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--color-night-ink);
}
</style>
