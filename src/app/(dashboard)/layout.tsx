"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useAuth } from "@/lib/auth-context"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, needsWorkspace } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isLoading) return
    if (needsWorkspace) {
      router.replace("/auth/onboarding")
      return
    }
    if (!isAuthenticated) {
      router.replace("/auth/login")
    }
  }, [isAuthenticated, isLoading, needsWorkspace, router])

  if (isLoading || needsWorkspace || !isAuthenticated) return null

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col min-h-screen bg-background">
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
