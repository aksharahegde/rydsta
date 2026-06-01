<script setup lang="ts">
const year = new Date().getFullYear()

useHead({ titleTemplate: '%s' })

useSeoMeta({
  title: 'Privacy Policy | Rydsta',
  description:
    'How Rydsta handles your ride export: processed in your browser, not uploaded to our servers, no account required.',
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
        >
          <RideLogo />
        </NuxtLink>
        <div class="rw-nav__actions">
          <NuxtLink
            to="/about"
            class="rw-nav-about"
          >About</NuxtLink>
          <NuxtLink
            to="/privacy-policy"
            class="rw-nav-about"
            aria-current="page"
          >Privacy</NuxtLink>
          <NuxtLink
            to="/upload"
            class="rw-nav-cta"
          >Get started</NuxtLink>
        </div>
      </div>
    </nav>

    <main class="rw-about">
      <div class="rw-content">

        <p class="rw-about__tag">Legal</p>
        <h1 class="rw-about__heading">Privacy Policy</h1>
        <p class="rw-about__sub">
          Rydsta turns your ride export into a visual story in your browser.
          This policy explains what information is involved, where it goes,
          and what we do not do with it.
        </p>
        <p class="rw-about__meta">Last updated: June 1, 2026</p>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Summary</p>
          <ul class="rw-about__list">
            <li>No account is required.</li>
            <li>Your ride export is <strong>not uploaded</strong> to Rydsta’s servers.</li>
            <li>Trip data is processed <strong>only on your device</strong> to build your wrapped.</li>
            <li>We do <strong>not</strong> sell your trip data.</li>
          </ul>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Who operates Rydsta</p>
          <p class="rw-about__body">
            Rydsta is a personal project operated by <strong>Akshara Hegde</strong>,
            available at
            <a
              href="https://rydsta.akshara.dev"
              target="_blank"
              rel="noopener noreferrer"
            >rydsta.akshara.dev</a>.
            For questions about this policy, visit
            <a
              href="https://akshara.dev"
              target="_blank"
              rel="noopener noreferrer"
            >akshara.dev</a>.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Information you provide</p>
          <p class="rw-about__body">
            When you use Rydsta, you may select a file from your device: a
            <strong>CSV</strong>, <strong>XLSX</strong>, or <strong>ZIP</strong> export
            from a ride app. Depending on your export, that file can include
            trip-related information such as:
          </p>
          <ul class="rw-about__list">
            <li>Dates and times of trips</li>
            <li>Pickup and dropoff locations (addresses and/or coordinates)</li>
            <li>Fare, currency, distance, and trip status</li>
            <li>City, vehicle type, and similar ride metadata</li>
          </ul>
          <p class="rw-about__body">
            You choose whether to provide this file. Rydsta cannot access your
            files unless you select them.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">How your information is used</p>
          <p class="rw-about__body">
            Your file is read and parsed <strong>entirely in your browser</strong>
            (including via Web Workers). The data is used only to:
          </p>
          <ul class="rw-about__list">
            <li>Detect columns and normalize trips</li>
            <li>Generate statistics, maps, heatmaps, and personality insights</li>
            <li>Let you download a <strong>PNG</strong> image of your wrapped, if you choose</li>
          </ul>
          <p class="rw-about__body">
            Rydsta does <strong>not</strong> send your export or parsed trip data
            to a backend operated by us.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Where data is stored</p>
          <div class="rw-about__table-wrap">
            <table class="rw-about__table">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Where</th>
                  <th scope="col">How long</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Parsed trips</td>
                  <td>In-memory in your browser session</td>
                  <td>Until you close the tab, refresh, or navigate away</td>
                </tr>
                <tr>
                  <td>Your original file</td>
                  <td>Your device only</td>
                  <td>Not retained by Rydsta after processing in the session</td>
                </tr>
                <tr>
                  <td>Theme preference (<code>rydsta-color-mode</code>)</td>
                  <td><code>localStorage</code> on your device</td>
                  <td>Until you clear site data</td>
                </tr>
                <tr>
                  <td>Downloaded PNG</td>
                  <td>Where you save it on your device</td>
                  <td>Under your control</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="rw-about__body">
            Rydsta does <strong>not</strong> use IndexedDB or server-side databases
            for your trips in the current version.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Third-party services</p>
          <p class="rw-about__body">
            Some features rely on services outside your device:
          </p>
          <ul class="rw-about__list">
            <li>
              <strong>Hosting (Vercel):</strong> Delivers the static site. Standard
              hosting logs (e.g. IP address, browser type, pages requested) may be
              processed by the host. These logs do <strong>not</strong> include your
              trip file contents.
            </li>
            <li>
              <strong>Maps (OpenFreeMap + MapLibre GL):</strong> When you view a map,
              your browser requests map tiles from OpenFreeMap. Those requests may
              include map area and network information (such as IP address) as part
              of normal web traffic. Trip routes are drawn locally; tile servers do
              not receive your full export file.
            </li>
            <li>
              <strong>Fonts (Google Fonts):</strong> If loaded, your browser may
              request fonts from Google’s servers per their policies.
            </li>
          </ul>
          <p class="rw-about__body">
            We do <strong>not</strong> embed third-party analytics that receive your
            trip export or parsed trip content.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">What we do not collect</p>
          <p class="rw-about__body">On Rydsta’s side, we do <strong>not</strong>:</p>
          <ul class="rw-about__list">
            <li>Require sign-in or maintain user accounts</li>
            <li>Store your exports or trips on our servers</li>
            <li>Run advertising based on your trip history</li>
            <li>Sell or rent your personal data</li>
          </ul>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Security</p>
          <p class="rw-about__body">
            The site is served over HTTPS and uses a Content Security Policy to
            limit what the app can load and connect to. Because processing is local,
            you remain in control of the source file on your device.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Your choices</p>
          <ul class="rw-about__list">
            <li><strong>Do not upload:</strong> You can browse the site without providing a file.</li>
            <li><strong>Clear session data:</strong> Closing the tab or refreshing clears in-memory trip data.</li>
            <li><strong>Clear site data:</strong> You can remove <code>localStorage</code> entries via your browser settings.</li>
            <li><strong>Share carefully:</strong> Anything you export as a PNG is under your control; only share what you are comfortable sharing publicly.</li>
          </ul>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Children</p>
          <p class="rw-about__body">
            Rydsta is not directed at children under 13. If you are a parent or
            guardian and believe a child has used the service with personal data,
            contact us via
            <a
              href="https://akshara.dev"
              target="_blank"
              rel="noopener noreferrer"
            >akshara.dev</a>.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Changes to this policy</p>
          <p class="rw-about__body">
            We may update this page from time to time. The “Last updated” date at
            the top will change when we do. Continued use of the site after changes
            means you accept the updated policy.
          </p>
        </section>

        <hr class="rw-about__rule">

        <section class="rw-about__section">
          <p class="rw-about__section-label">Contact</p>
          <p class="rw-about__body">
            <strong>Akshara Hegde</strong> —
            <a
              href="https://akshara.dev"
              target="_blank"
              rel="noopener noreferrer"
            >akshara.dev</a>
          </p>
        </section>

      </div>
    </main>

    <footer class="rw-footer">
      <div class="rw-content">
        <p class="rw-footer-statement">
          Your city moved you.<br>Now see how.
        </p>
        <div class="rw-footer-meta">
          <span class="rw-footer-brand">
            <RideLogo size="sm" />
          </span>
          <span
            class="rw-footer-sep"
            aria-hidden="true"
          >·</span>
          <NuxtLink
            to="/privacy-policy"
            class="rw-footer-link"
          >Privacy policy</NuxtLink>
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
.rw-about__meta {
  font-size: var(--text-sm);
  color: var(--color-ink-3);
  margin: 0 0 var(--space-sm);
}

.rw-about__list {
  margin: 0 0 var(--space-md);
  padding-left: 1.25rem;
  font-size: var(--text-md);
  color: var(--color-ink-2);
  line-height: 1.6;
  max-width: 52ch;
}

.rw-about__list li + li {
  margin-top: var(--space-xs);
}

.rw-about__body a {
  color: var(--color-accent);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.rw-about__body a:hover {
  color: var(--color-ink);
}

.rw-about__body code {
  font-size: 0.9em;
  font-family: var(--font-mono, ui-monospace, monospace);
}

.rw-about__table-wrap {
  overflow-x: auto;
  margin-bottom: var(--space-md);
}

.rw-about__table {
  width: 100%;
  max-width: 56rem;
  border-collapse: collapse;
  font-size: var(--text-sm);
  color: var(--color-ink-2);
  line-height: 1.5;
}

.rw-about__table th,
.rw-about__table td {
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  vertical-align: top;
  border: 1px solid var(--color-rule);
}

.rw-about__table th {
  font-weight: 600;
  color: var(--color-ink);
  background: var(--color-paper-2);
}

.rw-about__table code {
  font-size: 0.85em;
  font-family: var(--font-mono, ui-monospace, monospace);
}

</style>
