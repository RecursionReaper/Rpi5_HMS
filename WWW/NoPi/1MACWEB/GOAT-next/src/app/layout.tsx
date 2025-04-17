import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HMS - Home Monitoring System',
  description: 'AI-Powered Home Surveillance System',
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
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-black to-zinc-900">
          <nav className="border-b border-zinc-800/50 backdrop-blur-xl bg-black/20 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="text-xl font-semibold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
                  >
                    HMS
                  </Link>
                </div>
                <div className="flex items-center space-x-1">
                  <Link
                    href="/"
                    className="nav-link group"
                  >
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100" />
                    <span className="relative">Dashboard</span>
                  </Link>
                  <Link
                    href="/snaps"
                    className="nav-link group"
                  >
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100" />
                    <span className="relative">Snapshots</span>
                  </Link>
                  <Link
                    href="/about"
                    className="nav-link group"
                  >
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-indigo-400 to-purple-500 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100" />
                    <span className="relative">About</span>
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="flex-1 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
