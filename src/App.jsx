import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import HomePage from './pages/HomePage'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'
import OrganizerDashboard from './pages/OrganizerDashboard'
import TournamentsPage from './pages/TournamentsPage'
import DemoTournamentsPage from './pages/DemoTournamentsPage'
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
        <Route path="/signin" element={<SignInPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/Demo/tournaments" element={<DemoTournamentsPage />} />
        <Route path="/:username" element={<OrganizerDashboard />} />
        <Route path="/:username/tournaments" element={<TournamentsPage />} />
        <Route path="/:username/tournaments/create" element={<CreateTournamentPage />} />
        <Route path="/tournament/:slug" element={<TournamentDashboard />} />
        <Route path="/tournament/:slug/rounds" element={<DrawPage />} />
        <Route path="/tournament/:slug/draw" element={<DrawPage />} />
        <Route path="/tournament/:slug/results" element={<ResultsPage />} />
        <Route path="/tournament/:slug/standings" element={<StandingsPage />} />
      </Routes>
    </AuthProvider>
  )
}
