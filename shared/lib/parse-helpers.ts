import type { FileNode } from '../types/import'

export function decodeUtf8(data: Uint8Array): string {
  return new TextDecoder('utf-8').decode(data)
}

export function isSpreadsheetPath(path: string): boolean {
  const lower = path.toLowerCase()
  return lower.endsWith('.csv') || lower.endsWith('.xlsx')
}

export function fileNodeFromPath(path: string): FileNode {
  const name = path.split('/').pop() ?? path
  const kind = path.toLowerCase().endsWith('.xlsx') ? 'xlsx' : 'csv'
  return { path, name, kind }
}

export function toFileNodes(
  unzipped: { path: string; data: Uint8Array }[],
): FileNode[] {
  return unzipped
    .filter(entry => isSpreadsheetPath(entry.path))
    .map(entry => fileNodeFromPath(entry.path))
}
