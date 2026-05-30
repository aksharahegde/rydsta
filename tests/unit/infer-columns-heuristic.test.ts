import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Papa from 'papaparse'
import {
  inferColumnsFromHeaders,
  REQUIRED_CANONICAL_FIELDS,
} from '../../shared/lib/infer-columns-heuristic'

const fixturePath = resolve(
  import.meta.dirname,
  '../fixtures/uber-rider-trips-sample.csv',
)

function headersFromFixture(): string[] {
  const text = readFileSync(fixturePath, 'utf8')
  const parsed = Papa.parse<string[]>(text, { preview: 1 })
  return (parsed.data[0] ?? []).map(String)
}

function mappingFor(
  mappings: ReturnType<typeof inferColumnsFromHeaders>['mappings'],
  field: string,
) {
  return mappings.find(m => m.field === field)
}

describe('inferColumnsFromHeaders', () => {
  it('maps Uber fixture headers with full required-field confidence', () => {
    const headers = headersFromFixture()
    const { mappings, confidence } = inferColumnsFromHeaders(headers)

    expect(confidence).toBe(1)
    expect(mappingFor(mappings, 'startedAt')?.columnIndex).toBe(
      headers.indexOf('begintrip_timestamp_local'),
    )
    expect(mappingFor(mappings, 'endedAt')?.columnIndex).toBe(
      headers.indexOf('dropoff_timestamp_local'),
    )
    expect(mappingFor(mappings, 'pickup')?.columnIndex).toBe(
      headers.indexOf('begintrip_address'),
    )
    expect(mappingFor(mappings, 'dropoff')?.columnIndex).toBe(
      headers.indexOf('dropoff_address'),
    )
    expect(mappingFor(mappings, 'fare')?.columnIndex).toBe(
      headers.indexOf('fare_amount'),
    )
    expect(mappingFor(mappings, 'currency')?.columnIndex).toBe(
      headers.indexOf('currency_code'),
    )
    expect(mappingFor(mappings, 'distanceKm')?.columnIndex).toBe(
      headers.indexOf('trip_distance_miles'),
    )
    expect(mappingFor(mappings, 'status')?.columnIndex).toBe(
      headers.indexOf('status'),
    )
    expect(mappingFor(mappings, 'vehicleType')?.columnIndex).toBe(
      headers.indexOf('product_type_name'),
    )
  })

  it('scores synonym includes matches for human-readable headers', () => {
    const headers = ['Start Time', 'Trip Fare', 'From', 'To']
    const { mappings, confidence } = inferColumnsFromHeaders(headers)

    expect(mappingFor(mappings, 'startedAt')?.columnIndex).toBe(0)
    expect(mappingFor(mappings, 'fare')?.columnIndex).toBe(1)
    expect(mappingFor(mappings, 'pickup')?.columnIndex).toBe(2)
    expect(mappingFor(mappings, 'dropoff')?.columnIndex).toBe(3)
    expect(confidence).toBe(4 / REQUIRED_CANONICAL_FIELDS.length)
  })

  it('returns low confidence when required fields are missing', () => {
    const { mappings, confidence } = inferColumnsFromHeaders(['notes', 'id'])

    expect(mappings).toHaveLength(0)
    expect(confidence).toBe(0)
  })
})
