import type { Trip } from '../types/trip'

export type LngLat = [number, number]

export type MapBounds = [LngLat, LngLat]

export type TripArcGeoJson = {
  type: 'Feature'
  properties: { tripIndex: number }
  geometry: {
    type: 'LineString'
    coordinates: LngLat[]
  }
}

const DEFAULT_ARC_SEGMENTS = 24
const BOUNDS_PADDING = 0.08
const GEO_BIN_SIZE = 0.05
const MIN_BOUNDS_SPAN = 0.02

export type PrimaryCity = {
  label: string
  tripCount: number
  fromCityField: boolean
}

export function tripHasCoordinates(trip: Trip): boolean {
  return (
    trip.pickupLat !== null
    && trip.pickupLng !== null
    && trip.dropoffLat !== null
    && trip.dropoffLng !== null
  )
}

export function tripsWithCoordinates(trips: Trip[]): Trip[] {
  return [...trips]
    .filter(tripHasCoordinates)
    .sort((a, b) => a.startedAt.getTime() - b.startedAt.getTime())
}

export function arcLineCoordinates(
  pickup: LngLat,
  dropoff: LngLat,
  segments = DEFAULT_ARC_SEGMENTS,
): LngLat[] {
  if (segments < 2) return [pickup, dropoff]

  const [lng1, lat1] = pickup
  const [lng2, lat2] = dropoff
  const midLng = (lng1 + lng2) / 2
  const midLat = (lat1 + lat2) / 2
  const dx = lng2 - lng1
  const dy = lat2 - lat1
  const dist = Math.hypot(dx, dy) || 1
  const bulge = Math.min(0.35, dist * 0.15)
  const controlLng = midLng - (dy / dist) * bulge
  const controlLat = midLat + (dx / dist) * bulge

  const points: LngLat[] = []
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const u = 1 - t
    const lng = u * u * lng1 + 2 * u * t * controlLng + t * t * lng2
    const lat = u * u * lat1 + 2 * u * t * controlLat + t * t * lat2
    points.push([lng, lat])
  }
  return points
}

export function tripArcGeoJson(trip: Trip, tripIndex = 0): TripArcGeoJson | null {
  if (!tripHasCoordinates(trip)) return null

  const pickup: LngLat = [trip.pickupLng!, trip.pickupLat!]
  const dropoff: LngLat = [trip.dropoffLng!, trip.dropoffLat!]

  return {
    type: 'Feature',
    properties: { tripIndex },
    geometry: {
      type: 'LineString',
      coordinates: arcLineCoordinates(pickup, dropoff),
    },
  }
}

export function boundsForTrips(trips: Trip[]): MapBounds | null {
  const mapped = tripsWithCoordinates(trips)
  if (mapped.length === 0) return null

  let minLng = Infinity
  let minLat = Infinity
  let maxLng = -Infinity
  let maxLat = -Infinity

  for (const trip of mapped) {
    const points: LngLat[] = [
      [trip.pickupLng!, trip.pickupLat!],
      [trip.dropoffLng!, trip.dropoffLat!],
    ]
    for (const [lng, lat] of points) {
      minLng = Math.min(minLng, lng)
      minLat = Math.min(minLat, lat)
      maxLng = Math.max(maxLng, lng)
      maxLat = Math.max(maxLat, lat)
    }
  }

  const lngPad = Math.max((maxLng - minLng) * BOUNDS_PADDING, MIN_BOUNDS_SPAN / 2)
  const latPad = Math.max((maxLat - minLat) * BOUNDS_PADDING, MIN_BOUNDS_SPAN / 2)

  return [
    [minLng - lngPad, minLat - latPad],
    [maxLng + lngPad, maxLat + latPad],
  ]
}

export function boundsForTrip(trip: Trip): MapBounds | null {
  return boundsForTrips([trip])
}

function densestPickupBin(trips: Trip[]): {
  latBin: number
  lngBin: number
  count: number
} | null {
  const mapped = tripsWithCoordinates(trips)
  if (mapped.length === 0) return null

  const bins = new Map<string, number>()
  for (const trip of mapped) {
    const latBin = Math.round(trip.pickupLat! / GEO_BIN_SIZE)
    const lngBin = Math.round(trip.pickupLng! / GEO_BIN_SIZE)
    const key = `${latBin},${lngBin}`
    bins.set(key, (bins.get(key) ?? 0) + 1)
  }

  let bestKey = ''
  let bestCount = 0
  for (const [key, count] of bins) {
    if (count > bestCount) {
      bestCount = count
      bestKey = key
    }
  }
  if (!bestKey) return null

  const [latBin, lngBin] = bestKey.split(',').map(Number)
  return { latBin: latBin!, lngBin: lngBin!, count: bestCount }
}

function tripsInDensestBin(trips: Trip[]): Trip[] {
  const bin = densestPickupBin(trips)
  if (!bin) return []

  return tripsWithCoordinates(trips).filter((trip) => {
    const latBin = Math.round(trip.pickupLat! / GEO_BIN_SIZE)
    const lngBin = Math.round(trip.pickupLng! / GEO_BIN_SIZE)
    return latBin === bin.latBin && lngBin === bin.lngBin
  })
}

export function primaryCityFromTrips(trips: Trip[]): PrimaryCity | null {
  const mapped = tripsWithCoordinates(trips)
  if (mapped.length === 0) return null

  const cityCounts = new Map<string, number>()
  for (const trip of mapped) {
    const city = trip.city?.trim()
    if (!city) continue
    cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1)
  }

  if (cityCounts.size > 0) {
    let label = ''
    let tripCount = 0
    for (const [city, count] of cityCounts) {
      if (count > tripCount) {
        tripCount = count
        label = city
      }
    }
    return { label, tripCount, fromCityField: true }
  }

  const bin = densestPickupBin(mapped)
  if (!bin) return null

  return {
    label: 'Your trips',
    tripCount: bin.count,
    fromCityField: false,
  }
}

export function tripsForMapOverview(trips: Trip[]): Trip[] {
  const primary = primaryCityFromTrips(trips)
  if (!primary) return []

  if (primary.fromCityField) {
    return tripsWithCoordinates(trips).filter(
      trip => trip.city?.trim() === primary.label,
    )
  }

  return tripsInDensestBin(trips)
}

export function boundsForOverview(trips: Trip[]): MapBounds | null {
  return boundsForTrips(tripsForMapOverview(trips))
}

export function mapCenterForOverview(trips: Trip[]): LngLat | null {
  const bounds = boundsForOverview(trips)
  if (!bounds) return null
  return [
    (bounds[0][0] + bounds[1][0]) / 2,
    (bounds[0][1] + bounds[1][1]) / 2,
  ]
}

export function sliceArcCoordinates(
  coordinates: LngLat[],
  progress: number,
): LngLat[] {
  if (coordinates.length === 0) return []
  const clamped = Math.max(0, Math.min(1, progress))
  if (clamped >= 1) return [...coordinates]

  const targetIndex = clamped * (coordinates.length - 1)
  const whole = Math.floor(targetIndex)
  const fraction = targetIndex - whole

  const result = coordinates.slice(0, whole + 1)
  if (fraction > 0 && whole + 1 < coordinates.length) {
    const [lngA, latA] = coordinates[whole]!
    const [lngB, latB] = coordinates[whole + 1]!
    result.push([
      lngA + (lngB - lngA) * fraction,
      latA + (latB - latA) * fraction,
    ])
  }
  return result
}

export type TripPointsGeoJson = {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    properties: { kind: 'pickup' | 'dropoff'; tripIndex: number }
    geometry: { type: 'Point'; coordinates: LngLat }
  }>
}

export function allTripPointsGeoJson(trips: Trip[]): TripPointsGeoJson {
  const features: TripPointsGeoJson['features'] = []
  const mapped = tripsWithCoordinates(trips)

  for (const [index, trip] of mapped.entries()) {
    features.push({
      type: 'Feature',
      properties: { kind: 'pickup', tripIndex: index },
      geometry: {
        type: 'Point',
        coordinates: [trip.pickupLng!, trip.pickupLat!],
      },
    })
    features.push({
      type: 'Feature',
      properties: { kind: 'dropoff', tripIndex: index },
      geometry: {
        type: 'Point',
        coordinates: [trip.dropoffLng!, trip.dropoffLat!],
      },
    })
  }

  return { type: 'FeatureCollection', features }
}
