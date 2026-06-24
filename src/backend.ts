import type { AeonState, Entry, Milestone, Requirement } from './types'
import { HORIZONS } from './lib/horizons'
import { supabase } from './lib/supabase'

/* ============================================================
   A small storage abstraction so cloud sync is a drop-in.
   The store updates in-memory state optimistically, then hands
   a Mutation to the active backend to persist.
   ============================================================ */

export type Mutation =
  | { kind: 'profile' }
  | { kind: 'milestone'; milestone: Milestone }
  | { kind: 'entry'; key: string; entry: Entry }
  | { kind: 'requirement'; milestoneId: string; reqKind: 'have' | 'need'; req: Requirement }
  | { kind: 'toggle'; reqId: string; to: 'have' | 'need' }
  | { kind: 'seed'; milestones: Milestone[]; entries: Record<string, Entry[]> }

export interface Backend {
  mode: 'local' | 'cloud'
  load(): Promise<AeonState | null>
  apply(m: Mutation, state: AeonState): Promise<void>
}

/* ---------------- LOCAL (localStorage) ---------------- */

const KEY = 'aeon'

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

export class LocalBackend implements Backend {
  mode = 'local' as const

  async load(): Promise<AeonState | null> {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? migrate(JSON.parse(raw) as AeonState) : null
    } catch {
      return null
    }
  }

  // every mutation just snapshots the whole doc
  async apply(_m: Mutation, state: AeonState): Promise<void> {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* ignore quota errors */
    }
  }
}

/* ---------------- CLOUD (Supabase, normalized) ---------------- */

export class SupabaseBackend implements Backend {
  mode = 'cloud' as const
  constructor(private userId: string) {}

  private get db() {
    if (!supabase) throw new Error('Supabase client not configured')
    return supabase
  }

  async load(): Promise<AeonState | null> {
    const uid = this.userId
    const [profileRes, msRes, reqRes, enRes] = await Promise.all([
      this.db.from('profiles').select('*').eq('id', uid).maybeSingle(),
      this.db.from('milestones').select('*').eq('user_id', uid).order('created_at'),
      this.db.from('requirements').select('*').eq('user_id', uid).order('position').order('created_at'),
      this.db.from('entries').select('*').eq('user_id', uid).order('time'),
    ])
    if (profileRes.error) throw profileRes.error
    if (msRes.error) throw msRes.error
    if (reqRes.error) throw reqRes.error
    if (enRes.error) throw enRes.error

    const p = profileRes.data

    const milestones: Milestone[] = (msRes.data ?? []).map((m) => ({
      id: m.id, title: m.title, why: m.why, cat: m.cat, hz: m.hz, have: [], need: [],
    }))
    const byId = new Map(milestones.map((m) => [m.id, m]))
    for (const rq of reqRes.data ?? []) {
      const m = byId.get(rq.milestone_id)
      if (!m) continue
      const req: Requirement = { id: rq.id, t: rq.t, d: rq.d }
      ;(rq.kind === 'have' ? m.have : m.need).push(req)
    }

    const entries: Record<string, Entry[]> = {}
    for (const e of enRes.data ?? []) {
      ;(entries[e.ekey] ||= []).push({ id: e.id, time: e.time, t: e.t, d: e.d, cat: e.cat })
    }

    return {
      name: p?.name ?? 'Friend',
      dob: p?.dob ?? '',
      place: p?.place ?? 'Earth',
      activeHorizon: p?.active_horizon ?? '5y',
      activeCat: p?.active_cat ?? 'All',
      milestones,
      entries,
    }
  }

  async apply(m: Mutation, state: AeonState): Promise<void> {
    const uid = this.userId
    switch (m.kind) {
      case 'profile': {
        const { error } = await this.db.from('profiles').upsert({
          id: uid,
          name: state.name,
          dob: state.dob || null,
          place: state.place,
          active_horizon: state.activeHorizon,
          active_cat: state.activeCat,
        })
        if (error) throw error
        return
      }
      case 'milestone': {
        const x = m.milestone
        const { error } = await this.db.from('milestones').insert({
          id: x.id, user_id: uid, title: x.title, why: x.why, cat: x.cat, hz: x.hz,
        })
        if (error) throw error
        return
      }
      case 'entry': {
        const e = m.entry
        const { error } = await this.db.from('entries').insert({
          id: e.id, user_id: uid, ekey: m.key, time: e.time, t: e.t, d: e.d, cat: e.cat,
        })
        if (error) throw error
        return
      }
      case 'requirement': {
        const { error } = await this.db.from('requirements').insert({
          id: m.req.id, milestone_id: m.milestoneId, user_id: uid,
          kind: m.reqKind, t: m.req.t, d: m.req.d,
        })
        if (error) throw error
        return
      }
      case 'toggle': {
        const { error } = await this.db.from('requirements')
          .update({ kind: m.to }).eq('id', m.reqId).eq('user_id', uid)
        if (error) throw error
        return
      }
      case 'seed': {
        const msRows = m.milestones.map((x) => ({
          id: x.id, user_id: uid, title: x.title, why: x.why, cat: x.cat, hz: x.hz,
        }))
        const reqRows = m.milestones.flatMap((x) => [
          ...x.have.map((r, i) => ({ id: r.id, milestone_id: x.id, user_id: uid, kind: 'have', t: r.t, d: r.d, position: i })),
          ...x.need.map((r, i) => ({ id: r.id, milestone_id: x.id, user_id: uid, kind: 'need', t: r.t, d: r.d, position: i })),
        ])
        const enRows = Object.entries(m.entries).flatMap(([key, list]) =>
          list.map((e) => ({ id: e.id, user_id: uid, ekey: key, time: e.time, t: e.t, d: e.d, cat: e.cat })),
        )
        if (msRows.length) {
          const { error } = await this.db.from('milestones').insert(msRows)
          if (error) throw error
        }
        if (reqRows.length) {
          const { error } = await this.db.from('requirements').insert(reqRows)
          if (error) throw error
        }
        if (enRows.length) {
          const { error } = await this.db.from('entries').insert(enRows)
          if (error) throw error
        }
        return
      }
    }
  }
}
