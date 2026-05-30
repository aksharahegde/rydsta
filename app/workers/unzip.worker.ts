import { unzipSync } from 'fflate'
import { isSpreadsheetPath } from '#shared/lib/parse-helpers'

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

self.onmessage = (event: MessageEvent<UnzipMessage>) => {
  const msg = event.data
  if (msg.type !== 'unzip') {
    postError(`Unknown message type: ${(msg as { type: string }).type}`)
    return
  }

  try {
    const archive = unzipSync(new Uint8Array(msg.buffer))
    const files = Object.entries(archive)
      .filter(([path]) => isSpreadsheetPath(path))
      .map(([path, data]) => ({ path, data }))

    const out: UnzipResultMessage = { type: 'unzip-result', files }
    self.postMessage(out)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to unzip archive'
    postError(message)
  }
}

export type { UnzipMessage, UnzipResultMessage, ErrorMessage, OutMessage }
