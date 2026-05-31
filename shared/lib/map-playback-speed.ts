/** Hold time between trips at 1× playback (ms). */
export const BASE_TRIP_HOLD_MS = 4000

/** Arc draw duration at 1× playback (ms). */
export const BASE_ARC_DRAW_MS = 550

export const PLAYBACK_SPEED_OPTIONS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

export type PlaybackSpeed = (typeof PLAYBACK_SPEED_OPTIONS)[number]

export const DEFAULT_PLAYBACK_SPEED: PlaybackSpeed = 1

export function tripHoldMsForSpeed(speed: number): number {
  const clamped = Math.max(0.25, Math.min(speed, 4))
  return Math.round(BASE_TRIP_HOLD_MS / clamped)
}

export function arcDrawMsForSpeed(speed: number): number {
  const clamped = Math.max(0.25, Math.min(speed, 4))
  return Math.round(BASE_ARC_DRAW_MS / clamped)
}

export function formatPlaybackSpeedLabel(speed: number): string {
  return speed === 1 ? '1×' : `${speed}×`
}

export function isPlaybackSpeed(value: number): value is PlaybackSpeed {
  return (PLAYBACK_SPEED_OPTIONS as readonly number[]).includes(value)
}
