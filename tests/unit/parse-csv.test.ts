import { describe, it, expect } from 'vitest'
import {
  detectCsvDelimiter,
  getFatalPapaErrors,
  isIgnorablePapaError,
  parseCsvToTable,
} from '../../shared/lib/parse-csv'
import Papa from 'papaparse'

describe('parse-csv', () => {
  it('detects comma delimiter', () => {
    expect(detectCsvDelimiter('a,b,c\n1,2,3')).toBe(',')
  })

  it('detects semicolon delimiter', () => {
    expect(detectCsvDelimiter('a;b;c\n1;2;3')).toBe(';')
  })

  it('parses single-column CSV without throwing', () => {
    const table = parseCsvToTable('five_star_rating\n5\n4\n', 'Rider/rider_lifetime_ratings_received-0.csv')
    expect(table.headers).toEqual(['five_star_rating'])
    expect(table.rows).toHaveLength(2)
  })

  it('parses with UTF-8 BOM', () => {
    const table = parseCsvToTable('\uFEFFname,value\nfoo,1\n', 'test.csv')
    expect(table.headers[0]).toBe('name')
    expect(table.rows[0]).toEqual(['foo', '1'])
  })

  it('treats UndetectableDelimiter as non-fatal', () => {
    const parsed = Papa.parse('onlyonecolumn', { header: true })
    const fatal = getFatalPapaErrors(parsed.errors)
    const ignorable = parsed.errors.filter(isIgnorablePapaError)
    if (parsed.errors.some(isIgnorablePapaError)) {
      expect(fatal).toHaveLength(0)
      expect(ignorable.length).toBeGreaterThan(0)
    }
  })
})
