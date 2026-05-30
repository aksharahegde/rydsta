import { describe, it, expect } from 'vitest'
import { buildStorySlides } from '../../app/composables/useWrappedStory'
import type { Trip } from '../../shared/types/trip'

function trip(overrides: Partial<Trip> & Pick<Trip, 'startedAt'>): Trip {
  return {
    provider: 'uber',
    startedAt: overrides.startedAt,
    endedAt: null,
    pickup: 'Koramangala',
    dropoff: 'Airport',
    fare: 200,
    currency: 'INR',
    distanceKm: 10,
    status: 'completed',
    vehicleType: null,
    sourceFile: 't.csv',
    ...overrides,
  }
}

describe('buildStorySlides', () => {
  it('returns slides in spec order for complete trip data', () => {
    const trips = [
      trip({ startedAt: new Date('2025-06-01T10:00:00Z') }),
      trip({
        startedAt: new Date('2025-06-15T22:00:00Z'),
        pickup: 'Indiranagar',
        fare: 120,
        distanceKm: 5,
      }),
    ]

    const slides = buildStorySlides(trips)
    expect(slides.map(s => s.id)).toEqual([
      'hook',
      'total-trips',
      'total-spend',
      'busiest-time',
      'top-pickup',
      'highlight',
      'personality',
      'cta',
    ])
  })

  it('omits spend slide when no fares', () => {
    const trips = [
      trip({ startedAt: new Date('2025-01-01T10:00:00Z'), fare: null }),
      trip({ startedAt: new Date('2025-02-01T10:00:00Z'), fare: null }),
    ]

    const slides = buildStorySlides(trips)
    expect(slides.some(s => s.id === 'total-spend')).toBe(false)
    expect(slides.some(s => s.id === 'total-trips')).toBe(true)
  })

  it('returns empty array when there are no valid trips', () => {
    const invalid = trip({
      startedAt: new Date('invalid'),
      fare: null,
      distanceKm: null,
    })
    invalid.startedAt = new Date(Number.NaN)

    expect(buildStorySlides([invalid])).toEqual([])
    expect(buildStorySlides([])).toEqual([])
  })

  it('uses priciest trip highlight when distance is missing', () => {
    const trips = [
      trip({
        startedAt: new Date('2025-03-01T10:00:00Z'),
        distanceKm: null,
        fare: 500,
      }),
    ]

    const slides = buildStorySlides(trips)
    const highlight = slides.find(s => s.id === 'highlight')
    expect(highlight?.headline).toBe('Priciest trip')
    expect(highlight?.value).toContain('500')
  })
})
