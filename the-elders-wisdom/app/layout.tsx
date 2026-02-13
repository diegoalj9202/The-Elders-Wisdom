import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "The Elders' Wisdom - Create Your E-Book",
  description: 'An immersive educational platform for creating wisdom-themed multimedia e-books',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="grain-effect" onContextMenu={(e) => e.preventDefault()}>
        {children}
      </body>
    </html>
  )
}
