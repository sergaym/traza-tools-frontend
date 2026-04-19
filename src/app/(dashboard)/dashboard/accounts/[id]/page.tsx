"use client"

import { use, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import useSWR, { useSWRConfig } from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, GitBranch, Link2, ScrollText, Plus, Search, Zap } from "lucide-react"
import { accountsService } from "@/modules/accounts/services/accounts-service"
import { connectionsService } from "@/modules/connections/services/connections-service"
import { connectLinksService } from "@/modules/connect-links/services/connect-links-service"
import { providersService } from "@/modules/providers/services/providers-service"
import { triggersService } from "@/modules/triggers/services/triggers-service"
import { toolsService } from "@/modules/tools/services/tools-service"
import { ProviderIcon } from "@/modules/providers/components/provider-icon"
import type { Connection } from "@/modules/connections/types"
import type { TriggerSubscription } from "@/modules/triggers/types"
import type { ExecutionLog } from "@/modules/tools/types"
import type { ProviderSummary } from "@/modules/providers/types"
import { apiAssetUrl, cn } from "@/lib/utils"
import { toast } from "sonner"

export default function AccountDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { mutate } = useSWRConfig()

  const { data: account, isLoading } = useSWR(
    `/v1/users/${id}`,
    () => accountsService.getById(id),
    { onError: () => toast.error("Failed to load account") }
  )

  async function handleDeleteAccount() {
    if (!window.confirm("Delete this account and all connections, triggers, and logs?")) return
    try {
      await accountsService.delete(id)
      toast.success("Account deleted")
      router.push("/dashboard/accounts")
    } catch {
      toast.error("Failed to delete account")
    }
  }

  if (isLoading) {
    return (
      <>
        <TopBar title={<Skeleton className="h-4 w-40" />} />
        <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-4">
          <Skeleton className="h-20 w-full" />
        </main>
      </>
    )
  }

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 p-10">
        <p className="text-sm text-muted-foreground">Account not found</p>
        <Button variant="outline" size="sm" render={<Link href="/dashboard/accounts" />} nativeButton={false}>
          Back to accounts
        </Button>
      </div>
    )
  }

  const displayName =
    typeof account.metadata?.name === "string" ? account.metadata.name : account.external_id

  return (
    <>
      <TopBar
        title={
          <span className="flex items-center gap-1.5 min-w-0">
            <Link href="/dashboard/accounts" className="text-muted-foreground hover:text-foreground shrink-0">
              Accounts
            </Link>
            <ChevronLeft className="w-3 h-3 text-muted-foreground rotate-180 shrink-0" />
            <span className="truncate">{displayName}</span>
          </span>
        }
        actions={
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs text-destructive border-border/60 hover:border-destructive/40"
            type="button"
            onClick={() => void handleDeleteAccount()}
          >
            Delete account
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-4xl w-full mx-auto">
        <div>
          <p className="text-xs text-muted-foreground font-mono">{account.external_id}</p>
          {account.created_at && (
            <p className="text-xs text-muted-foreground mt-1">
              Created {new Date(account.created_at).toLocaleString()}
            </p>
          )}
        </div>

        <Separator className="opacity-40" />

        <Tabs defaultValue="connections">
          <TabsList className="h-8">
            <TabsTrigger value="connections" className="text-xs h-6 gap-1.5">
              <Link2 className="w-3 h-3" />
              Connections
            </TabsTrigger>
            <TabsTrigger value="triggers" className="text-xs h-6 gap-1.5">
              <GitBranch className="w-3 h-3" />
              Triggers
            </TabsTrigger>
            <TabsTrigger value="logs" className="text-xs h-6 gap-1.5">
              <ScrollText className="w-3 h-3" />
              Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connections" className="mt-4">
            <ConnectionsTab
              accountId={id}
              onMutate={() => {
                void mutate(`/v1/users/${id}`)
              }}
            />
          </TabsContent>
          <TabsContent value="triggers" className="mt-4">
            <TriggersTab accountId={id} />
          </TabsContent>
          <TabsContent value="logs" className="mt-4">
            <LogsTab accountId={id} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

function ConnectionsTab({
  accountId,
  onMutate,
}: {
  accountId: string
  onMutate: () => void
}) {
  const { mutate } = useSWRConfig()
  const [addOpen, setAddOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [connecting, setConnecting] = useState<string | null>(null)

  const { data: connections, isLoading } = useSWR(
    [`/v1/connections`, accountId],
    () => connectionsService.getAll(accountId),
    { onError: () => toast.error("Failed to load connections") }
  )

  const { data: providersPage } = useSWR(
    addOpen ? "/v1/providers" : null,
    () => providersService.getAll({ limit: 100 }),
    { onError: () => toast.error("Failed to load toolkits") }
  )

  const providers = (providersPage?.data ?? []).filter((p: ProviderSummary) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  async function connectProvider(provider: ProviderSummary) {
    setConnecting(provider.id)
    try {
      const defs = await providersService.getConnectionDefinitions(provider.id)
      const connectionId = defs[0]?.connection_id ?? provider.id
      const link = await connectLinksService.create({
        user_id: accountId,
        provider_id: provider.id,
        connection_id: connectionId,
        redirect_url: window.location.href,
      })
      window.location.href = link.url
    } catch {
      toast.error(`Could not start connection for ${provider.name}`)
      setConnecting(null)
    }
  }

  async function disconnect(conn: Connection) {
    if (!window.confirm("Disconnect this toolkit?")) return
    try {
      await connectionsService.delete(conn.id, accountId)
      await mutate([`/v1/connections`, accountId])
      onMutate()
      toast.success("Disconnected")
    } catch {
      toast.error("Failed to disconnect")
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setAddOpen(true)}>
          <Plus className="w-3 h-3" />
          Add connection
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-24 w-full rounded-lg" />
      ) : !connections?.length ? (
        <Card className="border-border/50 bg-card">
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No connections yet. Add a connection to authorize this account with a toolkit.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {connections.map((c: Connection) => (
            <Card key={c.id} className="border-border/50 bg-card">
              <CardContent className="flex items-center gap-4 px-4 py-3">
                <ProviderIcon
                  name={c.provider_name ?? c.provider_id}
                  iconUrl={
                    c.provider_icon_url ? apiAssetUrl(c.provider_icon_url) : undefined
                  }
                  className="w-9 h-9 rounded-lg text-xs shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{c.provider_name ?? c.provider_id}</p>
                  <p className="text-xs text-muted-foreground font-mono truncate">{c.connection_id}</p>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-xs font-normal border-0 shrink-0",
                    c.status === "active"
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-muted-foreground bg-muted"
                  )}
                >
                  {c.status}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs text-destructive border-border/60 shrink-0"
                  type="button"
                  onClick={() => void disconnect(c)}
                >
                  Disconnect
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-lg max-h-[min(80vh,520px)] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-sm">Connect toolkit</DialogTitle>
            <DialogDescription className="text-xs">
              Choose a toolkit to open the authorization flow for this account.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              className="pl-8 h-8 text-sm"
              placeholder="Search toolkits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="overflow-y-auto flex-1 min-h-0 space-y-1 pr-1">
            {providers.map((p: ProviderSummary) => (
              <Button
                key={p.id}
                variant="ghost"
                className="w-full justify-start h-auto py-2 px-2 font-normal"
                type="button"
                onClick={() => void connectProvider(p)}
                disabled={connecting === p.id}
              >
                <ProviderIcon name={p.name} iconUrl={p.icon_url} className="w-8 h-8 rounded-md text-xs shrink-0" />
                <span className="text-sm font-medium truncate">{p.name}</span>
              </Button>
            ))}
          </div>
          <DialogFooter>
            <Button variant="ghost" size="sm" className="h-8 text-xs" type="button" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TriggersTab({ accountId }: { accountId: string }) {
  const { data: triggers, isLoading } = useSWR(
    [`/v1/triggers`, accountId],
    () => triggersService.getAll({ user_id: accountId }),
    { onError: () => toast.error("Failed to load triggers") }
  )

  if (isLoading) {
    return <Skeleton className="h-24 w-full rounded-lg" />
  }

  if (!triggers?.length) {
    return (
      <Card className="border-border/50 bg-card">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No trigger subscriptions for this account.
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-2">
      {triggers.map((t: TriggerSubscription) => (
        <Card key={t.id} className="border-border/50 bg-card">
          <CardContent className="flex items-center gap-4 px-4 py-3">
            <div className="p-1.5 rounded bg-foreground/8 text-foreground/60 shrink-0">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{t.trigger_id}</p>
              <p className="text-xs text-muted-foreground font-mono truncate">{t.provider_id}</p>
            </div>
            <Badge
              className={cn(
                "text-xs font-normal border-0 shrink-0",
                t.status === "active" ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground bg-muted"
              )}
            >
              {t.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function LogsTab({ accountId }: { accountId: string }) {
  const { data: logs, isLoading } = useSWR(
    [`/v1/tools/logs`, accountId],
    () => toolsService.getLogs({ user_id: accountId, limit: 50 }),
    { onError: () => toast.error("Failed to load logs") }
  )

  if (isLoading) {
    return <Skeleton className="h-40 w-full rounded-lg" />
  }

  if (!logs?.length) {
    return (
      <Card className="border-border/50 bg-card">
        <CardContent className="py-10 text-center text-sm text-muted-foreground">
          No execution logs for this account.
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-border/50 bg-card overflow-hidden">
      <CardContent className="p-0">
        <ul className="divide-y divide-border/30">
          {(logs as ExecutionLog[]).map((entry) => (
            <li key={entry.id}>
              <Link
                href={`/dashboard/logs/${entry.id}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                <div className="flex-1 min-w-0">
                  <code className="text-xs font-mono text-foreground">{entry.tool_id}</code>
                  {entry.error && (
                    <p className="text-xs text-red-400/80 truncate mt-0.5">{entry.error}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs font-normal shrink-0">
                  {entry.status}
                </Badge>
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
