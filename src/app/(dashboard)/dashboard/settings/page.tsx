"use client"

import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" description="Workspace configuration" />
      <main className="flex-1 p-6 space-y-5 max-w-2xl w-full">
        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">General</CardTitle>
            <CardDescription className="text-xs">Basic workspace information</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Workspace name</Label>
              <Input defaultValue="My Workspace" className="h-8 text-sm bg-muted/40 border-border max-w-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">API base URL</Label>
              <Input defaultValue="https://api.example.com" className="h-8 text-sm bg-muted/40 border-border max-w-xs" />
            </div>
            <Button size="sm" className="h-8 text-xs">Save changes</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Appearance</CardTitle>
            <CardDescription className="text-xs">Choose your preferred color scheme</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Theme</p>
                <p className="text-xs text-muted-foreground mt-0.5">Light, dark, or follow your system</p>
              </div>
              <ThemeSwitcher />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">API Keys</CardTitle>
            <CardDescription className="text-xs">Manage authentication tokens</CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/40 rounded-md border border-border">
              <div>
                <p className="text-xs font-medium text-foreground">Production key</p>
                <code className="text-xs text-muted-foreground font-mono">tz_live_••••••••••••4f2a</code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs font-normal text-emerald-600 bg-emerald-50 border-0">
                  Active
                </Badge>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive">
                  Revoke
                </Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs border-border">
              Generate new key
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-destructive/40">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-destructive">Danger zone</CardTitle>
          </CardHeader>
          <Separator />
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Delete workspace</p>
                <p className="text-xs text-muted-foreground mt-0.5">Permanently remove this workspace and all data</p>
              </div>
              <Button variant="destructive" size="sm" className="h-8 text-xs">
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
