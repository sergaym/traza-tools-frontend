"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Puzzle,
  ScrollText,
  Settings,
  HelpCircle,
  ChevronDown,
  Zap,
  GitBranch,
  Users,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"

const mainNav = [
  { label: "Toolkits", href: "/dashboard/toolkits", icon: Puzzle },
  { label: "Accounts", href: "/dashboard/accounts", icon: Users },
  { label: "Logs", href: "/dashboard/logs", icon: ScrollText },
  { label: "Triggers", href: "/dashboard/triggers", icon: GitBranch },
]

const secondaryNav = [
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/dashboard/help", icon: HelpCircle },
]

export function AppSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  const title = user?.organization.name ?? "Workspace"
  const subtitle = user?.name || user?.email || "Member"
  const initials = (user?.organization.name ?? title).slice(0, 2).toUpperCase()

  return (
    <Sidebar className="border-r border-border/50">
      <SidebarHeader className="px-4 py-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Traza Tools
          </span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="opacity-40" />

      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map(({ label, href, icon: Icon }) => {
                const active = pathname.startsWith(href)
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center gap-2.5 text-sm font-medium rounded-md px-2.5 py-2 transition-colors w-full",
                            active
                              ? "text-foreground bg-sidebar-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="my-2 opacity-40" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-muted-foreground/60 uppercase tracking-widest px-2.5 mb-1">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryNav.map(({ label, href, icon: Icon }) => {
                const active = pathname === href
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      isActive={active}
                      render={
                        <Link
                          href={href}
                          className={cn(
                            "flex items-center gap-2.5 text-sm font-medium rounded-md px-2.5 py-2 transition-colors w-full",
                            active
                              ? "text-foreground bg-sidebar-accent"
                              : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                          )}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          {label}
                        </Link>
                      }
                    />
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-3 py-3 border-t border-border/40">
        <DropdownMenu>
          <DropdownMenuTrigger
            nativeButton={false}
            render={
              <div className="flex items-center gap-2.5 w-full px-2 py-2 rounded-md hover:bg-sidebar-accent/50 transition-colors cursor-pointer group">
                <Avatar className="w-7 h-7 shrink-0">
                  <AvatarFallback className="text-xs bg-primary/20 text-primary font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-medium text-foreground truncate">{title}</p>
                  <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              </div>
            }
          />
          <DropdownMenuContent align="end" side="top" className="w-48">
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={handleLogout}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
