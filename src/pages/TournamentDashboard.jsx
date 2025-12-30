import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import HamburgerMenu from '../components/HamburgerMenu'

export default function TournamentDashboard() {
  const { slug } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tournament, setTournament] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDemo, setIsDemo] = useState(false)

  useEffect(() => {
    fetchTournamentData()
  }, [slug])

  async function fetchTournamentData() {
    try {
      setLoading(true)

      // Check if this is a demo tournament
      const demoTournaments = {
        'national-debate-championship-2025': {
          id: 'demo-1',
          slug: 'national-debate-championship-2025',
          name: 'National Debate Championship 2025',
          date: '2025-03-15',
          time: '09:00',
          rounds: 5,
          out_rounds: 2,
          members_per_team: 4,
          created_by: null
        },
        'regional-debate-series-spring': {
          id: 'demo-2',
          slug: 'regional-debate-series-spring',
          name: 'Regional Debate Series - Spring',
          date: '2025-04-20',
          time: '10:00',
          rounds: 4,
          out_rounds: 1,
          members_per_team: 3,
          created_by: null
        },
        'inter-university-championship': {
          id: 'demo-3',
          slug: 'inter-university-championship',
          name: 'Inter-University Championship',
          date: '2024-12-10',
          time: '08:30',
          rounds: 6,
          out_rounds: 3,
          members_per_team: 4,
          created_by: null
        }
      }

      const demoTeams = {
        'national-debate-championship-2025': [
          { id: 1, name: 'Team Alpha', members: [{ name: 'John Doe' }, { name: 'Jane Smith' }, { name: 'Robert Brown' }, { name: 'Emma Wilson' }] },
          { id: 2, name: 'Team Beta', members: [{ name: 'Mike Johnson' }, { name: 'Sarah Williams' }, { name: 'Chris Davis' }, { name: 'Lisa Anderson' }] },
          { id: 3, name: 'Team Gamma', members: [{ name: 'David Miller' }, { name: 'Emily Taylor' }, { name: 'James Moore' }, { name: 'Sophia Garcia' }] },
        ],
        'regional-debate-series-spring': [
          { id: 1, name: 'City Debaters', members: [{ name: 'Alex Chen' }, { name: 'Maria Rodriguez' }, { name: 'Tom Wilson' }] },
          { id: 2, name: 'University Stars', members: [{ name: 'Sam Lee' }, { name: 'Nina Patel' }, { name: 'Jack Brown' }] },
        ],
        'inter-university-championship': [
          { id: 1, name: 'Harvard Red', members: [{ name: 'Oliver Smith' }, { name: 'Emma Johnson' }, { name: 'Noah Williams' }, { name: 'Ava Brown' }] },
          { id: 2, name: 'Yale Blue', members: [{ name: 'Liam Jones' }, { name: 'Isabella Garcia' }, { name: 'Mason Miller' }, { name: 'Sophia Davis' }] },
          { id: 3, name: 'Princeton Orange', members: [{ name: 'Ethan Martinez' }, { name: 'Mia Rodriguez' }, { name: 'Lucas Wilson' }, { name: 'Charlotte Moore' }] },
        ]
      }

      if (demoTournaments[slug]) {
        // Use demo data
        setIsDemo(true)
        setTournament(demoTournaments[slug])
        setTeams(demoTeams[slug] || [])
        setLoading(false)
        return
      }

      // Fetch tournament by slug
      const { data: tournamentData, error: tournamentError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('slug', slug)
        .single()

      if (tournamentError) throw tournamentError

      setTournament(tournamentData)

      // Fetch teams for this tournament
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*')
        .eq('tournament_id', tournamentData.id)
        .order('name', { ascending: true })

      if (teamsError) throw teamsError

      setTeams(teamsData)
    } catch (err) {
      console.error('Error fetching tournament data:', err)
      setError(err.message)
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

  if (loading) {
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
          Loading tournament...
        </div>
      </>
    )
  }

  if (error || !tournament) {
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
          <p style={{ color: 'var(--error-color)', marginBottom: '1rem' }}>
            {error || 'Tournament not found'}
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
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
                <span className="info-value">{teams.length}</span>
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

        <div className="tournament-info-section">
          <div className="info-card">
            <h3>Registered Teams ({teams.length})</h3>
            {teams.length === 0 ? (
              <p style={{ color: 'var(--gray-600)', padding: '2rem', textAlign: 'center' }}>
                No teams registered yet.
              </p>
            ) : (
              <div className="teams-list">
                {teams.map(team => (
                  <div key={team.id} className="team-item">
                    <span className="team-name">{team.name}: </span>
                    <span className="team-members-inline">
                      {Array.isArray(team.members) && team.members.map((member, idx) => (
                        <React.Fragment key={idx}>
                          <span className="member-name-item">{member.name || member}</span>
                          {idx < team.members.length - 1 && <span className="member-separator">, </span>}
                        </React.Fragment>
                      ))}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
