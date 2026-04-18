import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Puzzle, Zap, GitBranch, ArrowRight, TrendingUp, Activity, CheckCircle2 } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Active Integrations", value: "12", delta: "+3 this week", icon: Puzzle, color: "text-primary" },
  { label: "Tools Configured", value: "47", delta: "+8 this week", icon: Zap, color: "text-emerald-400" },
  { label: "Triggers Fired", value: "1,284", delta: "Last 7 days", icon: Activity, color: "text-amber-400" },
  { label: "Success Rate", value: "99.2%", delta: "↑ 0.4%", icon: TrendingUp, color: "text-sky-400" },
]

const quickActions = [
  {
    title: "Connect an Integration",
    description: "Browse 200+ integrations and connect your apps",
    href: "/dashboard/integrations",
    icon: Puzzle,
  },
  {
    title: "Configure a Tool",
    description: "Set up actions your AI agents can take",
    href: "/dashboard/tools",
    icon: Zap,
  },
  {
    title: "Create a Trigger",
    description: "React to real-time events across your stack",
    href: "/dashboard/triggers",
    icon: GitBranch,
  },
]

const recentActivity = [
  { action: "GitHub integration connected", time: "2 min ago", status: "success" },
  { action: "Slack tool configured — send_message", time: "15 min ago", status: "success" },
  { action: "Webhook trigger fired — PR merged", time: "1 hr ago", status: "success" },
  { action: "Linear integration reconnected", time: "3 hr ago", status: "warning" },
  { action: "Notion tool executed — create_page", time: "5 hr ago", status: "success" },
]

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" description="Overview of your workspace" />
      <main className="flex-1 p-6 space-y-6 max-w-6xl w-full mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ label, value, delta, icon: Icon, color }) => (
            <Card key={label} className="bg-card border-border/50 hover:border-border transition-colors">
              <CardContent className="pt-5 pb-4 px-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
                    <p className="text-2xl font-semibold text-foreground">{value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{delta}</p>
                  </div>
                  <div className={`p-2 rounded-lg bg-muted/60 ${color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Quick actions */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Get started</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {quickActions.map(({ title, description, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <Card className="h-full bg-card border-border/50 hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer group">
                    <CardContent className="pt-5 pb-5 px-5 flex flex-col gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary w-fit">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{title}</p>
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-auto" />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-foreground">Recent activity</h2>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-7">
                View all
              </Button>
            </div>
            <Card className="bg-card border-border/50">
              <CardContent className="p-0">
                <ul className="divide-y divide-border/30">
                  {recentActivity.map(({ action, time, status }, i) => (
                    <li key={i} className="flex items-start gap-2.5 px-4 py-3">
                      <CheckCircle2
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          status === "success" ? "text-emerald-400" : "text-amber-400"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-foreground/90 leading-snug">{action}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  )
}
