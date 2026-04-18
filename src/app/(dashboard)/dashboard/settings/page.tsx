import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" description="Workspace configuration" />
      <main className="flex-1 p-6 space-y-6 max-w-2xl w-full mx-auto">
        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">General</CardTitle>
            <CardDescription className="text-xs">Basic workspace information</CardDescription>
          </CardHeader>
          <Separator className="opacity-40" />
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Workspace name</Label>
              <Input defaultValue="My Workspace" className="h-8 text-sm bg-muted/40 border-border/50 max-w-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">API base URL</Label>
              <Input defaultValue="https://api.example.com" className="h-8 text-sm bg-muted/40 border-border/50 max-w-xs" />
            </div>
            <Button size="sm" className="h-8 text-xs mt-2">Save changes</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">API Keys</CardTitle>
            <CardDescription className="text-xs">Manage authentication tokens</CardDescription>
          </CardHeader>
          <Separator className="opacity-40" />
          <CardContent className="pt-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border border-border/40">
              <div>
                <p className="text-xs font-medium text-foreground">Production key</p>
                <code className="text-xs text-muted-foreground font-mono">tz_live_••••••••••••4f2a</code>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs text-emerald-400 bg-emerald-400/10">Active</Badge>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-muted-foreground hover:text-destructive">Revoke</Button>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs border-border/50">Generate new key</Button>
          </CardContent>
        </Card>

        <Card className="bg-card border-border/50 border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-destructive">Danger zone</CardTitle>
          </CardHeader>
          <Separator className="opacity-40" />
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium">Delete workspace</p>
                <p className="text-xs text-muted-foreground">Permanently remove this workspace and all data</p>
              </div>
              <Button variant="destructive" size="sm" className="h-8 text-xs">Delete</Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
