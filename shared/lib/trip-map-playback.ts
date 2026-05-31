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

  const lngPad = Math.max((maxLng - minLng) * BOUNDS_PADDING, 0.02)
  const latPad = Math.max((maxLat - minLat) * BOUNDS_PADDING, 0.02)

  return [
    [minLng - lngPad, minLat - latPad],
    [maxLng + lngPad, maxLat + latPad],
  ]
}

export function boundsForTrip(trip: Trip): MapBounds | null {
  return boundsForTrips([trip])
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
