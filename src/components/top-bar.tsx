"use client"

import type React from "react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

interface TopBarProps {
  title: React.ReactNode
  description?: string
  badge?: string
  actions?: React.ReactNode
}

export function TopBar({ title, description, badge, actions }: TopBarProps) {
  return (
    <header className="flex items-center gap-3 px-5 h-12 border-b border-border shrink-0 bg-background sticky top-0 z-10">
      <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-4" />
      <div className="flex-1 min-w-0 flex items-center gap-2">
        <h1 className="text-sm font-medium text-foreground truncate">{title}</h1>
        {badge && (
          <Badge variant="secondary" className="text-xs font-normal h-5 px-1.5 shrink-0">
            {badge}
          </Badge>
        )}
        {description && (
          <span className="text-xs text-muted-foreground truncate hidden sm:block">
            {description}
          </span>
        )}
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  )
}
