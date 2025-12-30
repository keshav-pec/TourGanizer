import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function AuthCallback() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    // Wait for auth state to update
    if (user) {
      const organizerName = user?.user_metadata?.username || user?.email?.split('@')[0] || 'organizer'
      navigate(`/${organizerName}`, { replace: true })
    }
  }, [user, navigate])

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      textAlign: 'center'
    }}>
      <div>
        <h2>Completing sign in...</h2>
        <p>Please wait while we redirect you.</p>
      </div>
    </div>
  )
}
