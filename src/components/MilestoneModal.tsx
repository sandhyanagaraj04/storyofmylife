import { useEffect, useRef, useState } from 'react'
import { useAeon } from '../store'
import { CAT_NAMES } from '../lib/categories'
import { HORIZONS } from '../lib/horizons'
import type { CatName } from '../types'

export default function MilestoneModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const activeCat = useAeon((s) => s.activeCat)
  const activeHorizon = useAeon((s) => s.activeHorizon)
  const addMilestone = useAeon((s) => s.addMilestone)
  const titleRef = useRef<HTMLInputElement>(null)

  const defaultCat: CatName = activeCat === 'All' ? 'Financial' : activeCat
  const [title, setTitle] = useState('')
  const [why, setWhy] = useState('')
  const [cat, setCat] = useState<CatName>(defaultCat)
  const [hz, setHz] = useState(activeHorizon)

  // re-sync defaults each time the modal opens
  useEffect(() => {
    if (open) {
      setTitle('')
      setWhy('')
      setCat(activeCat === 'All' ? 'Financial' : activeCat)
      setHz(activeHorizon)
      const id = setTimeout(() => titleRef.current?.focus(), 60)
      return () => clearTimeout(id)
    }
  }, [open, activeCat, activeHorizon])

  function save() {
    if (!title.trim()) {
      titleRef.current?.focus()
      return
    }
    addMilestone({ title: title.trim(), why: why.trim(), cat, hz })
    onClose()
  }

  return (
    <div className={`modal-bg ${open ? 'show' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass modal">
        <h3>New milestone</h3>
        <p className="h">A future worth planning for.</p>
        <div className="field">
          <label>Milestone</label>
          <input
            ref={titleRef}
            placeholder="e.g. Own a home by the sea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save() }}
          />
        </div>
        <div className="field">
          <label>Why it matters</label>
          <input
            placeholder="The deeper reason behind it"
            value={why}
            onChange={(e) => setWhy(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save() }}
          />
        </div>
        <div className="row2">
          <div className="field">
            <label>Category</label>
            <select value={cat} onChange={(e) => setCat(e.target.value as CatName)}>
              {CAT_NAMES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>Horizon</label>
            <select value={hz} onChange={(e) => setHz(e.target.value)}>
              {HORIZONS.map((h) => (
                <option key={h.key} value={h.key}>{h.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn ghost" onClick={onClose}>Cancel</button>
          <button className="btn" onClick={save}>Add to board</button>
        </div>
      </div>
    </div>
  )
}
