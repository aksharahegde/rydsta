import {
  MILES_TO_KM,
  UBER_STARTED_AT_FALLBACK,
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

function isMilesColumn(headers: string[], columnIndex: number): boolean {
  const header = (headers[columnIndex] ?? '').toLowerCase()
  return header.includes('mile')
}

function resolveStartedAt(
  row: string[],
  table: ParsedTable,
  mappings: ColumnMapping[],
  provider: RideProvider,
): Date | null {
  let raw = cellAt(row, mappings, 'startedAt')
  if (!raw && provider === 'uber') {
    const fallbackIdx = headerIndex(table.headers, UBER_STARTED_AT_FALLBACK)
    if (fallbackIdx >= 0) {
      raw = (row[fallbackIdx] ?? '').trim()
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

    trips.push({
      provider,
      startedAt,
      endedAt,
      pickup: cellAt(row, mappings, 'pickup') || null,
      dropoff: cellAt(row, mappings, 'dropoff') || null,
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
