import { describe, it, expect } from 'vitest'
import {
  arcLineCoordinates,
  boundsForTrips,
  sliceArcCoordinates,
  tripArcGeoJson,
  tripHasCoordinates,
  tripsWithCoordinates,
} from '../../shared/lib/trip-map-playback'
import type { Trip } from '../../shared/types/trip'

function trip(overrides: Partial<Trip> & Pick<Trip, 'startedAt'>): Trip {
  return {
    provider: 'uber',
    startedAt: overrides.startedAt,
    endedAt: null,
    pickup: 'A',
    dropoff: 'B',
    pickupLat: 12.97,
    pickupLng: 77.59,
    dropoffLat: 12.95,
    dropoffLng: 77.67,
    fare: 100,
    currency: 'INR',
    distanceKm: 5,
    status: 'completed',
    vehicleType: null,
    sourceFile: 't.csv',
    ...overrides,
  }
}

describe('trip-map-playback', () => {
  it('tripHasCoordinates requires all four values', () => {
    expect(tripHasCoordinates(trip({ startedAt: new Date() }))).toBe(true)
    expect(
      tripHasCoordinates(
        trip({ startedAt: new Date(), pickupLat: null }),
      ),
    ).toBe(false)
  })

  it('tripsWithCoordinates sorts chronologically', () => {
    const later = trip({ startedAt: new Date('2025-06-02T10:00:00Z') })
    const earlier = trip({ startedAt: new Date('2025-01-01T10:00:00Z') })
    const result = tripsWithCoordinates([later, earlier])
    expect(result[0]?.startedAt).toEqual(earlier.startedAt)
    expect(result[1]?.startedAt).toEqual(later.startedAt)
  })

  it('arcLineCoordinates returns requested segment count', () => {
    const coords = arcLineCoordinates([77.59, 12.97], [77.67, 12.95], 24)
    expect(coords).toHaveLength(25)
    expect(coords[0]).toEqual([77.59, 12.97])
    expect(coords[coords.length - 1]).toEqual([77.67, 12.95])
  })

  it('boundsForTrips pads pickup and dropoff extents', () => {
    const bounds = boundsForTrips([
      trip({ startedAt: new Date('2025-01-01T10:00:00Z') }),
    ])
    expect(bounds).not.toBeNull()
    expect(bounds![0][0]).toBeLessThan(77.59)
    expect(bounds![1][0]).toBeGreaterThan(77.67)
  })

  it('sliceArcCoordinates interpolates partial progress', () => {
    const full = arcLineCoordinates([0, 0], [10, 10], 10)
    const partial = sliceArcCoordinates(full, 0.5)
    expect(partial.length).toBeGreaterThan(1)
    expect(partial.length).toBeLessThan(full.length)
  })

  it('tripArcGeoJson builds a LineString feature', () => {
    const feature = tripArcGeoJson(trip({ startedAt: new Date() }), 2)
    expect(feature?.geometry.type).toBe('LineString')
    expect(feature?.properties.tripIndex).toBe(2)
    expect(feature?.geometry.coordinates.length).toBeGreaterThan(2)
  })
})
