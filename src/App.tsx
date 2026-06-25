import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Background from './components/Background'
import TopBar from './components/TopBar'
import Onboarding from './pages/Onboarding'
import Timeline from './pages/Timeline'
import Drill from './pages/Drill'
import Vision from './pages/Vision'
import MilestoneDetail from './pages/MilestoneDetail'
import Login from './pages/Login'
import { useAuth } from './auth'
import { useAeon } from './store'
import { LocalBackend, SupabaseBackend } from './backend'

function Splash() {
  return (
    <section id="view-onboard">
      <div className="glass onboard-wrap fade-in" style={{ textAlign: 'center' }}>
        <div className="kicker">Aeon</div>
        <h1 style={{ fontSize: 28 }}>
          <span className="gradtext">Loading your story…</span>
        </h1>
      </div>
    </section>
  )
}

export default function App() {
  const { pathname } = useLocation()
  const { mode, authed, loading, userId } = useAuth()
  const init = useAeon((s) => s.init)
  const reset = useAeon((s) => s.reset)
  const hydrated = useAeon((s) => s.hydrated)

  // smooth-scroll to top on navigation, matching the prototype
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  // wire the store to the right backend whenever auth state changes
  useEffect(() => {
    if (mode === 'local') {
      init(new LocalBackend())
    } else if (authed && userId) {
      init(new SupabaseBackend(userId))
    } else {
      reset()
    }
  }, [mode, authed, userId, init, reset])

  const needLogin = mode === 'cloud' && !authed
  const booting = (mode === 'cloud' && loading) || (!needLogin && !hydrated)
  const showTopBar = pathname !== '/' && pathname !== '/login' && !needLogin

  return (
    <>
      <Background />
      <div className="app">
        {showTopBar && <TopBar />}
        {booting ? (
          <Splash />
        ) : (
          <Routes>
            <Route path="/login" element={<Login />} />
            {needLogin ? (
              <Route path="*" element={<Navigate to="/login" replace />} />
            ) : (
              <>
                <Route path="/" element={<Onboarding />} />
                <Route path="/timeline" element={<Timeline />} />
                <Route path="/year/:y" element={<Drill />} />
                <Route path="/year/:y/:m" element={<Drill />} />
                <Route path="/year/:y/:m/:d" element={<Drill />} />
                <Route path="/vision" element={<Vision />} />
                <Route path="/milestone/:id" element={<MilestoneDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        )}
      </div>
    </>
  )
}
