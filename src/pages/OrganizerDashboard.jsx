import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function OrganizerDashboard() {
  const { username } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  // Mock data for recent tournaments - replace with Supabase data later
  const recentTournaments = [
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
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="organizer-hero">
        <div className="hero-content">
          <h1>Welcome back, {username}</h1>
          <p className="hero-subtitle">Ready to create your next tournament?</p>
          <Link to={`/${username}/tournaments/create`} className="btn btn-primary btn-large">
            Create New Tournament
          </Link>
        </div>
      </section>

      {/* Recent Tournaments Section */}
      <section className="recent-tournaments-section">
        <div className="section-header-row">
          <h2>Recent Tournaments</h2>
          <Link to={`/${username}/tournaments`} className="btn btn-secondary">
            View All Tournaments
          </Link>
        </div>
        
        <div className="tournaments-list">
          {recentTournaments.map(tournament => (
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
      </section>
    </div>
  )
}
