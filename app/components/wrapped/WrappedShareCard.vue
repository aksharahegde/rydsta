<script setup lang="ts">
import type { WrappedStats } from '#shared/lib/wrapped-stats'

const props = withDefaults(
  defineProps<{
    stats: WrappedStats
    personality: string
    aspect?: 'story' | 'square'
  }>(),
  { aspect: 'story' },
)

const exportWidth = computed(() => 1080)
const exportHeight = computed(() =>
  props.aspect === 'square' ? 1080 : 1920,
)

function formatMoney(amount: number, currency: string | null): string {
  if (currency) {
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(amount)
    } catch {
      return `${currency} ${amount.toLocaleString()}`
    }
  }
  return amount.toLocaleString()
}

const spendLabel = computed(() => {
  const { totalSpend, currency } = props.stats
  if (totalSpend == null || Number.isNaN(totalSpend) || totalSpend < 0) {
    return null
  }
  return formatMoney(totalSpend, currency)
})

const highlightStat = computed(() => {
  if (props.stats.topPickup) {
    return { label: 'Top pickup', value: props.stats.topPickup }
  }
  if (props.stats.busiestMonth) {
    return { label: 'Busiest month', value: props.stats.busiestMonth }
  }
  if (props.stats.busiestWeekday) {
    return { label: 'Busiest day', value: props.stats.busiestWeekday }
  }
  return null
})
</script>

<template>
  <div
    class="share-card"
    data-testid="wrapped-share-card"
    :style="{
      width: `${exportWidth}px`,
      height: `${exportHeight}px`,
    }"
  >
    <div class="share-card__glow" aria-hidden="true" />

    <header class="share-card__header">
      <p class="share-card__brand">
        Ride Wrapped
      </p>
      <p class="share-card__year">
        {{ stats.year }}
      </p>
    </header>

    <div class="share-card__stats">
      <div class="share-card__stat">
        <span class="share-card__stat-value">{{ stats.totalTrips }}</span>
        <span class="share-card__stat-label">Trips</span>
      </div>
      <div
        v-if="spendLabel"
        class="share-card__stat"
      >
        <span class="share-card__stat-value share-card__stat-value--sm">{{
          spendLabel
        }}</span>
        <span class="share-card__stat-label">Total spend</span>
      </div>
      <div
        v-if="highlightStat"
        class="share-card__stat share-card__stat--wide"
      >
        <span class="share-card__stat-value share-card__stat-value--sm">{{
          highlightStat.value
        }}</span>
        <span class="share-card__stat-label">{{ highlightStat.label }}</span>
      </div>
    </div>

    <footer class="share-card__footer">
      <p class="share-card__personality">
        {{ personality }}
      </p>
      <p class="share-card__personality-sub">
        Your ride personality
      </p>
    </footer>
  </div>
</template>

<style scoped>
.share-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 96px 72px;
  overflow: hidden;
  background: linear-gradient(165deg, #0a0a12 0%, #141428 45%, #1e1b4b 100%);
  color: #f8fafc;
  font-family:
    system-ui,
    -apple-system,
    'Segoe UI',
    Roboto,
    sans-serif;
}

.share-card__glow {
  position: absolute;
  inset: -20% -10% auto;
  height: 55%;
  background: radial-gradient(
    ellipse at 50% 0%,
    rgba(129, 140, 248, 0.35) 0%,
    transparent 70%
  );
  pointer-events: none;
}

.share-card__header {
  position: relative;
  z-index: 1;
}

.share-card__brand {
  margin: 0;
  font-size: 40px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #c4b5fd;
}

.share-card__year {
  margin: 24px 0 0;
  font-size: 128px;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  background: linear-gradient(135deg, #c4b5fd 0%, #f472b6 50%, #fb923c 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.share-card__stats {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 40px 48px;
}

.share-card__stat {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.share-card__stat--wide {
  grid-column: 1 / -1;
}

.share-card__stat-value {
  font-size: 88px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1;
}

.share-card__stat-value--sm {
  font-size: 52px;
  line-height: 1.1;
}

.share-card__stat-label {
  font-size: 28px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.share-card__footer {
  position: relative;
  z-index: 1;
}

.share-card__personality {
  margin: 0;
  font-size: 64px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.share-card__personality-sub {
  margin: 16px 0 0;
  font-size: 32px;
  color: #94a3b8;
}
</style>
