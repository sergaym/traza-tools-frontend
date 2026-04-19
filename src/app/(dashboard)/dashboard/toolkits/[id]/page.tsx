"use client"

import { use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Zap, GitBranch, Activity, Users } from "lucide-react"
import { providersService } from "@/modules/providers/services/providers-service"
import { connectionsService } from "@/modules/connections/services/connections-service"
import { ProviderIcon } from "@/modules/providers/components/provider-icon"
import type { ProviderToolItem } from "@/modules/providers/types"
import type { LinkedConnection } from "@/modules/connections/types"
import { toast } from "sonner"

export default function ToolkitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

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
          <TabsList className="h-8 bg-muted/40 border border-border/40">
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
            <ToolkitAccountsPanel connections={accounts} loading={loadingAccounts} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

function CatalogToolsPanel({ tools, loading }: { tools: ProviderToolItem[]; loading: boolean }) {
  if (loading) {
    return (
      <Card className="bg-card border-border/50">
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
    <Card className="bg-card border-border/50">
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

function ToolkitAccountsPanel({ connections, loading }: { connections: LinkedConnection[]; loading: boolean }) {
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

  if (connections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Users className="w-7 h-7 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No accounts have connected this toolkit yet</p>
        <Button variant="outline" size="sm" className="h-8 text-xs" render={<Link href="/dashboard/accounts" />} nativeButton={false}>
          Go to Accounts
        </Button>
      </div>
    )
  }

  return (
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
  )
}

function CatalogTriggersPanel({ triggers, loading }: { triggers: ProviderToolItem[]; loading: boolean }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="bg-card border-border/50">
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
        <Card key={t.tool_slug} className="bg-card border-border/50 hover:border-border transition-colors">
          <CardContent className="flex items-center gap-4 px-4 py-3">
            <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
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
