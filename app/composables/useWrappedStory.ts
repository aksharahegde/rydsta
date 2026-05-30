import { computeWrappedStats } from '#shared/lib/wrapped-stats'
import { pickPersonality } from '#shared/lib/personality'
import type { StorySlide } from '#shared/types/story'
import type { Trip } from '#shared/types/trip'

function isValidTrip(t: Trip): boolean {
  return Boolean(t.startedAt) && !Number.isNaN(t.startedAt.getTime())
}

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

function personalityEmoji(personality: string): string {
  switch (personality) {
    case 'Night Owl':
      return '🦉'
    case 'Airport Regular':
      return '✈️'
    default:
      return '🛣️'
  }
}

export function buildStorySlides(trips: Trip[]): StorySlide[] {
  const valid = trips.filter(isValidTrip)
  const stats = computeWrappedStats(trips)
  const personality = pickPersonality(stats, valid)
  const slides: StorySlide[] = []

  if (stats.totalTrips > 0) {
    slides.push({
      id: 'hook',
      kind: 'hook',
      headline: 'Your rides, wrapped',
      subline: String(stats.year),
      visual: 'gradient',
    })
  }

  if (stats.totalTrips > 0) {
    slides.push({
      id: 'total-trips',
      kind: 'stat',
      headline: 'Total trips',
      value: String(stats.totalTrips),
      visual: 'number',
    })
  }

  if (
    stats.totalSpend != null
    && !Number.isNaN(stats.totalSpend)
    && stats.totalSpend >= 0
  ) {
    slides.push({
      id: 'total-spend',
      kind: 'stat',
      headline: 'Total spend',
      value: formatMoney(stats.totalSpend, stats.currency),
      visual: 'number',
    })
  }

  const busiestValue = stats.busiestMonth ?? stats.busiestWeekday
  if (busiestValue) {
    slides.push({
      id: 'busiest-time',
      kind: 'stat',
      headline: stats.busiestMonth ? 'Busiest month' : 'Busiest day',
      value: busiestValue,
      visual: 'number',
    })
  }

  if (stats.topPickup) {
    slides.push({
      id: 'top-pickup',
      kind: 'stat',
      headline: 'Top pickup',
      value: stats.topPickup,
      subline: 'Where you started most rides',
      visual: 'number',
    })
  }

  const longest = stats.longestTrip
  if (
    longest?.distanceKm != null
    && !Number.isNaN(longest.distanceKm)
    && longest.distanceKm > 0
  ) {
    slides.push({
      id: 'highlight',
      kind: 'highlight',
      headline: 'Longest trip',
      value: `${longest.distanceKm} km`,
      subline: longest.pickup ?? longest.dropoff ?? undefined,
      visual: 'emoji',
    })
  } else {
    const priciest = stats.priciestTrip
    if (priciest?.fare != null && !Number.isNaN(priciest.fare)) {
      slides.push({
        id: 'highlight',
        kind: 'highlight',
        headline: 'Priciest trip',
        value: formatMoney(priciest.fare, priciest.currency ?? stats.currency),
        subline: priciest.pickup ?? priciest.dropoff ?? undefined,
        visual: 'emoji',
      })
    }
  }

  if (stats.totalTrips > 0) {
    slides.push({
      id: 'personality',
      kind: 'personality',
      headline: personality,
      subline: 'Your ride personality',
      value: personalityEmoji(personality),
      visual: 'emoji',
    })
  }

  if (slides.length > 0) {
    slides.push({
      id: 'cta',
      kind: 'cta',
      headline: 'Share your wrapped',
      subline: 'Download a card or upload another year',
      visual: 'gradient',
    })
  }

  return slides
}

export function useWrappedStory() {
  return { buildStorySlides }
}
