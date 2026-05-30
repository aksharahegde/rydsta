export type RideProvider = 'uber' | 'ola' | 'rapido' | 'unknown'

export type CanonicalField =
  | 'startedAt'
  | 'endedAt'
  | 'pickup'
  | 'dropoff'
  | 'fare'
  | 'currency'
  | 'distanceKm'
  | 'status'
  | 'vehicleType'

export type ProviderFingerprint = {
  id: RideProvider
  /** Match relative path inside zip (posix-style) */
  pathPatterns: RegExp[]
  fileNamePatterns: RegExp[]
  /** All must be present (case-insensitive header match) */
  requiredHeaders: string[]
  columnMap: Partial<Record<CanonicalField, string>>
  ignorePathPatterns: RegExp[]
}

/** See docs/ride-data-format.md */
export const PROVIDER_FINGERPRINTS: ProviderFingerprint[] = [
  {
    id: 'uber',
    pathPatterns: [/(^|\/)Rider\/trips_data/i],
    fileNamePatterns: [/^trips_data-\d+\.csv$/i],
    requiredHeaders: [
      'begintrip_timestamp_local',
      'dropoff_timestamp_local',
      'fare_amount',
      'currency_code',
      'begintrip_address',
      'dropoff_address',
      'trip_distance_miles',
      'status',
    ],
    columnMap: {
      startedAt: 'begintrip_timestamp_local',
      endedAt: 'dropoff_timestamp_local',
      pickup: 'begintrip_address',
      dropoff: 'dropoff_address',
      fare: 'fare_amount',
      currency: 'currency_code',
      distanceKm: 'trip_distance_miles',
      status: 'status',
      vehicleType: 'product_type_name',
    },
    ignorePathPatterns: [
      /(^|\/)Eats\//i,
      /(^|\/)Account and Profile\//i,
      /rider_app_analytics/i,
      /rider_lifetime_ratings/i,
      /customer_support/i,
      /saved_locations/i,
      /user_profile/i,
      /user_orders/i,
    ],
  },
]

export const UBER_STARTED_AT_FALLBACK = 'request_timestamp_local'

export const MILES_TO_KM = 1.60934
