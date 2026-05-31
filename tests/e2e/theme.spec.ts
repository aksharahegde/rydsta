import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/uber-rider-trips-sample.csv',
)

async function goToWrapped(page: import('@playwright/test').Page) {
  await page.goto('/upload')
  await page.getByTestId('ride-upload-input').setInputFiles({
    name: 'trips_data-0.csv',
    mimeType: 'text/csv',
    buffer: readFileSync(fixturePath),
  })
  await expect(page).toHaveURL(/\/wrapped$/, { timeout: 30_000 })
  await expect(page.getByTestId('wrapped-bento-grid')).toBeVisible({ timeout: 30_000 })
}

test.describe('theme toggle', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem('ride-wrapped-color-mode', 'light')
      document.documentElement.classList.remove('dark')
    })
    await page.reload()
  })

  test('light mode uses a bright page background', async ({ page }) => {
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    const paper = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--color-paper'),
    )
    expect(paper).toContain('99%')

    const bg = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.rw-page')!).backgroundColor,
    )
    expect(bg).toMatch(/0\.9[5-9]|99%/)
  })

  test('upload page stays light after toggle', async ({ page }) => {
    await page.goto('/upload')
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    await page.getByTestId('ride-theme-toggle').click()
    await expect(page.locator('html')).toHaveClass(/dark/)

    await page.getByTestId('ride-theme-toggle').click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)

    const bg = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.upload-page')!).backgroundColor,
    )
    expect(bg).toMatch(/0\.9[5-9]|99%/)
  })

  test('download CTA text is readable in light mode', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('ride-wrapped-color-mode', 'light')
      document.documentElement.classList.remove('dark')
    })
    await goToWrapped(page)

    const heading = page.getByText('Share your wrapped')
    const download = page.getByTestId('wrapped-download-png')
    await expect(heading).toBeVisible()
    await expect(download).toBeVisible()

    const contrast = await page.evaluate(() => {
      const tile = document.querySelector('.rw-tile--cta')!
      const h = document.querySelector('.rw-cta-heading')!
      const b = document.querySelector('.rw-download-btn')!
      const tileBg = getComputedStyle(tile).backgroundColor
      const hColor = getComputedStyle(h).color
      const bColor = getComputedStyle(b).color
      const bBg = getComputedStyle(b).backgroundColor
      return { tileBg, hColor, bColor, bBg }
    })

    expect(contrast.hColor).not.toBe(contrast.tileBg)
    expect(contrast.bColor).not.toBe(contrast.bBg)
  })

  test('toggle switches between light and dark', async ({ page }) => {
    const toggle = page.getByTestId('ride-theme-toggle')

    await toggle.click()
    await expect(page.locator('html')).toHaveClass(/dark/)
    await expect.poll(() =>
      page.evaluate(() => localStorage.getItem('ride-wrapped-color-mode')),
    ).toBe('dark')

    await toggle.click()
    await expect(page.locator('html')).not.toHaveClass(/dark/)
    await expect.poll(() =>
      page.evaluate(() => localStorage.getItem('ride-wrapped-color-mode')),
    ).toBe('light')

    const bg = await page.evaluate(() =>
      getComputedStyle(document.querySelector('.rw-page')!).backgroundColor,
    )
    expect(bg).toMatch(/0\.9[5-9]|99%/)
  })
})
