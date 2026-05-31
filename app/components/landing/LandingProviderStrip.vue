<script setup lang="ts">
const providers = [
  { name: 'Uber', meta: 'Export ready' },
  { name: 'Ola', meta: 'Export ready' },
  { name: 'Rapido', meta: 'Export ready' },
] as const
</script>

<template>
  <section
    class="rw-landing-providers rw-content"
    aria-label="Supported ride providers"
  >
    <div class="rw-landing-providers__header">
      <h2 class="rw-landing-providers__title">
        Works with your ride exports
      </h2>
    </div>
    <p class="rw-landing-providers__sub">
      Uber, Ola, Rapido — drop a CSV, XLSX, or ZIP
    </p>
    <div class="rw-landing-providers__grid">
      <article
        v-for="provider in providers"
        :key="provider.name"
        class="rw-landing-provider-card"
      >
        <p class="rw-landing-provider-card__name">
          {{ provider.name }}
        </p>
        <p class="rw-landing-provider-card__meta">
          {{ provider.meta }}
        </p>
      </article>
    </div>
  </section>
</template>
