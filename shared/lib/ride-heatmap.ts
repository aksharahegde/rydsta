import type { Trip } from '../types/trip'
import { tripsForYear } from './wrapped-stats'

export type HeatmapLevel = 0 | 1 | 2 | 3 | 4

export type HeatmapCell = {
  date: string | null
  count: number
  level: HeatmapLevel
}

export type HeatmapWeek = {
  days: HeatmapCell[]
}

export type HeatmapMonthLabel = {
  weekIndex: number
  label: string
}

export type YearHeatmap = {
  year: number
  weeks: HeatmapWeek[]
  monthLabels: HeatmapMonthLabel[]
}

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

function dayKey(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function countToLevel(count: number, max: number): HeatmapLevel {
  if (count === 0 || max <= 0) return 0
  const ratio = count / max
  if (ratio <= 0.25) return 1
  if (ratio <= 0.5) return 2
  if (ratio <= 0.75) return 3
  return 4
}

function buildDayCounts(trips: Trip[], year: number): Map<string, number> {
  const counts = new Map<string, number>()
  for (const t of tripsForYear(trips, year)) {
    const key = dayKey(t.startedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }
  return counts
}

function buildMonthLabels(weeks: HeatmapWeek[]): HeatmapMonthLabel[] {
  const labels: HeatmapMonthLabel[] = []
  let lastMonth = -1

  weeks.forEach((week, weekIndex) => {
    for (const cell of week.days) {
      if (!cell.date) continue
      const month = Number(cell.date.slice(5, 7)) - 1
      if (month !== lastMonth) {
        labels.push({ weekIndex, label: MONTH_SHORT[month] ?? '' })
        lastMonth = month
      }
      return
    }
  })

  return labels
}

export function buildYearHeatmap(trips: Trip[], year: number): YearHeatmap {
  const dayCounts = buildDayCounts(trips, year)
  const maxCount = Math.max(0, ...dayCounts.values())

  const yearStart = new Date(year, 0, 1)
  const yearEnd = new Date(year, 11, 31)

  const gridStart = new Date(yearStart)
  gridStart.setDate(gridStart.getDate() - gridStart.getDay())

  const weeks: HeatmapWeek[] = []
  const cursor = new Date(gridStart)

  while (weeks.length < 54) {
    const days: HeatmapCell[] = []
    for (let d = 0; d < 7; d++) {
      const inYear = cursor.getFullYear() === year
      const key = inYear ? dayKey(cursor) : null
      const count = key ? (dayCounts.get(key) ?? 0) : 0
      days.push({
        date: key,
        count,
        level: inYear ? countToLevel(count, maxCount) : 0,
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    weeks.push({ days })

    if (cursor > yearEnd && cursor.getDay() === 0) break
  }

  return {
    year,
    weeks,
    monthLabels: buildMonthLabels(weeks),
  }
}
