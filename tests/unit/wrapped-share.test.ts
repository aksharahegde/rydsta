// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { downloadSharePng } from '../../app/composables/useWrappedShare'

const { toPngMock } = vi.hoisted(() => ({
  toPngMock: vi.fn(),
}))

vi.mock('html-to-image', () => ({
  toPng: toPngMock,
}))

describe('downloadSharePng', () => {
  beforeEach(() => {
    toPngMock.mockReset()
    toPngMock.mockResolvedValue('data:image/png;base64,abc')
  })

  it('exports with default story dimensions and pixelRatio 2', async () => {
    const element = document.createElement('div')
    const click = vi.fn()
    const anchor = { href: '', download: '', click } as HTMLAnchorElement
    const createElement = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor)

    await downloadSharePng(element)

    expect(toPngMock).toHaveBeenCalledWith(element, {
      pixelRatio: 2,
      width: 1080,
      height: 1920,
      canvasWidth: 1080,
      canvasHeight: 1920,
    })
    expect(anchor.download).toMatch(/^ride-wrapped-\d{4}\.png$/)
    expect(click).toHaveBeenCalledOnce()

    createElement.mockRestore()
  })

  it('uses custom size and filename', async () => {
    const element = document.createElement('div')
    const click = vi.fn()
    const anchor = { href: '', download: '', click } as HTMLAnchorElement
    const createElement = vi
      .spyOn(document, 'createElement')
      .mockReturnValue(anchor)

    await downloadSharePng(element, {
      width: 1080,
      height: 1080,
      filename: 'ride-wrapped-2025.png',
    })

    expect(toPngMock).toHaveBeenCalledWith(
      element,
      expect.objectContaining({ width: 1080, height: 1080 }),
    )
    expect(anchor.download).toBe('ride-wrapped-2025.png')

    createElement.mockRestore()
  })
})
