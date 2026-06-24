export type CategoryName =
  | 'Financial'
  | 'Career'
  | 'Health'
  | 'Spiritual'
  | 'Relationships'
  | 'Adventure'

export type Horizon = 5 | 10 | 20 | 30

export interface User {
  id: string
  name: string
  dob: string // ISO date "YYYY-MM-DD"
  placeOfBirth: string
  lifeSpan: number // default 90
  createdAt: string
}

export interface Entry {
  id: string
  time: string // "HH:MM" or "HH:MM:SS"
  title: string
  detail: string
  category: CategoryName | null
  mood: null // reserved (Phase 3)
  createdAt: string
}

export interface Requirement {
  id: string
  text: string
  detail: string
}

export interface Milestone {
  id: string
  title: string
  why: string
  category: CategoryName
  horizon: Horizon
  targetYear: number
  have: Requirement[]
  pending: Requirement[]
  createdAt: string
}

export interface UiState {
  activeHorizon: Horizon
  activeCategory: CategoryName | 'All'
}

export interface AeonDoc {
  user: User | null
  // entries keyed by "YYYY-M-D" (month 0-indexed)
  entries: Record<string, Entry[]>
  milestones: Milestone[]
  ui: UiState
}
