"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { useAuth } from "@/lib/auth-context"

export default function OnboardingPage() {
  const { needsWorkspace, isLoading } = useAuth()
  const router = useRouter()
  const [orgName, setOrgName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isLoading) return
    if (!needsWorkspace) {
      router.replace("/dashboard")
    }
  }, [needsWorkspace, isLoading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const name = orgName.trim()
    if (!name) return
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/api/onboarding/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ org_name: name }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; detail?: string }
        setError(body.detail ?? body.error ?? "Could not create workspace")
        return
      }
      router.push("/dashboard")
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  if (isLoading || !needsWorkspace) {
    return null
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Name your workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          This creates your organization and a default API key in Traza.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="org" className="text-xs font-medium">
            Workspace name
          </Label>
          <Input
            id="org"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Acme Inc"
            className="text-sm"
            autoFocus
          />
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
        <Button type="submit" className="w-full" disabled={loading || !orgName.trim()}>
          {loading ? "Creating…" : "Continue"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        <Button
          type="button"
          className="text-foreground hover:underline underline-offset-4"
          onClick={async () => {
            await authClient.signOut()
            router.push("/auth/login")
          }}
        >
          Sign out and use a different account
        </Button>
      </p>
    </div>
  )
}
