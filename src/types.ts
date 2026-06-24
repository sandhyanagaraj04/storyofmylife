/* ============================================================
   Aeon data model — mirrors the prototype's localStorage shape
   (key: "aeon") so behaviour & persistence match exactly.
   ============================================================ */

export type CatName =
  | 'Financial'
  | 'Career'
  | 'Health'
  | 'Spiritual'
  | 'Relationships'
  | 'Adventure'

/** entries may carry no category ("") until classified */
export type EntryCat = CatName | ''

export interface Requirement {
  t: string // text
  d: string // detail
}

export interface Milestone {
  id: string
  title: string
  why: string
  cat: CatName
  hz: string // horizon key, e.g. "5y"
  have: Requirement[]
  need: Requirement[]
}

export interface Entry {
  time: string // "HH:MM" (24h)
  t: string // title
  d: string // detail
  cat: EntryCat
}

export interface AeonState {
  name: string
  dob: string // "YYYY-MM-DD"
  place: string
  activeHorizon: string
  activeCat: CatName | 'All'
  milestones: Milestone[]
  // entries keyed by "Y-M-D" (month 0-indexed, matching JS Date)
  entries: Record<string, Entry[]>
}
