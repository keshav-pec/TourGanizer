import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' or 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users (from Google OAuth or regular login)
  useEffect(() => {
    if (user) {
      const name = user?.user_metadata?.username || user?.email?.split('@')[0] || 'organizer'
      navigate(`/${name}`)
    }
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    
    const result = mode === 'login' 
      ? await signIn({ email, password })
      : await signUp({ email, password, username })

    if (result.error) {
      setError(result.error.message)
    } else {
      // Get username from user metadata
      const name = result.user?.user_metadata?.username || result.user?.email?.split('@')[0] || 'organizer'
      navigate(`/${name}`)
    }
  }

  async function handleGoogleSignIn() {
    setError(null)
    const result = await signInWithGoogle()
    
    if (result.error) {
      setError(result.error.message)
    }
    // Note: Google OAuth will redirect, so no need to navigate here
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
        
        <div className="auth-divider">
          <span>or</span>
        </div>
        
        <button 
          type="button" 
          className="btn btn-secondary btn-full" 
          onClick={handleGoogleSignIn}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>
        
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
