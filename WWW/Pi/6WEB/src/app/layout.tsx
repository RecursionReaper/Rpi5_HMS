import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

// Load font with all weights for better typography
const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'HMS - Home Monitoring System',
  description: 'AI-Powered Home Surveillance System for Enhanced Security',
  keywords: 'home monitoring, surveillance, security, AI camera',
}

const navItems = [
  { href: '/', label: 'Dashboard' },
  { href: '/snaps', label: 'Snapshots' },
  { href: '/about', label: 'About' },
]

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-950 via-zinc-900 to-slate-900">
          {/* Premium glass effect navbar */}
          <nav className="border-b border-white/10 backdrop-blur-xl bg-black/30 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-fuchsia-500 bg-clip-text text-transparent hover:opacity-90 transition-opacity"
                  >
                    HMS
                  </Link>
                </div>
                <div className="flex items-center space-x-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative px-3 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-300 group"
                    >
                      <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100" />
                      <span className="relative">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>
          
          {/* Main content with subtle background effect */}
          <main className="flex-1 relative">
            <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[size:20px_20px] pointer-events-none" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
              {/* Content card with glass effect */}
              <div className="backdrop-blur-sm bg-black/20 border border-white/10 rounded-xl shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-fuchsia-500/5 pointer-events-none" />
                <div className="p-6">
                  {children}
                </div>
              </div>
            </div>
          </main>
          
          {/* Simple footer */}
          <footer className="border-t border-white/10 backdrop-blur-xl bg-black/30 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm text-gray-400">
                HMS • Home Monitoring System • {new Date().getFullYear()}
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
