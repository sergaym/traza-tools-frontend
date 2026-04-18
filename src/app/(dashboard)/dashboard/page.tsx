import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Puzzle, Zap, GitBranch, ArrowRight, Activity, CheckCircle2, Circle } from "lucide-react"
import Link from "next/link"

const stats = [
  { label: "Active integrations", value: "12", delta: "+3 this week" },
  { label: "Tools configured", value: "47", delta: "+8 this week" },
  { label: "Triggers fired", value: "1,284", delta: "Last 7 days" },
  { label: "Success rate", value: "99.2%", delta: "↑ 0.4%" },
]

const quickActions = [
  {
    title: "Integrations",
    description: "Connect your apps and services",
    href: "/dashboard/integrations",
    icon: Puzzle,
  },
  {
    title: "Tools",
    description: "Actions available to your agents",
    href: "/dashboard/tools",
    icon: Zap,
  },
  {
    title: "Triggers",
    description: "React to real-time events",
    href: "/dashboard/triggers",
    icon: GitBranch,
  },
]

const recentActivity = [
  { action: "GitHub integration connected", time: "2 min ago", ok: true },
  { action: "Slack tool configured — send_message", time: "15 min ago", ok: true },
  { action: "Webhook trigger fired — PR merged", time: "1 hr ago", ok: true },
  { action: "Linear integration reconnected", time: "3 hr ago", ok: false },
  { action: "Notion tool executed — create_page", time: "5 hr ago", ok: true },
]

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" />
      <main className="flex-1 p-6 space-y-6 max-w-5xl w-full">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map(({ label, value, delta }) => (
            <div key={label} className="px-4 py-3.5 rounded-lg border border-border bg-card">
              <p className="text-xs text-muted-foreground mb-1">{label}</p>
              <p className="text-xl font-semibold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{delta}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          {/* Quick access */}
          <div className="lg:col-span-2 space-y-2.5">
            <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Quick access</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {quickActions.map(({ title, description, href, icon: Icon }) => (
                <Link key={href} href={href}>
                  <div className="group h-full p-4 rounded-lg border border-border bg-card hover:border-primary/40 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-1.5 rounded-md bg-muted">
                        <Icon className="w-3.5 h-3.5 text-foreground/70" />
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent activity */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Recent activity</h2>
              <Button variant="ghost" size="sm" className="text-xs text-muted-foreground h-6 px-2">
                View all
              </Button>
            </div>
            <div className="rounded-lg border border-border bg-card overflow-hidden">
              <ul className="divide-y divide-border">
                {recentActivity.map(({ action, time, ok }, i) => (
                  <li key={i} className="flex items-start gap-2.5 px-4 py-2.5">
                    {ok ? (
                      <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0 text-emerald-500" />
                    ) : (
                      <Circle className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-500" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-foreground/90 leading-snug">{action}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
