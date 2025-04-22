import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'powerGlove App',
  description: 'Created with the sweat and tears of undergrad students trying to make a MVP in 2 weeks',
  generator: 'powerGlove.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
