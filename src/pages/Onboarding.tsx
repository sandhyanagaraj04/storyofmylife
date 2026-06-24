import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAeon } from '../store'

export default function Onboarding() {
  const navigate = useNavigate()
  const hasUser = useAeon((s) => s.hasUser())
  const startStory = useAeon((s) => s.startStory)

  const [name, setName] = useState('')
  const [dob, setDob] = useState('1996-08-14')
  const [place, setPlace] = useState('')

  // already onboarded → straight to the timeline
  if (hasUser) return <Navigate to="/timeline" replace />

  function begin() {
    if (!dob) return
    startStory(name, dob, place)
    navigate('/timeline')
  }

  return (
    <section id="view-onboard">
      <div className="glass onboard-wrap fade-in">
        <div className="kicker">Your story begins</div>
        <h1>
          Map your life,
          <br />
          <span className="gradtext">second by second.</span>
        </h1>
        <p className="sub">
          Aeon turns your date of birth into a living timeline — then lets you dream forward with a
          vision board of everything you want to become.
        </p>
        <div className="field">
          <label>What's your name?</label>
          <input
            placeholder="e.g. Sandhya Nagaraj"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="row2">
          <div className="field">
            <label>Date of birth</label>
            <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
          </div>
          <div className="field">
            <label>Place of birth</label>
            <input
              placeholder="e.g. Bengaluru, India"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
            />
          </div>
        </div>
        <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={begin}>
          Begin your story →
        </button>
        <p style={{ fontSize: '11.5px', color: 'var(--muted)', marginTop: 16 }}>
          Everything stays on your device in this prototype.
        </p>
      </div>
    </section>
  )
}
