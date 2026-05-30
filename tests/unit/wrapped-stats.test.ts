import { describe, it, expect } from 'vitest'
import { computeWrappedStats } from '../../shared/lib/wrapped-stats'
import type { Trip } from '../../shared/types/trip'

const trips: Trip[] = [
  {
    provider: 'uber',
    startedAt: new Date('2025-06-01T10:00:00Z'),
    endedAt: null,
    pickup: 'Koramangala',
    dropoff: 'Airport',
    fare: 450,
    currency: 'INR',
    distanceKm: 35,
    status: 'completed',
    vehicleType: null,
    sourceFile: 't.csv',
  },
  {
    provider: 'uber',
    startedAt: new Date('2025-06-15T22:00:00Z'),
    endedAt: null,
    pickup: ' Indiranagar ',
    dropoff: 'Home',
    fare: 120,
    currency: 'INR',
    distanceKm: 5,
    status: 'completed',
    vehicleType: null,
    sourceFile: 't.csv',
  },
]

describe('computeWrappedStats', () => {
  it('sums trips and fare', () => {
    const s = computeWrappedStats(trips)
    expect(s.totalTrips).toBe(2)
    expect(s.totalSpend).toBe(570)
    expect(s.currency).toBe('INR')
  })

  it('derives year, busiest month/weekday, top pickup, and highlights', () => {
    const s = computeWrappedStats(trips)
    expect(s.year).toBe(2025)
    expect(s.busiestMonth).toBe('June')
    expect(s.busiestWeekday).toBe('Sunday')
    expect(s.topPickup).toBe('Koramangala')
    expect(s.longestTrip?.distanceKm).toBe(35)
    expect(s.priciestTrip?.fare).toBe(450)
  })

  it('returns empty stats for no valid trips', () => {
    const s = computeWrappedStats([])
    expect(s.totalTrips).toBe(0)
    expect(s.totalSpend).toBeNull()
    expect(s.busiestMonth).toBeNull()
    expect(s.longestTrip).toBeNull()
  })
})
