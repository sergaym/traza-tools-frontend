import Image from "next/image"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <Link href="/" className="mb-8">
        <Image src="/traza-icon.svg" alt="Traza Tools" width={96} height={19} priority />
      </Link>
      <main className="w-full max-w-sm">
        {children}
      </main>
    </div>
  )
}
