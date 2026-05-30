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
  <main
    class="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-2xl flex-col justify-center px-5 py-12 sm:px-8"
  >
    <p
      class="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-slate-800/10 bg-slate-900/5 px-3 py-1 text-xs font-medium tracking-wide text-slate-600 uppercase"
    >
      <span
        class="size-1.5 rounded-full bg-emerald-500"
        aria-hidden="true"
      />
      Privacy-first · No account
    </p>

    <h1
      class="text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl"
      data-testid="landing-hero"
    >
      Your rides, wrapped
    </h1>

    <p class="mt-4 max-w-lg text-lg leading-relaxed text-slate-600">
      Turn trip exports into a shareable year-in-rides story. Your files never
      leave your browser—no account, no upload to our servers.
    </p>

    <ul class="mt-8 space-y-3 text-slate-700">
      <li class="flex gap-3">
        <span
          class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          1
        </span>
        <span>
          <strong class="font-semibold text-slate-900">Uber, Ola, Rapido</strong>
          — drop a zip or csv export from your ride app
        </span>
      </li>
      <li class="flex gap-3">
        <span
          class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          2
        </span>
        <span>
          <strong class="font-semibold text-slate-900">Shareable story</strong>
          — swipe through slides built from your trips
        </span>
      </li>
      <li class="flex gap-3">
        <span
          class="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white"
          aria-hidden="true"
        >
          3
        </span>
        <span>
          <strong class="font-semibold text-slate-900">Download image</strong>
          — save a card to share on social
        </span>
      </li>
    </ul>

    <div class="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
      <NuxtLink
        to="/upload"
        class="inline-flex items-center justify-center rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
        data-testid="landing-cta"
      >
        Get started
      </NuxtLink>
      <p class="text-sm text-slate-500">
        Parsing runs locally in your browser.
      </p>
    </div>
  </main>
</template>
