import { unzipSync } from 'fflate'
import { isSpreadsheetPath } from '#shared/lib/parse-helpers'

// 200 MB uncompressed cap — guards against zip-bomb decompression attacks
const MAX_UNCOMPRESSED_BYTES = 200 * 1024 * 1024
// 100:1 compression ratio ceiling per entry
const MAX_COMPRESSION_RATIO = 100

type UnzipMessage = { type: 'unzip'; buffer: ArrayBuffer }

type UnzipResultMessage = {
  type: 'unzip-result'
  files: { path: string; data: Uint8Array }[]
}

type ErrorMessage = { type: 'error'; message: string }

type OutMessage = UnzipResultMessage | ErrorMessage

function postError(message: string) {
  const out: ErrorMessage = { type: 'error', message }
  self.postMessage(out)
}

// Strip directory traversal sequences from ZIP entry paths (HIGH-4)
function sanitisePath(raw: string): string {
  return raw.split('/').filter(p => p.length > 0 && p !== '..').join('/')
}

self.onmessage = (event: MessageEvent<UnzipMessage>) => {
  const msg = event.data
  if (msg.type !== 'unzip') {
    postError(`Unknown message type: ${(msg as { type: string }).type}`)
    return
  }

  // MED-3: runtime payload guard
  if (!(msg.buffer instanceof ArrayBuffer)) {
    postError('Invalid payload: buffer must be ArrayBuffer')
    return
  }

  try {
    const compressedSize = msg.buffer.byteLength
    const archive = unzipSync(new Uint8Array(msg.buffer))

    // HIGH-3: zip-bomb guard — check total uncompressed size and per-entry ratio
    let totalUncompressed = 0
    for (const [, data] of Object.entries(archive)) {
      totalUncompressed += data.byteLength
      const ratio = compressedSize > 0 ? data.byteLength / compressedSize : 0
      if (ratio > MAX_COMPRESSION_RATIO) {
        postError('Archive rejected: suspicious compression ratio')
        return
      }
    }
    if (totalUncompressed > MAX_UNCOMPRESSED_BYTES) {
      postError('Archive rejected: uncompressed size exceeds 200 MB limit')
      return
    }

    const files = Object.entries(archive)
      .filter(([path]) => isSpreadsheetPath(path))
      .map(([path, data]) => ({ path: sanitisePath(path), data })) // HIGH-4: sanitise paths

    const out: UnzipResultMessage = { type: 'unzip-result', files }
    self.postMessage(out)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to unzip archive'
    postError(message)
  }
}

export type { UnzipMessage, UnzipResultMessage, ErrorMessage, OutMessage }
