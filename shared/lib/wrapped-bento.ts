import type { WrappedStats } from './wrapped-stats'

export type BentoHighlight = {
  title: string
  value: string
  route?: string
}

export type BentoBusiestTile = {
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

export function getBentoHighlight(stats: WrappedStats): BentoHighlight | null {
  const longest = stats.longestTrip
  if (
    longest?.distanceKm != null
    && !Number.isNaN(longest.distanceKm)
    && longest.distanceKm > 0
  ) {
    const route = [longest.pickup, longest.dropoff].filter(Boolean).join(' → ')
    return {
      title: 'Longest trip',
      value: formatWrappedDistance(longest.distanceKm),
      route: route || undefined,
    }
  }

  const priciest = stats.priciestTrip
  if (priciest?.fare != null && !Number.isNaN(priciest.fare)) {
    const route = [priciest.pickup, priciest.dropoff].filter(Boolean).join(' → ')
    return {
      title: 'Priciest trip',
      value: formatWrappedMoney(
        priciest.fare,
        priciest.currency ?? stats.currency,
      ),
      route: route || undefined,
    }
  }

  return null
}

export function getPersonalityTileClass(personality: string): string {
  switch (personality) {
    case 'Night Owl':
      return 'rw-tile--night'
    case 'Airport Regular':
      return 'rw-tile--personality-airport'
    default:
      return 'rw-tile--personality-warrior'
  }
}

export function shouldShowTopPickupTile(stats: WrappedStats): boolean {
  return Boolean(stats.topPickup)
}

export function shouldShowHeroTile(stats: WrappedStats): boolean {
  return stats.totalTrips > 0
}
