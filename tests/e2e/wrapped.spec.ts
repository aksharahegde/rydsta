import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { expect, test } from '@playwright/test'

const fixturesDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  '../fixtures',
)

const singleYearFixture = path.join(fixturesDir, 'uber-rider-trips-sample.csv')
const multiYearFixture = path.join(fixturesDir, 'uber-rider-trips-multi-year.csv')

async function uploadCsv(page: import('@playwright/test').Page, fixturePath: string) {
  await page.goto('/upload')
  await page.getByTestId('ride-upload-input').setInputFiles({
    name: 'trips_data-0.csv',
    mimeType: 'text/csv',
    buffer: readFileSync(fixturePath),
  })
  await expect(page.getByTestId('ride-upload-error')).not.toBeVisible({ timeout: 30_000 })
  await expect(page).toHaveURL(/\/wrapped$/, { timeout: 30_000 })
  await expect(page.getByTestId('wrapped-bento-grid')).toBeVisible({ timeout: 30_000 })
}

test('upload uber csv navigates to wrapped bento with download', async ({ page }) => {
  await uploadCsv(page, singleYearFixture)

  await expect(page.getByText(/wrapped/i).first()).toBeVisible({ timeout: 15_000 })
  await expect(page.getByText(/rides in 2025/)).toBeVisible()
  await expect(page.getByTestId('wrapped-year-rail')).toBeVisible()
  await expect(page.getByTestId('wrapped-activity-heatmap')).toBeVisible()

  const download = page.getByTestId('wrapped-download-png')
  await expect(download).toBeVisible()
  await download.click()
  await expect(download).toBeDisabled()
  await expect(download).toBeEnabled({ timeout: 30_000 })
})

test('multi-year export switches year stats and heatmap', async ({ page }) => {
  await uploadCsv(page, multiYearFixture)

  await expect(page.getByTestId('wrapped-year-rail')).toBeVisible()
  await expect(page.getByTestId('wrapped-year-2024')).toBeVisible()
  await expect(page.getByTestId('wrapped-year-2019')).toBeVisible()
  await expect(page.getByText(/rides in 2024/)).toBeVisible()
  await expect(page.getByTestId('wrapped-activity-heatmap')).toBeVisible()

  await page.getByTestId('wrapped-year-2019').click()
  await expect(page.getByText(/rides in 2019/)).toBeVisible()
})
