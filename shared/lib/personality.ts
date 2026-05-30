import type { Trip } from '../types/trip'
import type { WrappedStats } from './wrapped-stats'

export function pickPersonality(_stats: WrappedStats, trips: Trip[]): string {
  const night = trips.filter(t => {
    const h = t.startedAt.getHours()
    return h >= 22 || h < 5
  }).length

  if (trips.length && night / trips.length >= 0.4) return 'Night Owl'

  if (trips.some(t => /airport/i.test(`${t.pickup ?? ''} ${t.dropoff ?? ''}`))) {
    return 'Airport Regular'
  }

  return 'Road Warrior'
}
