import { describe, expect, it } from 'vitest'
import { mergeTrips, tripDedupeKey } from '../../shared/lib/trip-dedupe'
import type { Trip } from '../../shared/types/trip'

function makeTrip(overrides: Partial<Trip> = {}): Trip {
  return {
    provider: 'uber',
    startedAt: new Date('2025-03-01T08:05:00'),
    endedAt: null,
    pickup: 'Koramangala',
    dropoff: 'Indiranagar',
    fare: 285.5,
    currency: 'INR',
    distanceKm: 4.2,
    status: 'completed',
    vehicleType: 'UberGo',
    pickupLat: null,
    pickupLng: null,
    dropoffLat: null,
    dropoffLng: null,
    sourceFile: 'trips.csv',
    ...overrides,
  }
}

describe('tripDedupeKey', () => {
  it('combines startedAt, pickup, and fare', () => {
    const trip = makeTrip()
    expect(tripDedupeKey(trip)).toBe(
      `${trip.startedAt.toISOString()}|Koramangala|285.5`,
    )
  })
})

describe('mergeTrips', () => {
  it('dedupes by startedAt, pickup, and fare', () => {
    const a = makeTrip()
    const b = makeTrip({ dropoff: 'Different dropoff' })
    const c = makeTrip({ fare: 999 })

    expect(mergeTrips([a], [b, c])).toHaveLength(2)
  })
})
