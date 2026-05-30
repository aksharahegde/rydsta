import Papa from 'papaparse'
import type { ParseError } from 'papaparse'
import type { ParsedTable } from '../types/import'
import { fileNodeFromPath } from './parse-helpers'

const DELIMITER_CANDIDATES = [',', ';', '\t'] as const

export function stripBom(text: string): string {
  return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text
}

/** First non-empty line used to pick delimiter (avoids Papa UndetectableDelimiter). */
export function detectCsvDelimiter(text: string): string {
  const line =
    text.split(/\r\n|\n|\r/).find(l => l.trim().length > 0) ?? ''

  let best: string = ','
  let bestCount = -1

  for (const delim of DELIMITER_CANDIDATES) {
    let count = 0
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') {
        inQuotes = !inQuotes
      } else if (!inQuotes && ch === delim) {
        count++
      }
    }
    if (count > bestCount) {
      bestCount = count
      best = delim
    }
  }

  return best
}

export function isIgnorablePapaError(err: ParseError): boolean {
  return err.type === 'Delimiter' && err.code === 'UndetectableDelimiter'
}

export function getFatalPapaErrors(errors: ParseError[]): ParseError[] {
  return errors.filter(e => !isIgnorablePapaError(e))
}

export function parseCsvToTable(text: string, path: string): ParsedTable {
  const normalized = stripBom(text)
  const delimiter = detectCsvDelimiter(normalized)

  const parsed = Papa.parse<Record<string, string>>(normalized, {
    header: true,
    skipEmptyLines: true,
    delimiter,
  })

  const fatal = getFatalPapaErrors(parsed.errors)
  if (fatal.length > 0) {
    throw new Error(fatal[0]?.message ?? 'CSV parse failed')
  }

  const headers = (parsed.meta.fields ?? []).map(String)
  const rows = parsed.data.map(row =>
    headers.map(header => String(row[header] ?? '')),
  )

  return {
    headers,
    rows,
    source: fileNodeFromPath(path),
  }
}
