import { describe, it, expect } from 'vitest'
import { isTripFile, matchProvider } from '../../shared/lib/match-provider'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Papa from 'papaparse'

const fixturePath = resolve(
  import.meta.dirname,
  '../fixtures/uber-rider-trips-sample.csv',
)

function headersFromFixture(): string[] {
  const text = readFileSync(fixturePath, 'utf8')
  const parsed = Papa.parse<string[]>(text, { preview: 1 })
  return (parsed.data[0] ?? []).map(String)
}

describe('matchProvider (Uber)', () => {
  const headers = headersFromFixture()

  it('matches Rider/trips_data path with high confidence', () => {
    const result = matchProvider({
      path: 'Rider/trips_data-0.csv',
      headers,
    })
    expect(result.provider).toBe('uber')
    expect(result.confidence).toBeGreaterThanOrEqual(0.9)
    expect(result.fingerprint?.columnMap.fare).toBe('fare_amount')
  })

  it('ignores Eats orders file', () => {
    expect(
      isTripFile({ path: 'Eats/user_orders-0.csv', headers: ['Order_Price'] }),
    ).toBe(false)
  })

  it('ignores rider analytics', () => {
    expect(
      isTripFile({
        path: 'Rider/rider_app_analytics-0.csv',
        headers: ['Latitude'],
      }),
    ).toBe(false)
  })
})
