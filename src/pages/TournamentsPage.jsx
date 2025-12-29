import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function TournamentsPage() {
  const { username } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  // Mock data for all tournaments - replace with Supabase data later
  const tournaments = [
    {
      id: 1,
      name: 'National Debate Championship 2025',
      slug: 'national-debate-2025',
      format: 'British Parliamentary',
      date: 'Jan 15-18, 2025',
      teams: 64,
      status: 'Active'
    },
    {
      id: 2,
      name: 'Inter-University Competition',
      slug: 'inter-uni-comp',
      format: 'Asian Parliamentary',
      date: 'Feb 20-21, 2025',
      teams: 32,
      status: 'Saved'
    },
    {
      id: 3,
      name: 'Regional Tournament Series',
      slug: 'regional-series',
      format: 'World Schools',
      date: 'Dec 10-12, 2024',
      teams: 48,
      status: 'Completed'
    },
    {
      id: 4,
      name: 'Spring Invitational 2025',
      slug: 'spring-invitational',
      format: 'British Parliamentary',
      date: 'Mar 5-7, 2025',
      teams: 40,
      status: 'Saved'
    },
    {
      id: 5,
      name: 'Summer Championship',
      slug: 'summer-championship',
      format: 'World Schools',
      date: 'Jul 10-15, 2025',
      teams: 56,
      status: 'Saved'
    }
  ]

  return (
    <div className="organizer-dashboard-page">
      {/* Organizer Navbar */}
      <nav className="organizer-navbar">
        <div className="nav-brand">
          <Link to="/" className="logo">
            <span className="logo-text">TourGanizer</span>
          </Link>
        </div>
        <div className="nav-actions">
          <Link to={`/${username}`} className="btn btn-text" style={{marginRight: '0.5rem'}}>
            Dashboard
          </Link>
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="page">
        <div className="page-header">
          <h1>All Tournaments</h1>
          <Link to={`/${username}/tournaments/create`} className="btn btn-primary">
            Create New Tournament
          </Link>
        </div>

        <div className="tournaments-list">
          {tournaments.map(tournament => (
            <Link 
              key={tournament.id} 
              to={`/${username}/tournaments/${tournament.slug}`}
              className="tournament-list-item"
            >
              <div className="tournament-list-main">
                <div className="tournament-status">
                  <span className={`status-badge status-${tournament.status.toLowerCase()}`}>
                    {tournament.status}
                  </span>
                </div>
                <div className="tournament-list-info">
                  <h3>{tournament.name}</h3>
                </div>
              </div>
              <div className="tournament-list-details">
                <div className="detail-item">
                  <span className="detail-label">Format</span>
                  <span className="detail-value">{tournament.format}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{tournament.date}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teams</span>
                  <span className="detail-value">{tournament.teams}</span>
                </div>
              </div>
            </Link>
          ))}
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
    </div>
  )
}
