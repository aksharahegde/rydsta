import { describe, it, expect } from 'vitest'
import {
  MAP_PLAYBACK_MESSAGES,
  mapPlaybackMessageAt,
} from '../../shared/lib/map-playback-messages'

describe('map-playback-messages', () => {
  it('cycles messages by index', () => {
    expect(mapPlaybackMessageAt(0)).toBe(MAP_PLAYBACK_MESSAGES[0])
    expect(mapPlaybackMessageAt(MAP_PLAYBACK_MESSAGES.length)).toBe(
      MAP_PLAYBACK_MESSAGES[0],
    )
  })
})
