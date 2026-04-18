import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitBranch, Plus, Zap, Activity } from "lucide-react"

const TRIGGERS = [
  {
    id: "t1",
    name: "PR Merged",
    integration: "GitHub",
    event: "pull_request.merged",
    active: true,
    lastFired: "1 hr ago",
    totalFired: 42,
  },
  {
    id: "t2",
    name: "Issue Created",
    integration: "Linear",
    event: "issue.created",
    active: true,
    lastFired: "3 hr ago",
    totalFired: 97,
  },
  {
    id: "t3",
    name: "Payment Failed",
    integration: "Stripe",
    event: "charge.failed",
    active: false,
    lastFired: "Never",
    totalFired: 0,
  },
]

export default function TriggersPage() {
  return (
    <>
      <TopBar
        title="Triggers"
        badge={`${TRIGGERS.filter((t) => t.active).length} active`}
        description="React to real-time events"
        actions={
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            New trigger
          </Button>
        }
      />
      <main className="flex-1 p-6 max-w-6xl w-full mx-auto">
        <div className="space-y-3">
          {TRIGGERS.map((trigger) => (
            <Card key={trigger.id} className="bg-card border-border/50 hover:border-border transition-colors">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
                  <GitBranch className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-foreground">{trigger.name}</p>
                    <Badge variant="secondary" className="text-xs font-normal">
                      {trigger.integration}
                    </Badge>
                  </div>
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

          {TRIGGERS.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <Activity className="w-8 h-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No triggers configured yet</p>
              <Button size="sm">
                <Plus className="w-3.5 h-3.5 mr-1.5" />
                Create your first trigger
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
