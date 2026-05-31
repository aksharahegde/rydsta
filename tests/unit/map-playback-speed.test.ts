import { describe, it, expect } from 'vitest'
import {
  arcDrawMsForSpeed,
  BASE_ARC_DRAW_MS,
  BASE_TRIP_HOLD_MS,
  tripHoldMsForSpeed,
} from '../../shared/lib/map-playback-speed'

describe('map-playback-speed', () => {
  it('scales trip hold inversely with speed', () => {
    expect(tripHoldMsForSpeed(1)).toBe(BASE_TRIP_HOLD_MS)
    expect(tripHoldMsForSpeed(2)).toBe(BASE_TRIP_HOLD_MS / 2)
    expect(tripHoldMsForSpeed(0.5)).toBe(BASE_TRIP_HOLD_MS * 2)
  })

  it('scales arc draw inversely with speed', () => {
    expect(arcDrawMsForSpeed(1)).toBe(BASE_ARC_DRAW_MS)
    expect(arcDrawMsForSpeed(2)).toBe(Math.round(BASE_ARC_DRAW_MS / 2))
  })
})
