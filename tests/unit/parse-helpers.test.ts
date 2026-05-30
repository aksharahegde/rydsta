import { describe, it, expect } from 'vitest'
import {
  decodeUtf8,
  isSpreadsheetPath,
  toFileNodes,
  fileNodeFromPath,
} from '../../shared/lib/parse-helpers'

describe('decodeUtf8', () => {
  it('decodes UTF-8 bytes to a string', () => {
    const data = new TextEncoder().encode('ride,wrapped')
    expect(decodeUtf8(data)).toBe('ride,wrapped')
  })
})

describe('isSpreadsheetPath', () => {
  it.each([
    ['trips.csv', true],
    ['folder/TRIPS.CSV', true],
    ['export.xlsx', true],
    ['data.XLSX', true],
    ['readme.txt', false],
    ['archive.zip', false],
    ['trips.csv.bak', false],
  ])('returns %s for %s', (path, expected) => {
    expect(isSpreadsheetPath(path)).toBe(expected)
  })
})

describe('fileNodeFromPath', () => {
  it('derives name and kind from path', () => {
    expect(fileNodeFromPath('uber/trips.csv')).toEqual({
      path: 'uber/trips.csv',
      name: 'trips.csv',
      kind: 'csv',
    })
    expect(fileNodeFromPath('export.XLSX')).toEqual({
      path: 'export.XLSX',
      name: 'export.XLSX',
      kind: 'xlsx',
    })
  })
})

describe('toFileNodes', () => {
  it('keeps only spreadsheet paths as FileNodes', () => {
    const nodes = toFileNodes([
      { path: 'folder/trips.csv', data: new Uint8Array() },
      { path: 'notes.txt', data: new Uint8Array() },
      { path: 'export.XLSX', data: new Uint8Array() },
    ])

    expect(nodes).toEqual([
      { path: 'folder/trips.csv', name: 'trips.csv', kind: 'csv' },
      { path: 'export.XLSX', name: 'export.XLSX', kind: 'xlsx' },
    ])
  })

  it('returns an empty list when no spreadsheets are present', () => {
    expect(
      toFileNodes([{ path: 'readme.txt', data: new Uint8Array() }]),
    ).toEqual([])
  })
})
