"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, Plus, Globe, ChevronRight } from "lucide-react"
import { providersService } from "@/modules/providers/services/providers-service"
import { ProviderIcon } from "@/modules/providers/components/provider-icon"
import type { ProviderSummary } from "@/modules/providers/types"
import { toast } from "sonner"

export default function ToolkitsPage() {
  const [search, setSearch] = useState("")

  const { data: providersPage, isLoading } = useSWR(
    "/v1/providers",
    () => providersService.getAll({ limit: 100 }),
    { onError: () => toast.error("Failed to load toolkits") }
  )

  const providers = providersPage?.data ?? []
  const filtered = providers.filter((p: ProviderSummary) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <TopBar
        title="Toolkits"
        actions={
          <Button size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="w-3.5 h-3.5" />
            Request toolkit
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-6xl w-full mx-auto">
        <p className="text-xs text-muted-foreground max-w-lg">
          Browse available toolkits. Connect accounts to providers under{" "}
          <Link href="/dashboard/accounts" className="text-foreground font-medium hover:underline">
            Accounts
          </Link>
          .
        </p>
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search toolkits..."
            className="pl-9 h-8 text-sm bg-muted/40 border-border/50 focus:border-border"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-card border-border/50">
                <CardHeader className="flex-row items-center gap-3">
                  <Skeleton className="w-9 h-9 rounded-lg shrink-0" />
                  <Skeleton className="h-3.5 w-24" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-6 w-16 ml-auto" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <Globe className="w-8 h-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No toolkits found</p>
            <Button variant="ghost" size="sm" onClick={() => setSearch("")}>
              Clear search
            </Button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 [&>a]:flex">
            {filtered.map((provider: ProviderSummary) => (
              <Link key={provider.id} href={`/dashboard/toolkits/${provider.id}`} className="flex">
                <Card className="bg-card border-border hover:border-primary/30 transition-all group cursor-pointer flex-1">
                  <CardHeader className="flex-row items-center gap-3">
                    <ProviderIcon
                      name={provider.name}
                      iconUrl={provider.icon_url}
                      className="w-9 h-9 rounded-lg text-xs shrink-0"
                    />
                    <CardTitle className="text-sm truncate">{provider.name}</CardTitle>
                  </CardHeader>
                  <CardFooter className="justify-end">
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground transition-colors" />
                  </CardFooter>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
