"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"
import { usersService } from "@/modules/users/services/users-service"
import { CheckCircle2, Copy } from "lucide-react"

type Step = "form" | "done"

export default function SignupPage() {
  const { login } = useAuth()
  const router = useRouter()
  const [externalId, setExternalId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>("form")
  const [userId, setUserId] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const id = externalId.trim()
    if (!id) return

    setError("")
    setLoading(true)
    try {
      const user = await usersService.create({ external_id: id })
      setUserId(user.id)
      setStep("done")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong"
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(userId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleContinue() {
    login(userId)
    router.push("/dashboard")
  }

  if (step === "done") {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">You&apos;re in</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Save your user ID — you&apos;ll use it as your API key.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">User ID (your API key)</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/40 text-xs font-mono text-foreground truncate">
                {userId}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="shrink-0 p-2 rounded-lg border border-border hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
              >
                {copied ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          <p className="text-xs text-muted-foreground px-0.5">
            This ID won&apos;t be shown again. Store it somewhere safe before continuing.
          </p>

          <Button className="w-full" onClick={handleContinue}>
            Go to dashboard
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Get started</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Create an account to start connecting integrations
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="external-id" className="text-xs font-medium">
            Your ID
          </Label>
          <Input
            id="external-id"
            type="text"
            placeholder="e.g. user_abc123 or your email"
            value={externalId}
            onChange={(e) => setExternalId(e.target.value)}
            className="text-sm"
            autoFocus
          />
          <p className="text-xs text-muted-foreground">
            Any unique identifier for your account — email, username, or your own user ID.
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={loading || !externalId.trim()}>
          {loading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an API key?{" "}
        <Link href="/auth/login" className="text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
