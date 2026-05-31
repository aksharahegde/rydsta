<script setup lang="ts">
import WrappedChartArcRing from '~/components/wrapped/charts/WrappedChartArcRing.vue'
import WrappedChartBars from '~/components/wrapped/charts/WrappedChartBars.vue'
import WrappedChartDownload from '~/components/wrapped/charts/WrappedChartDownload.vue'
import WrappedChartIcon from '~/components/wrapped/charts/WrappedChartIcon.vue'
import WrappedChartPin from '~/components/wrapped/charts/WrappedChartPin.vue'
import WrappedChartRadialBars from '~/components/wrapped/charts/WrappedChartRadialBars.vue'
import WrappedChartRoute from '~/components/wrapped/charts/WrappedChartRoute.vue'
import WrappedChartSparkline from '~/components/wrapped/charts/WrappedChartSparkline.vue'
import WrappedPersonalityGlyph from '~/components/wrapped/charts/WrappedPersonalityGlyph.vue'
import {
  hourTripCounts,
  mapStatIconKind,
  monthlyTripCounts,
  weekdayTripCounts,
} from '#shared/lib/bento-charts'
import {
  getBentoHighlight,
  getBusiestInHero,
  getBusiestTile,
  getMapStatTiles,
  getPersonalityTileClass,
  getSpendLabel,
  shouldShowHeroTile,
  shouldShowTopPickupTile,
} from '#shared/lib/wrapped-bento'
import { buildYearHeatmap } from '#shared/lib/ride-heatmap'
import { pickPersonality } from '#shared/lib/personality'
import { tripsWithCoordinates } from '#shared/lib/trip-map-playback'
import {
  computeWrappedStats,
  tripCountByYear,
  tripsForYear,
  validTrips,
  yearRangeLabel,
  yearsFromTrips,
} from '#shared/lib/wrapped-stats'
import type { Trip } from '#shared/types/trip'

const EXPORT_WIDTH = 1400
const EXPORT_HEIGHT = 1050

const props = defineProps<{
  trips: Trip[]
}>()

const exportRef = ref<HTMLElement | null>(null)
const capturing = ref(false)
const downloading = ref(false)
const { downloadSharePng } = useWrappedShare()

const years = computed(() => yearsFromTrips(props.trips))
const yearCounts = computed(() => tripCountByYear(props.trips))
const totalTripsAllYears = computed(() => validTrips(props.trips).length)
const rangeLabel = computed(() => yearRangeLabel(years.value))

const selectedYear = ref(years.value[0] ?? new Date().getFullYear())

watch(years, (list) => {
  if (list.length === 0) return
  if (!list.includes(selectedYear.value)) {
    selectedYear.value = list[0]!
  }
}, { immediate: true })

const yearTrips = computed(() => tripsForYear(props.trips, selectedYear.value))
const stats = computed(() => computeWrappedStats(props.trips, selectedYear.value))
const personality = computed(() => pickPersonality(stats.value, yearTrips.value))
const heatmap = computed(() => buildYearHeatmap(props.trips, selectedYear.value))
const mapExpanded = ref(false)

watch(selectedYear, () => {
  mapExpanded.value = false
  mapMountKey.value += 1
})

const personalityTileClass = computed(() =>
  getPersonalityTileClass(personality.value),
)

const personalityTimeLabel = computed(() => {
  switch (personality.value) {
    case 'Night Owl':
      return '22:00 — 05:00'
    case 'Airport Regular':
      return 'Terminal regular'
    default:
      return 'Always on the move'
  }
})

const personalityDisplay = computed(() =>
  personality.value.replace(/ /g, '\n'),
)

const personalityTagline = computed(() => {
  switch (personality.value) {
    case 'Night Owl':
      return 'Late rides, every time.'
    case 'Airport Regular':
      return 'Terminal 2, always.'
    default:
      return 'Miles add up fast.'
  }
})

const spendLabel = computed(() => getSpendLabel(stats.value))
const busiestInHero = computed(() => getBusiestInHero(stats.value))
const busiestTile = computed(() => getBusiestTile(stats.value))
const highlight = computed(() => getBentoHighlight(stats.value))
const mapStatTiles = computed(() => getMapStatTiles(stats.value))
const vizAnimate = computed(() => !capturing.value)
const mapMountKey = ref(0)
const monthlyCounts = computed(() => monthlyTripCounts(props.trips, selectedYear.value))
const weekdayCounts = computed(() => weekdayTripCounts(props.trips, selectedYear.value))
const hourCounts = computed(() => hourTripCounts(props.trips, selectedYear.value))

const warriorContent = computed(() => {
  if (spendLabel.value && !stats.value.busiestMonth) {
    return {
      title: 'Total spend',
      tagline: spendLabel.value,
    }
  }
  // Personality name already shown in the personality tile above —
  // warrior tile leads with the tagline as the headline
  return {
    title: personalityTagline.value,
    tagline: 'Your ride personality',
  }
})

function onSelectYear(year: number) {
  selectedYear.value = year
}

async function onDownload() {
  const el = exportRef.value
  if (!el || downloading.value) return

  downloading.value = true
  capturing.value = true
  try {
    await downloadSharePng(el, {
      width: EXPORT_WIDTH,
      height: EXPORT_HEIGHT,
      filename: `rydsta-${selectedYear.value}.png`,
    })
  } finally {
    capturing.value = false
    downloading.value = false
    mapMountKey.value += 1
  }
}
</script>

<template>
  <div class="rw-wrapped-page">
    <RidePageNav current="Wrapped" />

    <header class="rw-wrapped-header rw-content">
      <h1 class="rw-wrapped-title">
        Your rides, wrapped
      </h1>
      <p class="rw-wrapped-sub">
        {{ rangeLabel }} · {{ totalTripsAllYears }} trips total
      </p>
    </header>

    <div class="rw-wrapped-layout rw-content">
      <WrappedYearRail
        v-if="yearCounts.length > 0"
        :years="yearCounts"
        :selected-year="selectedYear"
        @select="onSelectYear"
      />

      <section
        ref="exportRef"
        class="rw-bento rw-bento--export rw-wrapped-layout__main"
        :class="{ 'rw-bento--capturing': capturing }"
        data-testid="wrapped-bento-grid"
        aria-label="Your ride wrapped"
      >
        <!-- Hero stat (2×2) -->
        <article
          v-if="shouldShowHeroTile(stats)"
          class="rw-tile rw-tile--stat rw-tile--blueprint"
        >
          <div
            class="rw-tile-viz rw-tile-viz--radial"
            aria-hidden="true"
          >
            <WrappedChartRadialBars
              :key="selectedYear"
              grid-id="hero-monthly"
              :values="monthlyCounts"
              :animate="vizAnimate"
            />
          </div>
          <p class="rw-tile-eyebrow">
            {{ stats.year }}
          </p>
          <p class="rw-tile-big">
            {{ stats.totalTrips }}
          </p>
          <p class="rw-tile-stat-sub">
            rides in {{ stats.year }}
          </p>
          <p
            v-if="spendLabel"
            class="rw-tile-spend"
          >
            {{ spendLabel }} spent
          </p>
          <p
            v-if="busiestInHero"
            class="rw-tile-busiest"
          >
            {{ busiestInHero.eyebrow }}: {{ busiestInHero.value }}
          </p>
        </article>

        <!-- Personality (1×2) -->
        <article
          v-if="shouldShowHeroTile(stats)"
          class="rw-tile"
          :class="personalityTileClass"
        >
          <div
            class="rw-tile-viz rw-tile-viz--personality"
            aria-hidden="true"
          >
            <WrappedPersonalityGlyph
              :key="selectedYear"
              :personality="personality"
              :hour-counts="hourCounts"
              :animate="vizAnimate"
            />
          </div>
          <div
            v-if="personality === 'Night Owl'"
            class="rw-stars"
            aria-hidden="true"
          />
          <p class="rw-tile-time">
            {{ personalityTimeLabel }}
          </p>
          <p class="rw-tile-persona rw-tile-persona--stacked">
            {{ personalityDisplay }}
          </p>
          <p class="rw-tile-persona-sub">
            Your ride personality
          </p>
        </article>

        <!-- Top pickup -->
        <article
          v-if="shouldShowTopPickupTile(stats)"
          class="rw-tile rw-tile--privacy rw-tile--blueprint"
        >
          <div
            class="rw-tile-viz rw-tile-viz--ping"
            aria-hidden="true"
          >
            <WrappedChartPin
              :key="selectedYear"
              grid-id="top-pickup"
              :animate="vizAnimate"
            />
          </div>
          <p class="rw-tile-eyebrow">
            Top pickup
          </p>
          <p class="rw-tile-stat-value-sm rw-tile-clamp rw-tile-clamp--3">
            {{ stats.topPickup }}
          </p>
          <p class="rw-tile-tagline">
            Where you started most rides
          </p>
        </article>

        <!-- Busiest time -->
        <article
          v-if="busiestTile"
          class="rw-tile rw-tile--providers rw-tile--blueprint"
        >
          <div
            class="rw-tile-viz rw-tile-viz--arc"
            aria-hidden="true"
          >
            <WrappedChartArcRing
              :key="selectedYear"
              grid-id="busiest-weekday"
              :values="weekdayCounts"
              :animate="vizAnimate"
            />
          </div>
          <p class="rw-tile-eyebrow">
            {{ busiestTile.eyebrow }}
          </p>
          <p class="rw-tile-busiest-value">
            {{ busiestTile.value }}
          </p>
        </article>

        <!-- Route stats beside trip map -->
        <article
          v-if="mapStatTiles.length > 0"
          class="rw-tile rw-tile--map-stats"
        >
          <div
            v-for="(item, index) in mapStatTiles"
            :key="item.eyebrow"
            class="rw-map-stats__item"
          >
            <div
              class="rw-tile-viz rw-tile-viz--micro"
              aria-hidden="true"
            >
              <WrappedChartIcon
                :key="`${selectedYear}-${item.eyebrow}`"
                :grid-id="`map-stat-${index}`"
                :kind="mapStatIconKind(item.eyebrow)"
                :animate="vizAnimate"
                :style="{ '--viz-i': index }"
              />
            </div>
            <p class="rw-tile-eyebrow">
              {{ item.eyebrow }}
            </p>
            <p
              class="rw-map-stats__value"
              :class="{ 'rw-map-stats__value--clamp': item.eyebrow === 'Go-to ride' || item.eyebrow === 'Primary city' }"
            >
              {{ item.value }}
            </p>
          </div>
        </article>

        <!-- Trip map -->
        <WrappedTripMapTile
          v-if="!capturing"
          :key="`${selectedYear}-${mapMountKey}`"
          :trips="yearTrips"
          :year="selectedYear"
          @expand="mapExpanded = true"
        />
        <article
          v-else
          class="rw-tile rw-tile--trip-map rw-tile--trip-map--placeholder"
        >
          <p class="rw-tile-eyebrow">
            Your routes · {{ stats.year }}
          </p>
          <p class="rw-tile-tagline">
            Map preview ({{ tripsWithCoordinates(yearTrips).length }} trips)
          </p>
        </article>

        <!-- Activity heatmap -->
        <article class="rw-tile rw-tile--heatmap rw-tile--blueprint">
          <p class="rw-tile-eyebrow">
            Ride activity · {{ stats.year }}
          </p>
          <WrappedActivityHeatmap
            :key="selectedYear"
            :heatmap="heatmap"
            :animate="vizAnimate"
          />
        </article>

        <!-- Trip highlight -->
        <article
          v-if="highlight"
          class="rw-tile rw-tile--airport rw-tile--blueprint"
        >
          <div
            class="rw-tile-viz rw-tile-viz--feature"
            aria-hidden="true"
          >
            <WrappedChartRoute
              :key="selectedYear"
              grid-id="trip-highlight"
              :animate="vizAnimate"
            />
          </div>
          <p class="rw-tile-eyebrow">
            {{ highlight.title }}
          </p>
          <p class="rw-tile-highlight-value">
            {{ highlight.value }}
          </p>
          <div class="rw-trip-detail__route rw-tile-highlight-stops">
            <div
              class="rw-trip-detail__rail"
              aria-hidden="true"
            >
              <span class="rw-trip-detail__dot rw-trip-detail__dot--pickup" />
              <span class="rw-trip-detail__rail-line" />
              <span class="rw-trip-detail__dot rw-trip-detail__dot--dropoff" />
            </div>
            <div class="rw-trip-detail__stops">
              <p class="rw-trip-detail__stop rw-tile-clamp rw-tile-clamp--2">
                {{ highlight.pickup }}
              </p>
              <p class="rw-trip-detail__stop rw-tile-clamp rw-tile-clamp--2">
                {{ highlight.dropoff }}
              </p>
            </div>
          </div>
        </article>

        <!-- Secondary stat / tagline -->
        <article class="rw-tile rw-tile--warrior rw-tile--blueprint">
          <div
            class="rw-tile-viz rw-tile-viz--band-sm"
            aria-hidden="true"
          >
            <WrappedChartSparkline
              :key="selectedYear"
              grid-id="warrior-spark"
              :values="monthlyCounts"
              :animate="vizAnimate"
            />
          </div>
          <p class="rw-tile-persona--sm">
            {{ warriorContent.title }}
          </p>
          <p class="rw-tile-tagline rw-tile-clamp rw-tile-clamp--2">
            {{ warriorContent.tagline }}
          </p>
        </article>

        <!-- Download CTA -->
        <article class="rw-tile rw-tile--cta rw-tile--blueprint rw-tile--blueprint-dark">
          <div
            class="rw-tile-viz rw-tile-viz--cta"
            aria-hidden="true"
          >
            <WrappedChartDownload
              :key="selectedYear"
              grid-id="download-cta"
              :animate="vizAnimate"
            />
          </div>
          <div class="rw-tile--cta-actions">
            <p class="rw-cta-heading">
              Share your wrapped
            </p>
            <button
              type="button"
              class="rw-download-btn"
              data-testid="wrapped-download-png"
              :disabled="downloading"
              @click="onDownload"
            >
              {{ downloading ? 'Exporting…' : 'Download PNG' }}
            </button>
            <NuxtLink
              to="/upload"
              class="rw-cta-upload-link"
            >
              Upload another year
            </NuxtLink>
          </div>
        </article>
      </section>
    </div>

    <WrappedTripMapStage
      v-if="mapExpanded"
      :key="selectedYear"
      :trips="yearTrips"
      :year="selectedYear"
      @close="mapExpanded = false"
    />
  </div>
</template>
