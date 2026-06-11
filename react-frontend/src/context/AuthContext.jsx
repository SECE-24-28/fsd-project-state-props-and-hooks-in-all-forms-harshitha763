import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser]   = useState(() => {
    try { return JSON.parse(localStorage.getItem('fc_user')) || null } catch { return null }
  })
  const [token, setToken] = useState(() => localStorage.getItem('fc_token') || null)

  const login = (userData, tokenData) => {
    setUser(userData)
    setToken(tokenData)
    localStorage.setItem('fc_user',  JSON.stringify(userData))
    localStorage.setItem('fc_token', tokenData)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('fc_user')
    localStorage.removeItem('fc_token')
  }

  const isLoggedIn = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
