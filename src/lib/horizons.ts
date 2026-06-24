export interface HorizonDef {
  key: string
  label: string
  days: number
  tag: string
}

/** The 15 horizons from the prototype, in order. */
export const HORIZONS: HorizonDef[] = [
  { key: '1w', label: '1 week', days: 7, tag: 'This week' },
  { key: '2w', label: '2 weeks', days: 14, tag: 'Fortnight' },
  { key: '1mo', label: '1 month', days: 30, tag: 'Soon' },
  { key: '2mo', label: '2 months', days: 61, tag: 'Soon' },
  { key: '3mo', label: '3 months', days: 91, tag: 'A quarter' },
  { key: '6mo', label: '6 months', days: 182, tag: 'Half a year' },
  { key: '9mo', label: '9 months', days: 274, tag: 'Three quarters' },
  { key: '1y', label: '1 year', days: 365, tag: 'Near horizon' },
  { key: '2y', label: '2 years', days: 730, tag: 'Building' },
  { key: '3y', label: '3 years', days: 1095, tag: 'Building' },
  { key: '4y', label: '4 years', days: 1461, tag: 'Building' },
  { key: '5y', label: '5 years', days: 1826, tag: 'Near horizon' },
  { key: '10y', label: '10 years', days: 3652, tag: 'Legacy' },
  { key: '20y', label: '20 years', days: 7305, tag: 'Legacy' },
  { key: '30y', label: '30 years', days: 10958, tag: 'Lifetime' },
]

export function hz(key: string): HorizonDef {
  return HORIZONS.find((h) => h.key === key) || HORIZONS.find((h) => h.key === '1y')!
}

/** Target date for a horizon = today + days. */
export function horizonDate(key: string): Date {
  const h = hz(key)
  const d = new Date()
  d.setDate(d.getDate() + h.days)
  return d
}
