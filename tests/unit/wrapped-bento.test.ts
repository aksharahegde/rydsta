import { describe, it, expect } from 'vitest'
import { computeWrappedStats } from '../../shared/lib/wrapped-stats'
import {
  formatWrappedDistance,
  getBentoHighlight,
  getSpendLabel,
  shouldShowHeroTile,
  shouldShowTopPickupTile,
} from '../../shared/lib/wrapped-bento'
import type { Trip } from '../../shared/types/trip'

function trip(overrides: Partial<Trip> & Pick<Trip, 'startedAt'>): Trip {
  return {
    provider: 'uber',
    startedAt: overrides.startedAt,
    endedAt: null,
    pickup: 'Koramangala',
    dropoff: 'Airport',
    city: null,
    fare: 200,
    currency: 'INR',
    distanceKm: 10,
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

describe('wrapped bento content', () => {
  it('formats distance without excessive decimals', () => {
    expect(formatWrappedDistance(22.259640891134698)).toBe('22.3 km')
    expect(formatWrappedDistance(35)).toBe('35 km')
    expect(formatWrappedDistance(4.567)).toBe('4.57 km')
  })

  it('shows hero and spend for complete trip data', () => {
    const trips = [
      trip({ startedAt: new Date('2025-06-01T10:00:00Z') }),
      trip({
        startedAt: new Date('2025-06-15T22:00:00Z'),
        pickup: 'Indiranagar',
        fare: 120,
        distanceKm: 5,
      }),
    ]

    const stats = computeWrappedStats(trips, 2025)
    expect(shouldShowHeroTile(stats)).toBe(true)
    expect(getSpendLabel(stats)).not.toBeNull()
    expect(shouldShowTopPickupTile(stats)).toBe(true)
    expect(getBentoHighlight(stats)?.title).toBe('Longest trip')
  })

  it('omits spend label when no fares', () => {
    const trips = [
      trip({ startedAt: new Date('2025-01-01T10:00:00Z'), fare: null }),
      trip({ startedAt: new Date('2025-02-01T10:00:00Z'), fare: null }),
    ]

    const stats = computeWrappedStats(trips, 2025)
    expect(getSpendLabel(stats)).toBeNull()
    expect(shouldShowHeroTile(stats)).toBe(true)
  })

  it('uses priciest trip highlight when distance is missing', () => {
    const trips = [
      trip({
        startedAt: new Date('2025-03-01T10:00:00Z'),
        distanceKm: null,
        fare: 500,
      }),
    ]

    const stats = computeWrappedStats(trips, 2025)
    const highlight = getBentoHighlight(stats)
    expect(highlight?.title).toBe('Priciest trip')
    expect(highlight?.value).toContain('500')
  })

  it('computes stats per selected year in multi-year data', () => {
    const trips = [
      trip({ startedAt: new Date('2019-06-01T10:00:00Z'), fare: 100 }),
      trip({ startedAt: new Date('2024-03-01T10:00:00Z'), fare: 500 }),
      trip({ startedAt: new Date('2024-08-01T10:00:00Z'), fare: 600 }),
    ]

    const stats2019 = computeWrappedStats(trips, 2019)
    const stats2024 = computeWrappedStats(trips, 2024)
    expect(stats2019.totalTrips).toBe(1)
    expect(stats2024.totalTrips).toBe(2)
    expect(stats2024.totalSpend).toBe(1100)
  })

  it('hides top pickup tile when pickup data is absent', () => {
    const trips = [
      trip({
        startedAt: new Date('2025-04-01T10:00:00Z'),
        pickup: null,
        dropoff: null,
      }),
    ]

    const stats = computeWrappedStats(trips, 2025)
    expect(shouldShowTopPickupTile(stats)).toBe(false)
  })
})
