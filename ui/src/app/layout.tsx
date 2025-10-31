import './globals.css'
import type { Metadata } from 'next'
import { Quicksand } from 'next/font/google'

const quicksand = Quicksand({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ZipZapZoop',
  description: 'Securely share files peer-to-peer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={quicksand.className}>
        <main className="min-h-screen bg-background">
          {children}
        </main>
      </body>
    </html>
  )
}