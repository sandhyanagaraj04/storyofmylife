import { Navigate, useNavigate } from 'react-router-dom'
import { useAeon } from '../store'
import { horizonDate } from '../lib/horizons'
import { age, birthYear } from '../lib/format'

const LIFE_SPAN = 90

export default function Timeline() {
  const navigate = useNavigate()
  const s = useAeon()
  if (!s.dob || !s.name) return <Navigate to="/" replace />

  const by = birthYear(s.dob)
  const now = new Date().getFullYear()
  const a = age(s.dob)

  const lived = a
  const ahead = LIFE_SPAN - a
  const weeks = Math.round(a * 52.18)

  const stats: [string, string][] = [
    [String(lived), 'Years lived'],
    [weeks.toLocaleString(), 'Weeks of memories'],
    [String(ahead), 'Years to dream in'],
    [String(s.milestones.length), 'Milestones set'],
  ]

  const msYears = new Set(s.milestones.map((m) => horizonDate(m.hz).getFullYear()))

  return (
    <section id="view-timeline" className="fade-in">
      <div className="page-head">
        <div>
          <h2>{s.name.split(' ')[0]}'s life in years</h2>
          <div className="sub">
            Each square is one year. Click any year to drill into months, weeks, days — down to the
            second.
          </div>
        </div>
        <span className="pill">📍 <span>{s.place}</span></span>
      </div>

      <div className="stat-row">
        {stats.map(([n, l]) => (
          <div className="glass stat hover-lift" key={l}>
            <div className="n gradtext">{n}</div>
            <div className="l">{l}</div>
          </div>
        ))}
      </div>

      <div className="life-legend">
        <span>
          <i className="dot" style={{ background: 'linear-gradient(135deg,#8b5cf6,#e635a8)' }} /> Lived
        </span>
        <span>
          <i className="dot" style={{ background: 'var(--grad)' }} /> This year
        </span>
        <span>
          <i className="dot" style={{ background: 'var(--glass)', border: '1px solid var(--stroke)' }} /> Ahead
        </span>
        <span>
          <i className="dot" style={{ background: 'var(--gold)' }} /> Has a milestone
        </span>
      </div>

      <div className="glass" style={{ padding: 22 }}>
        <div className="year-grid">
          {Array.from({ length: LIFE_SPAN }, (_, i) => {
            const y = by + i
            const cls = y < now ? 'past' : y === now ? 'now' : 'future'
            const ms = msYears.has(y) ? 'milestone' : ''
            return (
              <div
                key={i}
                className={`ycell ${cls} ${ms}`}
                title={`${y} · age ${i}`}
                onClick={() => navigate(`/year/${y}`)}
              >
                {i}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
