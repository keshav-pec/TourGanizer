import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

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
    // TODO: Replace with Supabase insert with status 'draft'
    // const { data, error } = await supabase.from('tournaments').insert([{ 
    //   name: form.name, 
    //   date: form.date,
    //   time: form.time,
    //   rounds: form.rounds,
    //   out_rounds: form.outRounds,
    //   members_per_team: form.membersPerTeam,
    //   status: 'draft',
    //   created_by: user.id 
    // }])
    // Then insert teams and members
    
    // Mock slug generation
    const slug = form.name.toLowerCase().replace(/\s+/g, '-')
    // Navigate to tournaments page or dashboard
    navigate(`/${username}/tournaments`)
  }

  async function handleContinueToPayment(e) {
    e.preventDefault()
    // TODO: Replace with Supabase insert
    // const { data, error } = await supabase.from('tournaments').insert([{ 
    //   name: form.name, 
    //   date: form.date,
    //   time: form.time,
    //   rounds: form.rounds,
    //   out_rounds: form.outRounds,
    //   members_per_team: form.membersPerTeam,
    //   created_by: user.id 
    // }])
    // Then insert teams and members
    
    // Mock slug generation
    const slug = form.name.toLowerCase().replace(/\s+/g, '-')
    // Navigate to payment page (to be created)
    navigate(`/tournament/${slug}/payment`)
  }

  if (!user) {
    return (
      <div className="page">
        <p>Please <Link to="/login">sign in</Link> to create a tournament.</p>
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
          <Link to={`/${username}`} className="btn btn-text" style={{marginRight: '0.5rem'}}>
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

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" onClick={handleSaveDraft} className="btn btn-secondary">
              Save as Draft
            </button>
            <button type="button" onClick={handleContinueToPayment} className="btn btn-primary">
              Continue to Payment
            </button>
          </div>
        </form>
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
