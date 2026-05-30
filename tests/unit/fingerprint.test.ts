import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Papa from 'papaparse'
import {
  PROVIDER_FINGERPRINTS,
  UBER_STARTED_AT_FALLBACK,
} from '../../shared/constants/providers'
import { matchProvider } from '../../shared/lib/match-provider'

const fixturePath = resolve(
  import.meta.dirname,
  '../fixtures/uber-rider-trips-sample.csv',
)

function headersFromFixture(): string[] {
  const text = readFileSync(fixturePath, 'utf8')
  const parsed = Papa.parse<string[]>(text, { preview: 1 })
  return (parsed.data[0] ?? []).map(String)
}

describe('PROVIDER_FINGERPRINTS (Uber)', () => {
  const uber = PROVIDER_FINGERPRINTS.find(fp => fp.id === 'uber')

  it('defines Uber fingerprint with docs-aligned column map', () => {
    expect(uber).toBeDefined()
    expect(uber!.columnMap).toMatchObject({
      startedAt: 'begintrip_timestamp_local',
      endedAt: 'dropoff_timestamp_local',
      pickup: 'begintrip_address',
      dropoff: 'dropoff_address',
      fare: 'fare_amount',
      currency: 'currency_code',
      distanceKm: 'trip_distance_miles',
      status: 'status',
      vehicleType: 'product_type_name',
    })
    expect(UBER_STARTED_AT_FALLBACK).toBe('request_timestamp_local')
  })

  it('requires core trip headers from Uber export', () => {
    expect(uber!.requiredHeaders).toEqual(
      expect.arrayContaining([
        'begintrip_timestamp_local',
        'dropoff_timestamp_local',
        'fare_amount',
        'currency_code',
        'begintrip_address',
        'dropoff_address',
        'trip_distance_miles',
        'status',
      ]),
    )
  })

  it('matches Rider/trips_data paths and ignores Eats', () => {
    expect(uber!.pathPatterns.some(re => re.test('Rider/trips_data-0.csv'))).toBe(
      true,
    )
    expect(
      uber!.ignorePathPatterns.some(re => re.test('Eats/user_orders-0.csv')),
    ).toBe(true)
  })
})

describe('matchProvider with Uber fingerprint', () => {
  const headers = headersFromFixture()

  it('matches fixture headers with high confidence', () => {
    const result = matchProvider({
      path: 'Rider/trips_data-0.csv',
      headers,
    })
    expect(result.provider).toBe('uber')
    expect(result.fingerprint?.id).toBe('uber')
    expect(result.confidence).toBeGreaterThanOrEqual(0.9)
  })
})
