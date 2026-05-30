import {
  PROVIDER_FINGERPRINTS,
  type ProviderFingerprint,
  type RideProvider,
} from '../constants/providers'

export type FileDescriptor = {
  path: string
  headers: string[]
}

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase()
}

function headersIncludeAll(headers: string[], required: string[]): boolean {
  const set = new Set(headers.map(normalizeHeader))
  return required.every(r => set.has(r.toLowerCase()))
}

export function shouldIgnoreFile(
  path: string,
  fingerprint: ProviderFingerprint,
): boolean {
  return fingerprint.ignorePathPatterns.some(re => re.test(path))
}

export function matchProvider(file: FileDescriptor): {
  provider: RideProvider
  fingerprint: ProviderFingerprint | null
  confidence: number
} {
  for (const fp of PROVIDER_FINGERPRINTS) {
    if (fp.ignorePathPatterns.some(re => re.test(file.path))) {
      continue
    }
    const pathOk =
      fp.pathPatterns.some(re => re.test(file.path)) ||
      fp.fileNamePatterns.some(re => re.test(file.path.split('/').pop() ?? ''))

    if (!pathOk) continue

    if (!headersIncludeAll(file.headers, fp.requiredHeaders)) {
      return { provider: fp.id, fingerprint: fp, confidence: 0.5 }
    }

    return { provider: fp.id, fingerprint: fp, confidence: 0.95 }
  }

  return { provider: 'unknown', fingerprint: null, confidence: 0 }
}

export function isTripFile(file: FileDescriptor): boolean {
  for (const fp of PROVIDER_FINGERPRINTS) {
    if (shouldIgnoreFile(file.path, fp)) continue
    const pathOk =
      fp.pathPatterns.some(re => re.test(file.path)) ||
      fp.fileNamePatterns.some(re => re.test(file.path.split('/').pop() ?? ''))
    if (pathOk) return true
  }
  return false
}
