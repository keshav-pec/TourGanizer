import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function CreateTournamentPage() {
  const { username } = useParams()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ 
    name: '', 
    date: '', 
    time: '',
    rounds: '',
    outRounds: '',
    membersPerTeam: ''
  })
  const [teams, setTeams] = useState([
    { 
      name: '', 
      members: [{ name: '', email: '' }] 
    }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  function addTeam() {
    setTeams([...teams, { 
      name: '', 
      members: [{ name: '', email: '' }] 
    }])
  }

  function removeTeam(teamIndex) {
    setTeams(teams.filter((_, index) => index !== teamIndex))
  }

  function updateTeamName(teamIndex, name) {
    const updatedTeams = [...teams]
    updatedTeams[teamIndex].name = name
    setTeams(updatedTeams)
  }

  function addMember(teamIndex) {
    const updatedTeams = [...teams]
    updatedTeams[teamIndex].members.push({ name: '', email: '' })
    setTeams(updatedTeams)
  }

  function removeMember(teamIndex, memberIndex) {
    const updatedTeams = [...teams]
    updatedTeams[teamIndex].members = updatedTeams[teamIndex].members.filter((_, index) => index !== memberIndex)
    setTeams(updatedTeams)
  }

  function updateMember(teamIndex, memberIndex, field, value) {
    const updatedTeams = [...teams]
    updatedTeams[teamIndex].members[memberIndex][field] = value
    setTeams(updatedTeams)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    // This will be called by both buttons, but we'll handle the action type separately
  }

  async function handleSaveDraft(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Generate slug from tournament name
      const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      // Insert tournament
      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .insert([{
          slug: slug,
          name: form.name,
          date: form.date,
          time: form.time,
          rounds: parseInt(form.rounds),
          out_rounds: parseInt(form.outRounds),
          members_per_team: parseInt(form.membersPerTeam),
          created_by: user.id
        }])
        .select()
        .single()

      if (tournamentError) throw tournamentError

      // Insert teams with members
      const teamsData = teams.map(team => ({
        tournament_id: tournament.id,
        name: team.name,
        members: team.members, // jsonb array
        created_by: user.id
      }))

      const { error: teamsError } = await supabase
        .from('teams')
        .insert(teamsData)

      if (teamsError) throw teamsError

      // Create rounds
      const roundsData = []
      for (let i = 1; i <= parseInt(form.rounds); i++) {
        roundsData.push({
          tournament_id: tournament.id,
          round_number: i,
          created_by: user.id
        })
      }

      const { error: roundsError } = await supabase
        .from('rounds')
        .insert(roundsData)

      if (roundsError) throw roundsError

      // Navigate to tournaments page
      navigate(`/${username}/tournaments`)
    } catch (err) {
      console.error('Error creating tournament:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleContinueToPayment(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Generate slug from tournament name
      const slug = form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      
      // Insert tournament
      const { data: tournament, error: tournamentError } = await supabase
        .from('tournaments')
        .insert([{
          slug: slug,
          name: form.name,
          date: form.date,
          time: form.time,
          rounds: parseInt(form.rounds),
          out_rounds: parseInt(form.outRounds),
          members_per_team: parseInt(form.membersPerTeam),
          created_by: user.id
        }])
        .select()
        .single()

      if (tournamentError) throw tournamentError

      // Insert teams with members
      const teamsData = teams.map(team => ({
        tournament_id: tournament.id,
        name: team.name,
        members: team.members, // jsonb array
        created_by: user.id
      }))

      const { error: teamsError } = await supabase
        .from('teams')
        .insert(teamsData)

      if (teamsError) throw teamsError

      // Create rounds
      const roundsData = []
      for (let i = 1; i <= parseInt(form.rounds); i++) {
        roundsData.push({
          tournament_id: tournament.id,
          round_number: i,
          created_by: user.id
        })
      }

      const { error: roundsError } = await supabase
        .from('rounds')
        .insert(roundsData)

      if (roundsError) throw roundsError

      // Navigate to payment page (to be created)
      navigate(`/tournament/${slug}/payment`)
    } catch (err) {
      console.error('Error creating tournament:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="page">
        <p>Please <Link to="/signin">sign in</Link> to create a tournament.</p>
      </div>
    )
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
          <Link to={`/${username}`} className="nav-link-style">
            Dashboard
          </Link>
          <button className="btn btn-secondary" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </nav>

      <div className="page">

        <form onSubmit={handleSubmit} className="form tournament-form">
          {/* Tournament Name as Heading */}
          <div className="tournament-name-row">
            <h2 className="tournament-name-heading">
              Tournament Name : 
            </h2>
            <input 
              type="text" 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Debating Championship 2026"
              required
              className="tournament-name-input"
            />
          </div>

          {/* Date and Time on same line */}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Date</label>
              <input 
                type="date" 
                value={form.date} 
                onChange={e => setForm({...form, date: e.target.value})}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>Time</label>
              <input 
                type="time" 
                value={form.time} 
                onChange={e => setForm({...form, time: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Rounds and Out-Rounds on same line */}
          <div className="form-row">
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>No. of Rounds</label>
              <input 
                type="number" 
                value={form.rounds} 
                onChange={e => setForm({...form, rounds: e.target.value})}
                placeholder="5"
                min="1"
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label>No. of Out-Rounds</label>
              <input 
                type="number" 
                value={form.outRounds} 
                onChange={e => setForm({...form, outRounds: e.target.value})}
                placeholder="2"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>No. of Members per Team</label>
            <input 
              type="number" 
              value={form.membersPerTeam} 
              onChange={e => setForm({...form, membersPerTeam: e.target.value})}
              placeholder="4"
              min="1"
              required
            />
          </div>

          {/* Teams Section */}
          <div className="teams-section">
            <div className="teams-header">
              <h3>Teams</h3>
              <button type="button" onClick={addTeam} className="btn btn-secondary">
                Add Team
              </button>
            </div>

            {teams.map((team, teamIndex) => (
              <div key={teamIndex} className="team-card">
                <div className="team-card-header">
                  <h4>Team {teamIndex + 1}</h4>
                  {teams.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => removeTeam(teamIndex)} 
                      className="btn-text"
                      style={{ color: 'var(--error)', fontSize: '0.875rem' }}
                    >
                      Remove Team
                    </button>
                  )}
                </div>

                <div className="form-group">
                  <label>Team Name</label>
                  <input 
                    type="text" 
                    value={team.name} 
                    onChange={e => updateTeamName(teamIndex, e.target.value)}
                    placeholder="Team Alpha"
                    required
                  />
                </div>

                {/* Members */}
                <div className="members-section">
                  <div className="members-header">
                    <label style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--gray-700)', margin: 0 }}>
                      Members
                    </label>
                    <button 
                      type="button" 
                      onClick={() => addMember(teamIndex)} 
                      className="btn-text"
                      style={{ fontSize: '0.875rem' }}
                    >
                      + Add Member
                    </button>
                  </div>

                  {team.members.map((member, memberIndex) => (
                    <div key={memberIndex} className="member-row">
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.875rem' }}>Member {memberIndex + 1} Name</label>
                        <input 
                          type="text" 
                          value={member.name} 
                          onChange={e => updateMember(teamIndex, memberIndex, 'name', e.target.value)}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.875rem' }}>Email</label>
                        <input 
                          type="email" 
                          value={member.email} 
                          onChange={e => updateMember(teamIndex, memberIndex, 'email', e.target.value)}
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      {team.members.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => removeMember(teamIndex, memberIndex)} 
                          className="btn btn-secondary member-remove-btn"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {error && <div className="error-message" style={{ marginTop: '1rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleSaveDraft} className="btn btn-secondary" disabled={loading}>
              {loading ? 'Saving...' : 'Save as Draft'}
            </button>
            <button type="button" onClick={handleContinueToPayment} className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Continue to Payment'}
            </button>
          </div>
        </form>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  )
}
