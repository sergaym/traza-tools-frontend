"use client"

import { useState } from "react"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, CheckCircle2, Globe, Loader2 } from "lucide-react"

interface Integration {
  id: string
  name: string
  description: string
  category: string
  connected: boolean
  logo: string
}

const INTEGRATIONS: Integration[] = [
  { id: "github", name: "GitHub", description: "Code hosting & version control", category: "dev", connected: true, logo: "GH" },
  { id: "linear", name: "Linear", description: "Issue tracking for software teams", category: "productivity", connected: true, logo: "LN" },
  { id: "slack", name: "Slack", description: "Team communication & messaging", category: "communication", connected: false, logo: "SL" },
  { id: "notion", name: "Notion", description: "Docs, wikis and project management", category: "productivity", connected: false, logo: "NT" },
  { id: "jira", name: "Jira", description: "Project & issue tracking at scale", category: "productivity", connected: false, logo: "JR" },
  { id: "figma", name: "Figma", description: "Collaborative design & prototyping", category: "design", connected: false, logo: "FG" },
  { id: "postgres", name: "PostgreSQL", description: "Relational database queries", category: "database", connected: true, logo: "PG" },
  { id: "stripe", name: "Stripe", description: "Payments and billing infrastructure", category: "finance", connected: false, logo: "ST" },
  { id: "gmail", name: "Gmail", description: "Email via Google Workspace", category: "communication", connected: false, logo: "GM" },
  { id: "discord", name: "Discord", description: "Voice, video and text communication", category: "communication", connected: false, logo: "DC" },
  { id: "airtable", name: "Airtable", description: "Database meets spreadsheet", category: "productivity", connected: false, logo: "AT" },
  { id: "hubspot", name: "HubSpot", description: "CRM and marketing automation", category: "crm", connected: false, logo: "HS" },
]

const CATEGORIES = ["all", "dev", "productivity", "communication", "database", "design", "finance", "crm"]

const LOGO_COLORS: Record<string, string> = {
  GH: "bg-zinc-700 text-zinc-100",
  LN: "bg-violet-600 text-white",
  SL: "bg-fuchsia-600 text-white",
  NT: "bg-zinc-100 text-zinc-900",
  JR: "bg-blue-600 text-white",
  FG: "bg-rose-500 text-white",
  PG: "bg-sky-600 text-white",
  ST: "bg-indigo-500 text-white",
  GM: "bg-red-500 text-white",
  DC: "bg-indigo-600 text-white",
  AT: "bg-yellow-400 text-zinc-900",
  HS: "bg-orange-500 text-white",
}

export default function IntegrationsPage() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [connecting, setConnecting] = useState<string | null>(null)

  const filtered = INTEGRATIONS.filter((i) => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === "all" || i.category === category
    return matchesSearch && matchesCategory
  })

  const connected = filtered.filter((i) => i.connected)
  const available = filtered.filter((i) => !i.connected)

  async function handleConnect(id: string) {
    setConnecting(id)
    await new Promise((r) => setTimeout(r, 1200))
    setConnecting(null)
  }

  return (
    <>
      <TopBar
        title="Integrations"
        badge={`${INTEGRATIONS.filter((i) => i.connected).length} connected`}
        description="Connect your tools and services"
        actions={
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Request integration
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-6xl w-full mx-auto">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              placeholder="Search integrations..."
              className="pl-9 h-8 text-sm bg-muted/40 border-border/50 focus:border-border"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Tabs value={category} onValueChange={setCategory}>
            <TabsList className="h-8 bg-muted/40 border border-border/40">
              {CATEGORIES.map((c) => (
                <TabsTrigger key={c} value={c} className="text-xs capitalize h-6">
                  {c}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Connected */}
        {connected.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Connected · {connected.length}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {connected.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  connecting={connecting === integration.id}
                  onConnect={() => handleConnect(integration.id)}
                />
              ))}
            </div>
          </section>
        )}

        {/* Available */}
        {available.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Available · {available.length}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {available.map((integration) => (
                <IntegrationCard
                  key={integration.id}
                  integration={integration}
                  connecting={connecting === integration.id}
                  onConnect={() => handleConnect(integration.id)}
                />
              ))}
            </div>
          </section>
        )}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Globe className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No integrations found</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearch(""); setCategory("all") }}>
              Clear filters
            </Button>
          </div>
        )}
      </main>
    </>
  )
}

function IntegrationCard({
  integration,
  connecting,
  onConnect,
}: {
  integration: Integration
  connecting: boolean
  onConnect: () => void
}) {
  return (
    <Card className="bg-card border-border hover:border-primary/30 transition-all group">
      <CardContent className="p-4 flex items-start gap-3">
        <div
          className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold ${
            LOGO_COLORS[integration.logo] ?? "bg-muted text-foreground"
          }`}
        >
          {integration.logo}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <p className="text-sm font-medium text-foreground truncate">{integration.name}</p>
            {integration.connected && (
              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {integration.description}
          </p>
          <div className="mt-3">
            {integration.connected ? (
              <Badge
                variant="secondary"
                className="text-xs font-normal text-emerald-400 bg-emerald-400/10 border-0"
              >
                Connected
              </Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-6 text-xs px-2.5 border-border/60 hover:border-primary/60 hover:text-primary gap-1"
                onClick={onConnect}
                disabled={connecting}
              >
                {connecting ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Plus className="w-3 h-3" />
                )}
                Connect
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
