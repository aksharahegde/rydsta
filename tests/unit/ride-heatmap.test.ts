import { describe, it, expect } from 'vitest'
import { buildYearHeatmap } from '../../shared/lib/ride-heatmap'
import type { Trip } from '../../shared/types/trip'

function trip(startedAt: Date, fare = 100): Trip {
  return {
    provider: 'uber',
    startedAt,
    endedAt: null,
    pickup: 'A',
    dropoff: 'B',
    fare,
    currency: 'INR',
    distanceKm: 5,
    status: 'completed',
    vehicleType: null,
    pickupLat: null,
    pickupLng: null,
    dropoffLat: null,
    dropoffLng: null,
    sourceFile: 't.csv',
  }
}

describe('buildYearHeatmap', () => {
  it('counts trips on the correct calendar days', () => {
    const trips = [
      trip(new Date(2019, 5, 15, 10, 0, 0)),
      trip(new Date(2019, 5, 15, 18, 0, 0)),
      trip(new Date(2019, 11, 31, 8, 0, 0)),
    ]
    const heatmap = buildYearHeatmap(trips, 2019)

    const june15 = heatmap.weeks
      .flatMap(w => w.days)
      .find(c => c.date === '2019-06-15')
    expect(june15?.count).toBe(2)
    expect(june15?.level).toBeGreaterThan(0)

    const dec31 = heatmap.weeks
      .flatMap(w => w.days)
      .find(c => c.date === '2019-12-31')
    expect(dec31?.count).toBe(1)
  })

  it('ignores trips from other years', () => {
    const trips = [
      trip(new Date(2019, 3, 1, 10, 0, 0)),
      trip(new Date(2024, 3, 1, 10, 0, 0)),
    ]
    const heatmap = buildYearHeatmap(trips, 2019)
    const total = heatmap.weeks
      .flatMap(w => w.days)
      .filter(c => c.date?.startsWith('2019'))
      .reduce((sum, c) => sum + c.count, 0)
    expect(total).toBe(1)
  })

  it('returns empty levels for a year with no trips', () => {
    const heatmap = buildYearHeatmap([trip(new Date(2024, 0, 1))], 2019)
    const withTrips = heatmap.weeks
      .flatMap(w => w.days)
      .filter(c => c.date?.startsWith('2019') && c.count > 0)
    expect(withTrips).toHaveLength(0)
  })

  it('includes month labels', () => {
    const heatmap = buildYearHeatmap([trip(new Date(2019, 0, 15))], 2019)
    expect(heatmap.monthLabels.some(m => m.label === 'Jan')).toBe(true)
  })

  it('pads weeks with null dates before and after the year', () => {
    const heatmap = buildYearHeatmap([], 2019)
    const firstWeek = heatmap.weeks[0]!
    expect(firstWeek.days.some(d => d.date === null)).toBe(true)
    const lastWeek = heatmap.weeks[heatmap.weeks.length - 1]!
    expect(lastWeek.days.some(d => d.date === null)).toBe(true)
  })
})
