import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function TournamentDashboard() {
  const { username, slug } = useParams()
  const { user } = useAuth()

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
    <div className="page">
      <div className="page-header">
        <div>
          <h1>{tournament.name}</h1>
          <p className="meta">
            {tournament.format} • {tournament.location} • {tournament.date}
          </p>
        </div>
        <Link to={`/${username}/tournaments`} className="btn btn-secondary">
          Back to Tournaments
        </Link>
      </div>

      <div className="dashboard-grid">
        <Link to={`/${username}/tournaments/${slug}/draw`} className="dashboard-card">
          <div className="card-icon">🎯</div>
          <h3>Draw</h3>
          <p>View and manage tournament draw</p>
        </Link>

        <Link to={`/${username}/tournaments/${slug}/results`} className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3>Results</h3>
          <p>Enter and manage match results</p>
        </Link>

        <Link to={`/${username}/tournaments/${slug}/standings`} className="dashboard-card">
          <div className="card-icon">🏆</div>
          <h3>Standings</h3>
          <p>View current tournament standings</p>
        </Link>
      </div>
    </div>
  )
}
