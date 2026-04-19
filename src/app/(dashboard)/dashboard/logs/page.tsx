"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle2, XCircle, Clock, Zap, GitBranch, Activity } from "lucide-react"
import { cn } from "@/lib/utils"
import { toolsService } from "@/modules/tools/services/tools-service"
import { triggersService } from "@/modules/triggers/services/triggers-service"
import type { ExecutionLog } from "@/modules/tools/types"
import type { TriggerSubscription } from "@/modules/triggers/types"
import { toast } from "sonner"

type LogStatus = "success" | "error" | "running"

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-emerald-500" },
  error: { icon: XCircle, className: "text-red-400" },
  running: { icon: Clock, className: "text-amber-400 animate-pulse" },
}

function shortId(id: string) {
  return `${id.slice(0, 8)}…${id.slice(-4)}`
}

export default function LogsPage() {
  const [search, setSearch] = useState("")
  const [segment, setSegment] = useState("tools")
  const [statusTab, setStatusTab] = useState("all")

  const { data: logs, isLoading: logsLoading } = useSWR(
    "/v1/tools/logs",
    () => toolsService.getLogs({ limit: 200 }),
    { onError: () => toast.error("Failed to load logs") }
  )

  const { data: triggers, isLoading: triggersLoading } = useSWR(
    "/v1/triggers",
    () => triggersService.getAll(),
    { onError: () => toast.error("Failed to load triggers") }
  )

  const filteredLogs = (logs ?? []).filter((entry: ExecutionLog) => {
    const q = search.toLowerCase()
    const matchesSearch =
      entry.tool_id.toLowerCase().includes(q) ||
      entry.provider_id.toLowerCase().includes(q) ||
      entry.user_id.toLowerCase().includes(q)
    const matchesStatus =
      statusTab === "all" || (statusTab === "errors" && entry.status === "error")
    return matchesSearch && matchesStatus
  })

  const filteredTriggers = (triggers ?? []).filter((t: TriggerSubscription) => {
    const q = search.toLowerCase()
    return (
      t.trigger_id.toLowerCase().includes(q) ||
      t.provider_id.toLowerCase().includes(q) ||
      t.user_id.toLowerCase().includes(q)
    )
  })

  const errorCount = (logs ?? []).filter((l: ExecutionLog) => l.status === "error").length
  const isLoading = segment === "tools" ? logsLoading : triggersLoading

  return (
    <>
      <TopBar title="Logs" />
      <main className="flex-1 p-6 space-y-4 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <Tabs value={segment} onValueChange={(v) => { setSegment(v); setSearch(""); setStatusTab("all") }}>
            <TabsList className="h-8">
              <TabsTrigger value="tools" className="text-xs h-6 gap-1.5">
                <Zap className="w-3 h-3" /> Tools
              </TabsTrigger>
              <TabsTrigger value="triggers" className="text-xs h-6 gap-1.5">
                <GitBranch className="w-3 h-3" /> Triggers
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder={segment === "tools" ? "Search tool logs..." : "Search triggers..."}
              className="pl-9 h-8 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {segment === "tools" && (
            <Tabs value={statusTab} onValueChange={setStatusTab}>
              <TabsList className="h-8">
                <TabsTrigger value="all" className="text-xs h-6">All</TabsTrigger>
                <TabsTrigger value="errors" className="text-xs h-6 gap-1">
                  Errors
                  {errorCount > 0 && (
                    <Badge className="text-xs font-normal h-4 px-1 bg-red-400/15 text-red-400 border-0">{errorCount}</Badge>
                  )}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <ul className="divide-y divide-border/30">
                {Array.from({ length: 6 }).map((_, i) => (
                  <li key={i} className="flex items-center gap-3 px-4 py-3">
                    <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
                    <Skeleton className="w-6 h-6 rounded shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-3 w-32" />
                    </div>
                    <Skeleton className="h-3 w-16" />
                  </li>
                ))}
              </ul>
            ) : segment === "tools" ? (
              filteredLogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <Search className="w-7 h-7 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No logs found</p>
                  <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setStatusTab("all") }}>
                    Clear filters
                  </Button>
                </div>
              ) : (
                <ul className="divide-y divide-border/30">
                  {filteredLogs.map((entry: ExecutionLog) => {
                    const config = STATUS_CONFIG[entry.status as LogStatus] ?? STATUS_CONFIG.running
                    const { icon: StatusIcon, className: statusClass } = config
                    return (
                      <li key={entry.id}>
                        <Link
                          href={`/dashboard/logs/${entry.id}`}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors"
                        >
                          <StatusIcon className={cn("w-3.5 h-3.5 shrink-0", statusClass)} />
                          <div className="p-1 rounded bg-muted/50 text-muted-foreground shrink-0">
                            <Zap className="w-3 h-3" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <code className="text-xs font-mono text-foreground">{entry.tool_id}</code>
                              <Badge variant="secondary" className="text-xs font-normal h-4 px-1.5 shrink-0">
                                {entry.provider_id}
                              </Badge>
                              <span className="text-xs font-mono text-muted-foreground" title={entry.user_id}>
                                {shortId(entry.user_id)}
                              </span>
                            </div>
                            {entry.error && (
                              <p className="text-xs text-red-400/80 truncate mt-0.5">{entry.error}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            {entry.duration_ms !== null && (
                              <span className="text-xs text-muted-foreground hidden sm:block">
                                {entry.duration_ms}ms
                              </span>
                            )}
                            {entry.created_at && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(entry.created_at).toLocaleTimeString()}
                              </span>
                            )}
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )
            ) : (
              filteredTriggers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <Activity className="w-7 h-7 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">
                    {search ? "No triggers found" : "No trigger subscriptions yet"}
                  </p>
                  {search && (
                    <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                      Clear filters
                    </Button>
                  )}
                </div>
              ) : (
                <ul className="divide-y divide-border/30">
                  {filteredTriggers.map((trigger: TriggerSubscription) => (
                    <li key={trigger.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="p-1 rounded bg-foreground/8 text-foreground/60 shrink-0">
                        <GitBranch className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-xs font-mono text-foreground">{trigger.trigger_id}</code>
                          <Badge variant="secondary" className="text-xs font-normal h-4 px-1.5 shrink-0">
                            {trigger.provider_id}
                          </Badge>
                          <Link
                            href={`/dashboard/accounts/${trigger.user_id}`}
                            className="text-xs font-mono text-muted-foreground hover:text-foreground"
                            title={trigger.user_id}
                          >
                            {shortId(trigger.user_id)}
                          </Link>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{trigger.callback_url}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {trigger.created_at && (
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {new Date(trigger.created_at).toLocaleTimeString()}
                          </span>
                        )}
                        <Badge className={cn(
                          "text-xs font-normal border-0",
                          trigger.status === "active"
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-muted-foreground bg-muted"
                        )}>
                          {trigger.status}
                        </Badge>
                      </div>
                    </li>
                  ))}
                </ul>
              )
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
