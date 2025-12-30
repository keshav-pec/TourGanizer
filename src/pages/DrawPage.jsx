import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import HamburgerMenu from '../components/HamburgerMenu'

export default function DrawPage() {
  const { slug } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tournament, setTournament] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [rounds, setRounds] = useState([
    { round: 1, matches: [
      { room: 'Room A', team1: 'Team Alpha', team2: 'Team Beta', adjudicator: 'Judge Smith' },
      { room: 'Room B', team1: 'Team Gamma', team2: 'Team Delta', adjudicator: 'Judge Jones' },
    ]}
  ])

  useEffect(() => {
    fetchTournamentData()
  }, [slug])

  async function fetchTournamentData() {
    try {
      setLoading(true)

      // Check if this is a demo tournament
      const demoTournaments = {
        'national-debate-championship-2025': {
          name: 'National Debate Championship 2025',
          date: '2025-03-15',
          time: '09:00',
          rounds: 5,
          out_rounds: 2,
          members_per_team: 4
        },
        'regional-debate-series-spring': {
          name: 'Regional Debate Series - Spring',
          date: '2025-04-20',
          time: '10:00',
          rounds: 4,
          out_rounds: 1,
          members_per_team: 3
        },
        'inter-university-championship': {
          name: 'Inter-University Championship',
          date: '2024-12-10',
          time: '08:30',
          rounds: 6,
          out_rounds: 3,
          members_per_team: 4
        }
      }

      if (demoTournaments[slug]) {
        setTournament(demoTournaments[slug])
        setTeams([]) // Demo tournaments don't need full team data here
        setLoading(false)
        return
      }

      // Fetch real tournament
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('slug', slug)
        .single()

      if (tournamentError) throw tournamentError

      setTournament(tournamentData)

      // Fetch teams count
      const { count } = await supabase
        .from('teams')
        .select('*', { count: 'exact', head: true })
        .eq('tournament_id', tournamentData.id)

      setTeams({ length: count || 0 })
    } catch (err) {
      console.error('Error fetching tournament:', err)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const organizerName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'organizer'

  function formatDate(dateString) {
    if (!dateString) return 'Date TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  function getTournamentStatus(date) {
    if (!date) return 'Saved'
    
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    const tournamentDate = new Date(date)
    tournamentDate.setHours(0, 0, 0, 0)
    
    if (now < tournamentDate) return 'Saved'
    if (now.getTime() === tournamentDate.getTime()) return 'Active'
    if (now > tournamentDate) return 'Completed'
    return 'Saved'
  }

  const isInfoActive = location.pathname === `/tournament/${slug}`
  const isRoundsActive = location.pathname.includes('/rounds')
  const isStandingsActive = location.pathname.includes('/standings')

  // Prepare nav items for hamburger menu
  const navCenterItems = [
    { to: `/tournament/${slug}`, label: 'Info', isActive: isInfoActive },
    { to: `/tournament/${slug}/rounds`, label: 'Rounds', isActive: isRoundsActive },
    { to: `/tournament/${slug}/standings`, label: 'Standings', isActive: isStandingsActive }
  ]

  const navActionItems = user ? [
    { to: isDemo ? '/Demo/tournaments' : `/${organizerName}`, label: 'Dashboard', className: 'nav-link-style', type: 'link' },
    { label: 'Sign Out', className: 'btn btn-secondary', type: 'button', onClick: handleSignOut }
  ] : [
    { to: '/signup', label: 'Get Started', className: 'nav-link-style', type: 'link' },
    { to: '/signin', label: 'Login', className: 'btn btn-primary', type: 'link' }
  ]

  if (loading || !tournament) {
    return (
      <>
        <nav className="organizer-navbar">
          <div className="nav-brand">
            <Link to="/" className="logo">
              <span className="logo-text">TourGanizer</span>
            </Link>
          </div>
        </nav>
        <div className="page" style={{ textAlign: 'center', padding: '3rem' }}>
          Loading...
        </div>
      </>
    )
  }

  const status = getTournamentStatus(tournament.date)

  return (
    <>
      {/* Tournament Navbar */}
      <nav className="organizer-navbar">
        <div className="nav-brand">
          <Link to="/" className="logo">
            <span className="logo-text">TourGanizer</span>
          </Link>
        </div>
        <div className="nav-center">
          <Link 
            to={`/tournament/${slug}`} 
            className={`nav-btn ${isInfoActive ? 'active' : ''}`}
          >
            Info
          </Link>
          <Link 
            to={`/tournament/${slug}/rounds`} 
            className={`nav-btn ${isRoundsActive ? 'active' : ''}`}
          >
            Rounds
          </Link>
          <Link 
            to={`/tournament/${slug}/standings`} 
            className={`nav-btn ${isStandingsActive ? 'active' : ''}`}
          >
            Standings
          </Link>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <Link to={isDemo ? '/Demo/tournaments' : `/${organizerName}`} className="nav-link-style">
                Dashboard
              </Link>
              <button className="btn btn-secondary" onClick={handleSignOut}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signup" className="nav-link-style">
                Get Started
              </Link>
              <Link to="/signin" className="btn btn-primary">
                Login
              </Link>
            </>
          )}
        </div>
        <HamburgerMenu navCenterItems={navCenterItems} navActionItems={navActionItems} />
      </nav>

      <div className="page">
        <div className="page-header">
          <div>
            <h1>{tournament.name}</h1>
            <p className="meta">
              {formatDate(tournament.date)} • {tournament.time || 'Time TBD'}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span className="info-label">Total Teams: </span>
                <span className="info-value">{teams.length || 0}</span>
              </div>
              <div>
                <span className="info-label">Rounds: </span>
                <span className="info-value">{tournament.rounds}</span>
              </div>
              <div>
                <span className="info-label">Out-Rounds: </span>
                <span className="info-value">{tournament.out_rounds}</span>
              </div>
              <div>
                <span className="info-label">Status: </span>
                <span className={`status-badge status-${status.toLowerCase()}`}>
                  {status}
                </span>
              </div>
            </div>
          </div>
        </div>
      
        {rounds.map(r => (
          <div key={r.round} className="round-section">
            <h2>Round {r.round}</h2>
            <div className="rounds-table">
              <table className="draw-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Affirmative</th>
                    <th>Negative</th>
                    <th>Adjudicator</th>
                  </tr>
                </thead>
                <tbody>
                  {r.matches.map((m, i) => (
                    <tr key={i}>
                      <td>{m.room}</td>
                      <td>{m.team1}</td>
                      <td>{m.team2}</td>
                      <td>{m.adjudicator}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="logo">
              <span>TourGanizer</span>
            </div>
            <p>Professional tournament management made simple</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <Link to="#">Features</Link>
              <Link to="#">Pricing</Link>
            </div>
            <div className="footer-column">
              <h4>Support</h4>
              <a href="#">Documentation</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2025 TourGanizer. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
