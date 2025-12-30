import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function TournamentDashboard() {
  const { slug } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [tournament, setTournament] = useState(null)
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchTournamentData()
  }, [slug])

  async function fetchTournamentData() {
    try {
      setLoading(true)

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
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
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
          <Link to={`/${user?.user_metadata?.username}/tournaments`} className="btn btn-secondary">
            Back to Tournaments
          </Link>
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
                      {team.members.map((member, idx) => (
                        <React.Fragment key={idx}>
                          <span className="member-name-item">{member.name}</span>
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
