"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { authClient } from "@/lib/auth-client"
import { CheckCircle2, Copy } from "lucide-react"

type Step = "form" | "done"

export default function SignupPage() {
  const router = useRouter()
  const [orgName, setOrgName] = useState("")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<Step>("form")
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const on = orgName.trim()
    const nm = name.trim()
    const em = email.trim()
    if (!on || !nm || !em || password.length < 8) return

    setError("")
    setLoading(true)
    try {
      const { error: signErr } = await authClient.signUp.email({
        email: em,
        password,
        name: nm,
      })
      if (signErr) {
        setError(signErr.message ?? "Could not create account")
        return
      }

      const res = await fetch("/api/onboarding/organization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ org_name: on }),
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string; detail?: string }
        setError(body.detail ?? body.error ?? "Could not create workspace")
        return
      }

      const data = (await res.json()) as {
        api_key: { key: string }
      }
      setApiKey(data.api_key.key)
      setStep("done")
    } catch {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleContinue() {
    router.push("/dashboard")
    router.refresh()
  }

  if (step === "done") {
    return (
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground tracking-tight">Workspace ready</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Save your default API key for programmatic access — it won&apos;t be shown again.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Default API key</Label>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 rounded-lg border border-border bg-muted/40 text-xs font-mono text-foreground truncate">
                {apiKey}
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
            You&apos;re signed in with Better Auth. Use this key for the Traza API and integrations.
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
        <h1 className="text-xl font-semibold text-foreground tracking-tight">Create workspace</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Better Auth handles your account; we link it to a Traza organization and API key.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="org-name" className="text-xs font-medium">
            Workspace name
          </Label>
          <Input
            id="org-name"
            type="text"
            placeholder="Acme Inc"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="text-sm"
            autoFocus
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-medium">
            Your name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Jane Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-xs font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-medium">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-sm"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}

        <Button
          type="submit"
          className="w-full"
          disabled={loading || !orgName.trim() || !name.trim() || !email.trim() || password.length < 8}
        >
          {loading ? "Creating…" : "Create workspace"}
        </Button>
      </form>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-foreground hover:underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </div>
  )
}
