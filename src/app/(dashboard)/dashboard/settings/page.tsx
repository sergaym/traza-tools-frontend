"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitcher } from "@/components/theme-switcher"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"
import { organizationsService } from "@/modules/organizations/services/organizations-service"
import type { ApiKeySummary } from "@/modules/organizations/types"

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ""

export default function SettingsPage() {
  const { user, isAuthenticated, refreshUser, logout } = useAuth()
  const [workspaceName, setWorkspaceName] = useState("")
  const [keys, setKeys] = useState<ApiKeySummary[]>([])
  const [keysLoading, setKeysLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState("")
  const [newKeyOpen, setNewKeyOpen] = useState(false)
  const [revealedKey, setRevealedKey] = useState<string | null>(null)

  useEffect(() => {
    if (user?.organization.name) setWorkspaceName(user.organization.name)
  }, [user?.organization.name])

  const loadKeys = useCallback(async () => {
    if (!isAuthenticated) {
      setKeys([])
      setKeysLoading(false)
      return
    }
    setKeysLoading(true)
    try {
      const list = await organizationsService.listApiKeys()
      setKeys(list)
    } catch {
      toast.error("Failed to load API keys")
      setKeys([])
    } finally {
      setKeysLoading(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    void loadKeys()
  }, [loadKeys])

  async function handleSaveWorkspace() {
    try {
      await organizationsService.updateName(workspaceName.trim())
      await refreshUser()
      toast.success("Workspace updated")
    } catch {
      toast.error("Could not update workspace")
    }
  }

  async function handleCreateKey() {
    const name = newKeyName.trim() || "API key"
    try {
      const created = await organizationsService.createApiKey(name)
      setRevealedKey(created.key)
      setNewKeyOpen(false)
      setNewKeyName("")
      await loadKeys()
      await refreshUser()
      toast.success("API key created — copy it now; it will not be shown again.")
    } catch {
      toast.error("Failed to create API key")
    }
  }

  async function handleRevoke(id: string) {
    if (!window.confirm("Revoke this API key? Clients using it will stop working.")) return
    try {
      await organizationsService.revokeApiKey(id)
      await loadKeys()
      toast.success("Key revoked")
    } catch {
      toast.error("Failed to revoke key")
    }
  }

  async function handleDeleteWorkspace() {
    if (
      !window.confirm(
        "Delete this workspace and all data? This cannot be undone."
      )
    )
      return
    try {
      await organizationsService.deleteWorkspace()
      logout()
      toast.success("Workspace deleted")
      window.location.href = "/"
    } catch {
      toast.error("Failed to delete workspace")
    }
  }

  function maskKeyId(id: string) {
    return `${id.slice(0, 8)}…${id.slice(-4)}`
  }

  return (
    <>
      <TopBar title="Settings" />
      <main className="flex-1 p-6 space-y-5 max-w-2xl w-full">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">General</CardTitle>
            <CardDescription className="text-xs">Basic workspace information</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Workspace name</Label>
              <Input
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="h-8 text-sm bg-muted/40 border-border max-w-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">API base URL</Label>
              <Input
                readOnly
                value={API_BASE || "(not set)"}
                className="h-8 text-sm bg-muted/40 border-border max-w-xs"
              />
            </div>
            <Button size="sm" className="h-8 text-xs" type="button" onClick={() => void handleSaveWorkspace()}>
              Save changes
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Appearance</CardTitle>
            <CardDescription className="text-xs">Choose your preferred color scheme</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">Light, dark, or follow your system</p>
              </div>
              <ThemeSwitcher />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">API Keys</CardTitle>
            <CardDescription className="text-xs">Manage authentication tokens</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-3">
            {keysLoading ? (
              <p className="text-xs text-muted-foreground">Loading…</p>
            ) : (
              keys.map((k) => (
                <div
                  key={k.id}
                  className="flex items-center justify-between p-3 bg-muted/40 rounded-md border border-border"
                >
                  <div>
                    <p className="text-xs font-medium text-foreground">{k.name}</p>
                    <code className="text-xs text-muted-foreground font-mono">{maskKeyId(k.id)}</code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-normal text-emerald-600 bg-emerald-50 border-0">
                      Active
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-muted-foreground hover:text-destructive"
                      type="button"
                      onClick={() => void handleRevoke(k.id)}
                    >
                      Revoke
                    </Button>
                  </div>
                </div>
              ))
            )}
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs border-border"
              type="button"
              onClick={() => setNewKeyOpen(true)}
            >
              Generate new key
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-destructive/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-destructive">Danger zone</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Delete workspace</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Permanently remove this workspace and all data
                </p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="h-8 text-xs"
                type="button"
                onClick={() => void handleDeleteWorkspace()}
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={newKeyOpen} onOpenChange={setNewKeyOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">New API key</DialogTitle>
            <DialogDescription className="text-xs">Choose a label for this key.</DialogDescription>
          </DialogHeader>
          <Input
            className="h-8 text-sm"
            placeholder="e.g. Production"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
          />
          <DialogFooter>
            <Button size="sm" className="h-8 text-xs" type="button" onClick={() => void handleCreateKey()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revealedKey} onOpenChange={(o) => !o && setRevealedKey(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">Your new API key</DialogTitle>
            <DialogDescription className="text-xs">
              Copy it now — you won&apos;t see it again.
            </DialogDescription>
          </DialogHeader>
          <code className="block text-xs break-all p-2 rounded-md bg-muted font-mono">{revealedKey}</code>
          <DialogFooter>
            <Button
              size="sm"
              className="h-8 text-xs"
              type="button"
              onClick={() => {
                if (revealedKey) void navigator.clipboard.writeText(revealedKey)
                toast.success("Copied")
              }}
            >
              Copy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
