import type { RideProvider } from '../constants/providers'
import type { Trip } from './trip'

export type FileNode = {
  path: string
  name: string
  kind: 'csv' | 'xlsx'
}

export type ParsedTable = {
  headers: string[]
  rows: string[][]
  source: FileNode
}

export type CanonicalField =
  | 'startedAt'
  | 'endedAt'
  | 'pickup'
  | 'dropoff'
  | 'pickupLat'
  | 'pickupLng'
  | 'dropoffLat'
  | 'dropoffLng'
  | 'fare'
  | 'currency'
  | 'distanceKm'
  | 'status'
  | 'vehicleType'

export type ColumnMapping = {
  field: CanonicalField
  columnIndex: number
  confidence: number
}

export type ImportResult = {
  trips: Trip[]
  warnings: string[]
  provider: RideProvider
}
