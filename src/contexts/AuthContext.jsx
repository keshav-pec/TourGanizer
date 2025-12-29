import React, { createContext, useContext, useState, useEffect } from 'react'

/**
 * AuthContext - pluggable authentication context.
 * Currently uses localStorage as a stub.
 * 
 * To connect Supabase:
 * 1. Install @supabase/supabase-js
 * 2. Replace signIn/signUp/signOut with supabase.auth methods
 * 3. Subscribe to onAuthStateChange for session updates
 */

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const stored = localStorage.getItem('auth.user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  async function signUp({ email, password, username }) {
    // STUB: Replace with supabase.auth.signUp({ email, password })
    // Note: Store username in user metadata and ensure uniqueness in Supabase
    const u = { 
      id: 'local-' + Date.now(), 
      email, 
      username: username,
      created_at: new Date().toISOString() 
    }
    localStorage.setItem('auth.user', JSON.stringify(u))
    localStorage.setItem('auth.token', 'stub-token-' + Date.now())
    setUser(u)
    return { user: u, error: null }
  }

  async function signIn({ email, password }) {
    // STUB: Replace with supabase.auth.signInWithPassword({ email, password })
    // Note: Fetch username from Supabase user metadata
    const u = { 
      id: 'local-' + Date.now(), 
      email,
      username: email.split('@')[0] // Temporary - will fetch from Supabase
    }
    localStorage.setItem('auth.user', JSON.stringify(u))
    localStorage.setItem('auth.token', 'stub-token-' + Date.now())
    setUser(u)
    return { user: u, error: null }
  }

  async function signOut() {
    // STUB: Replace with supabase.auth.signOut()
    localStorage.removeItem('auth.user')
    localStorage.removeItem('auth.token')
    setUser(null)
  }

  function getToken() {
    return localStorage.getItem('auth.token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
