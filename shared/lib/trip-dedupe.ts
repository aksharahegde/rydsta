import type { Trip } from '../types/trip'

export function tripDedupeKey(trip: Trip): string {
  const startedAt = trip.startedAt.toISOString()
  const pickup = trip.pickup ?? ''
  const fare = trip.fare ?? ''
  return `${startedAt}|${pickup}|${fare}`
}

export function mergeTrips(existing: Trip[], incoming: Trip[]): Trip[] {
  const seen = new Set(existing.map(tripDedupeKey))
  const merged = [...existing]
  for (const trip of incoming) {
    const key = tripDedupeKey(trip)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(trip)
  }
  return merged
}
