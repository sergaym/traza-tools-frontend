"use client"

import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { GitBranch, Activity } from "lucide-react"
import { triggersService } from "@/modules/triggers/services/triggers-service"
import type { TriggerSubscription } from "@/modules/triggers/types"
import { toast } from "sonner"

const TRAZA_USER_ID = process.env.NEXT_PUBLIC_TRAZA_USER_ID ?? ""

export default function TriggersPage() {
  const { data: triggers, isLoading } = useSWR(
    TRAZA_USER_ID ? ["/v1/triggers", TRAZA_USER_ID] : null,
    () => triggersService.getAll(TRAZA_USER_ID),
    { onError: () => toast.error("Failed to load triggers") }
  )

  return (
    <>
      <TopBar title="Triggers" />
      <main className="flex-1 p-6 space-y-4 max-w-4xl w-full mx-auto">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="flex items-center gap-4 px-4 py-3">
                  <Skeleton className="w-6 h-6 rounded" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-28" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : triggers?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Activity className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No trigger subscriptions yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {triggers?.map((trigger: TriggerSubscription) => (
              <Card key={trigger.id} className="bg-card border-border/50 hover:border-border transition-colors">
                <CardContent className="flex items-center gap-4 px-4 py-3">
                  <div className="p-1.5 rounded bg-primary/10 text-primary shrink-0">
                    <GitBranch className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{trigger.trigger_id}</p>
                    <p className="text-xs text-muted-foreground">{trigger.provider_id}</p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground">Callback</p>
                      <code className="text-xs font-mono text-foreground truncate max-w-[200px] block">{trigger.callback_url}</code>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge className={`text-xs font-normal border-0 ${trigger.status === "active" ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground bg-muted"}`}>
                        {trigger.status}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
