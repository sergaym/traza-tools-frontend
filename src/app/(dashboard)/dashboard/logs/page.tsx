"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, CheckCircle2, XCircle, Clock, Zap, GitBranch } from "lucide-react"
import { cn } from "@/lib/utils"

type LogType = "tool" | "trigger"
type LogStatus = "success" | "error" | "running"

interface LogEntry {
  id: string
  type: LogType
  name: string
  integration: string
  status: LogStatus
  duration_ms: number | null
  timestamp: string
  message?: string
}

const LOGS: LogEntry[] = [
  { id: "l1", type: "tool", name: "run_query", integration: "PostgreSQL", status: "success", duration_ms: 42, timestamp: "2 min ago" },
  { id: "l2", type: "trigger", name: "PR Merged", integration: "GitHub", status: "success", duration_ms: 11, timestamp: "5 min ago" },
  { id: "l3", type: "tool", name: "create_issue", integration: "Linear", status: "success", duration_ms: 310, timestamp: "12 min ago" },
  { id: "l4", type: "tool", name: "get_pull_request", integration: "GitHub", status: "error", duration_ms: 503, timestamp: "18 min ago", message: "Rate limit exceeded" },
  { id: "l5", type: "trigger", name: "Issue Created", integration: "Linear", status: "success", duration_ms: 8, timestamp: "34 min ago" },
  { id: "l6", type: "tool", name: "insert_row", integration: "PostgreSQL", status: "error", duration_ms: 90, timestamp: "1 hr ago", message: "Permission denied on relation users" },
  { id: "l7", type: "tool", name: "run_query", integration: "PostgreSQL", status: "success", duration_ms: 67, timestamp: "1 hr ago" },
  { id: "l8", type: "tool", name: "create_issue", integration: "GitHub", status: "success", duration_ms: 420, timestamp: "2 hr ago" },
  { id: "l9", type: "trigger", name: "PR Merged", integration: "GitHub", status: "success", duration_ms: 14, timestamp: "3 hr ago" },
  { id: "l10", type: "tool", name: "list_issues", integration: "Linear", status: "running", duration_ms: null, timestamp: "just now" },
]

const STATUS_CONFIG: Record<LogStatus, { icon: typeof CheckCircle2; className: string; label: string }> = {
  success: { icon: CheckCircle2, className: "text-emerald-500", label: "Success" },
  error: { icon: XCircle, className: "text-red-400", label: "Error" },
  running: { icon: Clock, className: "text-amber-400 animate-pulse", label: "Running" },
}

export default function LogsPage() {
  const [search, setSearch] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = LOGS.filter((entry) => {
    const matchesSearch =
      entry.name.toLowerCase().includes(search.toLowerCase()) ||
      entry.integration.toLowerCase().includes(search.toLowerCase())
    const matchesTab =
      tab === "all" || entry.type === tab || (tab === "errors" && entry.status === "error")
    return matchesSearch && matchesTab
  })

  const errorCount = LOGS.filter((l) => l.status === "error").length

  return (
    <>
      <TopBar
        title="Logs"
        badge={`${LOGS.length} entries`}
        description="Tool calls and trigger events"
      />
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
              <TabsTrigger value="tool" className="text-xs h-6">Tools</TabsTrigger>
              <TabsTrigger value="trigger" className="text-xs h-6">Triggers</TabsTrigger>
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
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <Search className="w-7 h-7 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No logs found</p>
              <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setTab("all") }}>
                Clear filters
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-border/30">
              {filtered.map((entry) => {
                const { icon: StatusIcon, className: statusClass } = STATUS_CONFIG[entry.status]
                return (
                  <li key={entry.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
                    <StatusIcon className={cn("w-3.5 h-3.5 shrink-0", statusClass)} />
                    <div className="p-1 rounded bg-muted/50 text-muted-foreground shrink-0">
                      {entry.type === "tool" ? (
                        <Zap className="w-3 h-3" />
                      ) : (
                        <GitBranch className="w-3 h-3" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-foreground">{entry.name}</code>
                        <Badge variant="secondary" className="text-xs font-normal h-4 px-1.5 shrink-0">
                          {entry.integration}
                        </Badge>
                      </div>
                      {entry.message && (
                        <p className="text-xs text-red-400/80 truncate mt-0.5">{entry.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {entry.duration_ms !== null && (
                        <span className="text-xs text-muted-foreground hidden sm:block">
                          {entry.duration_ms}ms
                        </span>
                      )}
                      <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
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
