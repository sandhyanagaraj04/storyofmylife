import type { Milestone } from '../types'

export const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]
export const MONTHS_F = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function uid(): string {
  // valid UUIDs so client-generated ids map straight onto Postgres uuid PKs
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** age today from a "YYYY-MM-DD" dob */
export function age(dob: string): number {
  if (!dob) return 0
  const b = new Date(dob)
  const n = new Date()
  let a = n.getFullYear() - b.getFullYear()
  if (n < new Date(n.getFullYear(), b.getMonth(), b.getDate())) a--
  return a
}

export function birthYear(dob: string): number {
  return new Date(dob).getFullYear()
}

/** milestone progress percentage = have / (have + need) */
export function pct(m: Milestone): number {
  const tot = m.have.length + m.need.length
  return tot ? Math.round((m.have.length / tot) * 100) : 0
}

/** days in a 0-indexed month */
export function daysInMonth(y: number, m: number): number {
  return new Date(y, m + 1, 0).getDate()
}

export function entryKey(y: number, m: number, d: number): string {
  return `${y}-${m}-${d}`
}
