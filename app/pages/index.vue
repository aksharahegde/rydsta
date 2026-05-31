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
    <nav
      class="rw-nav"
      aria-label="Site navigation"
    >
      <div class="rw-content rw-nav__inner">
        <span
          class="rw-wordmark"
          aria-label="Ride Wrapped"
        >Ride Wrapped</span>
        <div class="rw-nav__actions">
          <RideThemeToggle />
          <NuxtLink
            to="/upload"
            class="rw-nav-cta"
          >Get started</NuxtLink>
        </div>
      </div>
    </nav>

    <!-- Hero header — fixed-height, not full viewport -->
    <header
      class="rw-hero rw-content"
      data-testid="landing-hero"
    >
      <p class="rw-hero-tag">Uber · Ola · Rapido</p>
      <h1 class="rw-hero-head">Your year<br>in rides.</h1>
      <p class="rw-hero-sub">
        Drop an export. Get a shareable story.<br>
        No account — everything runs in your browser.
      </p>
      <NuxtLink
        to="/upload"
        class="rw-hero-cta"
        data-testid="landing-hero-upload"
      >
        See my wrapped
        <svg
          class="rw-hero-cta__arrow"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M5 12h14M13 6l6 6-6 6"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </NuxtLink>
    </header>

    <!-- Bento grid: tiles=7, spans=irregular, border=hairline-all -->
    <section
      class="rw-bento rw-content"
      aria-label="What you get"
    >

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
      <div class="rw-content">
        <p class="rw-footer-statement">
          Your city moved you.<br>Now see how.
        </p>
        <div class="rw-footer-meta">
          <span class="rw-wordmark-sm">Ride Wrapped</span>
          <span
            class="rw-footer-sep"
            aria-hidden="true"
          >·</span>
          <span>Runs entirely in your browser</span>
          <span
            class="rw-footer-sep"
            aria-hidden="true"
          >·</span>
          <span>No account</span>
          <span
            class="rw-footer-sep"
            aria-hidden="true"
          >·</span>
          <span>© 2026</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<style>
/* Landing page shell (bento grid styles live in app/assets/css/bento.css) */

/* ── Page shell ──────────────────────────────────────────────── */
.rw-page {
  background:
    radial-gradient(ellipse 120% 70% at 50% -15%, var(--color-glow), transparent 55%),
    var(--color-paper);
  color: var(--color-ink);
  font-family: var(--font-body);
  min-height: 100dvh;
}

/* ── Nav (N1: wordmark left, CTA right, sticky) ─────────────── */
.rw-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  background-color: var(--color-paper);
  border-bottom: 1px solid var(--color-rule);
}

.rw-nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block: var(--space-sm);
}

.rw-nav__actions {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
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
  padding-block: var(--space-2xl) var(--space-xl);
}

.rw-hero-tag {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--color-accent);
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

.rw-hero-cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  margin-top: var(--space-lg);
  padding: var(--space-sm) var(--space-lg);
  background-color: var(--color-hero-cta-bg);
  color: var(--color-hero-cta-fg);
  font-family: var(--font-display);
  font-size: var(--text-md);
  font-weight: 700;
  letter-spacing: -0.02em;
  text-decoration: none;
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-hero-cta-bg);
  transition:
    background-color var(--dur-short) var(--ease-out),
    border-color var(--dur-short) var(--ease-out),
    transform var(--dur-short) var(--ease-out),
    box-shadow var(--dur-short) var(--ease-out);
}

.rw-hero-cta:hover {
  background-color: var(--color-hero-cta-hover);
  border-color: var(--color-hero-cta-hover);
  box-shadow: 0 8px 24px -10px var(--color-hero-shadow);
}

.rw-hero-cta:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 3px;
}

.rw-hero-cta__arrow {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
  transition: transform var(--dur-short) var(--ease-out);
}

.rw-hero-cta:hover .rw-hero-cta__arrow {
  transform: translateX(3px);
}

.rw-tile--cta {
  cursor: pointer;
}

/* ── Footer (Ft5 Statement) ──────────────────────────────────── */
.rw-footer {
  border-top: 1px solid var(--color-rule);
}

.rw-footer .rw-content {
  padding-block: var(--space-2xl) var(--space-xl);
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

/* ── Responsive: mobile (≤ 640px) ───────────────────────────── */
@media (max-width: 40rem) {
  .rw-hero {
    padding-block: var(--space-xl) var(--space-lg);
  }
  .rw-hero-sub { font-size: var(--text-base); }

  .rw-footer .rw-content {
    padding-block: var(--space-xl);
  }
  .rw-footer-meta { gap: var(--space-xs); }
}

/* ── Reduced motion ──────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .rw-nav-cta,
  .rw-cta-arrow,
  .rw-hero-cta,
  .rw-hero-cta__arrow {
    transition: none;
  }
  .rw-cta-link:hover .rw-cta-arrow,
  .rw-hero-cta:hover .rw-hero-cta__arrow {
    transform: none;
  }
}
</style>
