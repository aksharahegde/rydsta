import type { CanonicalField } from './providers'

export const COLUMN_SYNONYMS: Record<CanonicalField, string[]> = {
  startedAt: [
    'begintrip_timestamp_local',
    'request_timestamp_local',
    'pickup time',
    'start time',
    'trip date',
  ],
  endedAt: ['dropoff_timestamp_local', 'end time', 'drop off time'],
  pickup: ['begintrip_address', 'pickup', 'pick up', 'from', 'source'],
  dropoff: ['dropoff_address', 'drop off', 'to', 'destination'],
  fare: ['fare_amount', 'fare', 'amount', 'total', 'trip fare'],
  currency: ['currency_code', 'currency'],
  distanceKm: ['trip_distance_miles', 'distance', 'km'],
  status: ['status', 'is_completed', 'trip status'],
  vehicleType: ['product_type_name', 'vehicle', 'service type'],
}
