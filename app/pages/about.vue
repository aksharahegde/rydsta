<script setup lang="ts">
const year = new Date().getFullYear()

// Override @nuxtjs/seo titleTemplate so site name isn't appended twice
useHead({ titleTemplate: '%s' })

useSeoMeta({
  title: 'About | Rydsta',
  description: 'Rydsta turns your Uber, Ola, and Rapido trip exports into a visual story. Built by Akshara Hegde. Runs entirely in your browser.',
})
</script>

<template>
  <div class="rw-page">

    <nav
      class="rw-nav"
      aria-label="Site navigation"
    >
      <div class="rw-content rw-nav__inner">
        <NuxtLink
          to="/"
          class="rw-wordmark"
          aria-label="Rydsta home"
        >Rydsta</NuxtLink>
        <div class="rw-nav__actions">
          <RideThemeToggle />
          <NuxtLink
            to="/about"
            class="rw-nav-about"
            aria-current="page"
          >About</NuxtLink>
          <NuxtLink
            to="/upload"
            class="rw-nav-cta"
          >Get started</NuxtLink>
        </div>
      </div>
    </nav>

    <main class="rw-about">
      <div class="rw-content">

        <!-- Identity header -->
        <p class="rw-about__tag">About</p>
        <h1 class="rw-about__heading">Rydsta</h1>
        <p class="rw-about__sub">
          Your ride history has a story in it. Rydsta finds it,
          built for Uber, Ola, and Rapido riders across India.
        </p>
        <p class="rw-about__sub">
          Drop an export. See your year as a shareable visual story:
          stats, routes, ride personality, and a full activity heatmap.
          Everything runs in your browser. Nothing leaves your device.
        </p>

        <hr class="rw-about__rule">

        <!-- How it works -->
        <section class="rw-about__section">
          <p class="rw-about__section-label">How it works</p>
          <div class="rw-about__steps">
            <div class="rw-about__step">
              <p class="rw-about__step-num">1</p>
              <p class="rw-about__step-title">Drop your export</p>
              <p class="rw-about__step-body">
                Upload a CSV, XLSX, or ZIP from your Uber, Ola,
                or Rapido app. Drag-and-drop or click to browse.
              </p>
            </div>
            <div class="rw-about__step">
              <p class="rw-about__step-num">2</p>
              <p class="rw-about__step-title">Stays on your device</p>
              <p class="rw-about__step-body">
                Your file is read and processed entirely locally.
                No upload, no account, no server. Ever.
              </p>
            </div>
            <div class="rw-about__step">
              <p class="rw-about__step-num">3</p>
              <p class="rw-about__step-title">See your wrapped</p>
              <p class="rw-about__step-body">
                Stats, an animated map, your rider archetype, and
                a year-long heatmap. Download a shareable PNG.
              </p>
            </div>
          </div>
        </section>

        <hr class="rw-about__rule">

        <!-- Privacy -->
        <section class="rw-about__section">
          <p class="rw-about__section-label">Privacy by design</p>
          <p class="rw-about__body">
            Your trip data never leaves your device. Rydsta runs
            entirely in your browser. The file you drop is parsed
            by a Web Worker and discarded the moment you close the tab.
          </p>
          <p class="rw-about__body">
            There is no backend. No analytics on your trip data. No
            account required. The only data that persists is what you
            choose to download.
          </p>
        </section>

        <hr class="rw-about__rule">

        <!-- Supported providers -->
        <section class="rw-about__section">
          <p class="rw-about__section-label">Supported exports</p>
          <div class="rw-about__providers">
            <div class="rw-about__provider">
              <span class="rw-about__provider-name">Uber</span>
              <span class="rw-about__provider-detail">
                Rider export → <code>trips_data-0.csv</code> from Account &gt; Privacy &gt; Download my data
              </span>
            </div>
            <div class="rw-about__provider">
              <span class="rw-about__provider-name">Ola</span>
              <span class="rw-about__provider-detail">
                Booking history export from the Ola app → Account &gt; Help &gt; Data requests
              </span>
            </div>
            <div class="rw-about__provider">
              <span class="rw-about__provider-name">Rapido</span>
              <span class="rw-about__provider-detail">
                Ride history CSV → Profile &gt; My Rides &gt; Export
              </span>
            </div>
          </div>
        </section>

        <hr class="rw-about__rule">

        <!-- Built by -->
        <section class="rw-about__section">
          <div class="rw-about__built">
            <span class="rw-about__built-label">Developed by</span>
            <a
              href="https://akshara.dev"
              target="_blank"
              rel="noopener noreferrer"
              class="rw-about__built-name"
            >Akshara Hegde</a>
            <p class="rw-about__built-tagline">
              A personal project born from too many unexplored Uber exports.
            </p>
          </div>
        </section>

        <!-- Tech row -->
        <div class="rw-about__tech">
          <span>Maps by <a href="https://maplibre.org" target="_blank" rel="noopener noreferrer">MapLibre GL</a></span>
          <span class="rw-about__tech-sep">·</span>
          <span>Tiles by <a href="https://openfreemap.org" target="_blank" rel="noopener noreferrer">OpenFreeMap</a></span>
          <span class="rw-about__tech-sep">·</span>
          <span>Built with <a href="https://nuxt.com" target="_blank" rel="noopener noreferrer">Nuxt 3</a> &amp; Vue 3</span>
        </div>

      </div>
    </main>

    <footer class="rw-footer">
      <div class="rw-content">
        <p class="rw-footer-statement">
          Your city moved you.<br>Now see how.
        </p>
        <div class="rw-footer-meta">
          <span class="rw-wordmark-sm">Rydsta</span>
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
