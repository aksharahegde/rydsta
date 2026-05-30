import { PROVIDER_FINGERPRINTS } from '../constants/providers'
import { shouldIgnoreFile } from './match-provider'

/** Skip parsing known non-trip export files inside provider zips (e.g. Uber ratings CSV). */
export function shouldSkipSpreadsheet(path: string): boolean {
  return PROVIDER_FINGERPRINTS.some(fp => shouldIgnoreFile(path, fp))
}
