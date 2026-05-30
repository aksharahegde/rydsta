import UnzipWorker from '~/workers/unzip.worker?worker'
import ParseCsvWorker from '~/workers/parse-csv.worker?worker'
import ParseXlsxWorker from '~/workers/parse-xlsx.worker?worker'
import InferColumnsWorker from '~/workers/infer-columns.worker?worker'
import { isSpreadsheetPath } from '#shared/lib/parse-helpers'
import { isTripFile } from '#shared/lib/match-provider'
import { shouldSkipSpreadsheet } from '#shared/lib/should-skip-spreadsheet'
import { normalizeTrips } from '#shared/lib/normalize-trips'
import { mergeTrips } from '#shared/lib/trip-dedupe'
import type { ColumnMapping, ParsedTable } from '#shared/types/import'
import type { RideProvider } from '#shared/types/trip'
import type { Trip } from '#shared/types/trip'
import type { UnzipResultMessage } from '~/workers/unzip.worker'
import type { ParseCsvResultMessage } from '~/workers/parse-csv.worker'
import type { ParseXlsxResultMessage } from '~/workers/parse-xlsx.worker'
import type { InferColumnsResultMessage } from '~/workers/infer-columns.worker'

export const CONFIDENCE_THRESHOLD = 0.85

const MAX_ZIP_BYTES = 50 * 1024 * 1024
const MAX_FILE_BYTES = 20 * 1024 * 1024

type SpreadsheetEntry = { path: string; data: Uint8Array }

export type PendingImport = {
  table: ParsedTable
  path: string
  provider: RideProvider
  mappings: ColumnMapping[]
}

type WorkerError = { type: 'error'; message: string }

function isWorkerError(data: unknown): data is WorkerError {
  return (
    typeof data === 'object'
    && data !== null
    && 'type' in data
    && (data as WorkerError).type === 'error'
  )
}

function runWorker<TMessage, TResult>(
  WorkerCtor: new () => Worker,
  message: TMessage,
): Promise<TResult> {
  return new Promise((resolve, reject) => {
    const worker = new WorkerCtor()
    worker.onmessage = (event: MessageEvent<unknown>) => {
      const data = event.data
      worker.terminate()
      if (isWorkerError(data)) {
        reject(new Error(data.message))
        return
      }
      resolve(data as TResult)
    }
    worker.onerror = () => {
      worker.terminate()
      reject(new Error('Worker failed'))
    }
    worker.postMessage(message)
  })
}

async function unzipArchive(buffer: ArrayBuffer) {
  const result = await runWorker<{ type: 'unzip'; buffer: ArrayBuffer }, UnzipResultMessage>(
    UnzipWorker,
    { type: 'unzip', buffer },
  )
  return result.files
}

async function parseSpreadsheet(path: string, data: Uint8Array): Promise<ParsedTable> {
  const lower = path.toLowerCase()
  if (lower.endsWith('.csv')) {
    const result = await runWorker<
      { type: 'parse-csv'; path: string; data: Uint8Array },
      ParseCsvResultMessage
    >(ParseCsvWorker, { type: 'parse-csv', path, data })
    return result.table
  }
  if (lower.endsWith('.xlsx')) {
    const result = await runWorker<
      { type: 'parse-xlsx'; path: string; data: Uint8Array },
      ParseXlsxResultMessage
    >(ParseXlsxWorker, { type: 'parse-xlsx', path, data })
    return result.table
  }
  throw new Error(`Unsupported file type: ${path}`)
}

async function inferColumns(path: string, table: ParsedTable) {
  return runWorker<
    { type: 'infer'; path: string; table: ParsedTable },
    InferColumnsResultMessage
  >(InferColumnsWorker, { type: 'infer', path, table })
}

async function expandFiles(files: File[]): Promise<SpreadsheetEntry[]> {
  const spreadsheets: SpreadsheetEntry[] = []

  for (const file of files) {
    const lower = file.name.toLowerCase()

    if (lower.endsWith('.zip')) {
      if (file.size > MAX_ZIP_BYTES) {
        throw new Error('Zip file is too large (max 50 MB).')
      }
      const buffer = await file.arrayBuffer()
      const unzipped = await unzipArchive(buffer)
      spreadsheets.push(...unzipped)
      continue
    }

    if (!isSpreadsheetPath(file.name)) continue

    if (file.size > MAX_FILE_BYTES) {
      throw new Error('File is too large (max 20 MB).')
    }

    spreadsheets.push({
      path: file.name,
      data: new Uint8Array(await file.arrayBuffer()),
    })
  }

  return spreadsheets
}

export function useRideImport() {
  const progress = ref(0)
  const error = ref<string | null>(null)
  const trips = useState<Trip[]>('ride-trips', () => [])
  const pendingMapping = useState<PendingImport | null>('ride-pending-import', () => null)
  const importConfidence = useState<number>('ride-import-confidence', () => 0)

  async function ingest(files: File[]) {
    if (!import.meta.client) {
      throw new Error('useRideImport.ingest must run on the client')
    }

    error.value = null
    progress.value = 0
    trips.value = []
    pendingMapping.value = null
    importConfidence.value = 0

    if (files.length === 0) return

    try {
      const spreadsheets = await expandFiles(files)
      progress.value = 15

      if (spreadsheets.length === 0) {
        error.value = 'No trip files found—try your app’s trip export.'
        return
      }

      const tripTables: { path: string; table: ParsedTable }[] = []
      const toParse = spreadsheets.filter(entry => !shouldSkipSpreadsheet(entry.path))
      const parseTotal = toParse.length || 1

      for (let i = 0; i < toParse.length; i++) {
        const entry = toParse[i]!
        const table = await parseSpreadsheet(entry.path, entry.data)
        if (isTripFile({ path: entry.path, headers: table.headers })) {
          tripTables.push({ path: entry.path, table })
        }
        progress.value = 15 + Math.round(((i + 1) / parseTotal) * 35)
      }

      if (toParse.length === 0) {
        error.value = 'No trip files found—try your app’s trip export.'
        return
      }

      if (tripTables.length === 0) {
        error.value = 'No trip files found—try your app’s trip export.'
        return
      }

      let minConfidence = 1

      for (let i = 0; i < tripTables.length; i++) {
        const { path, table } = tripTables[i]!
        const inferred = await inferColumns(path, table)
        minConfidence = Math.min(minConfidence, inferred.confidence)

        if (inferred.confidence >= CONFIDENCE_THRESHOLD) {
          const normalized = normalizeTrips(
            table,
            inferred.provider,
            inferred.mappings,
            path,
          )
          trips.value = mergeTrips(trips.value, normalized)
        } else if (!pendingMapping.value) {
          pendingMapping.value = {
            table,
            path,
            provider: inferred.provider,
            mappings: inferred.mappings,
          }
        }

        progress.value = 50 + Math.round(((i + 1) / tripTables.length) * 50)
      }

      importConfidence.value = minConfidence
      progress.value = 100

      if (trips.value.length === 0 && !pendingMapping.value) {
        error.value = 'No trips could be parsed from your files.'
      }
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Import failed'
      progress.value = 0
    }
  }

  return {
    progress,
    error,
    trips,
    pendingMapping,
    importConfidence,
    ingest,
  }
}
