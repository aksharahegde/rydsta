import { describe, it, expect } from 'vitest'
import { pickPersonality } from '../../shared/lib/personality'
import { computeWrappedStats } from '../../shared/lib/wrapped-stats'
import type { Trip } from '../../shared/types/trip'

function trip(overrides: Partial<Trip> & Pick<Trip, 'startedAt'>): Trip {
  return {
    provider: 'uber',
    endedAt: null,
    pickup: 'Office',
    dropoff: 'Home',
    fare: 100,
    currency: 'INR',
    distanceKm: 10,
    status: 'completed',
    vehicleType: null,
    sourceFile: 't.csv',
    ...overrides,
  }
}

/** Local calendar time — matches pickPersonality's use of getHours(). */
function localStartedAt(monthIndex: number, day: number, hour: number): Date {
  return new Date(2025, monthIndex, day, hour, 0, 0)
}

describe('pickPersonality', () => {
  it('returns Night Owl when at least 40% of trips are late night', () => {
    const trips = [
      trip({ startedAt: localStartedAt(5, 1, 23) }),
      trip({ startedAt: localStartedAt(5, 2, 2) }),
      trip({ startedAt: localStartedAt(5, 3, 10) }),
    ]
    const stats = computeWrappedStats(trips, 2025)
    expect(pickPersonality(stats, trips)).toBe('Night Owl')
  })

  it('returns Airport Regular when airport appears in route', () => {
    const trips = [
      trip({
        startedAt: localStartedAt(5, 1, 10),
        pickup: 'Home',
        dropoff: 'International Airport',
      }),
      trip({ startedAt: localStartedAt(5, 2, 11) }),
    ]
    const stats = computeWrappedStats(trips, 2025)
    expect(pickPersonality(stats, trips)).toBe('Airport Regular')
  })

  it('returns Road Warrior by default', () => {
    const trips = [
      trip({ startedAt: localStartedAt(5, 1, 10) }),
      trip({ startedAt: localStartedAt(5, 2, 14) }),
    ]
    const stats = computeWrappedStats(trips, 2025)
    expect(pickPersonality(stats, trips)).toBe('Road Warrior')
  })
})
