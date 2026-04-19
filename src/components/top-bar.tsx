"use client"

import type React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"

interface TopBarProps {
  title: React.ReactNode
  actions?: React.ReactNode
}

export function TopBar({ title, actions }: TopBarProps) {
  return (
    <header className="flex items-center gap-3 px-5 h-12 border-b border-border shrink-0 bg-background sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <div className="flex-1 min-w-0 flex items-center">
        <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}
