import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    
    const result = mode === 'login' 
      ? await signIn({ email, password })
      : await signUp({ email, password, username })

    if (result.error) {
      setError(result.error.message)
    } else {
      const name = result.user.username
      navigate(`/${name}`)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="yourorganization"
                pattern="[a-zA-Z0-9_-]+"
                title="Username can only contain letters, numbers, hyphens and underscores"
                required
              />
            </div>
          )}
          <div className="form-group">
            <label>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary btn-full">
            {mode === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>
        <div className="auth-toggle">
          {mode === 'login' ? (
            <p>Don't have an account? <button className="btn-text" onClick={() => setMode('signup')}>Sign up</button></p>
          ) : (
            <p>Already have an account? <button className="btn-text" onClick={() => setMode('login')}>Sign in</button></p>
          )}
        </div>
      </div>
    </div>
  )
}
