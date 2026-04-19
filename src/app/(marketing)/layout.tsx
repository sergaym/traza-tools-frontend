import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/traza-icon.svg" alt="Traza Tools" width={90} height={18} style={{ height: "auto" }} priority />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {[
              { label: "Features", href: "#features" },
              { label: "Integrations", href: "#integrations" },
              { label: "Pricing", href: "#pricing" },
              { label: "Docs", href: "/docs" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" render={<Link href="/dashboard" />} nativeButton={false}>
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/dashboard" />} nativeButton={false}>
              Get started
            </Button>
          </div>
        </div>
      </header>
      {children}
      <footer className="mt-auto bg-[#152023]">
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          {/* Top row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4">
              <Image src="/traza-icon-white.svg" alt="Traza Tools" width={80} height={16} style={{ height: "auto" }} />
              <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">
                The tool layer for AI agents. Connect, define, ship.
              </p>
            </div>

            {/* Product */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Product</p>
              {[
                { label: "Features", href: "#features" },
                { label: "Integrations", href: "#integrations" },
                { label: "Pricing", href: "#pricing" },
                { label: "Changelog", href: "#" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            {/* Developers */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Developers</p>
              {[
                { label: "Docs", href: "/docs" },
                { label: "API Reference", href: "#" },
                { label: "SDK", href: "#" },
                { label: "Status", href: "#" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <p className="text-xs font-medium text-white/60 uppercase tracking-wider">Company</p>
              {[
                { label: "About", href: "#" },
                { label: "Blog", href: "#" },
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-sm text-white/50 hover:text-white transition-colors">
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Bottom row */}
          <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <p className="text-xs text-white/30">© 2026 Traza Tools, Inc. All rights reserved.</p>
            <p className="text-xs text-white/30">Built for the agentic era.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
