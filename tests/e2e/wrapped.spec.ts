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

test('trip map tile expands and playback controls advance', async ({ page }) => {
  await uploadCsv(page, singleYearFixture)

  await expect(page.locator('.rw-tile--stat .rw-tile-big')).toHaveText('2')

  const mapTile = page.getByTestId('wrapped-trip-map-tile')
  await expect(mapTile).toBeVisible({ timeout: 15_000 })
  await expect(mapTile.locator('.rw-trip-map-svg-underlay')).toBeVisible({ timeout: 15_000 })
  await expect(mapTile.locator('.rw-trip-map-export__arc').first()).toBeVisible()
  await expect(mapTile.getByText(/Bengaluru · 2025/i)).toBeVisible()
  await expect(mapTile.getByText(/2 trips mapped/i)).toBeVisible()

  await page.getByTestId('wrapped-trip-map-expand').click()
  await expect(page.getByTestId('wrapped-trip-map-stage')).toBeVisible()

  const counter = page.getByTestId('wrapped-trip-map-counter')
  await expect(counter).toHaveText('1 / 2', { timeout: 10_000 })

  await page.getByTestId('wrapped-trip-map-next').click()
  await expect(counter).toHaveText('2 / 2')

  await page.getByTestId('wrapped-trip-map-prev').click()
  await expect(counter).toHaveText('1 / 2')

  await page.getByTestId('wrapped-trip-map-play').click()
  await expect(page.getByTestId('wrapped-trip-map-pause')).toBeVisible({ timeout: 5_000 })

  await page.getByTestId('wrapped-trip-map-close').click()
  await expect(page.getByTestId('wrapped-trip-map-stage')).not.toBeVisible()
})
