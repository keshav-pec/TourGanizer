import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()

  // Redirect authenticated users
  useEffect(() => {
    if (user) {
      const name = user?.user_metadata?.username || user?.email?.split('@')[0] || 'organizer'
      navigate(`/${name}`)
    }
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const result = await signUp({ 
      email, 
      password, 
      username,
      role: 'organizer' // Assign organizer role
    })

    setLoading(false)
    if (result.error) {
      setError(result.error.message)
    } else {
      // Get username from user metadata
      const name = result.user?.user_metadata?.username || result.user?.email?.split('@')[0] || 'organizer'
      navigate(`/${name}`)
    }
  }

  async function handleGoogleSignUp() {
    setError(null)
    const result = await signInWithGoogle()
    
    if (result.error) {
      setError(result.error.message)
    }
    // Google OAuth will redirect
  }

  return (
    <div className="auth-container">
      <Link to="/" className="auth-brand-logo">
        <span className="logo-text">TourGanizer</span>
      </Link>
      <div className="auth-content">
        <div className="auth-header">
          <h1>Create your account</h1>
          <p>Start organizing professional tournaments today</p>
        </div>

        <div className="auth-card">
          <button 
            type="button" 
            className="btn-google" 
            onClick={handleGoogleSignUp}
            disabled={loading}
          >
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
              <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
          
          <div className="divider">
            <span>or sign up with email</span>
          </div>
          
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Organization Name</label>
              <input 
                id="username"
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                placeholder="myorganization"
                pattern="[a-zA-Z0-9_-]+"
                title="Only letters, numbers, hyphens and underscores allowed"
                disabled={loading}
                required
              />
              <small className="form-hint">This will be your unique tournament organizer URL</small>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                id="email"
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input 
                id="password"
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                disabled={loading}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input 
                id="confirmPassword"
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                disabled={loading}
                required
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin" className="link-primary">Sign in</Link></p>
        </div>
      </div>
    </div>
  )
}
