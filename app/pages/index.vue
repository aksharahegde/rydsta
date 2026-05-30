<script setup lang="ts">
const description =
  'Turn your Uber, Ola, and Rapido trip exports into a shareable year-in-rides story. 100% in your browser.'

useSeoMeta({
  title: 'Ride Wrapped — Your rides, wrapped',
  description,
  ogTitle: 'Ride Wrapped — Your rides, wrapped',
  ogDescription: description,
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div class="rw-page">

    <!-- N1 nav: wordmark left, single CTA right, sticky -->
    <nav class="rw-nav" aria-label="Site navigation">
      <span class="rw-wordmark" aria-label="Ride Wrapped">Ride Wrapped</span>
      <NuxtLink to="/upload" class="rw-nav-cta">Get started</NuxtLink>
    </nav>

    <!-- Hero header — fixed-height, not full viewport -->
    <header class="rw-hero" data-testid="landing-hero">
      <p class="rw-hero-tag">Uber · Ola · Rapido</p>
      <h1 class="rw-hero-head">Your year<br>in rides.</h1>
      <p class="rw-hero-sub">
        Drop an export. Get a shareable story.<br>
        No account — everything runs in your browser.
      </p>
    </header>

    <!-- Bento grid: tiles=7, spans=irregular, border=hairline-all -->
    <section class="rw-bento" aria-label="What you get">

      <!-- Tile 1: Stat preview (2×2) — illustrative example card -->
      <article class="rw-tile rw-tile--stat">
        <p class="rw-tile-eyebrow">Example · 2024</p>
        <p class="rw-tile-big" aria-hidden="true">234</p>
        <p class="rw-tile-stat-sub">rides this year</p>
        <p class="rw-tile-spend">₹ 18,400 spent</p>
        <p class="rw-tile-disclaimer">Your numbers will be different</p>
      </article>

      <!-- Tile 2: Night Owl personality (1×2 tall, dark) -->
      <article class="rw-tile rw-tile--night">
        <div class="rw-stars" aria-hidden="true"></div>
        <p class="rw-tile-time">22:00 — 05:00</p>
        <p class="rw-tile-persona">Night<br>Owl</p>
      </article>

      <!-- Tile 3: Privacy (1×1) -->
      <article class="rw-tile rw-tile--privacy">
        <svg class="rw-tile-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <rect x="5" y="11" width="14" height="10" rx="2" stroke="currentColor" stroke-width="1.5"/>
          <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
        <p class="rw-tile-privacy-text">Files never leave your browser</p>
      </article>

      <!-- Tile 4: Airport Regular (2×1 wide) -->
      <article class="rw-tile rw-tile--airport">
        <p class="rw-tile-persona rw-tile-persona--wide">Airport Regular</p>
        <p class="rw-tile-tagline">Terminal 2, always.</p>
      </article>

      <!-- Tile 5: Providers (1×1) -->
      <article class="rw-tile rw-tile--providers">
        <p class="rw-tile-eyebrow">Works with</p>
        <p class="rw-tile-provider-list">Uber<br>Ola<br>Rapido</p>
      </article>

      <!-- Tile 6: Road Warrior (1×1) -->
      <article class="rw-tile rw-tile--warrior">
        <p class="rw-tile-persona rw-tile-persona--sm">Road<br>Warrior</p>
        <p class="rw-tile-tagline">Always on the move.</p>
      </article>

      <!-- Tile 7: CTA (1×1) -->
      <article class="rw-tile rw-tile--cta" role="none">
        <NuxtLink to="/upload" class="rw-cta-link" data-testid="landing-cta">
          <span>See my<br>wrapped</span>
          <svg class="rw-cta-arrow" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </NuxtLink>
      </article>

    </section>

    <!-- Ft5 Statement footer -->
    <footer class="rw-footer">
      <p class="rw-footer-statement">Your city moved you.<br>Now see how.</p>
      <div class="rw-footer-meta">
        <span class="rw-wordmark-sm">Ride Wrapped</span>
        <span class="rw-footer-sep" aria-hidden="true">·</span>
        <span>Runs entirely in your browser</span>
        <span class="rw-footer-sep" aria-hidden="true">·</span>
        <span>No account</span>
        <span class="rw-footer-sep" aria-hidden="true">·</span>
        <span>© 2026</span>
      </div>
    </footer>

  </div>
</template>

<style>
/* Hallmark · genre: playful · macrostructure: Bento Grid · theme: custom warm-amber
 * F1 Bento knobs: tiles=7, spans=irregular, border=hairline-all
 * nav: N1 (left/right split, sticky) · footer: Ft5 Statement (38ch, hairline rule above meta)
 * tone: playful + rider/travel · anchor hue: 55° (warm amber)
 * paper-band: light (L > 85%) · display-style: geometric-sans (Bricolage Grotesque)
 * accent-hue: warm (55°) · enrichment: Tier-A CSS star art on Night Owl tile
 */

/* ── Tokens ──────────────────────────────────────────────────── */
:root {
  --color-paper:      oklch(97% 0.008 65);
  --color-paper-2:    oklch(93% 0.012 65);
  --color-ink:        oklch(18% 0.010 60);
  --color-ink-2:      oklch(42% 0.008 65);
  --color-rule:       oklch(84% 0.008 65);
  --color-accent:     oklch(68% 0.12  55);
  --color-accent-bg:  oklch(93% 0.022 60);
  --color-focus:      oklch(52% 0.19  55);
  --color-night:      oklch(16% 0.018 260);
  --color-night-ink:  oklch(88% 0.010 260);
  --color-night-star-hi: oklch(88% 0.010 260 / 0.55);
  --color-night-star-md: oklch(88% 0.010 260 / 0.40);
  --color-night-star-lo: oklch(88% 0.010 260 / 0.28);

  --font-display: "Bricolage Grotesque", "Geist Variable", system-ui, sans-serif;
  --font-body:    "Geist Variable", "Geist", system-ui, sans-serif;

  --space-3xs: 0.25rem;
  --space-2xs: 0.5rem;
  --space-xs:  0.75rem;
  --space-sm:  1rem;
  --space-md:  1.5rem;
  --space-lg:  2rem;
  --space-xl:  3rem;
  --space-2xl: 4.5rem;
  --space-3xl: 7rem;

  --text-xs:      0.64rem;
  --text-sm:      0.8rem;
  --text-base:    1rem;
  --text-md:      1.25rem;
  --text-lg:      1.5625rem;
  --text-xl:      1.9531rem;
  --text-2xl:     2.4414rem;
  --text-3xl:     3.0518rem;
  --text-4xl:     3.8147rem;
  --text-display: clamp(2.75rem, 5vw + 1rem, 5.25rem);

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in:  cubic-bezier(0.4, 0, 1, 1);
  --dur-short: 200ms;
  --dur-med:   300ms;

  --radius-card:  12px;
  --radius-pill:  999px;
  --radius-sm:    6px;
}

/* ── Page shell ──────────────────────────────────────────────── */
.rw-page {
  background-color: var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  min-height: 100dvh;
}

/* ── Nav (N1: wordmark left, CTA right, sticky) ─────────────── */
.rw-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background-color: var(--color-paper);
  border-bottom: 1px solid var(--color-rule);
}

.rw-wordmark {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-md);
  letter-spacing: -0.025em;
  color: var(--color-ink);
  user-select: none;
}

.rw-nav-cta {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-ink);
  text-decoration: none;
  padding: var(--space-2xs) var(--space-sm);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-pill);
  white-space: nowrap;
  transition: background-color var(--dur-short) var(--ease-out),
              border-color     var(--dur-short) var(--ease-out);
}
.rw-nav-cta:hover {
  background-color: var(--color-paper-2);
  border-color: var(--color-ink-2);
}
.rw-nav-cta:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}
.rw-nav-cta:active { background-color: var(--color-paper-2); }

/* ── Hero header (fixed-height, not full viewport) ───────────── */
.rw-hero {
  padding: var(--space-2xl) var(--space-md) var(--space-xl);
  max-width: 64rem;
}

.rw-hero-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  margin-bottom: var(--space-xs);
}

.rw-hero-head {
  font-family: var(--font-display);
  font-size: var(--text-display);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.04em;
  color: var(--color-ink);
  margin: 0 0 var(--space-md);
  overflow-wrap: anywhere;
  min-width: 0;
}

.rw-hero-sub {
  font-family: var(--font-body);
  font-size: var(--text-md);
  line-height: 1.55;
  color: var(--color-ink-2);
  max-width: 42ch;
}

/* ── Bento grid ──────────────────────────────────────────────── */
.rw-bento {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: var(--space-xs);
  padding: 0 var(--space-md) var(--space-2xl);
  max-width: 64rem;
}

/* Tile base */
.rw-tile {
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-card);
  padding: var(--space-md);
  background-color: var(--color-paper-2);
  transition: transform  var(--dur-short) var(--ease-out),
              box-shadow var(--dur-short) var(--ease-out);
  overflow: hidden;
  position: relative;
  min-height: 9rem;
}
.rw-tile:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px -10px oklch(52% 0.10 55 / 0.18);
}

/* Grid placement (4-col desktop, 3 rows) */
.rw-tile--stat      { grid-column: 1 / 3; grid-row: 1 / 3; background-color: var(--color-paper); }
.rw-tile--night     { grid-column: 3 / 4; grid-row: 1 / 3; background-color: var(--color-night); border-color: var(--color-night); }
.rw-tile--privacy   { grid-column: 4 / 5; grid-row: 1;     background-color: var(--color-paper); }
.rw-tile--providers { grid-column: 4 / 5; grid-row: 2;     background-color: var(--color-paper-2); }
.rw-tile--airport   { grid-column: 1 / 3; grid-row: 3;     background-color: var(--color-accent-bg); border-color: oklch(84% 0.016 60); }
.rw-tile--warrior   { grid-column: 3 / 4; grid-row: 3;     background-color: var(--color-paper-2); }
.rw-tile--cta       { grid-column: 4 / 5; grid-row: 3;     background-color: var(--color-ink); border-color: var(--color-ink); cursor: pointer; }

.rw-tile--night:hover {
  box-shadow: 0 8px 24px -8px oklch(10% 0.015 260 / 0.5);
}
.rw-tile--cta:hover {
  box-shadow: 0 8px 24px -10px oklch(18% 0.010 60 / 0.35);
}

/* ── Tile: shared text styles ────────────────────────────────── */
.rw-tile-eyebrow {
  font-size: var(--text-xs);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-ink-2);
  margin-bottom: var(--space-xs);
}

.rw-tile-tagline {
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  font-style: italic;
}

/* ── Tile: Stat (illustrative example card) ──────────────────── */
.rw-tile--stat .rw-tile-big {
  font-family: var(--font-display);
  font-size: clamp(4rem, 10vw, 7rem);
  font-weight: 800;
  line-height: 1.0;
  letter-spacing: -0.05em;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
  margin-bottom: var(--space-3xs);
}
.rw-tile--stat .rw-tile-stat-sub {
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  margin-bottom: var(--space-3xs);
}
.rw-tile--stat .rw-tile-spend {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  color: var(--color-ink);
  font-variant-numeric: tabular-nums;
}
.rw-tile--stat .rw-tile-disclaimer {
  position: absolute;
  bottom: var(--space-sm);
  right: var(--space-sm);
  font-size: var(--text-xs);
  color: var(--color-ink-2);
  font-style: italic;
  max-width: 14ch;
  text-align: right;
  line-height: 1.3;
}

/* ── Tile: Night Owl ─────────────────────────────────────────── */
/* CSS star art — box-shadows derived from --color-night-star-* tokens.
 * Multiple shadows in a single declaration require inline values; all share hue 260°. */
.rw-stars {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
.rw-stars::before {
  content: "";
  position: absolute;
  width: 2px;
  height: 2px;
  border-radius: 50%;
  top: 20%;
  left: 30%;
  background: var(--color-night-star-hi);
  box-shadow:
    12px  -8px 0 var(--color-night-star-md),
   -15px  22px 0 var(--color-night-star-hi),
    28px  10px 0 var(--color-night-star-lo),
    -5px  40px 0 var(--color-night-star-md),
    35px -15px 0 var(--color-night-star-md),
   -25px  -8px 0 var(--color-night-star-lo),
    18px  52px 0 var(--color-night-star-hi),
   -32px  18px 0 var(--color-night-star-md);
}
.rw-stars::after {
  content: "";
  position: absolute;
  width: 1px;
  height: 1px;
  border-radius: 50%;
  top: 55%;
  left: 60%;
  background: var(--color-night-star-md);
  box-shadow:
   -20px   8px 0 var(--color-night-star-md),
    15px -12px 0 var(--color-night-star-hi),
    -8px -25px 0 var(--color-night-star-lo),
    25px  18px 0 var(--color-night-star-md),
   -15px  30px 0 var(--color-night-star-hi);
}

.rw-tile--night .rw-tile-time {
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  color: var(--color-night-ink);
  opacity: 0.65;
  margin-bottom: var(--space-md);
  margin-top: var(--space-2xs);
}

.rw-tile--night .rw-tile-persona {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: var(--color-night-ink);
}

/* ── Tile: Privacy ───────────────────────────────────────────── */
.rw-tile-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-ink-2);
  margin-bottom: var(--space-sm);
}
.rw-tile-privacy-text {
  font-size: var(--text-base);
  font-weight: 500;
  color: var(--color-ink);
  max-width: 14ch;
  line-height: 1.35;
}

/* ── Tile: Airport ───────────────────────────────────────────── */
.rw-tile--airport {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.rw-tile-persona--wide {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  margin-bottom: var(--space-2xs);
}

/* ── Tile: Providers ─────────────────────────────────────────── */
.rw-tile-provider-list {
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 600;
  line-height: 1.5;
  color: var(--color-ink);
}

/* ── Tile: Road Warrior ──────────────────────────────────────── */
.rw-tile--warrior {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}
.rw-tile-persona--sm {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  margin-bottom: var(--space-2xs);
}

/* ── Tile: CTA ───────────────────────────────────────────────── */
.rw-cta-link {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  text-decoration: none;
  color: var(--color-paper);
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  min-height: 100%;
  padding: 0;
}
.rw-cta-link:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
  border-radius: var(--radius-sm);
}
.rw-cta-arrow {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
  transition: transform var(--dur-short) var(--ease-out);
}
.rw-cta-link:hover .rw-cta-arrow {
  transform: translateX(3px);
}

/* ── Footer (Ft5 Statement) ──────────────────────────────────── */
.rw-footer {
  padding: var(--space-2xl) var(--space-md) var(--space-xl);
  border-top: 1px solid var(--color-rule);
  max-width: 64rem;
}
.rw-footer-statement {
  font-family: var(--font-display);
  font-size: clamp(1.75rem, 3.5vw + 0.5rem, 3rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.03em;
  color: var(--color-ink);
  max-width: 22ch;
  margin-bottom: var(--space-md);
}
.rw-footer-meta {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-wrap: wrap;
  font-size: var(--text-sm);
  color: var(--color-ink-2);
}
.rw-wordmark-sm {
  font-family: var(--font-display);
  font-weight: 600;
  color: var(--color-ink);
}
.rw-footer-sep { color: var(--color-rule); }

/* ── Responsive: tablet (641–960px) ─────────────────────────── */
@media (min-width: 40.0625rem) and (max-width: 60rem) {
  .rw-bento {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .rw-tile--stat      { grid-column: 1 / 3; grid-row: 1 / 3; }
  .rw-tile--night     { grid-column: 3 / 4; grid-row: 1 / 3; }
  .rw-tile--privacy   { grid-column: 1 / 2; grid-row: 3; }
  .rw-tile--airport   { grid-column: 2 / 4; grid-row: 3; }
  .rw-tile--providers { grid-column: 1 / 2; grid-row: 4; }
  .rw-tile--warrior   { grid-column: 2 / 3; grid-row: 4; }
  .rw-tile--cta       { grid-column: 3 / 4; grid-row: 4; }
}

/* ── Responsive: mobile (≤ 640px) ───────────────────────────── */
@media (max-width: 40rem) {
  .rw-hero {
    padding: var(--space-xl) var(--space-sm) var(--space-lg);
  }
  .rw-hero-sub { font-size: var(--text-base); }

  .rw-bento {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    padding: 0 var(--space-sm) var(--space-xl);
  }

  /* Reset all placements then re-declare for 2-col */
  .rw-tile--stat,
  .rw-tile--night,
  .rw-tile--privacy,
  .rw-tile--providers,
  .rw-tile--airport,
  .rw-tile--warrior,
  .rw-tile--cta {
    grid-column: auto;
    grid-row: auto;
  }

  .rw-tile--stat     { grid-column: 1 / 3; }
  .rw-tile--night    { grid-column: 1 / 2; }
  .rw-tile--privacy  { grid-column: 2 / 3; }
  .rw-tile--airport  { grid-column: 1 / 3; }
  .rw-tile--warrior  { grid-column: 1 / 2; }
  .rw-tile--providers{ grid-column: 2 / 3; }
  .rw-tile--cta      { grid-column: 1 / 3; }

  .rw-tile--stat .rw-tile-big {
    font-size: clamp(3rem, 18vw, 5rem);
  }
  .rw-tile--stat .rw-tile-disclaimer {
    position: static;
    text-align: left;
    margin-top: var(--space-sm);
  }

  .rw-tile-persona--wide {
    font-size: var(--text-xl);
  }

  .rw-footer {
    padding: var(--space-xl) var(--space-sm);
  }
  .rw-footer-meta { gap: var(--space-xs); }
}

/* ── Reduced motion ──────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .rw-tile,
  .rw-nav-cta,
  .rw-cta-arrow {
    transition: none;
  }
  .rw-tile:hover  { transform: none; box-shadow: none; }
  .rw-cta-link:hover .rw-cta-arrow { transform: none; }
}
</style>
