"use client"

import { use } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft } from "lucide-react"
import { toolsService } from "@/modules/tools/services/tools-service"
import { toast } from "sonner"

export default function LogDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)

  const { data: log, isLoading } = useSWR(
    `/v1/tools/logs/${id}`,
    () => toolsService.getLogById(id),
    { onError: () => toast.error("Failed to load log") }
  )

  if (isLoading) {
    return (
      <>
        <TopBar title={<Skeleton className="h-4 w-24" />} />
        <main className="flex-1 p-6 max-w-3xl w-full mx-auto space-y-4">
          <Skeleton className="h-40 w-full" />
        </main>
      </>
    )
  }

  if (!log) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 gap-3 p-10">
        <p className="text-sm text-muted-foreground">Log not found</p>
        <Button variant="outline" size="sm" render={<Link href="/dashboard/logs" />} nativeButton={false}>
          Back to logs
        </Button>
      </div>
    )
  }

  return (
    <>
      <TopBar
        title={
          <span className="flex items-center gap-1.5">
            <Link href="/dashboard/logs" className="text-muted-foreground hover:text-foreground transition-colors">
              Logs
            </Link>
            <ChevronLeft className="w-3 h-3 text-muted-foreground rotate-180" />
            <span className="font-mono text-xs truncate max-w-[200px]">{log.tool_id}</span>
          </span>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-3xl w-full mx-auto">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="secondary" className="text-xs font-normal">
            {log.status}
          </Badge>
          {log.duration_ms !== null && (
            <span className="text-xs text-muted-foreground">{log.duration_ms}ms</span>
          )}
          {log.created_at && (
            <span className="text-xs text-muted-foreground">
              {new Date(log.created_at).toLocaleString()}
            </span>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          Account{" "}
          <Link href={`/dashboard/accounts/${log.user_id}`} className="text-foreground font-mono hover:underline">
            {log.user_id}
          </Link>
        </p>

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Request</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-muted/40 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {JSON.stringify(log.arguments, null, 2)}
            </pre>
          </CardContent>
        </Card>

        {log.error && (
          <Card className="border-destructive/30 bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-destructive">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-400/90 whitespace-pre-wrap">{log.error}</p>
            </CardContent>
          </Card>
        )}

        <Separator className="opacity-40" />

        <Card className="border-border/50 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Result</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-muted/40 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-all">
              {log.result === null || log.result === undefined
                ? "null"
                : JSON.stringify(log.result, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
