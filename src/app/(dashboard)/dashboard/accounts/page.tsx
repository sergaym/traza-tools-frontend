"use client"

import { useState } from "react"
import Link from "next/link"
import useSWR from "swr"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
      <main className="flex-1 p-6 space-y-4 max-w-4xl w-full mx-auto">
        <p className="text-xs text-muted-foreground">
          Accounts represent your end-users or tenants (e.g. a client workspace). Connections and triggers are scoped per account.
        </p>

        <Card className="border-border/50 overflow-hidden">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="divide-y divide-border/30">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <Skeleton className="h-3 w-40" />
                    <Skeleton className="h-3 w-16 ml-auto" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                ))}
              </div>
            ) : accounts.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                No accounts yet. Create one to connect toolkits.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableHead className="text-xs text-muted-foreground px-4 w-full">External ID</TableHead>
                    <TableHead className="text-xs text-muted-foreground px-4">Connections</TableHead>
                    <TableHead className="text-xs text-muted-foreground px-4">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {accounts.map((a: Account) => (
                    <TableRow key={a.id} className="border-border/30 cursor-pointer">
                      <TableCell className="px-4 py-3">
                        <Link
                          href={`/dashboard/accounts/${a.id}`}
                          className="text-sm font-medium text-foreground hover:underline"
                        >
                          {a.external_id}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                        {a.connection_count ?? 0}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-xs text-muted-foreground">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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
