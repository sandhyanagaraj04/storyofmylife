/* ============================================================
   Aeon data model.
   In local mode this is persisted as one JSON doc (key "aeon").
   In cloud mode it is assembled from / written to Supabase tables.
   Items carry stable ids so normalized rows map cleanly.
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
  id: string
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
  id: string
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

/** The profile-level fields (everything except the collections). */
export type ProfileFields = Pick<
  AeonState,
  'name' | 'dob' | 'place' | 'activeHorizon' | 'activeCat'
>
