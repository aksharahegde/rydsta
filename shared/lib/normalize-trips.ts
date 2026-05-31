import {
  MILES_TO_KM,
  UBER_STARTED_AT_FALLBACK,
  UBER_TRIP_START_HEADERS,
  type CanonicalField,
  type RideProvider,
} from '../constants/providers'
import type { ColumnMapping, ParsedTable } from '../types/import'
import type { Trip } from '../types/trip'

function cellAt(row: string[], mappings: ColumnMapping[], field: CanonicalField): string {
  const mapping = mappings.find(m => m.field === field)
  if (!mapping) return ''
  return (row[mapping.columnIndex] ?? '').trim()
}

function headerIndex(headers: string[], name: string): number {
  const target = name.trim().toLowerCase()
  return headers.findIndex(h => h.trim().toLowerCase() === target)
}

export function parseDate(value: string): Date | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  const normalized = trimmed.includes('T') ? trimmed : trimmed.replace(' ', 'T')
  const date = new Date(normalized)
  return Number.isNaN(date.getTime()) ? null : date
}

export function parseNumber(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null
  const n = Number(trimmed)
  return Number.isFinite(n) ? n : null
}

export function parseLatitude(value: string): number | null {
  const n = parseNumber(value)
  if (n === null || n < -90 || n > 90) return null
  return n
}

export function parseLongitude(value: string): number | null {
  const n = parseNumber(value)
  if (n === null || n < -180 || n > 180) return null
  return n
}

const UBER_DROPOFF_LAT_HEADERS = ['dropoff_lat', 'destination_lat'] as const
const UBER_DROPOFF_LNG_HEADERS = ['dropoff_lng', 'destination_lng'] as const

function resolveCoordinates(
  row: string[],
  table: ParsedTable,
  mappings: ColumnMapping[],
  provider: RideProvider,
): {
  pickupLat: number | null
  pickupLng: number | null
  dropoffLat: number | null
  dropoffLng: number | null
} {
  let pickupLat = parseLatitude(cellAt(row, mappings, 'pickupLat'))
  let pickupLng = parseLongitude(cellAt(row, mappings, 'pickupLng'))
  let dropoffLat = parseLatitude(cellAt(row, mappings, 'dropoffLat'))
  let dropoffLng = parseLongitude(cellAt(row, mappings, 'dropoffLng'))

  if (provider === 'uber') {
    if (dropoffLat === null) {
      dropoffLat = parseLatitude(
        firstNonEmptyCell(row, table.headers, UBER_DROPOFF_LAT_HEADERS),
      )
    }
    if (dropoffLng === null) {
      dropoffLng = parseLongitude(
        firstNonEmptyCell(row, table.headers, UBER_DROPOFF_LNG_HEADERS),
      )
    }
  }

  const hasPickup = pickupLat !== null && pickupLng !== null
  const hasDropoff = dropoffLat !== null && dropoffLng !== null

  if (!hasPickup || !hasDropoff) {
    return {
      pickupLat: null,
      pickupLng: null,
      dropoffLat: null,
      dropoffLng: null,
    }
  }

  return { pickupLat, pickupLng, dropoffLat, dropoffLng }
}

function isMilesColumn(headers: string[], columnIndex: number): boolean {
  const header = (headers[columnIndex] ?? '').toLowerCase()
  return header.includes('mile')
}

function firstNonEmptyCell(
  row: string[],
  headers: string[],
  headerNames: readonly string[],
): string {
  for (const name of headerNames) {
    const idx = headerIndex(headers, name)
    if (idx < 0) continue
    const value = (row[idx] ?? '').trim()
    if (value) return value
  }
  return ''
}

function resolveStartedAt(
  row: string[],
  table: ParsedTable,
  mappings: ColumnMapping[],
  provider: RideProvider,
): Date | null {
  let raw = cellAt(row, mappings, 'startedAt')
  if (!raw && provider === 'uber') {
    raw = firstNonEmptyCell(row, table.headers, UBER_TRIP_START_HEADERS)
    if (!raw) {
      raw = firstNonEmptyCell(row, table.headers, [UBER_STARTED_AT_FALLBACK])
    }
  }
  return parseDate(raw)
}

function shouldSkipRow(
  row: string[],
  table: ParsedTable,
  mappings: ColumnMapping[],
): boolean {
  const status = cellAt(row, mappings, 'status').toLowerCase()
  if (status.includes('cancel')) return true

  const isCompletedIdx = headerIndex(table.headers, 'is_completed')
  if (isCompletedIdx >= 0) {
    const val = (row[isCompletedIdx] ?? '').trim().toLowerCase()
    if (val === 'false') return true
  }

  return false
}

function distanceKmFromRow(
  row: string[],
  table: ParsedTable,
  mappings: ColumnMapping[],
): number | null {
  const mapping = mappings.find(m => m.field === 'distanceKm')
  if (!mapping) return null

  const raw = (row[mapping.columnIndex] ?? '').trim()
  const miles = parseNumber(raw)
  if (miles === null) return null

  if (isMilesColumn(table.headers, mapping.columnIndex)) {
    return miles * MILES_TO_KM
  }
  return miles
}

export function normalizeTrips(
  table: ParsedTable,
  provider: RideProvider,
  mappings: ColumnMapping[],
  path: string,
): Trip[] {
  const trips: Trip[] = []

  for (const row of table.rows) {
    if (shouldSkipRow(row, table, mappings)) continue

    const startedAt = resolveStartedAt(row, table, mappings, provider)
    if (!startedAt) continue

    const endedAtRaw = cellAt(row, mappings, 'endedAt')
    const endedAt = endedAtRaw ? parseDate(endedAtRaw) : null
    const coords = resolveCoordinates(row, table, mappings, provider)

    trips.push({
      provider,
      startedAt,
      endedAt,
      pickup: cellAt(row, mappings, 'pickup') || null,
      dropoff: cellAt(row, mappings, 'dropoff') || null,
      ...coords,
      fare: parseNumber(cellAt(row, mappings, 'fare')),
      currency: cellAt(row, mappings, 'currency') || null,
      distanceKm: distanceKmFromRow(row, table, mappings),
      status: cellAt(row, mappings, 'status') || null,
      vehicleType: cellAt(row, mappings, 'vehicleType') || null,
      sourceFile: path,
    })
  }

  return trips
}
