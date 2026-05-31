import type { Trip } from '../types/trip'

export type WrappedStats = {
  year: number
  totalTrips: number
  totalSpend: number | null
  currency: string | null
  busiestMonth: string | null
  busiestWeekday: string | null
  topPickup: string | null
  totalDistanceKm: number | null
  primaryCity: string | null
  topVehicleType: string | null
  averageFare: number | null
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

export function validTrips(trips: Trip[]): Trip[] {
  return trips.filter(isValidTrip)
}

/** Trim and replace underscores so export codes (e.g. Short_trip) read naturally in UI. */
export function formatDisplayLabel(value: string | null | undefined): string | null {
  if (value == null) return null
  const trimmed = value.trim().replace(/_/g, ' ').replace(/\s+/g, ' ')
  return trimmed.length > 0 ? trimmed : null
}

function normalizePickup(pickup: string | null): string | null {
  return formatDisplayLabel(pickup)
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

/** Distinct years with trips, newest first (GitHub order). */
export function yearsFromTrips(trips: Trip[]): number[] {
  const years = new Set<number>()
  for (const t of validTrips(trips)) {
    years.add(t.startedAt.getFullYear())
  }
  return [...years].sort((a, b) => b - a)
}

export function yearRangeLabel(years: number[]): string {
  if (years.length === 0) return ''
  const sorted = [...years].sort((a, b) => a - b)
  const min = sorted[0]!
  const max = sorted[sorted.length - 1]!
  return min === max ? String(min) : `${min}–${max}`
}

export function tripsForYear(trips: Trip[], year: number): Trip[] {
  return validTrips(trips).filter(t => t.startedAt.getFullYear() === year)
}

export function tripCountByYear(trips: Trip[]): { year: number, count: number }[] {
  const counts = new Map<number, number>()
  for (const t of validTrips(trips)) {
    const y = t.startedAt.getFullYear()
    counts.set(y, (counts.get(y) ?? 0) + 1)
  }
  return yearsFromTrips(trips).map(year => ({
    year,
    count: counts.get(year) ?? 0,
  }))
}

export function computeWrappedStats(trips: Trip[], year: number): WrappedStats {
  const inYear = tripsForYear(trips, year)

  const fares = inYear
    .map(t => t.fare)
    .filter((f): f is number => f != null && !Number.isNaN(f))
  const totalSpend = fares.length ? fares.reduce((a, b) => a + b, 0) : null

  const monthCounts = new Map<string, number>()
  const weekdayCounts = new Map<string, number>()
  const pickupCounts = new Map<string, number>()
  const cityCounts = new Map<string, number>()
  const vehicleCounts = new Map<string, number>()
  let totalDistanceKm = 0
  let hasDistance = false

  for (const t of inYear) {
    const month = MONTH_NAMES[t.startedAt.getMonth()]
    monthCounts.set(month, (monthCounts.get(month) ?? 0) + 1)

    const weekday = WEEKDAY_NAMES[t.startedAt.getDay()]
    weekdayCounts.set(weekday, (weekdayCounts.get(weekday) ?? 0) + 1)

    const pickup = normalizePickup(t.pickup)
    if (pickup) {
      pickupCounts.set(pickup, (pickupCounts.get(pickup) ?? 0) + 1)
    }

    const city = normalizePickup(t.city)
    if (city) {
      cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1)
    }

    const vehicle = normalizePickup(t.vehicleType)
    if (vehicle) {
      vehicleCounts.set(vehicle, (vehicleCounts.get(vehicle) ?? 0) + 1)
    }

    if (t.distanceKm != null && !Number.isNaN(t.distanceKm) && t.distanceKm > 0) {
      totalDistanceKm += t.distanceKm
      hasDistance = true
    }
  }

  let longestTrip: Trip | null = null
  let bestDistance = -1
  for (const t of inYear) {
    const d = tripDistance(t)
    if (d > bestDistance) {
      bestDistance = d
      longestTrip = t
    }
  }
  if (bestDistance < 0) longestTrip = null

  let priciestTrip: Trip | null = null
  let bestFare = -1
  for (const t of inYear) {
    if (t.fare == null || Number.isNaN(t.fare)) continue
    if (t.fare > bestFare) {
      bestFare = t.fare
      priciestTrip = t
    }
  }
  if (bestFare < 0) priciestTrip = null

  const averageFare
    = totalSpend != null && inYear.length > 0
      ? totalSpend / inYear.length
      : null

  return {
    year,
    totalTrips: inYear.length,
    totalSpend,
    currency: inYear.find(t => t.currency)?.currency ?? null,
    busiestMonth: modeKey(monthCounts),
    busiestWeekday: modeKey(weekdayCounts),
    topPickup: modeKey(pickupCounts),
    totalDistanceKm: hasDistance ? totalDistanceKm : null,
    primaryCity: modeKey(cityCounts),
    topVehicleType: modeKey(vehicleCounts),
    averageFare,
    longestTrip,
    priciestTrip,
  }
}
