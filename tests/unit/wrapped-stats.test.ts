import { describe, it, expect } from 'vitest'
import {
  computeWrappedStats,
  tripsForYear,
  tripCountByYear,
  yearRangeLabel,
  yearsFromTrips,
} from '../../shared/lib/wrapped-stats'
import type { Trip } from '../../shared/types/trip'

const trips: Trip[] = [
  {
    provider: 'uber',
    startedAt: new Date('2025-06-01T10:00:00Z'),
    endedAt: null,
    pickup: 'Koramangala',
    dropoff: 'Airport',
    city: null,
    fare: 450,
    currency: 'INR',
    distanceKm: 35,
    status: 'completed',
    vehicleType: null,
    pickupLat: null,
    pickupLng: null,
    dropoffLat: null,
    dropoffLng: null,
    sourceFile: 't.csv',
  },
  {
    provider: 'uber',
    startedAt: new Date('2025-06-15T22:00:00Z'),
    endedAt: null,
    pickup: ' Indiranagar ',
    dropoff: 'Home',
    city: null,
    fare: 120,
    currency: 'INR',
    distanceKm: 5,
    status: 'completed',
    vehicleType: null,
    pickupLat: null,
    pickupLng: null,
    dropoffLat: null,
    dropoffLng: null,
    sourceFile: 't.csv',
  },
]

describe('yearsFromTrips', () => {
  it('returns distinct years newest first', () => {
    const mixed = [
      { ...trips[0]!, startedAt: new Date('2019-03-01T10:00:00Z') },
      { ...trips[0]!, startedAt: new Date('2024-08-01T10:00:00Z') },
      { ...trips[0]!, startedAt: new Date('2022-01-01T10:00:00Z') },
    ]
    expect(yearsFromTrips(mixed)).toEqual([2024, 2022, 2019])
  })

  it('formats year range label', () => {
    expect(yearRangeLabel([2019, 2024])).toBe('2019–2024')
    expect(yearRangeLabel([2025])).toBe('2025')
    expect(yearRangeLabel([])).toBe('')
  })
})

describe('computeWrappedStats', () => {
  it('sums trips and fare for the given year', () => {
    const s = computeWrappedStats(trips, 2025)
    expect(s.totalTrips).toBe(2)
    expect(s.totalSpend).toBe(570)
    expect(s.currency).toBe('INR')
    expect(s.year).toBe(2025)
  })

  it('derives year, busiest month/weekday, top pickup, and highlights', () => {
    const s = computeWrappedStats(trips, 2025)
    expect(s.busiestMonth).toBe('June')
    expect(s.busiestWeekday).toBe('Sunday')
    expect(s.topPickup).toBe('Koramangala')
    expect(s.longestTrip?.distanceKm).toBe(35)
    expect(s.priciestTrip?.fare).toBe(450)
    expect(s.totalDistanceKm).toBe(40)
    expect(s.averageFare).toBe(285)
  })

  it('returns empty stats for no trips in year', () => {
    const s = computeWrappedStats(trips, 2010)
    expect(s.totalTrips).toBe(0)
    expect(s.totalSpend).toBeNull()
    expect(s.busiestMonth).toBeNull()
    expect(s.longestTrip).toBeNull()
    expect(s.totalDistanceKm).toBeNull()
    expect(s.primaryCity).toBeNull()
    expect(s.topVehicleType).toBeNull()
    expect(s.averageFare).toBeNull()
  })

  it('derives distance, city, vehicle type from export fields', () => {
    const exportTrips = [
      {
        ...trips[0]!,
        city: 'Bengaluru',
        vehicleType: 'Uber Go',
        distanceKm: 4.2,
        fare: 285.5,
      },
      {
        ...trips[1]!,
        city: 'Bengaluru',
        vehicleType: 'Uber Go',
        distanceKm: 22,
        fare: 890,
      },
    ]

    const s = computeWrappedStats(exportTrips, 2025)
    expect(s.totalDistanceKm).toBeCloseTo(26.2)
    expect(s.primaryCity).toBe('Bengaluru')
    expect(s.topVehicleType).toBe('Uber Go')
    expect(s.averageFare).toBeCloseTo(587.75)
  })

  it('only counts trips from the requested year', () => {
    const mixed = [
      { ...trips[0]!, startedAt: new Date('2019-03-01T10:00:00Z'), fare: 100 },
      { ...trips[0]!, startedAt: new Date('2019-04-01T10:00:00Z'), fare: 100 },
      { ...trips[0]!, startedAt: new Date('2024-08-01T10:00:00Z'), fare: 999 },
    ]
    const s = computeWrappedStats(mixed, 2019)
    expect(s.year).toBe(2019)
    expect(s.totalTrips).toBe(2)
    expect(s.totalSpend).toBe(200)
  })

  it('filters trips for a year', () => {
    const mixed = [
      { ...trips[0]!, startedAt: new Date('2019-01-01T10:00:00Z') },
      { ...trips[0]!, startedAt: new Date('2024-01-01T10:00:00Z') },
    ]
    const filtered = tripsForYear(mixed, 2019)
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.startedAt.getFullYear()).toBe(2019)
  })

  it('returns trip counts per year', () => {
    const mixed = [
      { ...trips[0]!, startedAt: new Date('2019-01-01T10:00:00Z') },
      { ...trips[0]!, startedAt: new Date('2024-01-01T10:00:00Z') },
      { ...trips[0]!, startedAt: new Date('2024-02-01T10:00:00Z') },
    ]
    expect(tripCountByYear(mixed)).toEqual([
      { year: 2024, count: 2 },
      { year: 2019, count: 1 },
    ])
  })
})
