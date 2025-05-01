import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SerialProvider } from "@/components/providers/SerialProvider"
import { SiteLayout } from "@/components/site-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BoxSense - Boxing Glove Analysis System",
  description: "Real-time boxing performance analysis with advanced sensor technology",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <SerialProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
            <SiteLayout>{children}</SiteLayout>
          </ThemeProvider>
      </SerialProvider>
      </body>
    </html>
  )
}
