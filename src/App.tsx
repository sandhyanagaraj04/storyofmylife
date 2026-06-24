import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Background from './components/Background'
import TopBar from './components/TopBar'
import Onboarding from './pages/Onboarding'
import Timeline from './pages/Timeline'
import Drill from './pages/Drill'
import Vision from './pages/Vision'
import MilestoneDetail from './pages/MilestoneDetail'

export default function App() {
  const { pathname } = useLocation()
  const showTopBar = pathname !== '/'

  // smooth-scroll to top on navigation, matching the prototype
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <>
      <Background />
      <div className="app">
        {showTopBar && <TopBar />}
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/timeline" element={<Timeline />} />
          <Route path="/year/:y" element={<Drill />} />
          <Route path="/year/:y/:m" element={<Drill />} />
          <Route path="/year/:y/:m/:d" element={<Drill />} />
          <Route path="/vision" element={<Vision />} />
          <Route path="/milestone/:id" element={<MilestoneDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </>
  )
}
