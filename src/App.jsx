import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import OrganizerDashboard from './pages/OrganizerDashboard'
import TournamentsPage from './pages/TournamentsPage'
import CreateTournamentPage from './pages/CreateTournamentPage'
import TournamentDashboard from './pages/TournamentDashboard'
import DrawPage from './pages/DrawPage'
import ResultsPage from './pages/ResultsPage'
import StandingsPage from './pages/StandingsPage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/:username" element={<OrganizerDashboard />} />
        <Route path="/:username/tournaments" element={<TournamentsPage />} />
        <Route path="/:username/tournaments/create" element={<CreateTournamentPage />} />
        <Route path="/:username/tournaments/:slug" element={<TournamentDashboard />} />
        <Route path="/:username/tournaments/:slug/draw" element={<DrawPage />} />
        <Route path="/:username/tournaments/:slug/results" element={<ResultsPage />} />
        <Route path="/:username/tournaments/:slug/standings" element={<StandingsPage />} />
      </Routes>
    </AuthProvider>
  )
}
