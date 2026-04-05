import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

const AUTH_KEY = 'auth_token'
const VALID_USER = 'admin'
const VALID_PASS = '12345'

interface AuthContextType {
  isAuthenticated: boolean
  login: (u: string, p: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(AUTH_KEY) === 'true'
    }
    return false
  })

  const login = useCallback((username: string, password: string): boolean => {
    if (username === VALID_USER && password === VALID_PASS) {
      setIsAuthenticated(true)
      localStorage.setItem(AUTH_KEY, 'true')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    setIsAuthenticated(false)
    localStorage.removeItem(AUTH_KEY)
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
