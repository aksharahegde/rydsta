export type StorySlideKind =
  | 'hook'
  | 'stat'
  | 'highlight'
  | 'personality'
  | 'cta'

export type StorySlide = {
  id: string
  kind: StorySlideKind
  headline: string
  subline?: string
  value?: string
  visual?: 'number' | 'gradient' | 'emoji'
}
