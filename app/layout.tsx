import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'powerGlove App',
  description: 'powerGlove is a webApp made for a boxing glove that has pressure sensors and heart monitor',
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
