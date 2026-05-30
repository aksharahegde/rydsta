import { normalizeTrips } from '#shared/lib/normalize-trips'
import { mergeTrips } from '#shared/lib/trip-dedupe'
import type { CanonicalField, ColumnMapping } from '#shared/types/import'

export const CANONICAL_FIELDS: CanonicalField[] = [
  'startedAt',
  'endedAt',
  'pickup',
  'dropoff',
  'fare',
  'currency',
  'distanceKm',
  'status',
  'vehicleType',
]

export type ColumnMapOverrides = Partial<Record<CanonicalField, string>>

function buildMappings(
  headers: string[],
  overrides: ColumnMapOverrides,
  defaults: ColumnMapping[],
): ColumnMapping[] {
  const mappings: ColumnMapping[] = []

  for (const field of CANONICAL_FIELDS) {
    const selectedHeader = overrides[field]
    if (selectedHeader) {
      const columnIndex = headers.indexOf(selectedHeader)
      if (columnIndex >= 0) {
        mappings.push({ field, columnIndex, confidence: 1 })
        continue
      }
    }

    const fallback = defaults.find(m => m.field === field)
    if (fallback) mappings.push(fallback)
  }

  return mappings
}

export function useColumnMap() {
  const { pendingMapping, trips } = useRideImport()

  function applyMapping(overrides: ColumnMapOverrides) {
    const pending = pendingMapping.value
    if (!pending) return

    const mappings = buildMappings(
      pending.table.headers,
      overrides,
      pending.mappings,
    )
    const normalized = normalizeTrips(
      pending.table,
      pending.provider,
      mappings,
      pending.path,
    )
    trips.value = mergeTrips(trips.value, normalized)
    pendingMapping.value = null
  }

  return { applyMapping, pendingMapping }
}
