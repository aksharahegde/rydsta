<script setup lang="ts">
import { validTrips } from '#shared/lib/wrapped-stats'
import type { Trip } from '#shared/types/trip'

definePageMeta({ layout: 'wrapped' })

const trips = useState<Trip[]>('ride-trips', () => [])

const hasTrips = computed(() => validTrips(trips.value).length > 0)

watch(
  trips,
  (value) => {
    if (value.length === 0) navigateTo('/upload')
  },
  { immediate: true },
)
</script>

<template>
  <WrappedBentoGrid
    v-if="hasTrips"
    :trips="trips"
  />
</template>
