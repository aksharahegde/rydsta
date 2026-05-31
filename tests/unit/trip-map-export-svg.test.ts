import { describe, it, expect } from 'vitest'
import { buildTripMapExportSvg } from '#shared/lib/trip-map-export-svg'
import type { Trip } from '#shared/types/trip'

function trip(partial: Partial<Trip> & Pick<Trip, 'startedAt'>): Trip {
  return {
    provider: 'uber',
    startedAt: partial.startedAt,
    fare: partial.fare ?? 100,
    distanceKm: partial.distanceKm ?? 5,
    pickup: partial.pickup ?? 'A',
    dropoff: partial.dropoff ?? 'B',
    pickupLat: partial.pickupLat ?? 12.97,
    pickupLng: partial.pickupLng ?? 77.59,
    dropoffLat: partial.dropoffLat ?? 12.98,
    dropoffLng: partial.dropoffLng ?? 77.6,
    city: partial.city ?? 'Bangalore',
    ...partial,
  }
}

describe('buildTripMapExportSvg', () => {
  it('returns null when no coordinates', () => {
    const trips = [
      trip({
        startedAt: new Date('2025-03-01'),
        pickupLat: null,
        pickupLng: null,
      }),
    ]
    expect(buildTripMapExportSvg(trips)).toBeNull()
  })

  it('plots all coordinate trips when allCoordinates is set', () => {
    const trips = [
      trip({ startedAt: new Date('2025-03-01'), city: 'Bangalore' }),
      trip({
        startedAt: new Date('2025-03-02'),
        city: 'Mumbai',
        pickupLat: 19.08,
        pickupLng: 72.88,
        dropoffLat: 19.09,
        dropoffLng: 72.89,
      }),
    ]
    const overviewOnly = buildTripMapExportSvg(trips)
    const allCoords = buildTripMapExportSvg(trips, { allCoordinates: true })
    expect(overviewOnly!.arcPaths.length).toBe(1)
    expect(allCoords!.arcPaths.length).toBe(2)
  })

  it('builds arcs and points for mapped trips', () => {
    const trips = [
      trip({ startedAt: new Date('2025-03-01') }),
      trip({
        startedAt: new Date('2025-03-02'),
        pickupLat: 12.96,
        pickupLng: 77.58,
        dropoffLat: 12.99,
        dropoffLng: 77.61,
      }),
    ]
    const svg = buildTripMapExportSvg(trips)
    expect(svg).not.toBeNull()
    expect(svg!.arcPaths.length).toBeGreaterThan(0)
    expect(svg!.pickups.length).toBe(svg!.arcPaths.length)
    expect(svg!.viewBox).toBe('0 0 400 400')
  })
})
