"use client"

import { use } from "react"
import Link from "next/link"
import useSWR, { useSWRConfig } from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { ChevronLeft, Zap, GitBranch, Activity } from "lucide-react"
import { providersService } from "@/modules/providers/services/providers-service"
import { toolsService } from "@/modules/tools/services/tools-service"
import { connectionsService } from "@/modules/connections/services/connections-service"
import { triggersService } from "@/modules/triggers/services/triggers-service"
import { ProviderIcon } from "@/modules/providers/components/provider-icon"
import type { ToolSummary } from "@/modules/tools/types"
import type { TriggerSubscription } from "@/modules/triggers/types"
import type { Connection } from "@/modules/connections/types"
import { toast } from "sonner"

const TRAZA_USER_ID = process.env.NEXT_PUBLIC_TRAZA_USER_ID ?? ""

export default function IntegrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { mutate } = useSWRConfig()

  const { data: provider, isLoading: loadingProvider } = useSWR(
    `/v1/providers/${id}`,
    () => providersService.getById(id),
    { onError: () => toast.error("Failed to load provider") }
  )

  const { data: toolsPage, isLoading: loadingTools } = useSWR(
    `/v1/tools?provider_id=${id}`,
    () => toolsService.getAll({ limit: 100 }),
    { onError: () => toast.error("Failed to load tools") }
  )

  const { data: allConnections, isLoading: loadingConnections } = useSWR(
    TRAZA_USER_ID ? ["/v1/connections", TRAZA_USER_ID] : null,
    () => connectionsService.getAll(TRAZA_USER_ID),
    { onError: () => toast.error("Failed to load connections") }
  )

  const { data: allTriggers, isLoading: loadingTriggers } = useSWR(
    TRAZA_USER_ID ? ["/v1/triggers", TRAZA_USER_ID] : null,
    () => triggersService.getAll(TRAZA_USER_ID),
    { onError: () => toast.error("Failed to load triggers") }
  )

  const tools = (toolsPage?.data ?? []).filter((t: ToolSummary) => t.provider_id === id)
  const connection = (allConnections ?? []).find((c: Connection) => c.provider_id === id)
  const triggers = (allTriggers ?? []).filter((t: TriggerSubscription) => t.provider_id === id)

  async function handleDisconnect() {
    if (!connection) return
    try {
      await connectionsService.delete(connection.id, TRAZA_USER_ID)
      await mutate(TRAZA_USER_ID ? ["/v1/connections", TRAZA_USER_ID] : null)
      toast.success("Disconnected")
    } catch {
      toast.error("Failed to disconnect")
    }
  }

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
        <p className="text-sm text-muted-foreground">Provider not found</p>
        <Button variant="outline" size="sm" render={<Link href="/dashboard/integrations" />} nativeButton={false}>
          Back to integrations
        </Button>
      </div>
    )
  }

  return (
    <>
      <TopBar
        title={
          <span className="flex items-center gap-1.5">
            <Link href="/dashboard/integrations" className="text-muted-foreground hover:text-foreground transition-colors">
              Integrations
            </Link>
            <ChevronLeft className="w-3 h-3 text-muted-foreground rotate-180" />
            <span>{provider.name}</span>
          </span>
        }
        badge={connection ? "Connected" : "Not connected"}
      />
      <main className="flex-1 p-6 space-y-5 max-w-4xl w-full mx-auto">
        <div className="flex items-center gap-4">
          <ProviderIcon name={provider.name} iconUrl={provider.icon_url} className="w-10 h-10 rounded-xl text-sm" />
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold text-foreground">{provider.name}</p>
            <p className="text-xs text-muted-foreground">
              {provider.tool_count} tool{provider.tool_count !== 1 ? "s" : ""} · {provider.trigger_count} trigger{provider.trigger_count !== 1 ? "s" : ""}
            </p>
          </div>
          {connection && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 text-xs border-border/60 text-destructive hover:text-destructive hover:border-destructive/40"
              onClick={handleDisconnect}
            >
              Disconnect
            </Button>
          )}
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
          </TabsList>

          <TabsContent value="tools" className="mt-4">
            <ToolsPanel tools={tools} loading={loadingTools} />
          </TabsContent>
          <TabsContent value="triggers" className="mt-4">
            <TriggersPanel triggers={triggers} loading={loadingTriggers} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

function ToolsPanel({ tools, loading }: { tools: ToolSummary[]; loading: boolean }) {
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
        <p className="text-sm text-muted-foreground">No tools available</p>
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
                <code className="text-xs font-mono text-foreground">{tool.tool_id}</code>
                <p className="text-xs text-muted-foreground">v{tool.version}</p>
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

function TriggersPanel({ triggers, loading }: { triggers: TriggerSubscription[]; loading: boolean }) {
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
        <p className="text-sm text-muted-foreground">No active trigger subscriptions</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {triggers.map((trigger) => (
        <Card key={trigger.id} className="bg-card border-border/50 hover:border-border transition-colors">
          <CardContent className="flex items-center gap-4 px-4 py-3">
            <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
              <GitBranch className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{trigger.trigger_id}</p>
              <code className="text-xs font-mono text-muted-foreground truncate">{trigger.callback_url}</code>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <Badge className={`text-xs font-normal border-0 ${trigger.status === "active" ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground bg-muted"}`}>
                {trigger.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
