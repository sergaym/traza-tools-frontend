"use client"

import { use, useState } from "react"
import Link from "next/link"
import useSWR, { useSWRConfig } from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ChevronLeft, Zap, GitBranch, Activity, Users, Plus, Search, Key, Globe, ShieldOff } from "lucide-react"
import { providersService } from "@/modules/providers/services/providers-service"
import { connectionsService } from "@/modules/connections/services/connections-service"
import { connectLinksService } from "@/modules/connect-links/services/connect-links-service"
import { accountsService } from "@/modules/accounts/services/accounts-service"
import { ProviderIcon } from "@/modules/providers/components/provider-icon"
import type { ProviderToolItem, ProviderConnectionItem, ConnectionFieldItem, ConnectionType } from "@/modules/providers/types"
import type { LinkedConnection } from "@/modules/connections/types"
import type { Account } from "@/modules/accounts/types"
import { toast } from "sonner"

export default function ToolkitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { mutate } = useSWRConfig()

  const { data: provider, isLoading: loadingProvider } = useSWR(
    `/v1/providers/${id}`,
    () => providersService.getById(id),
    { onError: () => toast.error("Failed to load toolkit") }
  )

  const { data: toolsPage, isLoading: loadingTools } = useSWR(
    `/v1/providers/${id}/tools`,
    () => providersService.getTools(id, { limit: 100 }),
    { onError: () => toast.error("Failed to load tools") }
  )

  const { data: triggersPage, isLoading: loadingTriggers } = useSWR(
    `/v1/providers/${id}/triggers`,
    () => providersService.getTriggers(id, { limit: 100 }),
    { onError: () => toast.error("Failed to load triggers") }
  )

  const { data: linkedConnections, isLoading: loadingAccounts } = useSWR(
    `/v1/connections/for-provider/${id}`,
    () => connectionsService.listForProvider(id),
    { onError: () => toast.error("Failed to load accounts for this toolkit") }
  )

  const tools = toolsPage?.data ?? []
  const triggers = triggersPage?.data ?? []
  const accounts = linkedConnections ?? []
  const uniqueAccountCount = new Set(accounts.map((a) => a.user_id)).size

  if (loadingProvider) {
    return (
      <>
        <TopBar title={<Skeleton className="h-4 w-32" />} />
        <main className="flex-1 p-6 max-w-4xl w-full mx-auto space-y-5">
          <div className="flex items-center gap-4">
            <Skeleton className="w-10 h-10 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        </main>
      </>
    )
  }

  if (!provider) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center p-10">
        <p className="text-sm text-muted-foreground">Toolkit not found</p>
        <Button variant="outline" size="sm" render={<Link href="/dashboard/toolkits" />} nativeButton={false}>
          Back to toolkits
        </Button>
      </div>
    )
  }

  return (
    <>
      <TopBar
        title={
          <span className="flex items-center gap-1.5">
            <Link href="/dashboard/toolkits" className="text-muted-foreground hover:text-foreground transition-colors">
              Toolkits
            </Link>
            <ChevronLeft className="w-3 h-3 text-muted-foreground rotate-180" />
            <span>{provider.name}</span>
          </span>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-4">
          <ProviderIcon name={provider.name} iconUrl={provider.icon_url} className="w-10 h-10 rounded-xl text-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground">{provider.name}</p>
            <p className="text-xs text-muted-foreground">
              {provider.tool_count} tool{provider.tool_count !== 1 ? "s" : ""} · {provider.trigger_count} trigger
              {provider.trigger_count !== 1 ? "s" : ""} · {uniqueAccountCount} account{uniqueAccountCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        <Separator className="opacity-40" />

        <Tabs defaultValue="tools">
          <TabsList className="h-8">
            <TabsTrigger value="tools" className="text-xs h-6 gap-1.5">
              <Zap className="w-3 h-3" />
              Tools
              <Badge variant="secondary" className="text-xs font-normal h-4 px-1 ml-0.5">{tools.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="triggers" className="text-xs h-6 gap-1.5">
              <GitBranch className="w-3 h-3" />
              Triggers
              <Badge variant="secondary" className="text-xs font-normal h-4 px-1 ml-0.5">{triggers.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="accounts" className="text-xs h-6 gap-1.5">
              <Users className="w-3 h-3" />
              Accounts
              <Badge variant="secondary" className="text-xs font-normal h-4 px-1 ml-0.5">
                {uniqueAccountCount}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools" className="mt-4">
            <CatalogToolsPanel tools={tools} loading={loadingTools} />
          </TabsContent>
          <TabsContent value="triggers" className="mt-4">
            <CatalogTriggersPanel triggers={triggers} loading={loadingTriggers} />
          </TabsContent>
          <TabsContent value="accounts" className="mt-4">
            <ToolkitAccountsPanel
              providerId={id}
              connections={accounts}
              loading={loadingAccounts}
              onMutate={() => void mutate(`/v1/connections/for-provider/${id}`)}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

function CatalogToolsPanel({ tools, loading }: { tools: ProviderToolItem[]; loading: boolean }) {
  if (loading) {
    return (
      <Card className="bg-card">
        <CardContent className="p-0">
          <ul className="divide-y divide-border/30">
            {Array.from({ length: 3 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="w-6 h-6 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-64" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }

  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Zap className="w-7 h-7 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No tools in this toolkit</p>
      </div>
    )
  }

  return (
    <Card className="bg-card">
      <CardContent className="p-0">
        <ul className="divide-y divide-border/30">
          {tools.map((tool) => (
            <li key={tool.tool_slug} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="p-1.5 rounded bg-muted/60 text-muted-foreground shrink-0">
                <Zap className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{tool.name}</p>
                <code className="text-xs font-mono text-muted-foreground">{tool.tool_id}</code>
              </div>
              <Badge variant="secondary" className="text-xs font-normal shrink-0">
                {tool.tool_slug}
              </Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// --- helpers -----------------------------------------------------------

const OAUTH_TYPES: ConnectionType[] = ["oauth", "oauth_custom_credentials"]
const CREDENTIAL_TYPES: ConnectionType[] = ["credentials", "ntlm", "sqs"]

function connTypeBadge(type: ConnectionType) {
  if (OAUTH_TYPES.includes(type)) return { label: "OAuth", icon: Globe, className: "text-indigo-600 bg-indigo-50 border-0" }
  if (type === "no_auth") return { label: "No auth", icon: ShieldOff, className: "text-muted-foreground bg-muted border-0" }
  return { label: "API key", icon: Key, className: "text-amber-600 bg-amber-50 border-0" }
}

// --- main panel --------------------------------------------------------

type Step =
  | { kind: "account" }
  | { kind: "connection"; userId: string; isNew: boolean; externalId?: string }
  | { kind: "credentials"; userId: string; isNew: boolean; externalId?: string; connection: ProviderConnectionItem }

function ToolkitAccountsPanel({
  providerId,
  connections,
  loading,
  onMutate,
}: {
  providerId: string
  connections: LinkedConnection[]
  loading: boolean
  onMutate: () => void
}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>({ kind: "account" })
  const [accountTab, setAccountTab] = useState<"existing" | "new">("existing")
  const [search, setSearch] = useState("")
  const [externalId, setExternalId] = useState("")
  const [busy, setBusy] = useState(false)
  const [credValues, setCredValues] = useState<Record<string, string>>({})

  const { data: accountsPage } = useSWR(
    open ? "/v1/users?panel" : null,
    () => accountsService.getAll({ limit: 100 }),
    { onError: () => toast.error("Failed to load accounts") }
  )

  const { data: connectionDefs } = useSWR(
    open ? `/v1/providers/${providerId}/connections` : null,
    () => providersService.getConnectionDefinitions(providerId),
    { onError: () => toast.error("Failed to load connection types") }
  )

  const { data: fields } = useSWR(
    step.kind === "credentials"
      ? `/v1/providers/${providerId}/connections/${step.connection.connection_id}/fields`
      : null,
    () =>
      step.kind === "credentials"
        ? providersService.getConnectionFields(providerId, step.connection.connection_id)
        : Promise.resolve([]),
    { onError: () => toast.error("Failed to load connection fields") }
  )

  const filteredAccounts = (accountsPage?.data ?? []).filter((a: Account) =>
    a.external_id.toLowerCase().includes(search.toLowerCase())
  )

  function reset() {
    setStep({ kind: "account" })
    setAccountTab("existing")
    setSearch("")
    setExternalId("")
    setCredValues({})
    setBusy(false)
  }

  function closeDialog() {
    setOpen(false)
    reset()
  }

  async function resolveAccount(): Promise<Account | null> {
    if (accountTab === "existing") return null
    const trimmed = externalId.trim()
    if (!trimmed) {
      toast.error("External ID is required")
      return null
    }
    return accountsService.create({ external_id: trimmed, metadata: {} })
  }

  async function proceedWithAccount(account: Account) {
    const defs = connectionDefs ?? []
    if (defs.length === 0) {
      toast.error("This toolkit has no configured connection types")
      return
    }
    if (defs.length === 1) {
      await routeToConnection(account.id, false, undefined, defs[0])
    } else {
      setStep({ kind: "connection", userId: account.id, isNew: false })
    }
  }

  async function handleAccountSelect(account: Account) {
    setBusy(true)
    try {
      await proceedWithAccount(account)
    } finally {
      setBusy(false)
    }
  }

  async function handleNewAccountProceed() {
    const trimmed = externalId.trim()
    if (!trimmed) { toast.error("External ID is required"); return }
    setBusy(true)
    try {
      const account = await accountsService.create({ external_id: trimmed, metadata: {} })
      onMutate()
      const defs = connectionDefs ?? []
      if (defs.length === 0) { toast.error("No connection types configured"); setBusy(false); return }
      if (defs.length === 1) {
        await routeToConnection(account.id, true, trimmed, defs[0])
      } else {
        setStep({ kind: "connection", userId: account.id, isNew: true, externalId: trimmed })
      }
    } catch {
      toast.error("Could not create account")
      setBusy(false)
    }
  }

  async function handleConnectionPick(conn: ProviderConnectionItem) {
    if (step.kind !== "connection") return
    await routeToConnection(step.userId, step.isNew, step.externalId, conn)
  }

  async function routeToConnection(
    userId: string,
    isNew: boolean,
    accountExternalId: string | undefined,
    conn: ProviderConnectionItem
  ) {
    if (conn.connection_type === "no_auth") {
      setBusy(true)
      try {
        await connectionsService.create({
          user_id: userId,
          provider_id: providerId,
          connection_id: conn.connection_id,
          credentials: {},
        })
        onMutate()
        toast.success("Connected successfully")
        closeDialog()
      } catch {
        toast.error("Could not connect")
        setBusy(false)
      }
      return
    }

    if (OAUTH_TYPES.includes(conn.connection_type)) {
      setBusy(true)
      try {
        const link = await connectLinksService.create({
          user_id: userId,
          provider_id: providerId,
          connection_id: conn.connection_id,
          redirect_url: window.location.href,
        })
        window.location.href = link.url
      } catch {
        toast.error("Could not start OAuth flow")
        setBusy(false)
      }
      return
    }

    // credentials / ntlm / sqs — go to form step
    setStep({ kind: "credentials", userId, isNew, externalId: accountExternalId, connection: conn })
    setCredValues({})
  }

  async function handleCredentialSubmit() {
    if (step.kind !== "credentials") return
    const requiredFields = (fields ?? []).filter((f: ConnectionFieldItem) => f.required)
    const missing = requiredFields.filter((f: ConnectionFieldItem) => !credValues[f.name]?.trim())
    if (missing.length > 0) {
      toast.error(`Required: ${missing.map((f: ConnectionFieldItem) => f.label).join(", ")}`)
      return
    }
    setBusy(true)
    try {
      await connectionsService.create({
        user_id: step.userId,
        provider_id: providerId,
        connection_id: step.connection.connection_id,
        credentials: credValues,
      })
      onMutate()
      toast.success("Connected successfully")
      closeDialog()
    } catch {
      toast.error("Could not connect")
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <Card className="bg-card border-border/50">
        <CardContent className="p-0">
          <ul className="divide-y divide-border/30">
            {Array.from({ length: 2 }).map((_, i) => (
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-36" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button size="sm" className="h-8 text-xs gap-1" onClick={() => setOpen(true)}>
          <Plus className="w-3 h-3" />
          Connect account
        </Button>
      </div>

      {connections.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <Users className="w-7 h-7 text-muted-foreground/30" />
          <p className="text-sm text-muted-foreground">No accounts have connected this toolkit yet</p>
        </div>
      ) : (
        <Card className="bg-card border-border/50">
          <CardContent className="p-0">
            <ul className="divide-y divide-border/30">
              {connections.map((conn) => {
                const label = conn.user_display_name?.trim() || conn.user_external_id
                return (
                  <li key={conn.id}>
                    <Link
                      href={`/dashboard/accounts/${conn.user_id}`}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors group"
                    >
                      <div className="p-1.5 rounded-full bg-muted/60 text-muted-foreground shrink-0">
                        <Users className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{label}</p>
                        <p className="text-xs text-muted-foreground font-mono truncate">{conn.user_external_id}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <Badge variant="outline" className="text-xs font-normal">
                          {conn.connection_id}
                        </Badge>
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{conn.status}</span>
                      </div>
                      <ChevronLeft className="w-3 h-3 text-muted-foreground/40 rotate-180 shrink-0 group-hover:text-muted-foreground transition-colors" />
                    </Link>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      <Dialog open={open} onOpenChange={(v) => { if (!v) closeDialog() }}>
        <DialogContent className="sm:max-w-md flex flex-col max-h-[min(80vh,540px)]">
          {step.kind === "account" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm">Connect account</DialogTitle>
                <DialogDescription className="text-xs">
                  Choose an account or create a new one to connect with this toolkit.
                </DialogDescription>
              </DialogHeader>

              <div className="flex gap-1 border-b border-border/40 -mx-6 px-6">
                {(["existing", "new"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setAccountTab(t)}
                    className={`text-xs pb-2 px-1 border-b-2 transition-colors ${
                      accountTab === t
                        ? "border-foreground text-foreground font-medium"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t === "existing" ? "Existing account" : "New account"}
                  </button>
                ))}
              </div>

              {accountTab === "existing" ? (
                <>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <Input
                      className="pl-8 h-8 text-sm"
                      placeholder="Search accounts..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="overflow-y-auto flex-1 min-h-0 space-y-1 pr-1">
                    {filteredAccounts.map((a: Account) => (
                      <Button
                        key={a.id}
                        variant="ghost"
                        className="w-full justify-start h-8 px-2 text-xs font-normal"
                        type="button"
                        disabled={busy}
                        onClick={() => void handleAccountSelect(a)}
                      >
                        {a.external_id}
                      </Button>
                    ))}
                    {filteredAccounts.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-6">No accounts found</p>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" type="button" onClick={closeDialog}>
                      Cancel
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <>
                  <div className="space-y-1.5 py-1">
                    <Label className="text-xs">External ID</Label>
                    <Input
                      className="h-8 text-sm"
                      placeholder="e.g. user_123"
                      value={externalId}
                      onChange={(e) => setExternalId(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") void handleNewAccountProceed() }}
                    />
                  </div>
                  <DialogFooter>
                    <Button variant="ghost" size="sm" className="h-8 text-xs" type="button" onClick={closeDialog}>
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="h-8 text-xs"
                      type="button"
                      disabled={busy || !externalId.trim()}
                      onClick={() => void handleNewAccountProceed()}
                    >
                      Continue
                    </Button>
                  </DialogFooter>
                </>
              )}
            </>
          )}

          {step.kind === "connection" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm">Choose connection type</DialogTitle>
                <DialogDescription className="text-xs">
                  This toolkit supports multiple ways to connect.
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 min-h-0 space-y-1.5 pr-1">
                {(connectionDefs ?? []).map((conn) => {
                  const badge = connTypeBadge(conn.connection_type)
                  const Icon = badge.icon
                  return (
                    <button
                      key={conn.connection_id}
                      type="button"
                      disabled={busy}
                      onClick={() => void handleConnectionPick(conn)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border/50 hover:border-border hover:bg-muted/20 transition-colors text-left"
                    >
                      <div className="p-1.5 rounded bg-muted/60 text-muted-foreground shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{conn.name}</p>
                        {conn.description && (
                          <p className="text-xs text-muted-foreground truncate">{conn.description}</p>
                        )}
                      </div>
                      <Badge className={`text-xs font-normal shrink-0 ${badge.className}`}>
                        {badge.label}
                      </Badge>
                    </button>
                  )
                })}
              </div>
              <DialogFooter>
                <Button variant="ghost" size="sm" className="h-8 text-xs" type="button" onClick={() => setStep({ kind: "account" })}>
                  Back
                </Button>
              </DialogFooter>
            </>
          )}

          {step.kind === "credentials" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-sm">{step.connection.name}</DialogTitle>
                <DialogDescription className="text-xs">
                  {step.connection.description ?? "Enter your credentials to connect."}
                </DialogDescription>
              </DialogHeader>
              <div className="overflow-y-auto flex-1 min-h-0 space-y-3 pr-1">
                {(fields ?? []).map((f: ConnectionFieldItem) => (
                  <div key={f.name} className="space-y-1.5">
                    <Label className="text-xs">
                      {f.label}
                      {!f.required && <span className="text-muted-foreground ml-1">(optional)</span>}
                    </Label>
                    <Input
                      className="h-8 text-sm"
                      type={f.type === "secret" || f.type === "secret_multiline" ? "password" : "text"}
                      placeholder={f.placeholder ?? ""}
                      value={credValues[f.name] ?? (f.default != null ? String(f.default) : "")}
                      onChange={(e) => setCredValues((prev) => ({ ...prev, [f.name]: e.target.value }))}
                    />
                    {f.help && <p className="text-[11px] text-muted-foreground">{f.help}</p>}
                    {f.url && (
                      <a href={f.url} target="_blank" rel="noreferrer" className="text-[11px] text-primary hover:underline">
                        How to find this →
                      </a>
                    )}
                  </div>
                ))}
                {!fields && <Skeleton className="h-20 w-full" />}
              </div>
              <DialogFooter>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  type="button"
                  onClick={() => {
                    const defs = connectionDefs ?? []
                    setStep(
                      defs.length > 1
                        ? { kind: "connection", userId: step.userId, isNew: step.isNew, externalId: step.externalId }
                        : { kind: "account" }
                    )
                  }}
                >
                  Back
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs"
                  type="button"
                  disabled={busy || !fields}
                  onClick={() => void handleCredentialSubmit()}
                >
                  Connect
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function CatalogTriggersPanel({ triggers, loading }: { triggers: ProviderToolItem[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-card">
            <CardContent className="flex items-center gap-4 px-4 py-3">
              <Skeleton className="w-6 h-6 rounded" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-3 w-40" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (triggers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Activity className="w-7 h-7 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No triggers in this toolkit</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {triggers.map((t) => (
        <Card key={t.tool_slug} className="bg-card hover:border-border transition-colors">
          <CardContent className="flex items-center gap-4 px-4 py-3">
            <div className="p-1.5 rounded bg-foreground/8 text-foreground/60 shrink-0">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{t.name}</p>
              <code className="text-xs font-mono text-muted-foreground">{t.tool_id}</code>
            </div>
            <Badge variant="secondary" className="text-xs font-normal shrink-0">
              {t.tool_slug}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
