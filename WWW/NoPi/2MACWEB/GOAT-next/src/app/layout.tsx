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
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen bg-[#030712] overflow-hidden">
          {/* Enhanced background with multiple gradients */}
          <div className="fixed inset-0 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 z-0"></div>

          {/* Decorative gradient orbs */}
          <div className="fixed top-0 -left-40 w-96 h-96 rounded-full bg-indigo-900/20 blur-3xl pointer-events-none z-0"></div>
          <div className="fixed -top-20 right-0 w-96 h-96 rounded-full bg-purple-900/10 blur-3xl pointer-events-none z-0"></div>
          <div className="fixed bottom-0 left-20 w-80 h-80 rounded-full bg-blue-900/10 blur-3xl pointer-events-none z-0"></div>
          <div className="fixed -bottom-20 right-20 w-72 h-72 rounded-full bg-pink-900/15 blur-3xl pointer-events-none z-0"></div>

          {/* Subtle grid pattern overlay */}
          <div className="fixed inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-[0.06] z-0"></div>

          <nav className="border-b border-zinc-800/30 backdrop-blur-xl bg-black/40 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center">
                  <Link
                    href="/"
                    className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent hover:opacity-80 transition-all duration-300"
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-500/30">H</span>
                    <span>MS</span>
                  </Link>
                </div>

                <div className="flex items-center space-x-1 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/50 rounded-full px-2 py-1 shadow-xl">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="relative px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 text-zinc-400 hover:text-white hover:bg-zinc-800/50 group"
                    >
                      <span className="relative z-10">{item.label}</span>
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 transform origin-left transition-transform scale-x-0 group-hover:scale-x-100"></span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </nav>

          <main className="flex-1 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="bg-zinc-900/30 backdrop-blur-md border border-zinc-800/50 rounded-xl shadow-2xl overflow-hidden p-4">
                {children}
              </div>
            </div>
          </main>

          <footer className="border-t border-zinc-900/50 py-4 backdrop-blur-md bg-black/20 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-xs text-zinc-600">
              <p>HMS - Intelligent Home Monitoring System © {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}