<script setup lang="ts">
import LandingFeatureCard from '~/components/landing/LandingFeatureCard.vue'
import LandingHeroStats from '~/components/landing/LandingHeroStats.vue'
import LandingPreviewHeatmap from '~/components/landing/LandingPreviewHeatmap.vue'
import LandingPreviewPersonality from '~/components/landing/LandingPreviewPersonality.vue'
import LandingPreviewPrivacy from '~/components/landing/LandingPreviewPrivacy.vue'
import LandingPreviewRoutes from '~/components/landing/LandingPreviewRoutes.vue'
import LandingPreviewShare from '~/components/landing/LandingPreviewShare.vue'
import LandingPreviewStats from '~/components/landing/LandingPreviewStats.vue'
import LandingPreviewTripMap from '~/components/landing/LandingPreviewTripMap.vue'
import LandingPreviewTripStats from '~/components/landing/LandingPreviewTripStats.vue'
import LandingPreviewUpload from '~/components/landing/LandingPreviewUpload.vue'
import LandingProviderStrip from '~/components/landing/LandingProviderStrip.vue'

const year = new Date().getFullYear()

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
            to="/about"
            class="rw-nav-about"
          >About</NuxtLink>
          <NuxtLink
            to="/upload"
            class="rw-nav-cta"
          >Get started</NuxtLink>
        </div>
      </div>
    </nav>

    <header
      class="rw-hero rw-content"
      data-testid="landing-hero"
    >
      <p class="rw-hero-tag">Uber · Ola · Rapido</p>
      <h1 class="rw-hero-head">Your year<br>in rides.</h1>
      <p class="rw-hero-sub">
        Drop an export. Get a shareable story.
        No account. Everything runs in your browser.
      </p>
      <div class="rw-hero-actions">
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
        <a
          href="#features"
          class="rw-hero-cta rw-hero-cta--secondary"
        >
          See what you get
        </a>
      </div>
      <LandingHeroStats />
    </header>

    <section
      id="features"
      class="rw-landing-bento rw-content"
      aria-label="What you get"
    >
      <LandingFeatureCard
        variant="rw-landing-card--stats"
        title="Your ride totals"
        description="Trips, spend, and your busiest month. Pulled straight from your export."
      >
        <LandingPreviewStats />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--personality"
        title="Your rider archetype"
        description="Night Owl, Airport Regular, Road Warrior. We figure out which one fits you."
      >
        <LandingPreviewPersonality />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--trip-stats"
        title="The full picture"
        description="Distance, city, ride type, and fare. Everything your app buried in the data."
      >
        <LandingPreviewTripStats />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--trip-map"
        title="Animated trip map"
        description="Replay your routes city by city with an animated map playback."
      >
        <LandingPreviewTripMap />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--privacy"
        title="Private by design"
        description="Your export never leaves your browser. We never see it."
      >
        <LandingPreviewPrivacy />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--heatmap"
        title="Ride rhythm"
        description="See when you move most with a year-long activity heatmap."
      >
        <LandingPreviewHeatmap />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--upload"
        title="Drop your export"
        description="CSV, XLSX, or ZIP. Drag and drop from Uber, Ola, or Rapido."
      >
        <LandingPreviewUpload />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--routes"
        title="Memorable routes"
        description="The spots you kept coming back to, and the routes that defined your year."
      >
        <LandingPreviewRoutes />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--share"
        title="Share your wrapped"
        description="One PNG, ready to drop into Stories, Tweets, or your group chat."
      >
        <LandingPreviewShare />
      </LandingFeatureCard>

      <LandingFeatureCard
        variant="rw-landing-card--cta"
        title="Get started"
        description="Upload your ride export and see your wrapped in seconds."
        href="/upload"
        test-id="landing-cta"
      >
        <div class="rw-landing-preview rw-landing-preview-cta">
          <span class="rw-landing-preview-cta__text">See my wrapped</span>
          <svg
            class="rw-landing-preview-cta__arrow"
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
        </div>
      </LandingFeatureCard>
    </section>

    <LandingProviderStrip />

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
          <span>© {{ year }}</span>
        </div>
      </div>
    </footer>

  </div>
</template>

<style scoped>
.rw-landing-preview-cta {
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  min-height: 5rem;
  padding: var(--space-md);
}

.rw-landing-preview-cta__text {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-ink);
}

.rw-landing-preview-cta__arrow {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-accent);
  transition: transform var(--dur-short) var(--ease-out);
}

.rw-landing-card--link:hover .rw-landing-preview-cta__arrow {
  transform: translateX(4px);
}
</style>
