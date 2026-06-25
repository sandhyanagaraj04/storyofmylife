import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { mode, authed, signIn, signUp } = useAuth()
  const [tab, setTab] = useState<'in' | 'up'>('in')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  // local mode has no auth; cloud users already signed in skip this screen
  if (mode === 'local') return <Navigate to="/" replace />
  if (authed) return <Navigate to="/" replace />

  async function submit() {
    if (!email || !password) {
      setMsg('Email and password are required.')
      return
    }
    setBusy(true)
    setMsg(null)
    const res = tab === 'in' ? await signIn(email, password) : await signUp(email, password, name)
    setBusy(false)
    if (res.error) setMsg(res.error)
    // on success, onAuthStateChange flips `authed` and the guard above redirects
  }

  return (
    <section id="view-onboard">
      <div className="glass onboard-wrap fade-in">
        <div className="kicker">{tab === 'in' ? 'Welcome back' : 'Your story begins'}</div>
        <h1>
          {tab === 'in' ? 'Sign in to' : 'Create your'}
          <br />
          <span className="gradtext">Aeon.</span>
        </h1>
        <p className="sub">
          Your timeline and vision board sync to your account — reachable from any device.
        </p>

        {tab === 'up' && (
          <div className="field">
            <label>Your name</label>
            <input
              placeholder="e.g. Sandhya Nagaraj"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          />
        </div>
        <div className="field">
          <label>Password</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
          />
        </div>

        {msg && (
          <p style={{ color: 'var(--gold)', fontSize: 13, margin: '4px 0 6px', textAlign: 'left' }}>
            {msg}
          </p>
        )}

        <button className="btn" style={{ width: '100%', marginTop: 10 }} onClick={submit} disabled={busy}>
          {busy ? 'One moment…' : tab === 'in' ? 'Sign in →' : 'Create account →'}
        </button>

        <p style={{ fontSize: '12.5px', color: 'var(--muted)', marginTop: 18 }}>
          {tab === 'in' ? "Don't have an account? " : 'Already have one? '}
          <a
            style={{ color: 'var(--cyan)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => { setTab(tab === 'in' ? 'up' : 'in'); setMsg(null) }}
          >
            {tab === 'in' ? 'Create one' : 'Sign in'}
          </a>
        </p>
      </div>
    </section>
  )
}
