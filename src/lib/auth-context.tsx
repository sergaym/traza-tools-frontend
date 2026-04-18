"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

const STORAGE_KEY = "traza_api_key"

interface AuthState {
  apiKey: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (apiKey: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setApiKey(stored)
    setIsLoading(false)
  }, [])

  const login = useCallback((key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey(null)
  }, [])

  return (
    <AuthContext.Provider value={{ apiKey, isAuthenticated: !!apiKey, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}

export function getStoredApiKey(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(STORAGE_KEY)
}
