import type React from "react"
import { MainNav } from "@/components/main-nav"
import { MobileNav } from "@/components/mobile-nav"

interface SiteLayoutProps {
  children: React.ReactNode
}

export function SiteLayout({ children }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-black">
      <header className="sticky top-0 z-10 border-b border-gold/20 bg-black/95 backdrop-blur">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-4">
            <MobileNav />
            <div className="text-xl font-bold text-gold">BoxSense</div>
          </div>

          {/* Main navigation now in the header */}
          <div className="ml-6 flex-1">
            <MainNav />
          </div>

        </div>
      </header>

      <main className="flex-1">
        <div className="container py-6">{children}</div>
      </main>
    </div>
  )
}
