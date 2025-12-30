import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

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
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

//   useEffect(() => {
//     // Check for existing session on mount
//     const stored = localStorage.getItem('auth.user')
//     if (stored) {
//       setUser(JSON.parse(stored))
//     }
//     setLoading(false)
//   }, [])

  async function signUp({ email, password, username, role }) {
    // Sign up with email/password and store username + role in metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username || email.split('@')[0],
          role: role || 'organizer' // Default to organizer role
        }
      }
    })
    
    if (error) return { user: null, error }
    return { user: data.user, error: null }
  }

  async function signIn({ email, password }) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) return { user: null, error }
    return { user: data.user, error: null }
  }

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) console.error('Error signing out:', error)
    } catch (err) {
      console.error('Error signing out:', err)
    } finally {
      setUser(null)
    }
  }

  async function signInWithGoogle() {
    const redirectUrl = window.location.origin // Dynamically gets http://localhost:5173 or https://tourganizer.vercel.app
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${redirectUrl}/auth/callback`
      }
    })
    
    if (error) return { error }
    return { data, error: null }
  }

//   async function signUp({ email, password, username }) {
//     // STUB: Replace with supabase.auth.signUp({ email, password })
//     // Note: Store username in user metadata and ensure uniqueness in Supabase
//     const u = { 
//       id: 'local-' + Date.now(), 
//       email, 
//       username: username,
//       created_at: new Date().toISOString() 
//     }
//     localStorage.setItem('auth.user', JSON.stringify(u))
//     localStorage.setItem('auth.token', 'stub-token-' + Date.now())
//     setUser(u)
//     return { user: u, error: null }
//   }

//   async function signIn({ email, password }) {
//     // STUB: Replace with supabase.auth.signInWithPassword({ email, password })
//     // Note: Fetch username from Supabase user metadata
//     const u = { 
//       id: 'local-' + Date.now(), 
//       email,
//       username: email.split('@')[0] // Temporary - will fetch from Supabase
//     }
//     localStorage.setItem('auth.user', JSON.stringify(u))
//     localStorage.setItem('auth.token', 'stub-token-' + Date.now())
//     setUser(u)
//     return { user: u, error: null }
//   }

//   async function signOut() {
//     // STUB: Replace with supabase.auth.signOut()
//     localStorage.removeItem('auth.user')
//     localStorage.removeItem('auth.token')
//     setUser(null)
//   }

  function getToken() {
    return localStorage.getItem('auth.token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signInWithGoogle, getToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
