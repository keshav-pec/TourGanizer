import React from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function TournamentDashboard() {
  const { slug } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  // Mock tournament data - replace with Supabase query later
  const tournament = {
    name: 'National Debate Championship 2025',
    format: 'British Parliamentary',
    location: 'New York City',
    date: 'Jan 15-18, 2025',
    teams: 64,
    status: 'Active'
  }

  // Mock teams data - replace with Supabase query later
  const teams = [
    { id: 1, name: 'Team Alpha', members: ['John Doe', 'Jane Smith', 'Rakhesh Kumar', 'Murlidhar Singh'], status: 'Confirmed' },
    { id: 2, name: 'Team Beta', members: ['Mike Johnson', 'Sarah Williams', 'Robert Brown', 'Emma Wilson'], status: 'Confirmed' },
    { id: 3, name: 'Team Gamma', members: ['Chris Brown', 'Emily Davis', 'James Taylor', 'Olivia Martin'], status: 'Confirmed' },
    { id: 4, name: 'Team Delta', members: ['David Wilson', 'Lisa Anderson', 'Michael Thompson', 'Sophia Garcia'], status: 'Pending' },
  ]

  const isInfoActive = location.pathname === `/tournament/${slug}`
  const isRoundsActive = location.pathname.includes('/rounds')
  const isStandingsActive = location.pathname.includes('/standings')

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
              {tournament.format} • {tournament.location} • {tournament.date}
            </p>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div>
                <span className="info-label">Total Teams: </span>
                <span className="info-value">{tournament.teams}</span>
              </div>
              <div>
                <span className="info-label">Status: </span>
                <span className={`status-badge status-${tournament.status.toLowerCase()}`}>
                  {tournament.status}
                </span>
              </div>
            </div>
          </div>
          <Link to={`/${user?.username}/tournaments`} className="btn btn-secondary">
            Back to Tournaments
          </Link>
        </div>

        <div className="tournament-info-section">
          <div className="info-card">
            <h3>Registered Teams</h3>
            <div className="teams-list">
              {teams.map(team => (
                <div key={team.id} className="team-item">
                  <span className="team-name">{team.name} : </span>
                  <span className="team-members-inline">
                    {team.members.join(', ')}
                  </span>
                </div>
              ))}
            </div>
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
