/** Rotating copy shown while the map warms up for playback. */
export const MAP_PLAYBACK_MESSAGES = [
  'Dialing in your city grid…',
  'Your rides are loading their drama…',
  'Drawing the line from A to everywhere else…',
  'GPS nostalgia initializing…',
  'Stitching routes like a highlight reel…',
  'Warming up the streets you actually used…',
  'Almost there, buckle up',
] as const

export function mapPlaybackMessageAt(index: number): string {
  const list = MAP_PLAYBACK_MESSAGES
  const i = ((index % list.length) + list.length) % list.length
  return list[i]!
}
