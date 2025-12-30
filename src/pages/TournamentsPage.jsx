import React, { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import HamburgerMenu from '../components/HamburgerMenu'
import Footer from '../components/Footer'

export default function TournamentsPage() {
  const { username } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (user) {
      fetchTournaments()
    }
  }, [user])

  async function fetchTournaments() {
    try {
      setLoading(true)
      
      const { data: tournamentsData, error: tournamentsError } = await supabase
        .from('tournaments')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false })

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

      setTournaments(tournamentsWithTeams)
    } catch (err) {
      console.error('Error fetching tournaments:', err)
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
    now.setHours(0, 0, 0, 0) // Reset to start of day for fair comparison
    const tournamentDate = new Date(date)
    tournamentDate.setHours(0, 0, 0, 0)
    
    if (now < tournamentDate) return 'Saved'
    if (now.getTime() === tournamentDate.getTime()) return 'Active'
    if (now > tournamentDate) return 'Completed'
    return 'Saved'
  }

  if (!user) {
    return (
      <div className="page">
        <p>Please <Link to="/signin">sign in</Link> to view tournaments.</p>
      </div>
    )
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
          <Link to={`/${username}`} className="nav-link-style">
            Dashboard
          </Link>
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
        <HamburgerMenu
          navCenterItems={[]}
          navActionItems={[
            { to: `/${username}`, label: 'Dashboard', className: 'nav-link-style', type: 'link' },
            { label: 'Sign Out', className: 'btn btn-secondary', type: 'button', onClick: handleSignOut }
          ]}
        />
      </nav>

      <div className="page">
        <div className="page-header">
          <h1>All Tournaments</h1>
          <Link to={`/${username}/tournaments/create`} className="btn btn-primary">
            Create New Tournament
          </Link>
        </div>

        {error && <div className="error-message">{error}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--gray-600)' }}>
            Loading tournaments...
          </div>
        ) : tournaments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
              You haven't created any tournaments yet.
            </p>
            <Link to={`/${username}/tournaments/create`} className="btn btn-primary">
              Create Your First Tournament
            </Link>
          </div>
        ) : (
          <div className="tournaments-list">
            {tournaments.map((tournament) => {
              const status = getTournamentStatus(tournament.date)
              return (
                <Link
                  key={tournament.id || tournament.slug}
                  to={`/tournament/${tournament.slug || tournament.id}`}
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
      </div>

      <Footer />
    </div>
  )
}
