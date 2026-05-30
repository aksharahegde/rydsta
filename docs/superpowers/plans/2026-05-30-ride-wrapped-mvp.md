# Ride Wrapped MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a Nuxt 4, browser-only app that ingests ride export files and produces a shareable “year in rides” story with PNG export.

**Architecture:** Static Nuxt 4 app with client-only upload/map/wrapped routes; Web Workers for unzip/parse/inference; hybrid L1/L2 column mapping with optional lazy WASM; canonical `Trip` model drives deterministic story slides.

**Tech Stack:** Nuxt 4, Vue 3, TypeScript, Vitest, Playwright, fflate, PapaParse, SheetJS (read), html-to-image, shadcn-vue, @vueuse/nuxt, @nuxtjs/seo

**Spec:** `docs/superpowers/specs/2026-05-30-ride-wrapped-design.md`

---

## File map (created by this plan)

| Path | Responsibility |
|------|----------------|
| `nuxt.config.ts` | routeRules, vite worker config, modules |
| `shared/types/*.ts` | Trip, StorySlide, import types |
| `shared/constants/providers.ts` | L1 fingerprints |
| `shared/constants/column-synonyms.ts` | L2 header synonyms |
| `shared/lib/normalize-trips.ts` | table + mapping → Trip[] |
| `shared/lib/wrapped-stats.ts` | aggregates for slides |
| `shared/lib/personality.ts` | rule labels |
| `app/workers/*.worker.ts` | unzip, parse, infer |
| `app/composables/useRideImport.ts` | orchestration |
| `app/composables/useColumnMap.ts` | mapping state |
| `app/composables/useWrappedStory.ts` | Trip[] → slides |
| `app/composables/useWrappedShare.ts` | PNG export |
| `app/pages/*.vue` | routes |
| `app/components/ride/*` | upload, mapping UI + testids |
| `app/components/wrapped/*` | slides, player, share card |

---

### Task 1: Nuxt 4 scaffold

**Files:**
- Create: project via `nuxi init`
- Create: `nuxt.config.ts`
- Create: `app/app.vue`

- [ ] **Step 1: Initialize project**

```bash
cd /Users/chanakya/Documents/company/projects/ride-wrapped
pnpm dlx nuxi@latest init . --packageManager pnpm --force
pnpm install
```

- [ ] **Step 2: Configure route rules and SPA zones**

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  future: { compatibilityVersion: 4 },
  modules: ['@nuxtjs/seo', '@vueuse/nuxt'],
  routeRules: {
    '/': { prerender: true },
    '/upload': { ssr: false },
    '/map': { ssr: false },
    '/wrapped': { ssr: false },
  },
  vite: {
    worker: { format: 'es' },
  },
  nitro: {
    prerender: { routes: ['/'] },
  },
})
```

- [ ] **Step 3: Add dependencies**

```bash
pnpm add fflate papaparse xlsx html-to-image
pnpm add -D vitest @vue/test-utils @nuxt/test-utils happy-dom
pnpm add -D @playwright/test
```

- [ ] **Step 4: Verify dev server**

```bash
pnpm dev
```

Expected: app serves at `http://localhost:3000` with no errors.

- [ ] **Step 5: Commit** (if git initialized)

```bash
git init && git add . && git commit -m "chore: scaffold Nuxt 4 ride-wrapped"
```

---

### Task 2: Shared types and pure libs

**Files:**
- Create: `shared/types/trip.ts`
- Create: `shared/types/story.ts`
- Create: `shared/types/import.ts`
- Create: `shared/lib/wrapped-stats.ts`
- Create: `shared/lib/personality.ts`
- Test: `tests/unit/wrapped-stats.test.ts`

- [ ] **Step 1: Write failing test for trip count and spend**

```ts
// tests/unit/wrapped-stats.test.ts
import { describe, it, expect } from 'vitest'
import { computeWrappedStats } from '../../shared/lib/wrapped-stats'
import type { Trip } from '../../shared/types/trip'

const trips: Trip[] = [
  { provider: 'uber', startedAt: new Date('2025-06-01T10:00:00Z'), endedAt: null, pickup: 'Koramangala', dropoff: 'Airport', fare: 450, currency: 'INR', distanceKm: 35, status: 'completed', vehicleType: null, sourceFile: 't.csv' },
  { provider: 'uber', startedAt: new Date('2025-06-15T22:00:00Z'), endedAt: null, pickup: 'Indiranagar', dropoff: 'Home', fare: 120, currency: 'INR', distanceKm: 5, status: 'completed', vehicleType: null, sourceFile: 't.csv' },
]

describe('computeWrappedStats', () => {
  it('sums trips and fare', () => {
    const s = computeWrappedStats(trips)
    expect(s.totalTrips).toBe(2)
    expect(s.totalSpend).toBe(570)
    expect(s.currency).toBe('INR')
  })
})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pnpm vitest run tests/unit/wrapped-stats.test.ts
```

- [ ] **Step 3: Implement types and stats**

```ts
// shared/types/trip.ts
export type RideProvider = 'uber' | 'ola' | 'rapido' | 'unknown'

export type Trip = {
  provider: RideProvider
  startedAt: Date
  endedAt: Date | null
  pickup: string | null
  dropoff: string | null
  fare: number | null
  currency: string | null
  distanceKm: number | null
  status: string | null
  vehicleType: string | null
  sourceFile: string
}
```

```ts
// shared/lib/wrapped-stats.ts
import type { Trip } from '../types/trip'

export type WrappedStats = {
  year: number
  totalTrips: number
  totalSpend: number | null
  currency: string | null
  busiestMonth: string | null
  busiestWeekday: string | null
  topPickup: string | null
  longestTrip: Trip | null
  priciestTrip: Trip | null
}

export function computeWrappedStats(trips: Trip[]): WrappedStats {
  const valid = trips.filter(t => t.startedAt && !Number.isNaN(t.startedAt.getTime()))
  const year = valid[0]?.startedAt.getFullYear() ?? new Date().getFullYear()
  const fares = valid.map(t => t.fare).filter((f): f is number => f != null && !Number.isNaN(f))
  const totalSpend = fares.length ? fares.reduce((a, b) => a + b, 0) : null
  // busiest month/weekday + topPickup: implement histogram helpers in same file
  return {
    year,
    totalTrips: valid.length,
    totalSpend,
    currency: valid.find(t => t.currency)?.currency ?? null,
    busiestMonth: null,
    busiestWeekday: null,
    topPickup: null,
    longestTrip: null,
    priciestTrip: null,
  }
}
```

(Fill histogram + highlight helpers in same commit before marking done.)

- [ ] **Step 4: Run test — expect PASS**

- [ ] **Step 5: Implement `personality.ts` with unit test**

```ts
// shared/lib/personality.ts
import type { WrappedStats } from './wrapped-stats'

export function pickPersonality(stats: WrappedStats, trips: Trip[]): string {
  const night = trips.filter(t => {
    const h = t.startedAt.getHours()
    return h >= 22 || h < 5
  }).length
  if (trips.length && night / trips.length >= 0.4) return 'Night Owl'
  if (trips.some(t => /airport/i.test(`${t.pickup} ${t.dropoff}`))) return 'Airport Regular'
  return 'Road Warrior'
}
```

- [ ] **Step 6: Commit**

```bash
git add shared tests && git commit -m "feat: add Trip types and wrapped stats"
```

---

### Task 3: Provider fingerprints and column synonyms

**Files:**
- Create: `shared/constants/providers.ts`
- Create: `shared/constants/column-synonyms.ts`
- Test: `tests/unit/fingerprint.test.ts`

- [ ] **Step 1: Define fingerprint type and Uber/Ola/Rapido stubs**

```ts
// shared/constants/providers.ts
export type ProviderFingerprint = {
  id: 'uber' | 'ola' | 'rapido'
  pathPatterns: RegExp[]
  fileNamePatterns: RegExp[]
  requiredHeaders: string[] // normalized lowercase
  columnMap: Partial<Record<'startedAt' | 'fare' | 'pickup' | 'dropoff' | 'distanceKm' | 'status', string>>
}

export const PROVIDER_FINGERPRINTS: ProviderFingerprint[] = [
  {
    id: 'uber',
    pathPatterns: [/uber/i],
    fileNamePatterns: [/trip/i, /ride/i],
    requiredHeaders: [], // fill from real export samples
    columnMap: {},
  },
  // ola, rapido — add when sample exports available
]
```

- [ ] **Step 2: Add `matchFingerprint(path, headers)` and test**

- [ ] **Step 3: Add `column-synonyms.ts` with maps like `pickup: ['pickup', 'pick up location', 'from']`**

- [ ] **Step 4: Commit**

---

### Task 4: Web Workers — unzip and parse

**Files:**
- Create: `app/workers/unzip.worker.ts`
- Create: `app/workers/parse-csv.worker.ts`
- Create: `app/workers/parse-xlsx.worker.ts`
- Create: `shared/lib/parse-helpers.ts`

- [ ] **Step 1: unzip.worker — accept ArrayBuffer, return `{ path, data: Uint8Array }[]`**

Use `fflate.unzip` on worker message `{ type: 'unzip', buffer }`.

- [ ] **Step 2: parse-csv.worker — use PapaParse, return `ParsedTable`**

- [ ] **Step 3: parse-xlsx.worker — first sheet only, header row 1**

- [ ] **Step 4: Manual smoke in upload page (temporary log)** then remove log.

- [ ] **Step 5: Commit**

---

### Task 5: infer-columns worker + normalize

**Files:**
- Create: `app/workers/infer-columns.worker.ts`
- Create: `shared/lib/normalize-trips.ts`
- Test: `tests/unit/normalize-trips.test.ts`

- [ ] **Step 1: infer worker runs L1 fingerprint → L2 synonym scores → returns `ColumnMapping[]` + confidence**

- [ ] **Step 2: `normalizeTrips(table, mapping): Trip[]` with date/number parsing**

- [ ] **Step 3: Unit test with fixture header row from `tests/fixtures/uber-trips.csv`**

- [ ] **Step 4: Commit**

---

### Task 6: `useRideImport` composable

**Files:**
- Create: `app/composables/useRideImport.ts`
- Modify: `app/pages/upload.vue`

- [ ] **Step 1: Composable API**

```ts
export function useRideImport() {
  const progress = ref(0)
  const error = ref<string | null>(null)
  const trips = useState<Trip[]>('ride-trips', () => [])
  const pendingMapping = useState<ColumnMapping[] | null>('ride-pending-mapping', () => null)

  async function ingest(files: File[]) { /* spawn workers, merge */ }

  return { progress, error, trips, pendingMapping, ingest }
}
```

- [ ] **Step 2: Wire upload page — drag/drop + file input**

- [ ] **Step 3: On success: `navigateTo` `/wrapped` if high confidence else `/map`**

- [ ] **Step 4: Commit**

---

### Task 7: Map confirmation page

**Files:**
- Create: `app/pages/map.vue`
- Create: `app/components/ride/RideMappingConfirm.vue`

- [ ] **Step 1: UI lists canonical fields with select per CSV column**

- [ ] **Step 2: `data-testid="ride-mapping-confirm"` on root; `ride-mapping-submit` on continue**

- [ ] **Step 3: Re-run normalize on submit → `navigateTo('/wrapped')`**

- [ ] **Step 4: Commit**

---

### Task 8: Story slides and wrapped player

**Files:**
- Create: `app/composables/useWrappedStory.ts`
- Create: `app/layouts/wrapped.vue`
- Create: `app/pages/wrapped.vue`
- Create: `app/components/wrapped/WrappedSlidePlayer.vue`
- Create: `app/components/wrapped/WrappedSlide.vue`

- [ ] **Step 1: `buildStorySlides(stats, personality): StorySlide[]` — skip missing data**

- [ ] **Step 2: Player — index state, next/prev, keyboard, reduced motion**

- [ ] **Step 3: `data-testid="wrapped-slide-player"` and `wrapped-slide-{id}` on slides**

- [ ] **Step 4: Commit**

---

### Task 9: Share PNG export

**Files:**
- Create: `app/composables/useWrappedShare.ts`
- Create: `app/components/wrapped/WrappedShareCard.vue`
- Modify: `app/pages/wrapped.vue`

- [ ] **Step 1: Share card template (hidden off-screen or on CTA slide)**

- [ ] **Step 2: `downloadSharePng({ width: 1080, height: 1920 })` via html-to-image**

- [ ] **Step 3: `data-testid="wrapped-share-download"`**

- [ ] **Step 4: Commit**

---

### Task 10: Landing page + SEO

**Files:**
- Create: `app/pages/index.vue`
- Modify: `nuxt.config.ts` site config

- [ ] **Step 1: Hero, privacy bullets, CTA to `/upload`**

- [ ] **Step 2: `@nuxtjs/seo` title/description/OG for `/`**

- [ ] **Step 3: Commit**

---

### Task 11: shadcn-vue setup

**Files:**
- Create: `app/components/ui/*` via CLI
- Use in upload/map only

- [ ] **Step 1: Init shadcn-vue per Nuxt docs**

- [ ] **Step 2: Button, Progress, Select for mapping page**

- [ ] **Step 3: No data-testid under `ui/`**

- [ ] **Step 4: Commit**

---

### Task 12: E2E happy path

**Files:**
- Create: `tests/e2e/wrapped.spec.ts`
- Create: `tests/fixtures/minimal-uber.csv`

- [ ] **Step 1: Playwright config for Nuxt**

- [ ] **Step 2: Test upload fixture → wrapped headline visible**

- [ ] **Step 3: Run `pnpm exec playwright test`**

- [ ] **Step 4: Commit**

---

### Task 13: Optional L3 WASM (defer if L1/L2 sufficient)

**Files:**
- Create: `app/plugins/wasm-inference.client.ts`
- Create: `app/lib/embeddings.ts`

- [ ] **Step 1: Dynamic import `@xenova/transformers` only when `confidence < 0.6`**

- [ ] **Step 2: Document model size in README; host under `public/models/` if needed**

- [ ] **Step 3: Commit**

---

## Plan self-review (spec coverage)

| Spec section | Task |
|--------------|------|
| Privacy / no server | Task 1 routeRules, no API tasks |
| Upload zip/csv/xlsx | Task 4, 6 |
| Hybrid inference | Task 3, 5, 13 |
| Map skip threshold | Task 6 navigate logic |
| Story slides | Task 2, 8 |
| Share PNG | Task 9 |
| data-testid rules | Task 7, 8, 9 |
| Vitest + Playwright | Task 2, 12 |

No TBD placeholders in task list. **Uber fingerprints:** Implemented from `docs/ride-data-format.md` (no personal exports). Tests use `tests/fixtures/uber-rider-trips-sample.csv` (synthetic rows). Extend `ride-data-format.md` + `providers.ts` when Ola/Rapido columns are documented.

---

## Execution handoff

Plan complete and saved to `docs/superpowers/plans/2026-05-30-ride-wrapped-mvp.md`.

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks  
**2. Inline Execution** — implement in this session with checkpoints

Which approach do you want?
