"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Search, Plus, Zap, ChevronRight, Code2 } from "lucide-react"

interface Tool {
  id: string
  name: string
  description: string
  integration: string
  category: string
  enabled: boolean
  calls: number
}

const TOOLS: Tool[] = [
  { id: "gh-create-issue", name: "create_issue", description: "Create a new issue in a GitHub repository", integration: "GitHub", category: "write", enabled: true, calls: 84 },
  { id: "gh-get-pr", name: "get_pull_request", description: "Retrieve pull request details by number", integration: "GitHub", category: "read", enabled: true, calls: 210 },
  { id: "gh-merge-pr", name: "merge_pull_request", description: "Merge a pull request into its base branch", integration: "GitHub", category: "write", enabled: false, calls: 12 },
  { id: "ln-create-issue", name: "create_issue", description: "Create a new issue in a Linear project", integration: "Linear", category: "write", enabled: true, calls: 57 },
  { id: "ln-list-issues", name: "list_issues", description: "List all issues matching a filter", integration: "Linear", category: "read", enabled: true, calls: 338 },
  { id: "pg-query", name: "run_query", description: "Execute a read-only SQL query against the database", integration: "PostgreSQL", category: "read", enabled: true, calls: 509 },
  { id: "pg-insert", name: "insert_row", description: "Insert a new row into a specified table", integration: "PostgreSQL", category: "write", enabled: false, calls: 0 },
]

export default function ToolsPage() {
  const [search, setSearch] = useState("")

  const filtered = TOOLS.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.integration.toLowerCase().includes(search.toLowerCase())
  )

  const grouped = filtered.reduce<Record<string, Tool[]>>((acc, tool) => {
    if (!acc[tool.integration]) acc[tool.integration] = []
    acc[tool.integration].push(tool)
    return acc
  }, {})

  return (
    <>
      <TopBar
        title="Tools"
        badge={`${TOOLS.filter((t) => t.enabled).length} enabled`}
        description="Actions available to your agents"
        actions={
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Add tool
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-6xl w-full mx-auto">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search tools..."
            className="pl-9 h-8 text-sm bg-muted/40 border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {Object.entries(grouped).map(([integration, tools]) => (
          <Card key={integration} className="bg-card border-border/50">
            <CardHeader className="pb-0 pt-4 px-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                    <Code2 className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-sm">{integration}</CardTitle>
                  <Badge variant="secondary" className="text-xs font-normal">
                    {tools.length} tools
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7 gap-1">
                  Configure
                  <ChevronRight className="w-3 h-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 mt-3">
              <Separator className="opacity-40" />
              <ul className="divide-y divide-border/30">
                {tools.map((tool) => (
                  <li key={tool.id} className="flex items-center gap-3 px-4 py-3 group hover:bg-muted/20 transition-colors">
                    <div className="p-1.5 rounded bg-muted/60 text-muted-foreground">
                      <Zap className="w-3 h-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-foreground">{tool.name}</code>
                        <Badge
                          variant="outline"
                          className={`text-xs font-normal border-0 px-1.5 ${
                            tool.category === "write"
                              ? "bg-amber-400/10 text-amber-400"
                              : "bg-sky-400/10 text-sky-400"
                          }`}
                        >
                          {tool.category}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-muted-foreground hidden sm:block">
                        {tool.calls.toLocaleString()} calls
                      </span>
                      <Badge
                        variant="secondary"
                        className={`text-xs font-normal ${
                          tool.enabled
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-muted-foreground bg-muted/60"
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
        ))}

        {Object.keys(grouped).length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Zap className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No tools found</p>
          </div>
        )}
      </main>
    </>
  )
}
