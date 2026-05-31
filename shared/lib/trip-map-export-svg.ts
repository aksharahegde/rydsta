import {
  arcLineCoordinates,
  boundsForOverview,
  boundsForTrips,
  tripHasCoordinates,
  tripsForMapOverview,
  tripsWithCoordinates,
  type LngLat,
  type MapBounds,
} from './trip-map-playback'
import type { Trip } from '../types/trip'

const VIEW_SIZE = 400
const PAD = 16
const MAX_ARCS = 80

export type TripMapExportPoint = {
  x: number
  y: number
}

export type TripMapExportSvg = {
  viewBox: string
  arcPaths: string[]
  pickups: TripMapExportPoint[]
  dropoffs: TripMapExportPoint[]
}

function expandBounds(bounds: MapBounds): MapBounds {
  const [[west, south], [east, north]] = bounds
  const padLng = Math.max((east - west) * 0.08, 0.002)
  const padLat = Math.max((north - south) * 0.08, 0.002)
  return [
    [west - padLng, south - padLat],
    [east + padLng, north + padLat],
  ]
}

function projectPoint(
  lng: number,
  lat: number,
  bounds: MapBounds,
): [number, number] {
  const [[west, south], [east, north]] = bounds
  const inner = VIEW_SIZE - PAD * 2
  const lngSpan = east - west || 0.001
  const latSpan = north - south || 0.001
  const x = PAD + ((lng - west) / lngSpan) * inner
  const y = PAD + ((north - lat) / latSpan) * inner
  return [x, y]
}

function pathFromCoords(coords: LngLat[], bounds: MapBounds): string {
  if (coords.length === 0) return ''
  const [firstX, firstY] = projectPoint(coords[0]![0], coords[0]![1], bounds)
  let d = `M ${firstX} ${firstY}`
  for (let i = 1; i < coords.length; i++) {
    const [x, y] = projectPoint(coords[i]![0], coords[i]![1], bounds)
    d += ` L ${x} ${y}`
  }
  return d
}

function sampleTrips(trips: Trip[]): Trip[] {
  if (trips.length <= MAX_ARCS) return trips
  const step = Math.ceil(trips.length / MAX_ARCS)
  return trips.filter((_, index) => index % step === 0)
}

export type BuildTripMapExportSvgOptions = {
  /** Plot all trips with coordinates instead of the primary-city overview subset. */
  allCoordinates?: boolean
}

/** SVG route preview for PNG export (no WebGL / MapLibre). */
export function buildTripMapExportSvg(
  trips: Trip[],
  options?: BuildTripMapExportSvgOptions,
): TripMapExportSvg | null {
  const displayTrips = options?.allCoordinates
    ? tripsWithCoordinates(trips)
    : tripsForMapOverview(trips)
  const bounds = options?.allCoordinates
    ? boundsForTrips(displayTrips)
    : boundsForOverview(trips)
  if (!bounds || displayTrips.length === 0) return null

  const fitBounds = expandBounds(bounds)

  const sampled = sampleTrips(displayTrips)
  const arcPaths: string[] = []
  const pickupCoords: [number, number][] = []
  const dropoffCoords: [number, number][] = []

  for (const trip of sampled) {
    if (!tripHasCoordinates(trip)) continue
    const pickup: LngLat = [trip.pickupLng!, trip.pickupLat!]
    const dropoff: LngLat = [trip.dropoffLng!, trip.dropoffLat!]
    arcPaths.push(pathFromCoords(arcLineCoordinates(pickup, dropoff), fitBounds))
    pickupCoords.push(projectPoint(pickup[0], pickup[1], fitBounds))
    dropoffCoords.push(projectPoint(dropoff[0], dropoff[1], fitBounds))
  }

  return {
    viewBox: `0 0 ${VIEW_SIZE} ${VIEW_SIZE}`,
    arcPaths,
    pickups: pickupCoords.map(([x, y]) => ({ x, y })),
    dropoffs: dropoffCoords.map(([x, y]) => ({ x, y })),
  }
}
