"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Globe, ChevronRight } from "lucide-react"
import { providersService } from "@/modules/providers/services/providers-service"
import { connectionsService } from "@/modules/connections/services/connections-service"
import { connectLinksService } from "@/modules/connect-links/services/connect-links-service"
import { ProviderIcon } from "@/modules/providers/components/provider-icon"
import type { ProviderSummary } from "@/modules/providers/types"
import type { Connection } from "@/modules/connections/types"
import { toast } from "sonner"

const TRAZA_USER_ID = process.env.NEXT_PUBLIC_TRAZA_USER_ID ?? ""

export default function IntegrationsPage() {
  const [search, setSearch] = useState("")
  const [connecting, setConnecting] = useState<string | null>(null)

  const { data: providersPage, isLoading: loadingProviders } = useSWR(
    "/v1/providers",
    () => providersService.getAll({ limit: 100 }),
    { onError: () => toast.error("Failed to load providers") }
  )

  const { data: connections, isLoading: loadingConnections } = useSWR(
    TRAZA_USER_ID ? ["/v1/connections", TRAZA_USER_ID] : null,
    () => connectionsService.getAll(TRAZA_USER_ID),
    { onError: () => toast.error("Failed to load connections") }
  )

  const providers = providersPage?.data ?? []
  const connectedIds = new Set((connections ?? []).map((c: Connection) => c.provider_id))

  const filtered = providers.filter((p: ProviderSummary) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const connected = filtered.filter((p: ProviderSummary) => connectedIds.has(p.id))
  const available = filtered.filter((p: ProviderSummary) => !connectedIds.has(p.id))

  const isLoading = loadingProviders || loadingConnections

  async function handleConnect(provider: ProviderSummary) {
    if (!TRAZA_USER_ID) {
      toast.error("No user configured")
      return
    }
    setConnecting(provider.id)
    try {
      const link = await connectLinksService.create({
        user_id: TRAZA_USER_ID,
        provider_id: provider.id,
        connection_id: provider.id,
        redirect_url: window.location.href,
      })
      window.location.href = link.url
    } catch {
      toast.error(`Failed to connect ${provider.name}`)
      setConnecting(null)
    }
  }

  return (
    <>
      <TopBar
        title="Integrations"
        actions={
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Request integration
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-6xl w-full mx-auto">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            className="pl-9 h-8 text-sm bg-muted/40 border-border/50 focus:border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card border-border/50">
                <CardContent className="p-4 flex items-start gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-24" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-6 w-16 mt-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {connected.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Connected · {connected.length}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {connected.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      connected
                      connecting={false}
                      onConnect={() => handleConnect(provider)}
                    />
                  ))}
                </div>
              </section>
            )}

            {available.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Available · {available.length}
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {available.map((provider) => (
                    <ProviderCard
                      key={provider.id}
                      provider={provider}
                      connected={false}
                      connecting={connecting === provider.id}
                      onConnect={() => handleConnect(provider)}
                    />
                  ))}
                </div>
              </section>
            )}

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
                <Globe className="w-8 h-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No integrations found</p>
                <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  )
}

function ProviderCard({
  provider,
  connected,
  connecting,
  onConnect,
}: {
  provider: ProviderSummary
  connected: boolean
  connecting: boolean
  onConnect: () => void
}) {
  const cardContent = (
    <CardContent className="p-4 flex items-start gap-3">
      <ProviderIcon name={provider.name} iconUrl={provider.icon_url} className="w-9 h-9 rounded-lg text-xs" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{provider.name}</p>
        <div className="mt-3 flex items-center justify-between">
          {connected ? (
            <Badge variant="secondary" className="text-xs font-normal text-emerald-600 bg-emerald-50 border-0">
              Connected
            </Badge>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-6 text-xs px-2.5 border-border/60 hover:border-primary/60 hover:text-primary gap-1"
              onClick={(e) => { e.preventDefault(); onConnect() }}
              disabled={connecting}
            >
              <Plus className="w-3 h-3" />
              {connecting ? "Connecting…" : "Connect"}
            </Button>
          )}
          {connected && (
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
          )}
        </div>
      </div>
    </CardContent>
  )

  if (connected) {
    return (
      <Link href={`/dashboard/integrations/${provider.id}`}>
        <Card className="bg-card border-border hover:border-primary/30 transition-all group cursor-pointer">
          {cardContent}
        </Card>
      </Link>
    )
  }

  return (
    <Card className="bg-card border-border hover:border-border/80 transition-all group">
      {cardContent}
    </Card>
  )
}
