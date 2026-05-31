import { describe, it, expect } from 'vitest'
import {
  buildBarSeries,
  hourTripCounts,
  mapStatIconKind,
  monthlyTripCounts,
  normalizeBarSeries,
  peakSeriesIndex,
  sparklinePolyline,
  weekdayTripCounts,
} from '../../shared/lib/bento-charts'
import type { Trip } from '../../shared/types/trip'

function trip(startedAt: string | Date, overrides: Partial<Trip> = {}): Trip {
  return {
    provider: 'uber',
    startedAt: startedAt instanceof Date ? startedAt : new Date(startedAt),
    endedAt: null,
    pickup: 'A',
    dropoff: 'B',
    city: null,
    fare: 100,
    currency: 'INR',
    distanceKm: 5,
    status: 'completed',
    vehicleType: null,
    pickupLat: null,
    pickupLng: null,
    dropoffLat: null,
    dropoffLng: null,
    sourceFile: 't.csv',
    ...overrides,
  }
}

function tripAt(
  year: number,
  month: number,
  day: number,
  hour: number,
  overrides: Partial<Trip> = {},
): Trip {
  return trip(new Date(year, month - 1, day, hour, 0, 0), overrides)
}

describe('bento-charts', () => {
  const trips = [
    tripAt(2025, 3, 1, 8),
    tripAt(2025, 3, 15, 9),
    tripAt(2025, 6, 10, 22),
    tripAt(2025, 6, 20, 23),
    tripAt(2025, 8, 5, 14),
  ]

  it('normalizes bar series to 0–1 by max', () => {
    expect(normalizeBarSeries([0, 5, 10])).toEqual([0, 0.5, 1])
    expect(normalizeBarSeries([0, 0, 0])).toEqual([0, 0, 0])
  })

  it('aggregates monthly trip counts', () => {
    const counts = monthlyTripCounts(trips, 2025)
    expect(counts[2]).toBe(2)
    expect(counts[5]).toBe(2)
    expect(counts[7]).toBe(1)
    expect(counts.reduce((a, b) => a + b, 0)).toBe(5)
  })

  it('aggregates weekday and hour counts', () => {
    expect(weekdayTripCounts(trips, 2025).reduce((a, b) => a + b, 0)).toBe(5)
    const hours = hourTripCounts(trips, 2025)
    expect(hours[22]! + hours[23]!).toBeGreaterThanOrEqual(2)
  })

  it('builds sparkline polyline from monthly data', () => {
    const series = buildBarSeries(monthlyTripCounts(trips, 2025))
    expect(series.normalized).toHaveLength(12)
    expect(sparklinePolyline(series.values)).toMatch(/^[\d.,\s]+$/)
  })

  it('maps stat eyebrows to icon kinds', () => {
    expect(mapStatIconKind('Distance traveled')).toBe('distance')
    expect(mapStatIconKind('Primary city')).toBe('city')
    expect(mapStatIconKind('Go-to ride')).toBe('vehicle')
    expect(mapStatIconKind('Avg fare')).toBe('fare')
  })

  it('finds peak index in normalized series', () => {
    expect(peakSeriesIndex([0, 0.2, 0.8, 0.5])).toBe(2)
    expect(peakSeriesIndex([0, 0, 0])).toBe(0)
  })
})
