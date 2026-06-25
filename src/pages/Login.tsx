import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth'

export default function Login() {
  const { mode, authed, signIn, signUp, signInWithGoogle } = useAuth()
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

  async function google() {
    setBusy(true)
    setMsg(null)
    const res = await signInWithGoogle()
    // success triggers a full-page redirect to Google; only errors return here
    if (res.error) {
      setBusy(false)
      setMsg(res.error)
    }
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

        <button className="oauth-btn" onClick={google} disabled={busy}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
            <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z" />
          </svg>
          Continue with Google
        </button>

        <div className="or-div"><span>or</span></div>

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
