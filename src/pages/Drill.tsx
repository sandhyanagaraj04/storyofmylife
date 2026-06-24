import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAeon, entriesIn } from '../store'
import { CATS } from '../lib/categories'
import { MONTHS, MONTHS_F, birthYear, daysInMonth, entryKey } from '../lib/format'
import type { Entry } from '../types'

export default function Drill() {
  const params = useParams()
  const s = useAeon()
  if (!s.dob || !s.name) return <Navigate to="/" replace />

  const y = Number(params.y)
  const m = params.m != null ? Number(params.m) : null
  const d = params.d != null ? Number(params.d) : null

  if (d != null && m != null) return <DayView y={y} m={m} d={d} />
  if (m != null) return <MonthView y={y} m={m} />
  return <YearView y={y} />
}

/* ---------------- YEAR ---------------- */
function YearView({ y }: { y: number }) {
  const navigate = useNavigate()
  const entries = useAeon((s) => s.entries)
  const dob = useAeon((s) => s.dob)
  const ageThen = y - birthYear(dob)

  return (
    <section className="fade-in">
      <div className="crumbs">
        <Link to="/timeline">Life Timeline</Link>
        <span className="sep">›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{y} · age {ageThen}</span>
      </div>
      <div className="page-head">
        <div>
          <h2>{y}</h2>
          <div className="sub">The year you turned {ageThen}. Pick a month to keep going.</div>
        </div>
      </div>
      <div className="grid-cards g12">
        {Array.from({ length: 12 }, (_, m) => {
          const list = entriesIn(entries, y, m)
          const prev = list[0] ? list[0].t : 'No entries yet'
          return (
            <div className="glass cell-card hover-lift" key={m} onClick={() => navigate(`/year/${y}/${m}`)}>
              <div className="top">
                <span className="name">{MONTHS[m]}</span>
                <span className="cnt">{list.length || ''}</span>
              </div>
              <div className="preview">{prev}</div>
              <div className="bar">
                <i style={{ width: `${Math.min(list.length * 18, 100)}%` }} />
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- MONTH ---------------- */
function MonthView({ y, m }: { y: number; m: number }) {
  const navigate = useNavigate()
  const entries = useAeon((s) => s.entries)
  const days = daysInMonth(y, m)

  return (
    <section className="fade-in">
      <div className="crumbs">
        <Link to="/timeline">Life Timeline</Link>
        <span className="sep">›</span>
        <Link to={`/year/${y}`}>{y}</Link>
        <span className="sep">›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{MONTHS_F[m]}</span>
      </div>
      <div className="page-head">
        <div>
          <h2>{MONTHS_F[m]} {y}</h2>
          <div className="sub">
            Each tile is a day. Open one to log moments — weeks and seconds live inside.
          </div>
        </div>
      </div>
      <div className="grid-cards" style={{ gridTemplateColumns: 'repeat(auto-fill,minmax(96px,1fr))' }}>
        {Array.from({ length: days }, (_, i) => {
          const d = i + 1
          const list = entriesIn(entries, y, m, d)
          return (
            <div
              className="glass cell-card hover-lift"
              style={{ minHeight: 84 }}
              key={d}
              onClick={() => navigate(`/year/${y}/${m}/${d}`)}
            >
              <div className="top">
                <span className="name" style={{ fontSize: 15 }}>{d}</span>
                {list.length ? <span className="cnt">{list.length}●</span> : null}
              </div>
              <div className="preview" style={{ marginTop: 6 }}>
                {list.length ? list[0].t : <span style={{ opacity: 0.5 }}>—</span>}
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------------- DAY ---------------- */
function DayView({ y, m, d }: { y: number; m: number; d: number }) {
  const entries = useAeon((s) => s.entries)
  const addEntry = useAeon((s) => s.addEntry)
  const key = entryKey(y, m, d)
  const list: Entry[] = [...(entries[key] || [])].sort((a, b) => a.time.localeCompare(b.time))

  const [time, setTime] = useState('09:00')
  const [text, setText] = useState('')

  function log() {
    if (!text.trim()) return
    addEntry(key, time, text)
    setText('')
  }

  return (
    <section className="fade-in">
      <div className="crumbs">
        <Link to="/timeline">Life Timeline</Link>
        <span className="sep">›</span>
        <Link to={`/year/${y}`}>{y}</Link>
        <span className="sep">›</span>
        <Link to={`/year/${y}/${m}`}>{MONTHS_F[m]}</Link>
        <span className="sep">›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{MONTHS[m]} {d}</span>
      </div>
      <div className="page-head">
        <div>
          <h2>{MONTHS_F[m]} {d}, {y}</h2>
          <div className="sub">
            Your day, moment by moment. Add anything — a win, a feeling, a memory.
          </div>
        </div>
      </div>

      <div className="day-layout">
        {list.length ? (
          list.map((e, i) => {
            const c = (e.cat && CATS[e.cat]) || '#8b5cf6'
            return (
              <div className="glass entry" key={i}>
                <div className="time">{e.time}</div>
                <div className="body">
                  <div className="t">{e.t}</div>
                  {e.d ? <div className="d">{e.d}</div> : null}
                </div>
                <span
                  className="tag"
                  style={{ background: `${c}22`, color: c, border: `1px solid ${c}44` }}
                >
                  {e.cat || 'Moment'}
                </span>
              </div>
            )
          })
        ) : (
          <div className="empty">Nothing logged yet. What happened today?</div>
        )}
      </div>

      <div className="glass" style={{ padding: 16, marginTop: 16 }}>
        <div className="add-entry">
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            style={{ flex: '0 0 110px' }}
          />
          <input
            placeholder="What happened? (e.g. Signed the lease 🎉)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') log() }}
          />
          <button className="btn sm" onClick={log}>Log it</button>
        </div>
      </div>

      <div className="second-note">
        ⏱ Down to the second: every entry is timestamped. In a full build you'll zoom from this day
        into the exact second a moment happened — your life, at infinite resolution.
      </div>
    </section>
  )
}
