import { toPng } from 'html-to-image'

export type SharePngOptions = {
  width?: number
  height?: number
  filename?: string
}

export async function downloadSharePng(
  element: HTMLElement,
  options?: SharePngOptions,
) {
  const width = options?.width ?? 1080
  const height = options?.height ?? 1920
  const filename =
    options?.filename ?? `ride-wrapped-${new Date().getFullYear()}.png`

  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    width,
    height,
    canvasWidth: width,
    canvasHeight: height,
  })

  const anchor = document.createElement('a')
  anchor.href = dataUrl
  anchor.download = filename
  anchor.click()
}

export function useWrappedShare() {
  return { downloadSharePng }
}
