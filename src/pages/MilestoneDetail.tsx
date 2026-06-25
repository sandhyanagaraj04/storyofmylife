import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAeon } from '../store'
import { CATS } from '../lib/categories'
import { hz, horizonDate } from '../lib/horizons'
import { age, pct } from '../lib/format'
import MilestoneModal from '../components/MilestoneModal'
import type { Milestone, Requirement } from '../types'

export default function MilestoneDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const s = useAeon()
  const addReq = useAeon((st) => st.addReq)
  const toggleReq = useAeon((st) => st.toggleReq)
  const deleteReq = useAeon((st) => st.deleteReq)
  const deleteMilestone = useAeon((st) => st.deleteMilestone)
  const [editOpen, setEditOpen] = useState(false)

  if (!s.dob || !s.name) return <Navigate to="/" replace />
  const m = s.milestones.find((x) => x.id === id)
  if (!m) return <Navigate to="/vision" replace />

  const col = CATS[m.cat] || '#8b5cf6'
  const p = pct(m)
  const total = m.have.length + m.need.length
  const willBe = age(s.dob) + Math.floor(hz(m.hz).days / 365)
  const target = horizonDate(m.hz).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })

  function remove() {
    if (window.confirm(`Delete "${m!.title}"? This can't be undone.`)) {
      deleteMilestone(m!.id)
      navigate('/vision')
    }
  }

  return (
    <section id="view-milestone" className="fade-in">
      <div className="crumbs">
        <Link to="/vision">Vision Board</Link>
        <span className="sep">›</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{m.title}</span>
      </div>

      <div className="glass detail-hero">
        <div className="glow" style={{ background: `radial-gradient(circle at 20% 0,${col},transparent 60%)` }} />
        <div style={{ position: 'absolute', top: 18, right: 18, display: 'flex', gap: 8, zIndex: 2 }}>
          <button className="btn ghost sm" onClick={() => setEditOpen(true)}>Edit</button>
          <button className="btn ghost sm" onClick={remove}>Delete</button>
        </div>
        <span className="pill" style={{ borderColor: `${col}55`, color: col }}>
          <span className="cd" style={{ width: 8, height: 8, borderRadius: '50%', background: col, display: 'inline-block' }} />
          {m.cat} · {hz(m.hz).label} horizon
        </span>
        <h2>{m.title}</h2>
        <div className="why">{m.why || ''}</div>
        <div className="bigprog">
          <div
            className="ring"
            style={{ background: `conic-gradient(${col} ${p}%,rgba(255,255,255,.08) 0)` }}
          >
            <b>{p}%</b>
          </div>
          <div className="meta">
            <div className="a">{m.have.length} of {total} pieces in place</div>
            <div className="b">Target {target} · you'll be {willBe}</div>
          </div>
        </div>
      </div>

      <div className="req-cols">
        <ReqColumn
          milestone={m}
          type="have"
          icon="✓"
          heading="What I already have"
          color="have-col"
          placeholder="Add something you already have…"
          empty="Nothing here yet — add what you already have working for you."
          onAdd={(text) => addReq(m.id, 'have', text)}
          onToggle={(reqId) => toggleReq(m.id, reqId)}
          onDelete={(reqId) => deleteReq(m.id, reqId)}
        />
        <ReqColumn
          milestone={m}
          type="need"
          icon="◷"
          heading="What's still pending"
          color="need-col"
          placeholder="Add something you still need…"
          empty="Add the gaps between you and this milestone."
          onAdd={(text) => addReq(m.id, 'need', text)}
          onToggle={(reqId) => toggleReq(m.id, reqId)}
          onDelete={(reqId) => deleteReq(m.id, reqId)}
        />
      </div>

      <p className="second-note" style={{ marginTop: 20 }}>
        Tip: check off a "pending" item when you achieve it — it moves to "have" and your milestone
        progress climbs. In <b>Phase 2</b>, your daily timeline entries auto-link here to show you
        converging on each goal.
      </p>

      <MilestoneModal open={editOpen} onClose={() => setEditOpen(false)} editing={m} />
    </section>
  )
}

function ReqColumn({
  milestone,
  type,
  icon,
  heading,
  color,
  placeholder,
  empty,
  onAdd,
  onToggle,
  onDelete,
}: {
  milestone: Milestone
  type: 'have' | 'need'
  icon: string
  heading: string
  color: string
  placeholder: string
  empty: string
  onAdd: (text: string) => void
  onToggle: (reqId: string) => void
  onDelete: (reqId: string) => void
}) {
  const items: Requirement[] = type === 'have' ? milestone.have : milestone.need
  const [text, setText] = useState('')

  function add() {
    if (!text.trim()) return
    onAdd(text)
    setText('')
  }

  return (
    <div className={`glass req-col ${color}`}>
      <h4>
        <span className="ic">{icon}</span> {heading}{' '}
        <span className="toachieve">(to achieve the milestone)</span>
        <span className="badge">{items.length}</span>
      </h4>
      <div>
        {items.length ? (
          items.map((r) => (
            <div className={`req ${type === 'have' ? 'have' : ''}`} key={r.id}>
              <div className="ck" onClick={() => onToggle(r.id)}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 13l4 4L19 7" stroke="#06281d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="rt">
                <div className="rn">{r.t}</div>
                {r.d ? <div className="rd">{r.d}</div> : null}
              </div>
              <button
                className="req-del"
                aria-label="Delete item"
                title="Delete"
                onClick={() => onDelete(r.id)}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div style={{ color: 'var(--muted)', fontSize: 13, padding: '6px 0' }}>{empty}</div>
        )}
      </div>
      <div className="req-add">
        <input
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') add() }}
        />
        <button className="btn sm" onClick={add}>Add</button>
      </div>
    </div>
  )
}
