import React, { useState } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DrawPage() {
  const { slug } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const isInfoActive = location.pathname === `/tournament/${slug}`
  const isRoundsActive = location.pathname.includes('/rounds')
  const isStandingsActive = location.pathname.includes('/standings')

  const [rounds, setRounds] = useState([
    { round: 1, matches: [
      { room: 'Room A', team1: 'Team Alpha', team2: 'Team Beta', adjudicator: 'Judge Smith' },
      { room: 'Room B', team1: 'Team Gamma', team2: 'Team Delta', adjudicator: 'Judge Jones' },
    ]}
  ])

  // Mock tournament data - replace with Supabase query later
  const tournament = {
    name: 'National Debate Championship 2025',
    format: 'British Parliamentary',
    location: 'New York City',
    date: 'Jan 15-18, 2025',
    teams: 64,
    status: 'Active'
  }

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
      
        {rounds.map(r => (
          <div key={r.round} className="round-section">
            <h2>Round {r.round}</h2>
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
