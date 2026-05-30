import Papa from 'papaparse'
import type { ParsedTable } from '#shared/types/import'
import { decodeUtf8, fileNodeFromPath } from '#shared/lib/parse-helpers'

type ParseCsvMessage = {
  type: 'parse-csv'
  path: string
  data: Uint8Array
}

type ParseCsvResultMessage = {
  type: 'parse-csv-result'
  table: ParsedTable
}

type ErrorMessage = { type: 'error'; message: string }

type OutMessage = ParseCsvResultMessage | ErrorMessage

function postError(message: string) {
  const out: ErrorMessage = { type: 'error', message }
  self.postMessage(out)
}

self.onmessage = (event: MessageEvent<ParseCsvMessage>) => {
  const msg = event.data
  if (msg.type !== 'parse-csv') {
    postError(`Unknown message type: ${(msg as { type: string }).type}`)
    return
  }

  try {
    const text = decodeUtf8(msg.data)
    const parsed = Papa.parse<Record<string, string>>(text, {
      header: true,
      skipEmptyLines: true,
    })

    if (parsed.errors.length > 0) {
      postError(parsed.errors[0]?.message ?? 'CSV parse failed')
      return
    }

    const headers = (parsed.meta.fields ?? []).map(String)
    const rows = parsed.data.map(row =>
      headers.map(header => String(row[header] ?? '')),
    )

    const table: ParsedTable = {
      headers,
      rows,
      source: fileNodeFromPath(msg.path),
    }

    const out: ParseCsvResultMessage = { type: 'parse-csv-result', table }
    self.postMessage(out)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse CSV'
    postError(message)
  }
}

export type { ParseCsvMessage, ParseCsvResultMessage, ErrorMessage, OutMessage }
