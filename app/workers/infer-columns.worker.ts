import type { CanonicalField } from '#shared/constants/providers'
import { inferColumnsFromHeaders } from '#shared/lib/infer-columns-heuristic'
import { matchProvider } from '#shared/lib/match-provider'
import type { ColumnMapping, ParsedTable } from '#shared/types/import'

type InferColumnsMessage = {
  type: 'infer'
  path: string
  table: ParsedTable
}

type InferColumnsResultMessage = {
  type: 'infer-result'
  provider: ReturnType<typeof matchProvider>['provider']
  mappings: ColumnMapping[]
  confidence: number
  columnMap: Partial<Record<CanonicalField, string>>
}

type ErrorMessage = { type: 'error'; message: string }

type OutMessage = InferColumnsResultMessage | ErrorMessage

const FINGERPRINT_MAPPING_CONFIDENCE = 0.95

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase()
}

function buildMappingsFromColumnMap(
  headers: string[],
  columnMap: Partial<Record<CanonicalField, string>>,
  confidence: number,
): ColumnMapping[] {
  const normalized = headers.map(normalizeHeader)
  const mappings: ColumnMapping[] = []

  for (const field of Object.keys(columnMap) as CanonicalField[]) {
    const headerName = columnMap[field]
    if (!headerName) continue
    const columnIndex = normalized.indexOf(normalizeHeader(headerName))
    if (columnIndex >= 0) {
      mappings.push({ field, columnIndex, confidence })
    }
  }

  return mappings
}

function postError(message: string) {
  const out: ErrorMessage = { type: 'error', message }
  self.postMessage(out)
}

self.onmessage = (event: MessageEvent<InferColumnsMessage>) => {
  const msg = event.data
  if (msg.type !== 'infer') {
    postError(`Unknown message type: ${(msg as { type: string }).type}`)
    return
  }

  try {
    const { provider, fingerprint, confidence: matchConfidence } = matchProvider({
      path: msg.path,
      headers: msg.table.headers,
    })

    let mappings: ColumnMapping[]
    let confidence: number
    let columnMap: Partial<Record<CanonicalField, string>>

    if (fingerprint?.columnMap && Object.keys(fingerprint.columnMap).length > 0) {
      columnMap = fingerprint.columnMap
      mappings = buildMappingsFromColumnMap(
        msg.table.headers,
        columnMap,
        FINGERPRINT_MAPPING_CONFIDENCE,
      )
      confidence = FINGERPRINT_MAPPING_CONFIDENCE
    } else {
      const inferred = inferColumnsFromHeaders(msg.table.headers)
      mappings = inferred.mappings
      confidence = inferred.confidence
      columnMap = Object.fromEntries(
        mappings.map(m => [m.field, msg.table.headers[m.columnIndex] ?? '']),
      ) as Partial<Record<CanonicalField, string>>
    }

    if (provider === 'unknown' && matchConfidence === 0) {
      confidence = Math.min(confidence, matchConfidence)
    }

    const out: InferColumnsResultMessage = {
      type: 'infer-result',
      provider,
      mappings,
      confidence,
      columnMap,
    }
    self.postMessage(out)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to infer columns'
    postError(message)
  }
}

export type {
  InferColumnsMessage,
  InferColumnsResultMessage,
  ErrorMessage,
  OutMessage,
}
