"use client"

import { createContext, useCallback, useContext, useEffect, useState } from "react"

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
  needsWorkspace: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

type BetterAuthUser = { organizationId?: string | null }

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [meLoading, setMeLoading] = useState(true)

  const orgId = (session?.user as BetterAuthUser | undefined)?.organizationId ?? null

  useEffect(() => {
    if (isPending) return
    if (!session || !orgId) {
      setUser(null)
      setMeLoading(false)
      return
    }
    setMeLoading(true)
    apiClient.get<AuthUser>("/v1/auth/me")
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setMeLoading(false))
  }, [session, isPending, orgId])

  const refreshUser = useCallback(async () => {
    clearTrazaTokenCache()
    if (!session) return setUser(null)
    try {
      setUser(await apiClient.get<AuthUser>("/v1/auth/me"))
    } catch {
      setUser(null)
    }
  }, [session])

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await authClient.signIn.email({ email, password })
    if (error) throw new Error(error.message ?? "Sign in failed")
    clearTrazaTokenCache()
  }, [])

  const logout = useCallback(async () => {
    clearTrazaTokenCache()
    await authClient.signOut()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!session && !!user,
      isLoading: isPending || (!!session && !!orgId && meLoading),
      needsWorkspace: !isPending && !!session && !orgId,
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
