import { describe, expect, it, vi } from 'vitest'
import {
  bindMapStyleFallbacks,
  patchLibertyStyleGaps,
} from '#shared/lib/map-style-fallbacks'

function createMockMap() {
  const listeners = new Map<string, Array<(event: { id: string }) => void>>()
  const images = new Set<string>()
  const layout = new Map<string, Record<string, unknown>>()

  return {
    listeners,
    images,
    layout,
    on(event: string, handler: (event: { id: string }) => void) {
      const list = listeners.get(event) ?? []
      list.push(handler)
      listeners.set(event, list)
    },
    hasImage(id: string) {
      return images.has(id)
    },
    addImage(id: string, image: { width: number; height: number; data: Uint8Array }) {
      images.add(id)
      return image
    },
    getLayer(id: string) {
      return id === 'building-3d' ? { id } : undefined
    },
    setLayoutProperty(layerId: string, prop: string, value: unknown) {
      const entry = layout.get(layerId) ?? {}
      entry[prop] = value
      layout.set(layerId, entry)
    },
  }
}

describe('map-style-fallbacks', () => {
  it('adds a transparent placeholder on styleimagemissing', () => {
    const map = createMockMap()
    bindMapStyleFallbacks(map as never)

    const handlers = map.listeners.get('styleimagemissing')!
    handlers[0]!({ id: 'road_5' })

    expect(map.hasImage('road_5')).toBe(true)
  })

  it('does not duplicate placeholders', () => {
    const map = createMockMap()
    const addImage = vi.spyOn(map, 'addImage')
    bindMapStyleFallbacks(map as never)

    const handlers = map.listeners.get('styleimagemissing')!
    handlers[0]!({ id: 'pedestrian_polygon' })
    handlers[0]!({ id: 'pedestrian_polygon' })

    expect(addImage).toHaveBeenCalledTimes(1)
  })

  it('hides building-3d when present', () => {
    const map = createMockMap()
    patchLibertyStyleGaps(map as never)

    expect(map.layout.get('building-3d')?.visibility).toBe('none')
  })

  it('no-ops when building-3d is absent', () => {
    const map = createMockMap()
    const getLayer = vi.spyOn(map, 'getLayer').mockReturnValue(undefined)

    patchLibertyStyleGaps(map as never)

    expect(getLayer).toHaveBeenCalledWith('building-3d')
    expect(map.layout.size).toBe(0)
  })
})
