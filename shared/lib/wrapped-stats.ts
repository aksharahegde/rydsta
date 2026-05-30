import type { Trip } from '../types/trip'

export type WrappedStats = {
  year: number
  totalTrips: number
  totalSpend: number | null
  currency: string | null
  busiestMonth: string | null
  busiestWeekday: string | null
  topPickup: string | null
  longestTrip: Trip | null
  priciestTrip: Trip | null
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

function isValidTrip(t: Trip): boolean {
  return Boolean(t.startedAt) && !Number.isNaN(t.startedAt.getTime())
}

function normalizePickup(pickup: string | null): string | null {
  if (pickup == null) return null
  const trimmed = pickup.trim()
  return trimmed.length > 0 ? trimmed : null
}

function tripDistance(t: Trip): number {
  return t.distanceKm ?? 0
}

function modeKey(counts: Map<string, number>): string | null {
  let best: string | null = null
  let bestCount = 0
  for (const [key, count] of counts) {
    if (count > bestCount) {
      bestCount = count
      best = key
    }
  }
  return best
}

function yearFromRange(valid: Trip[]): number {
  if (valid.length === 0) return new Date().getFullYear()

  const yearCounts = new Map<number, number>()
  for (const t of valid) {
    const y = t.startedAt.getFullYear()
    yearCounts.set(y, (yearCounts.get(y) ?? 0) + 1)
  }

  let bestYear = valid[0]!.startedAt.getFullYear()
  let bestCount = 0
  for (const [year, count] of yearCounts) {
    if (count > bestCount || (count === bestCount && year > bestYear)) {
      bestCount = count
      bestYear = year
    }
  }
  return bestYear
}

export function computeWrappedStats(trips: Trip[]): WrappedStats {
  const valid = trips.filter(isValidTrip)
  const year = yearFromRange(valid)

  const fares = valid
    .map(t => t.fare)
    .filter((f): f is number => f != null && !Number.isNaN(f))
  const totalSpend = fares.length ? fares.reduce((a, b) => a + b, 0) : null

  const monthCounts = new Map<string, number>()
  const weekdayCounts = new Map<string, number>()
  const pickupCounts = new Map<string, number>()

  for (const t of valid) {
    const month = MONTH_NAMES[t.startedAt.getMonth()]
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1)

    const weekday = WEEKDAY_NAMES[t.startedAt.getDay()]
    weekdayCounts.set(weekday, (weekdayCounts.get(weekday) ?? 0) + 1)

    const pickup = normalizePickup(t.pickup)
    if (pickup) {
      pickupCounts.set(pickup, (pickupCounts.get(pickup) ?? 0) + 1)
    }
  }

  let longestTrip: Trip | null = null
  let bestDistance = -1
  for (const t of valid) {
    const d = tripDistance(t)
    if (d > bestDistance) {
      bestDistance = d
      longestTrip = t
    }
  }
  if (bestDistance < 0) longestTrip = null

  let priciestTrip: Trip | null = null
  let bestFare = -1
  for (const t of valid) {
    if (t.fare == null || Number.isNaN(t.fare)) continue
    if (t.fare > bestFare) {
      bestFare = t.fare
      priciestTrip = t
    }
  }
  if (bestFare < 0) priciestTrip = null

  return {
    year,
    totalTrips: valid.length,
    totalSpend,
    currency: valid.find(t => t.currency)?.currency ?? null,
    busiestMonth: modeKey(monthCounts),
    busiestWeekday: modeKey(weekdayCounts),
    topPickup: modeKey(pickupCounts),
    longestTrip,
    priciestTrip,
  }
}
