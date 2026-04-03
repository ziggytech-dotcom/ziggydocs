import type { Metadata } from 'next'
import { Space_Grotesk } from 'next/font/google'
import './globals.css'
import { Footer } from '@/components/Footer'
import { CookieBanner } from '@/components/CookieBanner'
import MobileBottomNav from '@/components/MobileBottomNav'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  title: "ZiggyDocs",
  description: "Smart document signing for modern businesses",
  openGraph: {
    title: "ZiggyDocs",
    description: "Smart document signing for modern businesses",
    siteName: "ZiggyDocs",
  },
  icons: { icon: '/favicon.ico', shortcut: '/favicon.ico', apple: '/apple-touch-icon.png' },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable} flex flex-col min-h-screen`}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        <MobileBottomNav />
        <CookieBanner />
      </body>
    </html>
  )
}
