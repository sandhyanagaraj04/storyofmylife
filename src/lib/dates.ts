import { format } from 'date-fns'

export const YEAR_MS = 365.2425 * 24 * 60 * 60 * 1000

/** entry key for a given year, 0-indexed month, day */
export function entryKey(y: number, m: number, d: number): string {
  return `${y}-${m}-${d}`
}

export function parseDob(dob: string): Date {
  // dob is "YYYY-MM-DD"; construct a local date
  const [y, m, d] = dob.split('-').map(Number)
  return new Date(y, (m ?? 1) - 1, d ?? 1)
}

export function ageNow(dob: string, today = new Date()): number {
  return Math.floor((today.getTime() - parseDob(dob).getTime()) / YEAR_MS)
}

/** age the user will be in a given calendar year */
export function ageInYear(dob: string, year: number): number {
  return year - parseDob(dob).getFullYear()
}

export function weeksLived(dob: string, today = new Date()): number {
  const ms = today.getTime() - parseDob(dob).getTime()
  return Math.max(0, Math.floor(ms / (7 * 24 * 60 * 60 * 1000)))
}

export function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate()
}

export const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const MONTHS_SHORT = MONTHS.map((m) => m.slice(0, 3))

export const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function fmtDayLabel(y: number, m: number, d: number): string {
  return format(new Date(y, m, d), 'EEEE, MMMM d, yyyy')
}

/** which "week of month" (1-based) a given day falls in, by calendar rows */
export function weekOfMonth(year: number, month0: number, day: number): number {
  const firstDow = new Date(year, month0, 1).getDay()
  return Math.floor((day - 1 + firstDow) / 7) + 1
}

export function sortByTime<T extends { time: string }>(arr: T[]): T[] {
  return [...arr].sort((a, b) => a.time.localeCompare(b.time))
}
