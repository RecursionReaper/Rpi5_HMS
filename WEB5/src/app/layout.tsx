import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'HMS - HomeGuard Vision',
  description: 'AI-Powered Intelligent Home Surveillance System',
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
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased bg-zinc-950`}>
        <div className="flex flex-col min-h-screen overflow-hidden">
          {/* Animated gradient background */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-gradient-to-r from-violet-500/20 to-purple-500/10 rounded-full blur-3xl opacity-30 animate-gradient-rotate"></div>
            <div className="absolute -bottom-40 -right-40 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/20 to-cyan-500/10 rounded-full blur-3xl opacity-30 animate-gradient-rotate-reverse"></div>
          </div>

          {/* Subtle grid pattern */}
          <div className="fixed inset-0 bg-grid-white/[0.03] z-0" />

          <nav className="sticky top-0 z-50 border-b border-zinc-800 backdrop-blur-xl bg-zinc-950/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <Link
                  href="/"
                  className="flex items-center space-x-3 group"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                    <span className="text-white font-bold text-base">HMS</span>
                  </div>
                  <span className="text-xl font-semibold bg-gradient-to-r from-purple-200 via-blue-300 to-purple-200 bg-clip-text text-transparent">
                    Rpi Vision
                  </span>
                </Link>

                <div className="flex items-center space-x-1 backdrop-blur-md bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-2 shadow-xl">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-zinc-400 hover:text-white group"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 relative z-10 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
              <div className="bg-zinc-900/30 backdrop-blur-2xl border border-zinc-800/50 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500 hover:border-zinc-700/70 p-4">
                <div className="w-full h-full overflow-hidden rounded-2xl">
                  {children}
                </div>
              </div>
            </div>
          </main>

          <footer className="border-t border-zinc-900/50 backdrop-blur-xl bg-zinc-950/80 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <p className="text-center text-sm text-zinc-500">
                © {new Date().getFullYear()} HomeGuard Vision - AI-Powered Surveillance System
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
