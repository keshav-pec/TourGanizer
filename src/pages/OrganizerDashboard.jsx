import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import Footer from '../components/Footer'

export default function OrganizerDashboard() {
  const { username } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [recentTournaments, setRecentTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchRecentTournaments()
    }
  }, [user])

  async function fetchRecentTournaments() {
    try {
      setLoading(true)
      
      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })
        .limit(3)

      if (tournamentsError) throw tournamentsError

      const tournamentsWithTeams = await Promise.all(
        tournamentsData.map(async (tournament) => {
          const { count } = await supabase
            .from('teams')
            .select('*', { count: 'exact', head: true })
            .eq('tournament_id', tournament.id)

          return {
            ...tournament,
            teams_count: count || 0
          }
        })
      )

      setRecentTournaments(tournamentsWithTeams)
    } catch (err) {
      console.error('Error fetching tournaments:', err)
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
    now.setHours(0, 0, 0, 0) // Reset to start of day for fair comparison
    const tournamentDate = new Date(date)
    tournamentDate.setHours(0, 0, 0, 0)
    
    if (now < tournamentDate) return 'Saved'
    if (now.getTime() === tournamentDate.getTime()) return 'Active'
    if (now > tournamentDate) return 'Completed'
    return 'Saved'
  }

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
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
            Loading tournaments...
          </div>
        ) : recentTournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              No tournaments yet. Create your first one!
            </p>
          </div>
        ) : (
          <div className="tournaments-list">
            {recentTournaments.map(tournament => {
              const status = getTournamentStatus(tournament.date)
              
              return (
                <Link 
                  key={tournament.id} 
                  to={`/tournament/${tournament.slug}`}
                  className="tournament-list-item"
                >
                  <div className="tournament-list-main">
                    <div className="tournament-status">
                      <span className={`status-badge status-${status.toLowerCase()}`}>
                        {status}
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
              )
            })}
          </div>
        )}
      </section>

      <Footer />
    </div>
  )
}
