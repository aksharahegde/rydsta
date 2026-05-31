<script setup lang="ts">
defineProps<{
  title: string
  description: string
  variant?: string
  href?: string
  testId?: string
}>()
</script>

<template>
  <NuxtLink
    v-if="href"
    :to="href"
    class="rw-landing-card rw-landing-card--link"
    :class="variant"
    :data-testid="testId"
  >
    <div class="rw-landing-card__preview">
      <slot />
    </div>
    <div class="rw-landing-card__copy">
      <h3 class="rw-landing-card__title">
        {{ title }}
      </h3>
      <p class="rw-landing-card__desc">
        {{ description }}
      </p>
    </div>
  </NuxtLink>
  <article
    v-else
    class="rw-landing-card"
    :class="variant"
  >
    <div class="rw-landing-card__preview">
      <slot />
    </div>
    <div class="rw-landing-card__copy">
      <h3 class="rw-landing-card__title">
        {{ title }}
      </h3>
      <p class="rw-landing-card__desc">
        {{ description }}
      </p>
    </div>
  </article>
</template>
