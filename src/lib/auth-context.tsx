"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react"

import { authClient } from "@/lib/auth-client"
import { apiClient, clearTrazaTokenCache } from "@/lib/api-client"

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
  const { data: session, isPending: sessionPending } = authClient.useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [meLoading, setMeLoading] = useState(true)

  useEffect(() => {
    if (sessionPending) return
    if (!session) {
      setUser(null)
      setMeLoading(false)
      return
    }
    setMeLoading(true)
    clearTrazaTokenCache()
    apiClient
      .get<AuthUser>("/v1/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setMeLoading(false))
  }, [session, sessionPending])

  const refreshUser = useCallback(async () => {
    clearTrazaTokenCache()
    if (!session) {
      setUser(null)
      return
    }
    try {
      const me = await apiClient.get<AuthUser>("/v1/auth/me")
      setUser(me)
    } catch {
      setUser(null)
    }
  }, [session])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password })
    if (error) {
      throw new Error(error.message ?? "Sign in failed")
    }
    clearTrazaTokenCache()
  }, [])

  const logout = useCallback(async () => {
    clearTrazaTokenCache()
    await authClient.signOut()
    setUser(null)
  }, [])

  const isLoading = sessionPending || (!!session && meLoading)
  const isAuthenticated = !!session && !!user

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
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
