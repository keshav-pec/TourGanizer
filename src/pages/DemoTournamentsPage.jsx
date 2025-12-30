import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function DemoTournamentsPage() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const organizerName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'organizer'

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  // Dummy tournament data for demo
  const demoTournaments = [
    {
      id: 'demo-1',
      slug: 'national-debate-championship-2025',
      name: 'National Debate Championship 2025',
      date: '2025-03-15',
      time: '09:00',
      rounds: 5,
      out_rounds: 2,
      members_per_team: 4,
      teams_count: 32,
      status: 'Active'
    },
    {
      id: 'demo-2',
      slug: 'regional-debate-series-spring',
      name: 'Regional Debate Series - Spring',
      date: '2025-04-20',
      time: '10:00',
      rounds: 4,
      out_rounds: 1,
      members_per_team: 3,
      teams_count: 24,
      status: 'Saved'
    },
    {
      id: 'demo-3',
      slug: 'inter-university-championship',
      name: 'Inter-University Championship',
      date: '2024-12-10',
      time: '08:30',
      rounds: 6,
      out_rounds: 3,
      members_per_team: 4,
      teams_count: 48,
      status: 'Completed'
    }
  ]

  function formatDate(dateString) {
    if (!dateString) return 'Date TBD'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    })
  }

  return (
    <div className="organizer-dashboard-page">
      <nav className="organizer-navbar">
        <div className="nav-brand">
          <Link to="/" className="logo">
            <span className="logo-text">TourGanizer</span>
          </Link>
        </div>
        <div className="nav-actions">
          {user ? (
            <>
              <Link to="/Demo/tournaments" className="nav-link-style">
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
      </nav>

      <div className="page">
        <div className="page-header">
          <div>
            <h1>Demo Tournaments</h1>
            <p className="meta">Explore our sample tournaments to see how TourGanizer works</p>
          </div>
        </div>

        <div className="tournaments-list">
          {demoTournaments.map(tournament => (
            <Link 
              key={tournament.id} 
              to={`/tournament/${tournament.slug}`}
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
                  <span className="detail-label">Date</span>
                  <span className="detail-value">{formatDate(tournament.date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{tournament.time || 'TBD'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Teams</span>
                  <span className="detail-value">{tournament.teams_count}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

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
