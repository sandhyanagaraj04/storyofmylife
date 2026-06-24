import { useLocation, useNavigate } from 'react-router-dom'
import { useAeon } from '../store'

export default function TopBar() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const name = useAeon((s) => s.name)

  // timeline tab is active on the timeline + any drill view;
  // vision tab is active on the board + any milestone detail
  const timelineOn = pathname === '/timeline' || pathname.startsWith('/year')
  const visionOn = pathname === '/vision' || pathname.startsWith('/milestone')

  return (
    <div className="topbar" id="topbar">
      <div className="brand" onClick={() => navigate('/timeline')}>
        <div className="logo">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2v20M2 12h20" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
            <circle cx="12" cy="12" r="4.5" stroke="#fff" strokeWidth="2.2" />
          </svg>
        </div>
        <span className="gradtext">Aeon</span>
      </div>
      <div className="nav">
        <button className={timelineOn ? 'on' : ''} onClick={() => navigate('/timeline')}>
          Life Timeline
        </button>
        <button className={visionOn ? 'on' : ''} onClick={() => navigate('/vision')}>
          Vision Board
        </button>
      </div>
      <div className="who">
        <span>{name || '—'}</span>
        <div className="avatar">{(name[0] || 'A').toUpperCase()}</div>
      </div>
    </div>
  )
}
