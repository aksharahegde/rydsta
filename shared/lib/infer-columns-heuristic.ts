import { COLUMN_SYNONYMS } from '../constants/column-synonyms'
import type { CanonicalField } from '../constants/providers'
import type { ColumnMapping } from '../types/import'

/** Fields required for a usable trip import (aligned with Uber fingerprint). */
export const REQUIRED_CANONICAL_FIELDS: CanonicalField[] = [
  'startedAt',
  'endedAt',
  'pickup',
  'dropoff',
  'fare',
  'currency',
  'distanceKm',
  'status',
]

const CANONICAL_FIELDS = Object.keys(COLUMN_SYNONYMS) as CanonicalField[]

function normalize(value: string): string {
  return value.trim().toLowerCase().replace(/[_\s]+/g, ' ')
}

/** 1 = exact normalized match; 0.85 = substring match; 0 = no match. */
function synonymMatchScore(header: string, synonym: string): number {
  const h = normalize(header)
  const s = normalize(synonym)
  if (h === s) return 1
  if (s.length >= 3 && h.includes(s)) return 0.85
  if (h.length >= 3 && s.includes(h)) return 0.85
  return 0
}

export function inferColumnsFromHeaders(headers: string[]): {
  mappings: ColumnMapping[]
  confidence: number
} {
  const mappings: ColumnMapping[] = []

  for (const field of CANONICAL_FIELDS) {
    const synonyms = COLUMN_SYNONYMS[field]
    let bestScore = 0
    let bestIndex = -1
    let bestSynonymRank = Number.POSITIVE_INFINITY

    for (let columnIndex = 0; columnIndex < headers.length; columnIndex++) {
      for (let synonymRank = 0; synonymRank < synonyms.length; synonymRank++) {
        const score = synonymMatchScore(
          headers[columnIndex] ?? '',
          synonyms[synonymRank]!,
        )
        const isBetter =
          score > bestScore ||
          (score === bestScore &&
            score > 0 &&
            synonymRank < bestSynonymRank)
        if (isBetter) {
          bestScore = score
          bestIndex = columnIndex
          bestSynonymRank = synonymRank
        }
      }
    }

    if (bestScore > 0 && bestIndex >= 0) {
      mappings.push({
        field,
        columnIndex: bestIndex,
        confidence: bestScore,
      })
    }
  }

  const mappedRequired = REQUIRED_CANONICAL_FIELDS.filter(required =>
    mappings.some(m => m.field === required),
  ).length

  const confidence =
    REQUIRED_CANONICAL_FIELDS.length === 0
      ? 0
      : mappedRequired / REQUIRED_CANONICAL_FIELDS.length

  return { mappings, confidence }
}
