import React, { useState } from 'react'
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function StandingsPage() {
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

  const [standings, setStandings] = useState([
    { rank: 1, team: 'Team Alpha', wins: 3, losses: 0, points: 9 },
    { rank: 2, team: 'Team Gamma', wins: 2, losses: 1, points: 6 },
    { rank: 3, team: 'Team Delta', wins: 1, losses: 2, points: 3 },
    { rank: 4, team: 'Team Beta', wins: 0, losses: 3, points: 0 },
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
      {/* Organizer Navbar */}
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
        
        <table className="standings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Team</th>
              <th>Wins</th>
              <th>Losses</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {standings.map(s => (
              <tr key={s.rank}>
                <td className="rank">#{s.rank}</td>
                <td className="team-name">{s.team}</td>
                <td>{s.wins}</td>
                <td>{s.losses}</td>
                <td className="points">{s.points}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
