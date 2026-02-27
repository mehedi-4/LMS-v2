import { createContext, useContext, useEffect, useState } from 'react'

const InstructorAuthContext = createContext()
const STORAGE_KEY = 'instructorAuth'

export function InstructorAuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : null
  })
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem(STORAGE_KEY)))
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        setIsAuthenticated(true)
      } catch {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:5006/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.instructor)
        setIsAuthenticated(true)
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data.instructor))
        return { success: true }
      }

      setError(data.message)
      return { success: false, message: data.message }
    } catch {
      const errorMessage = 'Failed to connect to server'
      setError(errorMessage)
      return { success: false, message: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem(STORAGE_KEY)
  }

  const updateUser = (updates) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }

  return (
    <InstructorAuthContext.Provider value={{ user, isAuthenticated, loading, error, login, logout, updateUser }}>
      {children}
    </InstructorAuthContext.Provider>
  )
}

export function useInstructorAuth() {
  const context = useContext(InstructorAuthContext)
  if (!context) {
    throw new Error('useInstructorAuth must be used within InstructorAuthProvider')
  }
  return context
}
