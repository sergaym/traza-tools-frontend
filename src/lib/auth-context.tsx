"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { apiClient } from "@/lib/api-client"

const STORAGE_KEY = "traza_api_key"

export interface AuthUser {
  id: string
  email: string
  name: string
  organization: { id: string; name: string }
}

interface AuthState {
  apiKey: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (apiKey: string) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      setUser(null)
      return
    }
    try {
      const me = await apiClient.get<AuthUser>("/v1/auth/me")
      setUser(me)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    setApiKey(stored)
    if (stored) {
      apiClient
        .get<AuthUser>("/v1/auth/me")
        .then(setUser)
        .catch(() => setUser(null))
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(async (key: string) => {
    localStorage.setItem(STORAGE_KEY, key)
    setApiKey(key)
    const me = await apiClient.get<AuthUser>("/v1/auth/me")
    setUser(me)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setApiKey(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        apiKey,
        user,
        isAuthenticated: !!apiKey && !!user,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
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
