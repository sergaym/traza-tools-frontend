"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"
import { apiClient } from "@/lib/api-client"

export interface AuthUser {
  id: string
  email: string
  name: string
  organization: { id: string; name: string }
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiClient.get<AuthUser>("/v1/auth/me")
      setUser(me)
    } catch {
      setUser(null)
    }
  }, [])

  useEffect(() => {
    apiClient
      .get<AuthUser>("/v1/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    await apiClient.post("/v1/auth/login", { email, password })
    const me = await apiClient.get<AuthUser>("/v1/auth/me")
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    try {
      await apiClient.post("/v1/auth/logout")
    } catch {
      // ignore
    }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
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
