"use client"

import { useState } from "react"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle2, XCircle, Clock, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { toolsService } from "@/modules/tools/services/tools-service"
import type { ExecutionLog } from "@/modules/tools/types"
import { toast } from "sonner"

const TRAZA_USER_ID = process.env.NEXT_PUBLIC_TRAZA_USER_ID ?? ""

type LogStatus = "success" | "error" | "running"

const STATUS_CONFIG: Record<string, { icon: typeof CheckCircle2; className: string }> = {
  success: { icon: CheckCircle2, className: "text-emerald-500" },
  error: { icon: XCircle, className: "text-red-400" },
  running: { icon: Clock, className: "text-amber-400 animate-pulse" },
}

export default function LogsPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const { data: logs, isLoading } = useSWR(
    TRAZA_USER_ID ? ["/v1/tools/logs", TRAZA_USER_ID] : null,
    () => toolsService.getLogs(TRAZA_USER_ID),
    { onError: () => toast.error("Failed to load logs") }
  )

  const filtered = (logs ?? []).filter((entry: ExecutionLog) => {
    const matchesSearch =
      entry.tool_id.toLowerCase().includes(search.toLowerCase()) ||
      entry.provider_id.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      tab === "all" || (tab === "errors" && entry.status === "error")
    return matchesSearch && matchesTab
  })

  const errorCount = (logs ?? []).filter((l: ExecutionLog) => l.status === "error").length

  return (
    <>
      <TopBar title="Logs" />
      <main className="flex-1 p-6 space-y-4 max-w-5xl w-full mx-auto">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search logs..."
              className="pl-9 h-8 text-sm bg-muted/40 border-border/50 focus:border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="h-8 bg-muted/40 border border-border/40">
              <TabsTrigger value="all" className="text-xs h-6">All</TabsTrigger>
              <TabsTrigger value="errors" className="text-xs h-6 gap-1">
                Errors
                {errorCount > 0 && (
                  <Badge className="text-xs font-normal h-4 px-1 bg-red-400/15 text-red-400 border-0">{errorCount}</Badge>
                )}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
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
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Search className="w-7 h-7 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No logs found</p>
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTab("all") }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border/30">
              {filtered.map((entry: ExecutionLog) => {
                const config = STATUS_CONFIG[entry.status as LogStatus] ?? STATUS_CONFIG.running
                const { icon: StatusIcon, className: statusClass } = config
                return (
                  <li key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                    <StatusIcon className={cn("w-3.5 h-3.5 shrink-0", statusClass)} />
                    <div className="p-1 rounded bg-muted/50 text-muted-foreground shrink-0">
                      <Zap className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-foreground">{entry.tool_id}</code>
                        <Badge variant="secondary" className="text-xs font-normal h-4 px-1.5 shrink-0">
                          {entry.provider_id}
                        </Badge>
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
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </main>
    </>
  )
}
