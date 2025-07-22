import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Screenshot Capture Service',
  description: 'Capture high-quality screenshots from any website URL and save them to your Cosmic bucket media library.',
  keywords: ['screenshot', 'web capture', 'cosmic cms', 'website screenshot', 'url capture'],
  authors: [{ name: 'Screenshot Capture Service' }],
  openGraph: {
    title: 'Screenshot Capture Service',
    description: 'Capture high-quality screenshots from any website URL and save them to your Cosmic bucket media library.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}