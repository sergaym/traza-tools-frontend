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
      <footer className="border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Image src="/traza-icon.svg" alt="Traza Tools" width={72} height={15} />
          <div className="flex items-center gap-5">
            {["Privacy", "Terms", "Docs", "Status"].map((item) => (
              <Link key={item} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </Link>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2026 Traza Tools</p>
        </div>
      </footer>
    </div>
  )
}
