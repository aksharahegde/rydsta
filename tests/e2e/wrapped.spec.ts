import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const fixturePath = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures/uber-rider-trips-sample.csv',
)

test('upload uber csv navigates to wrapped with trip stats', async ({ page }) => {
  await page.goto('/upload')

  // Uber fingerprint matches trips_data-*.csv filenames (see shared/constants/providers.ts)
  await page.getByTestId('ride-upload-input').setInputFiles({
    name: 'trips_data-0.csv',
    mimeType: 'text/csv',
    buffer: readFileSync(fixturePath),
  })

  await expect(page.getByTestId('ride-upload-error')).not.toBeVisible({ timeout: 30_000 })
  await expect(page).toHaveURL(/\/wrapped$/, { timeout: 30_000 })
  await expect(page.getByTestId('wrapped-slide-player')).toBeVisible({ timeout: 30_000 })

  const wrappedContent = page.getByText(/wrapped/i).or(page.getByText('2', { exact: true }))
  await expect(wrappedContent.first()).toBeVisible({ timeout: 15_000 })

  const nextSlide = page.getByRole('button', { name: 'Next slide' })
  while (await nextSlide.isEnabled()) {
    await nextSlide.click()
  }

  const download = page.getByTestId('wrapped-share-download')
  if (await download.isVisible()) {
    await download.click()
    await expect(download).toBeDisabled()
    await expect(download).toBeEnabled({ timeout: 30_000 })
  }
})
