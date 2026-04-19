"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { accountsService } from "@/modules/accounts/services/accounts-service"
import type { Account } from "@/modules/accounts/types"
import { toast } from "sonner"
import { Plus } from "lucide-react"

export default function AccountsPage() {
  const [createOpen, setCreateOpen] = useState(false)
  const [externalId, setExternalId] = useState("")

  const { data: page, isLoading, mutate } = useSWR(
    "/v1/users",
    () => accountsService.getAll({ limit: 100 }),
    { onError: () => toast.error("Failed to load accounts") }
  )

  const accounts = page?.data ?? []

  async function handleCreate() {
    const id = externalId.trim()
    if (!id) {
      toast.error("External ID is required")
      return
    }
    try {
      await accountsService.create({ external_id: id, metadata: {} })
      setCreateOpen(false)
      setExternalId("")
      await mutate()
      toast.success("Account created")
    } catch {
      toast.error("Could not create account")
    }
  }

  return (
    <>
      <TopBar
        title="Accounts"
        actions={
          <Button size="sm" className="h-8 text-xs gap-1.5" onClick={() => setCreateOpen(true)}>
            <Plus className="w-3.5 h-3.5" />
            New account
          </Button>
        }
      />
      <main className="flex-1 p-6 space-y-5 max-w-3xl w-full mx-auto">
        <p className="text-xs text-muted-foreground">
          Accounts represent your end-users or tenants (e.g. a client workspace). Connections and triggers are scoped per account.
        </p>

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : accounts.length === 0 ? (
          <Card className="bg-card border-border/50">
            <CardContent className="py-12 text-center text-sm text-muted-foreground">
              No accounts yet. Create one to connect toolkits.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {accounts.map((a: Account) => (
              <Link key={a.id} href={`/dashboard/accounts/${a.id}`}>
                <Card className="bg-card border-border/50 hover:border-border transition-colors cursor-pointer">
                  <CardHeader className="py-3 px-4 flex-row items-center justify-between gap-4">
                    <div className="min-w-0">
                      <CardTitle className="text-sm font-medium truncate">{a.external_id}</CardTitle>
                      <CardDescription className="text-xs">
                        {a.connection_count ?? 0} connection{(a.connection_count ?? 0) !== 1 ? "s" : ""}
                        {a.created_at && (
                          <span className="text-muted-foreground/80">
                            {" · "}
                            {new Date(a.created_at).toLocaleDateString()}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm">New account</DialogTitle>
            <DialogDescription className="text-xs">
              A stable identifier from your product (e.g. tenant or user id).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-1.5">
            <Label className="text-xs">External ID</Label>
            <Input
              className="h-8 text-sm"
              placeholder="e.g. finsa_prod"
              value={externalId}
              onChange={(e) => setExternalId(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button size="sm" className="h-8 text-xs" type="button" onClick={() => void handleCreate()}>
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
