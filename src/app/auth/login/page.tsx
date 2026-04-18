"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [apiKey, setApiKey] = useState("")
  const [show, setShow] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = apiKey.trim()
    if (!trimmed) return

    setError("")
    setLoading(true)
    try {
      login(trimmed)
      router.push("/dashboard")
    } catch {
      setError("Invalid API key. Check your key and try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Enter your API key to access the dashboard
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="api-key" className="text-xs font-medium">
            API Key
          </Label>
          <div className="relative">
            <Input
              id="api-key"
              type={show ? "text" : "password"}
              placeholder="trz_••••••••••••••••"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="pr-9 font-mono text-sm"
              autoComplete="current-password"
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
            >
              {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading || !apiKey.trim()}>
          {loading ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Don&apos;t have an API key?{" "}
        <Link href="/auth/signup" className="text-foreground hover:underline underline-offset-4">
          Get started
        </Link>
      </p>
    </div>
  )
}
