import { create } from 'zustand'
import type { AeonState, CatName, Milestone, Requirement } from './types'
import { HORIZONS } from './lib/horizons'
import { guessCat } from './lib/categories'
import { uid } from './lib/format'

const KEY = 'aeon'

function emptyState(): AeonState {
  return {
    name: '',
    dob: '',
    place: '',
    activeHorizon: '5y',
    activeCat: 'All',
    milestones: [],
    entries: {},
  }
}

function load(): AeonState | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as AeonState) : null
  } catch {
    return null
  }
}

function persist(s: AeonState) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignore quota errors */
  }
}

/** upgrade old numeric horizons (5/10/20/30) to keys ('5y' etc.) */
function migrate(s: AeonState): AeonState {
  const map: Record<number, string> = { 5: '5y', 10: '10y', 20: '20y', 30: '30y' }
  const ah = s.activeHorizon as unknown
  if (typeof ah === 'number') s.activeHorizon = map[ah] || '5y'
  if (!HORIZONS.find((h) => h.key === s.activeHorizon)) s.activeHorizon = '5y'
  ;(s.milestones || []).forEach((m) => {
    const h = m.hz as unknown
    if (typeof h === 'number') m.hz = map[h] || `${h}y`
  })
  return s
}

/** Seed data — pre-loads the board so the demo feels alive (ported verbatim). */
function seed(s: AeonState): AeonState {
  s.milestones = [
    {
      id: uid(), title: 'Run a half-marathon',
      why: 'Prove to myself the body can keep up with the ambition.', cat: 'Health', hz: '6mo',
      have: [{ t: 'Run 5k comfortably', d: '~30 min pace' }],
      need: [{ t: 'Build to 15k long runs', d: '' }, { t: 'Strength training 2x/week', d: '' }, { t: 'Register for a race', d: '' }],
    },
    {
      id: uid(), title: 'Daily meditation, 90-day streak',
      why: 'A steady mind underneath a fast life.', cat: 'Spiritual', hz: '3mo',
      have: [{ t: 'Morning routine exists', d: 'Wake at 6' }],
      need: [{ t: '20 min sit every day', d: '' }, { t: 'A quiet corner set up', d: '' }],
    },
    {
      id: uid(), title: 'Land first consulting client',
      why: 'Plant the second income stream early.', cat: 'Career', hz: '2mo',
      have: [{ t: 'Portfolio site live', d: '' }],
      need: [{ t: 'Reach out to 20 leads', d: '' }, { t: 'Define a clear offer', d: '' }],
    },
    {
      id: uid(), title: 'Hit ₹2 Cr net worth',
      why: 'Financial freedom to choose work I love, not work I need.', cat: 'Financial', hz: '5y',
      have: [{ t: 'Emergency fund (6 months)', d: 'Already parked in liquid funds' }, { t: 'SIP of ₹40k/month running', d: 'Index + flexicap' }],
      need: [{ t: 'Second income stream', d: 'Consulting or product' }, { t: 'Max out tax-advantaged accounts', d: '' }, { t: 'Buy first rental property', d: '' }],
    },
    {
      id: uid(), title: 'Build & sell a product',
      why: 'Turn skills into something that outlives my time.', cat: 'Career', hz: '10y',
      have: [{ t: 'Core engineering skills', d: '' }, { t: 'This life-mapping idea', d: 'Aeon 🙂' }],
      need: [{ t: 'First 100 paying users', d: '' }, { t: 'Co-founder or small team', d: '' }, { t: '12 months runway', d: '' }],
    },
    {
      id: uid(), title: 'Own a home by the sea',
      why: 'A place that feels like a deep exhale.', cat: 'Financial', hz: '10y',
      have: [],
      need: [{ t: 'Down payment (₹60L)', d: '' }, { t: 'Decide the coast', d: '' }, { t: 'Stable location/work', d: '' }],
    },
    {
      id: uid(), title: 'See 30 countries',
      why: 'Collect perspectives, not just stamps.', cat: 'Adventure', hz: '20y',
      have: [{ t: '8 countries so far', d: '' }, { t: 'Remote-friendly work', d: '' }],
      need: [{ t: '2 trips a year, intentionally', d: '' }, { t: 'Travel fund', d: '' }],
    },
    {
      id: uid(), title: 'Write the family memoir',
      why: 'So the people after me know where they came from.', cat: 'Relationships', hz: '30y',
      have: [{ t: 'This timeline of memories', d: 'Aeon captures it' }],
      need: [{ t: 'Interview parents & elders', d: '' }, { t: 'Digitize old photos', d: '' }],
    },
  ]
  const y = new Date().getFullYear()
  const m = new Date().getMonth()
  s.entries[`${y}-${m}-3`] = [{ time: '07:30', t: 'Ran 6k — new personal best 🏃‍♀️', d: 'Felt strong the whole way', cat: 'Health' }]
  s.entries[`${y}-${m}-9`] = [
    { time: '14:00', t: 'Closed first consulting client 🎉', d: '₹80k retainer, 3 months', cat: 'Financial' },
    { time: '21:00', t: 'Dinner with parents', d: 'Talked about the memoir idea', cat: 'Relationships' },
  ]
  s.entries[`${y}-${m}-15`] = [{ time: '06:00', t: '20-min meditation, day 12 streak', d: '', cat: 'Spiritual' }]
  return s
}

function initialState(): AeonState {
  const loaded = load()
  if (loaded) return migrate(loaded)
  // fresh visitor: pre-seed the board so onboarding leads into a lively demo
  return seed(emptyState())
}

interface AeonStore extends AeonState {
  hasUser: () => boolean
  startStory: (name: string, dob: string, place: string) => void
  setHorizon: (key: string) => void
  setCat: (cat: CatName | 'All') => void
  addMilestone: (m: Omit<Milestone, 'id' | 'have' | 'need'>) => void
  addEntry: (key: string, time: string, text: string) => void
  addReq: (id: string, type: 'have' | 'need', text: string) => void
  toggleReq: (id: string, type: 'have' | 'need', index: number) => void
}

export const useAeon = create<AeonStore>((set, get) => {
  const commit = (mut: (s: AeonState) => void) =>
    set((state) => {
      const next: AeonState = {
        name: state.name,
        dob: state.dob,
        place: state.place,
        activeHorizon: state.activeHorizon,
        activeCat: state.activeCat,
        milestones: state.milestones.map((m) => ({ ...m, have: [...m.have], need: [...m.need] })),
        entries: Object.fromEntries(Object.entries(state.entries).map(([k, v]) => [k, [...v]])),
      }
      mut(next)
      persist(next)
      return next
    })

  return {
    ...initialState(),

    hasUser: () => !!(get().dob && get().name),

    startStory: (name, dob, place) =>
      commit((s) => {
        s.name = name.trim() || 'Friend'
        s.dob = dob
        s.place = place.trim() || 'Earth'
      }),

    setHorizon: (key) => commit((s) => { s.activeHorizon = String(key) }),

    setCat: (cat) => commit((s) => { s.activeCat = cat }),

    addMilestone: (m) =>
      commit((s) => {
        s.milestones.push({ id: uid(), have: [], need: [], ...m })
        s.activeHorizon = m.hz
      }),

    addEntry: (key, time, text) =>
      commit((s) => {
        const t = text.trim()
        if (!t) return
        const list = s.entries[key] || (s.entries[key] = [])
        list.push({ time: time || '12:00', t, d: '', cat: guessCat(t) })
      }),

    addReq: (id, type, text) =>
      commit((s) => {
        const t = text.trim()
        if (!t) return
        const m = s.milestones.find((x) => x.id === id)
        if (!m) return
        const req: Requirement = { t, d: '' }
        ;(type === 'have' ? m.have : m.need).push(req)
      }),

    toggleReq: (id, type, index) =>
      commit((s) => {
        const m = s.milestones.find((x) => x.id === id)
        if (!m) return
        if (type === 'need') {
          const [r] = m.need.splice(index, 1)
          if (r) m.have.push(r)
        } else {
          const [r] = m.have.splice(index, 1)
          if (r) m.need.push(r)
        }
      }),
  }
})

/** all entries within a year (and optionally a month / day) */
export function entriesIn(
  entries: AeonState['entries'],
  y: number,
  m?: number,
  d?: number,
) {
  if (d != null && m != null) return entries[`${y}-${m}-${d}`] || []
  let out: AeonState['entries'][string] = []
  for (const k of Object.keys(entries)) {
    const [ky, km] = k.split('-').map(Number)
    if (ky === y && (m == null || km === m)) out = out.concat(entries[k])
  }
  return out
}
