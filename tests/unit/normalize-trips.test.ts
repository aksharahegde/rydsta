import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import Papa from 'papaparse'
import {
  PROVIDER_FINGERPRINTS,
  type CanonicalField,
} from '../../shared/constants/providers'
import { normalizeTrips } from '../../shared/lib/normalize-trips'
import { tripsWithCoordinates } from '../../shared/lib/trip-map-playback'
import type { ColumnMapping, ParsedTable } from '../../shared/types/import'

const fixturePath = resolve(
  import.meta.dirname,
  '../fixtures/uber-rider-trips-sample.csv',
)

function parseFixtureTable(): ParsedTable {
  const text = readFileSync(fixturePath, 'utf8')
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
  })
  const headers = (parsed.meta.fields ?? []).map(String)
  const rows = parsed.data.map(row =>
    headers.map(header => String(row[header] ?? '')),
  )
  return {
    headers,
    rows,
    source: { path: 'Rider/trips_data-0.csv', name: 'trips_data-0.csv', kind: 'csv' },
  }
}

function mappingsFromUberFingerprint(headers: string[]): ColumnMapping[] {
  const uber = PROVIDER_FINGERPRINTS.find(fp => fp.id === 'uber')!
  const normalized = headers.map(h => h.trim().toLowerCase())
  const confidence = 0.95

  return (Object.entries(uber.columnMap) as [CanonicalField, string][]).flatMap(
    ([field, headerName]) => {
      const columnIndex = normalized.indexOf(headerName.toLowerCase())
      if (columnIndex < 0) return []
      return [{ field, columnIndex, confidence }]
    },
  )
}

describe('normalizeTrips', () => {
  it('normalizes Uber fixture into two completed trips', () => {
    const table = parseFixtureTable()
    const mappings = mappingsFromUberFingerprint(table.headers)
    const trips = normalizeTrips(
      table,
      'uber',
      mappings,
      'Rider/trips_data-0.csv',
    )

    expect(trips).toHaveLength(2)
    expect(trips.every(t => t.provider === 'uber')).toBe(true)

    const fareSum = trips.reduce((sum, t) => sum + (t.fare ?? 0), 0)
    expect(fareSum).toBeCloseTo(1175.5, 2)

    expect(trips[0]?.fare).toBeCloseTo(285.5, 2)
    expect(trips[1]?.fare).toBeCloseTo(890, 2)
    expect(trips[0]?.currency).toBe('INR')
    expect(trips[0]?.status).toBe('completed')
    expect(trips[0]?.city).toBe('Bengaluru')
    expect(trips[0]?.pickup).toBe('Koramangala 5th Block')
    expect(trips[0]?.distanceKm).toBeCloseTo(4.2 * 1.60934, 4)
    expect(trips[0]?.pickupLat).toBeCloseTo(12.97, 2)
    expect(trips[0]?.pickupLng).toBeCloseTo(77.59, 2)
    expect(trips[0]?.dropoffLat).toBeCloseTo(12.95, 2)
    expect(trips[0]?.dropoffLng).toBeCloseTo(77.67, 2)
    expect(tripsWithCoordinates(trips)).toHaveLength(2)
  })

  it('leaves coordinates null when lat/lng columns are absent', () => {
    const table = parseFixtureTable()
    const headers = table.headers.filter(
      h =>
        ![
          'begintrip_lat',
          'begintrip_lng',
          'dropoff_lat',
          'dropoff_lng',
          'destination_lat',
          'destination_lng',
        ].includes(h),
    )
    const dropIndices = new Set(
      table.headers
        .map((h, i) =>
          [
            'begintrip_lat',
            'begintrip_lng',
            'dropoff_lat',
            'dropoff_lng',
            'destination_lat',
            'destination_lng',
          ].includes(h)
            ? i
            : -1,
        )
        .filter(i => i >= 0),
    )
    const rows = table.rows.map(row =>
      row.filter((_, i) => !dropIndices.has(i)),
    )
    const mappings = mappingsFromUberFingerprint(headers).filter(
      m => !m.field.endsWith('Lat') && !m.field.endsWith('Lng'),
    )
    const trips = normalizeTrips(
      { ...table, headers, rows },
      'uber',
      mappings,
      'Rider/trips_data-0.csv',
    )

    expect(trips.length).toBeGreaterThan(0)
    expect(trips[0]?.pickupLat).toBeNull()
    expect(trips[0]?.dropoffLng).toBeNull()
  })

  it('uses begintrip_timestamp_utc when local begintrip is empty', () => {
    const table = parseFixtureTable()
    const mappings = mappingsFromUberFingerprint(table.headers)
    const row = [...table.rows[0]!]
    const beginLocalIdx = table.headers.indexOf('begintrip_timestamp_local')
    const beginUtcIdx = table.headers.indexOf('begintrip_timestamp_utc')
    row[beginLocalIdx] = ''
    row[beginUtcIdx] = '2019-06-10 14:30:00'

    const trips = normalizeTrips(
      { ...table, rows: [row] },
      'uber',
      mappings,
      'Rider/trips_data-0.csv',
    )

    expect(trips).toHaveLength(1)
    expect(trips[0]?.startedAt.getFullYear()).toBe(2019)
  })

  it('uses request_timestamp_local when all begintrip columns are empty', () => {
    const table = parseFixtureTable()
    const mappings = mappingsFromUberFingerprint(table.headers)
    const row = [...table.rows[0]!]
    const beginLocalIdx = table.headers.indexOf('begintrip_timestamp_local')
    const beginUtcIdx = table.headers.indexOf('begintrip_timestamp_utc')
    row[beginLocalIdx] = ''
    row[beginUtcIdx] = ''

    const trips = normalizeTrips(
      { ...table, rows: [row] },
      'uber',
      mappings,
      'Rider/trips_data-0.csv',
    )

    expect(trips).toHaveLength(1)
    expect(trips[0]?.startedAt).toEqual(new Date('2025-03-01T08:00:00'))
  })

  it('skips cancelled rows', () => {
    const table = parseFixtureTable()
    const mappings = mappingsFromUberFingerprint(table.headers)
    const row = [...table.rows[0]!]
    const statusIdx = table.headers.indexOf('status')
    row[statusIdx] = 'cancelled'

    const trips = normalizeTrips(
      { ...table, rows: [row] },
      'uber',
      mappings,
      'Rider/trips_data-0.csv',
    )

    expect(trips).toHaveLength(0)
  })
})
