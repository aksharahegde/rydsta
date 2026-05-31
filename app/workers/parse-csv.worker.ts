import { decodeUtf8 } from '#shared/lib/parse-helpers'
import { parseCsvToTable } from '#shared/lib/parse-csv'
import type { ParsedTable } from '#shared/types/import'

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

  if (!(msg.data instanceof Uint8Array)) {
    postError('Invalid payload: data must be Uint8Array')
    return
  }

  try {
    const text = decodeUtf8(msg.data)
    const table = parseCsvToTable(text, msg.path)

    const out: ParseCsvResultMessage = { type: 'parse-csv-result', table }
    self.postMessage(out)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to parse CSV'
    postError(message)
  }
}

export type { ParseCsvMessage, ParseCsvResultMessage, ErrorMessage, OutMessage }
