import type { Trip } from '../types/trip'
import { tripsForYear } from './wrapped-stats'

export type BarSeries = {
  values: number[]
  normalized: number[]
}

export function normalizeBarSeries(values: number[]): number[] {
  const max = Math.max(0, ...values)
  if (max <= 0) return values.map(() => 0)
  return values.map(v => v / max)
}

/** Trip counts per calendar month (Jan–Dec) for the given year. */
export function monthlyTripCounts(trips: Trip[], year: number): number[] {
  const counts = Array.from({ length: 12 }, () => 0)
  for (const t of tripsForYear(trips, year)) {
    counts[t.startedAt.getMonth()]! += 1
  }
  return counts
}

/** Trip counts per weekday (Sun–Sat). */
export function weekdayTripCounts(trips: Trip[], year: number): number[] {
  const counts = Array.from({ length: 7 }, () => 0)
  for (const t of tripsForYear(trips, year)) {
    counts[t.startedAt.getDay()]! += 1
  }
  return counts
}

/** Trip counts per hour of day (0–23). */
export function hourTripCounts(trips: Trip[], year: number): number[] {
  const counts = Array.from({ length: 24 }, () => 0)
  for (const t of tripsForYear(trips, year)) {
    counts[t.startedAt.getHours()]! += 1
  }
  return counts
}

export function buildBarSeries(values: number[]): BarSeries {
  return {
    values,
    normalized: normalizeBarSeries(values),
  }
}

export function peakSeriesIndex(normalized: number[]): number {
  let peak = 0
  let index = 0
  normalized.forEach((value, i) => {
    if (value > peak) {
      peak = value
      index = i
    }
  })
  return index
}

export function monthlyBarSeries(trips: Trip[], year: number): BarSeries {
  return buildBarSeries(monthlyTripCounts(trips, year))
}

export function weekdayBarSeries(trips: Trip[], year: number): BarSeries {
  return buildBarSeries(weekdayTripCounts(trips, year))
}

export type SparklinePoint = {
  x: number
  y: number
}

/** Normalized sparkline coords in 0–100 viewBox space. */
export function sparklinePoints(values: number[]): SparklinePoint[] {
  const normalized = normalizeBarSeries(values)
  if (normalized.length === 0) return []
  if (normalized.length === 1) {
    return [{ x: 50, y: 100 - normalized[0]! * 80 }]
  }

  const step = 100 / (normalized.length - 1)
  return normalized.map((value, index) => ({
    x: index * step,
    y: 100 - value * 80,
  }))
}

export function sparklinePolyline(values: number[]): string {
  return sparklinePoints(values)
    .map(p => `${p.x},${p.y}`)
    .join(' ')
}

export function sparklineArea(values: number[]): string {
  const points = sparklinePoints(values)
  if (points.length === 0) return ''
  const first = points[0]!
  const last = points[points.length - 1]!
  const line = points
    .slice(1)
    .reduce((acc, point) => `${acc} L ${point.x},${point.y}`, `M ${first.x},${first.y}`)
  return `${line} L ${last.x},100 L ${first.x},100 Z`
}

export type MapStatIconKind = 'distance' | 'city' | 'vehicle' | 'fare'

export function mapStatIconKind(eyebrow: string): MapStatIconKind {
  switch (eyebrow) {
    case 'Distance traveled':
      return 'distance'
    case 'Primary city':
      return 'city'
    case 'Go-to ride':
      return 'vehicle'
    default:
      return 'fare'
  }
}
