import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Promotion Predictor',
  description: 'Predict your next career move',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a]`}>
        <div className="min-h-screen relative overflow-hidden">
          {/* Gradient background */}
          <div className="fixed inset-0 bg-gradient-to-br from-blue-900/40 via-[#0a0a0a] to-purple-900/40" />

          {/* Animated gradient orbs */}
          <div className="fixed inset-0">
            <div className="absolute top-[20%] left-[10%] w-[500px] h-[500px] bg-blue-500/30 rounded-full blur-[128px] animate-pulse" />
            <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-purple-500/30 rounded-full blur-[128px] animate-pulse delay-700" />
          </div>

          {/* Grid pattern overlay */}
          <div className="fixed inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 dark:opacity-20" />

          {/* Content */}
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </body>
      <GoogleAnalytics gaId="G-9B5SG5PVL9" />
    </html>
  )
}