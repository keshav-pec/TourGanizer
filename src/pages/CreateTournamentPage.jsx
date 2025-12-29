import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function CreateTournamentPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', location: '', date: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    // TODO: Replace with Supabase insert
    // const { data, error } = await supabase.from('tournaments').insert([{ 
    //   name: form.name, 
    //   location: form.location, 
    //   date: form.date,
    //   created_by: user.id 
    // }])
    
    // Mock slug generation
    const slug = form.name.toLowerCase().replace(/\s+/g, '-')
    navigate(`/tournaments/${slug}`)
  }

  if (!user) {
    return (
      <div className="page">
        <p>Please <a href="/login">sign in</a> to create a tournament.</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h1>Create Tournament</h1>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label>Tournament Name</label>
          <input 
            type="text" 
            value={form.name} 
            onChange={e => setForm({...form, name: e.target.value})}
            placeholder="National Championship 2025"
            required
          />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input 
            type="text" 
            value={form.location} 
            onChange={e => setForm({...form, location: e.target.value})}
            placeholder="New York, NY"
            required
          />
        </div>
        <div className="form-group">
          <label>Date</label>
          <input 
            type="date" 
            value={form.date} 
            onChange={e => setForm({...form, date: e.target.value})}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Create Tournament</button>
      </form>
    </div>
  )
}
