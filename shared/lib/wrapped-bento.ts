import type { Trip } from '../types/trip'
import { formatDisplayLabel } from './wrapped-stats'
import type { WrappedStats } from './wrapped-stats'

export type BentoHighlight = {
  title: string
  value: string
  pickup: string
  dropoff: string
}

export type BentoBusiestTile = {
  eyebrow: string
  value: string
}

export type BentoMapStat = {
  eyebrow: string
  value: string
}

export function formatWrappedDistance(km: number): string {
  const fractionDigits = km >= 100 ? 0 : km >= 10 ? 1 : 2
  const formatted = km.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: 0,
  })
  return `${formatted} km`
}

export function formatWrappedMoney(
  amount: number,
  currency: string | null,
): string {
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

export function getSpendLabel(stats: WrappedStats): string | null {
  const { totalSpend, currency } = stats
  if (totalSpend == null || Number.isNaN(totalSpend) || totalSpend < 0) {
    return null
  }
  return formatWrappedMoney(totalSpend, currency)
}

export function getBusiestInHero(stats: WrappedStats): BentoBusiestTile | null {
  if (stats.busiestMonth) {
    return { eyebrow: 'Busiest month', value: stats.busiestMonth }
  }
  if (stats.busiestWeekday) {
    return { eyebrow: 'Busiest day', value: stats.busiestWeekday }
  }
  return null
}

export function getBusiestTile(stats: WrappedStats): BentoBusiestTile | null {
  return getBusiestInHero(stats)
}

export function getAverageFareLabel(stats: WrappedStats): string | null {
  const { averageFare, currency } = stats
  if (averageFare == null || Number.isNaN(averageFare) || averageFare < 0) {
    return null
  }
  return formatWrappedMoney(Math.round(averageFare), currency)
}

export function getMapStatTiles(stats: WrappedStats): BentoMapStat[] {
  const tiles: BentoMapStat[] = []

  if (stats.totalDistanceKm != null && stats.totalDistanceKm > 0) {
    tiles.push({
      eyebrow: 'Distance traveled',
      value: formatWrappedDistance(stats.totalDistanceKm),
    })
  }

  if (stats.primaryCity) {
    tiles.push({
      eyebrow: 'Primary city',
      value: stats.primaryCity,
    })
  }

  if (stats.topVehicleType) {
    tiles.push({
      eyebrow: 'Go-to ride',
      value: formatDisplayLabel(stats.topVehicleType) ?? stats.topVehicleType,
    })
  }

  const avgFare = getAverageFareLabel(stats)
  if (avgFare) {
    tiles.push({
      eyebrow: 'Avg fare',
      value: avgFare,
    })
  }

  return tiles
}

function highlightStops(trip: Trip): Pick<BentoHighlight, 'pickup' | 'dropoff'> | null {
  const pickup = formatDisplayLabel(trip.pickup)
  const dropoff = formatDisplayLabel(trip.dropoff)
  if (!pickup && !dropoff) return null
  return {
    pickup: pickup ?? 'Pickup',
    dropoff: dropoff ?? 'Dropoff',
  }
}

export function getBentoHighlight(stats: WrappedStats): BentoHighlight | null {
  const longest = stats.longestTrip
  if (
    longest?.distanceKm != null
    && !Number.isNaN(longest.distanceKm)
    && longest.distanceKm > 0
  ) {
    const stops = highlightStops(longest)
    if (!stops) {
      return {
        title: 'Longest trip',
        value: formatWrappedDistance(longest.distanceKm),
        pickup: 'Pickup',
        dropoff: 'Dropoff',
      }
    }
    return {
      title: 'Longest trip',
      value: formatWrappedDistance(longest.distanceKm),
      ...stops,
    }
  }

  const priciest = stats.priciestTrip
  if (priciest?.fare != null && !Number.isNaN(priciest.fare)) {
    const stops = highlightStops(priciest)
    if (!stops) {
      return {
        title: 'Priciest trip',
        value: formatWrappedMoney(
          priciest.fare,
          priciest.currency ?? stats.currency,
        ),
        pickup: 'Pickup',
        dropoff: 'Dropoff',
      }
    }
    return {
      title: 'Priciest trip',
      value: formatWrappedMoney(
        priciest.fare,
        priciest.currency ?? stats.currency,
      ),
      ...stops,
    }
  }

  return null
}

export function getPersonalityTileClass(personality: string): string {
  switch (personality) {
    case 'Night Owl':
      return 'rw-tile--personality rw-tile--night'
    case 'Airport Regular':
      return 'rw-tile--personality rw-tile--personality-airport'
    default:
      return 'rw-tile--personality rw-tile--personality-warrior'
  }
}

export function shouldShowTopPickupTile(stats: WrappedStats): boolean {
  return Boolean(stats.topPickup)
}

export function shouldShowHeroTile(stats: WrappedStats): boolean {
  return stats.totalTrips > 0
}
