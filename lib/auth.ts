"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"

interface AuthContextValue {
  isAuthenticated: boolean
  login: (username: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const AUTH_KEY = "monusgb_auth_session"
const VALID_USER = "SABANA"
const VALID_PASS = "SABANA"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_KEY)
      if (stored === "true") {
        setIsAuthenticated(true)
      }
    } catch {
      // ignore
    }
  }, [])

  const login = useCallback((username: string, password: string): boolean => {
    if (username === VALID_USER && password === VALID_PASS) {
      setIsAuthenticated(true)
      try {
        localStorage.setItem(AUTH_KEY, "true")
      } catch {
        // ignore
      }
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    try {
      localStorage.removeItem(AUTH_KEY)
    } catch {
      // ignore
    }
  }, [])

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
