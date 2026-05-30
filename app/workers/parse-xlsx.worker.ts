import * as XLSX from 'xlsx'
import type { ParsedTable } from '#shared/types/import'
import { fileNodeFromPath } from '#shared/lib/parse-helpers'

type ParseXlsxMessage = {
  type: 'parse-xlsx'
  path: string
  data: Uint8Array
}

type ParseXlsxResultMessage = {
  type: 'parse-xlsx-result'
  table: ParsedTable
}

type ErrorMessage = { type: 'error'; message: string }

type OutMessage = ParseXlsxResultMessage | ErrorMessage

function postError(message: string) {
  const out: ErrorMessage = { type: 'error', message }
  self.postMessage(out)
}

self.onmessage = (event: MessageEvent<ParseXlsxMessage>) => {
  const msg = event.data
  if (msg.type !== 'parse-xlsx') {
    postError(`Unknown message type: ${(msg as { type: string }).type}`)
    return
  }

  try {
    const workbook = XLSX.read(msg.data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    if (!sheetName) {
      postError('Workbook has no sheets')
      return
    }

    const sheet = workbook.Sheets[sheetName]
    const grid = XLSX.utils.sheet_to_json<string[]>(sheet, {
      header: 1,
      defval: '',
      raw: false,
    })

    const headers = (grid[0] ?? []).map(cell => String(cell ?? ''))
    const rows = grid.slice(1).map(row =>
      headers.map((_, index) => String(row[index] ?? '')),
    )

    const table: ParsedTable = {
      headers,
      rows,
      source: fileNodeFromPath(msg.path),
    }

    const out: ParseXlsxResultMessage = { type: 'parse-xlsx-result', table }
    self.postMessage(out)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse XLSX'
    postError(message)
  }
}

export type { ParseXlsxMessage, ParseXlsxResultMessage, ErrorMessage, OutMessage }
