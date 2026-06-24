import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAeon } from '../store'
import { CATS } from '../lib/categories'
import { HORIZONS, hz } from '../lib/horizons'
import { pct } from '../lib/format'
import MilestoneModal from '../components/MilestoneModal'
import type { CatName } from '../types'

export default function Vision() {
  const navigate = useNavigate()
  const s = useAeon()
  const setHorizon = useAeon((st) => st.setHorizon)
  const setCat = useAeon((st) => st.setCat)
  const [modalOpen, setModalOpen] = useState(false)

  if (!s.dob || !s.name) return <Navigate to="/" replace />

  const list = s.milestones.filter(
    (m) => m.hz === s.activeHorizon && (s.activeCat === 'All' || m.cat === s.activeCat),
  )

  return (
    <section id="view-vision" className="fade-in">
      <div className="page-head">
        <div>
          <h2>Vision Board</h2>
          <div className="sub">
            Set the milestones that define your future. Pick a horizon, then plan what it takes to
            get there.
          </div>
        </div>
      </div>

      <div className="horizon-tabs">
        {HORIZONS.map((h) => (
          <div
            key={h.key}
            className={`htab ${s.activeHorizon === h.key ? 'on' : ''}`}
            onClick={() => setHorizon(h.key)}
          >
            {h.label}
            <small>{h.tag}</small>
          </div>
        ))}
      </div>

      <div className="cat-filter">
        <div
          className={`chip ${s.activeCat === 'All' ? 'on' : ''}`}
          style={s.activeCat === 'All' ? { background: 'var(--grad)' } : undefined}
          onClick={() => setCat('All')}
        >
          All
        </div>
        {(Object.entries(CATS) as [CatName, string][]).map(([c, col]) => (
          <div
            key={c}
            className={`chip ${s.activeCat === c ? 'on' : ''}`}
            style={s.activeCat === c ? { background: col, borderColor: 'transparent' } : undefined}
            onClick={() => setCat(c)}
          >
            <span className="cd" style={{ background: col }} />
            {c}
          </div>
        ))}
      </div>

      <div className="vision-grid">
        {list.map((m) => {
          const col = CATS[m.cat] || '#8b5cf6'
          const p = pct(m)
          return (
            <div className="glass mcard hover-lift" key={m.id} onClick={() => navigate(`/milestone/${m.id}`)}>
              <div className="glow" style={{ background: col }} />
              <div className="cat-row">
                <span className="pill" style={{ borderColor: `${col}55`, color: col }}>
                  <span className="cd" style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block' }} />
                  {m.cat}
                </span>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>{hz(m.hz).label}</span>
              </div>
              <h3>{m.title}</h3>
              <div className="why">{m.why || ''}</div>
              <div className="foot">
                <div className="ring-row">
                  <span className="progress-num" style={{ color: col }}>{p}%</span>
                  <div className="minibar">
                    <i style={{ width: `${p}%`, background: col }} />
                  </div>
                </div>
                <div className="reqcount">{m.have.length} ready · {m.need.length} pending</div>
              </div>
            </div>
          )
        })}

        <div className="add-card" onClick={() => setModalOpen(true)}>
          <div className="plus">+</div>
          <div>Add a {hz(s.activeHorizon).label} milestone</div>
        </div>
      </div>

      <MilestoneModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  )
}
