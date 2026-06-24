import { create } from 'zustand'
import type { AeonState, CatName, Entry, Milestone } from './types'
import { guessCat } from './lib/categories'
import { uid } from './lib/format'
import { seedEntries, seedMilestones } from './lib/seed'
import { type Backend, type Mutation } from './backend'

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

/** pull a clean AeonState out of the full store */
function pick(s: AeonState): AeonState {
  return {
    name: s.name,
    dob: s.dob,
    place: s.place,
    activeHorizon: s.activeHorizon,
    activeCat: s.activeCat,
    milestones: s.milestones.map((m) => ({ ...m, have: [...m.have], need: [...m.need] })),
    entries: Object.fromEntries(Object.entries(s.entries).map(([k, v]) => [k, [...v]])),
  }
}

interface AeonStore extends AeonState {
  backend: Backend | null
  hydrated: boolean
  lastError: string | null

  hasUser: () => boolean
  init: (backend: Backend) => Promise<void>
  reset: () => void

  startStory: (name: string, dob: string, place: string) => void
  setHorizon: (key: string) => void
  setCat: (cat: CatName | 'All') => void
  addMilestone: (m: Omit<Milestone, 'id' | 'have' | 'need'>) => void
  addEntry: (key: string, time: string, text: string) => void
  addReq: (milestoneId: string, type: 'have' | 'need', text: string) => void
  toggleReq: (milestoneId: string, reqId: string) => void
}

export const useAeon = create<AeonStore>((set, get) => {
  /** apply a recipe to local state, then persist the emitted mutations */
  const run = (recipe: (s: AeonState) => Mutation[] | void) => {
    let muts: Mutation[] = []
    set((state) => {
      const next = pick(state)
      muts = recipe(next) || []
      return { ...state, ...next }
    })
    const backend = get().backend
    if (backend && muts.length) {
      const snap = pick(get())
      Promise.all(muts.map((m) => backend.apply(m, snap))).catch((err) => {
        console.error('[aeon] persist failed:', err)
        set({ lastError: err?.message ? String(err.message) : 'Could not save changes.' })
      })
    }
  }

  return {
    ...emptyState(),
    backend: null,
    hydrated: false,
    lastError: null,

    hasUser: () => !!(get().dob && get().name),

    init: async (backend) => {
      set({ backend, hydrated: false, lastError: null })
      try {
        const loaded = await backend.load()
        if (loaded) {
          set({ ...loaded, hydrated: true })
        } else if (backend.mode === 'local') {
          // fresh local visitor → pre-seed the demo so it isn't empty
          const seeded: AeonState = { ...emptyState(), milestones: seedMilestones(), entries: seedEntries() }
          set({ ...seeded, hydrated: true })
          await backend.apply({ kind: 'seed', milestones: seeded.milestones, entries: seeded.entries }, seeded)
        } else {
          set({ ...emptyState(), hydrated: true })
        }
      } catch (err: any) {
        console.error('[aeon] load failed:', err)
        set({ ...emptyState(), hydrated: true, lastError: err?.message ?? 'Could not load your data.' })
      }
    },

    reset: () => set({ ...emptyState(), backend: null, hydrated: false, lastError: null }),

    startStory: (name, dob, place) =>
      run((s) => {
        s.name = name.trim() || 'Friend'
        s.dob = dob
        s.place = place.trim() || 'Earth'
        const muts: Mutation[] = [{ kind: 'profile' }]
        // first time onboarding into a fresh cloud account → seed the demo board
        if (get().backend?.mode === 'cloud' && s.milestones.length === 0) {
          const milestones = seedMilestones()
          const entries = seedEntries()
          s.milestones = milestones
          s.entries = entries
          muts.push({ kind: 'seed', milestones, entries })
        }
        return muts
      }),

    setHorizon: (key) =>
      run((s) => {
        s.activeHorizon = String(key)
        return [{ kind: 'profile' }]
      }),

    setCat: (cat) =>
      run((s) => {
        s.activeCat = cat
        return [{ kind: 'profile' }]
      }),

    addMilestone: (partial) =>
      run((s) => {
        const milestone: Milestone = { id: uid(), have: [], need: [], ...partial }
        s.milestones.push(milestone)
        s.activeHorizon = milestone.hz
        return [{ kind: 'milestone', milestone }, { kind: 'profile' }]
      }),

    addEntry: (key, time, text) =>
      run((s) => {
        const t = text.trim()
        if (!t) return []
        const entry: Entry = { id: uid(), time: time || '12:00', t, d: '', cat: guessCat(t) }
        ;(s.entries[key] ||= []).push(entry)
        return [{ kind: 'entry', key, entry }]
      }),

    addReq: (milestoneId, type, text) =>
      run((s) => {
        const t = text.trim()
        if (!t) return []
        const m = s.milestones.find((x) => x.id === milestoneId)
        if (!m) return []
        const req = { id: uid(), t, d: '' }
        ;(type === 'have' ? m.have : m.need).push(req)
        return [{ kind: 'requirement', milestoneId, reqKind: type, req }]
      }),

    toggleReq: (milestoneId, reqId) =>
      run((s) => {
        const m = s.milestones.find((x) => x.id === milestoneId)
        if (!m) return []
        const inNeed = m.need.findIndex((r) => r.id === reqId)
        if (inNeed >= 0) {
          const [r] = m.need.splice(inNeed, 1)
          m.have.push(r)
          return [{ kind: 'toggle', reqId, to: 'have' }]
        }
        const inHave = m.have.findIndex((r) => r.id === reqId)
        if (inHave >= 0) {
          const [r] = m.have.splice(inHave, 1)
          m.need.push(r)
          return [{ kind: 'toggle', reqId, to: 'need' }]
        }
        return []
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
  let out: Entry[] = []
  for (const k of Object.keys(entries)) {
    const [ky, km] = k.split('-').map(Number)
    if (ky === y && (m == null || km === m)) out = out.concat(entries[k])
  }
  return out
}
