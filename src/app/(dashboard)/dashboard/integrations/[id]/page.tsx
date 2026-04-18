"use client"

import { use } from "react"
import Link from "next/link"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft, Zap, GitBranch, Plus, CheckCircle2, Activity } from "lucide-react"

// ─── Mock data ────────────────────────────────────────────────────────────────

type IntegrationMeta = {
  name: string
  description: string
  logo: string
  logoColor: string
  connected: boolean
}

type Tool = {
  id: string
  name: string
  description: string
  category: string
  enabled: boolean
  calls: number
}

type Trigger = {
  id: string
  name: string
  event: string
  active: boolean
  lastFired: string
  totalFired: number
}

const INTEGRATIONS: Record<string, IntegrationMeta> = {
  github: { name: "GitHub", description: "Code hosting & version control", logo: "GH", logoColor: "bg-zinc-700 text-zinc-100", connected: true },
  linear: { name: "Linear", description: "Issue tracking for software teams", logo: "LN", logoColor: "bg-violet-600 text-white", connected: true },
  postgres: { name: "PostgreSQL", description: "Relational database queries", logo: "PG", logoColor: "bg-sky-600 text-white", connected: true },
}

const TOOLS: Record<string, Tool[]> = {
  github: [
    { id: "gh-create-issue", name: "create_issue", description: "Create a new issue in a GitHub repository", category: "write", enabled: true, calls: 84 },
    { id: "gh-get-pr", name: "get_pull_request", description: "Retrieve pull request details by number", category: "read", enabled: true, calls: 210 },
    { id: "gh-merge-pr", name: "merge_pull_request", description: "Merge a pull request into its base branch", category: "write", enabled: false, calls: 12 },
  ],
  linear: [
    { id: "ln-create-issue", name: "create_issue", description: "Create a new issue in a Linear project", category: "write", enabled: true, calls: 57 },
    { id: "ln-list-issues", name: "list_issues", description: "List all issues matching a filter", category: "read", enabled: true, calls: 338 },
  ],
  postgres: [
    { id: "pg-query", name: "run_query", description: "Execute a read-only SQL query against the database", category: "read", enabled: true, calls: 509 },
    { id: "pg-insert", name: "insert_row", description: "Insert a new row into a specified table", category: "write", enabled: false, calls: 0 },
  ],
}

const TRIGGERS: Record<string, Trigger[]> = {
  github: [
    { id: "t1", name: "PR Merged", event: "pull_request.merged", active: true, lastFired: "1 hr ago", totalFired: 42 },
    { id: "t2", name: "Issue Opened", event: "issues.opened", active: false, lastFired: "Never", totalFired: 0 },
  ],
  linear: [
    { id: "t3", name: "Issue Created", event: "issue.created", active: true, lastFired: "3 hr ago", totalFired: 97 },
  ],
  postgres: [],
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function IntegrationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const integration = INTEGRATIONS[id]

  if (!integration) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 text-center p-10">
        <p className="text-sm text-muted-foreground">Integration not found</p>
        <Link href="/dashboard/integrations">
          <Button variant="outline" size="sm">Back to integrations</Button>
        </Link>
      </div>
    )
  }

  const tools = TOOLS[id] ?? []
  const triggers = TRIGGERS[id] ?? []

  return (
    <>
      <TopBar
        title={
          <span className="flex items-center gap-1.5">
            <Link href="/dashboard/integrations" className="text-muted-foreground hover:text-foreground transition-colors">
              Integrations
            </Link>
            <ChevronLeft className="w-3 h-3 text-muted-foreground rotate-180" />
            <span>{integration.name}</span>
          </span>
        }
        badge={integration.connected ? "Connected" : "Disconnected"}
      />
      <main className="flex-1 p-6 space-y-5 max-w-4xl w-full mx-auto">
        {/* Integration header */}
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center text-sm font-bold ${integration.logoColor}`}>
            {integration.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-foreground">{integration.name}</h2>
              {integration.connected && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
            </div>
            <p className="text-xs text-muted-foreground">{integration.description}</p>
          </div>
          <Button variant="outline" size="sm" className="h-7 text-xs border-border/60 text-destructive hover:text-destructive hover:border-destructive/40">
            Disconnect
          </Button>
        </div>

        <Separator className="opacity-40" />

        {/* Tabs */}
        <Tabs defaultValue="tools">
          <div className="flex items-center justify-between">
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
            <Button size="sm" className="h-7 text-xs gap-1.5">
              <Plus className="w-3 h-3" />
              Add
            </Button>
          </div>

          <TabsContent value="tools" className="mt-4">
            <ToolsPanel tools={tools} />
          </TabsContent>
          <TabsContent value="triggers" className="mt-4">
            <TriggersPanel triggers={triggers} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

// ─── Tools panel ──────────────────────────────────────────────────────────────

function ToolsPanel({ tools }: { tools: Tool[] }) {
  if (tools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Zap className="w-7 h-7 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No tools configured</p>
      </div>
    )
  }

  return (
    <Card className="bg-card border-border/50">
      <CardContent className="p-0">
        <ul className="divide-y divide-border/30">
          {tools.map((tool) => (
            <li key={tool.id} className="flex items-center gap-3 px-4 py-3 hover:bg-muted/20 transition-colors">
              <div className="p-1.5 rounded bg-muted/60 text-muted-foreground shrink-0">
                <Zap className="w-3 h-3" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono text-foreground">{tool.name}</code>
                  <Badge
                    variant="outline"
                    className={`text-xs font-normal border-0 px-1.5 ${
                      tool.category === "write" ? "bg-amber-400/10 text-amber-500" : "bg-sky-400/10 text-sky-500"
                    }`}
                  >
                    {tool.category}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">{tool.calls.toLocaleString()} calls</span>
                <Badge
                  variant="secondary"
                  className={`text-xs font-normal ${
                    tool.enabled ? "text-emerald-500 bg-emerald-400/10" : "text-muted-foreground bg-muted/60"
                  }`}
                >
                  {tool.enabled ? "Enabled" : "Disabled"}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

// ─── Triggers panel ───────────────────────────────────────────────────────────

function TriggersPanel({ triggers }: { triggers: Trigger[] }) {
  if (triggers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
        <Activity className="w-7 h-7 text-muted-foreground/30" />
        <p className="text-sm text-muted-foreground">No triggers configured</p>
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
              <p className="text-sm font-medium text-foreground">{trigger.name}</p>
              <code className="text-xs font-mono text-muted-foreground">{trigger.event}</code>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Last fired</p>
                <p className="text-xs font-medium text-foreground">{trigger.lastFired}</p>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-xs font-medium text-foreground">{trigger.totalFired}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${trigger.active ? "bg-emerald-400" : "bg-muted-foreground/40"}`} />
                <span className="text-xs text-muted-foreground">{trigger.active ? "Active" : "Paused"}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
