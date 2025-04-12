export default function AboutPage() {
  return (
    <div className="space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          About HMS
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Next-generation AI-powered home surveillance system
        </p>
      </div>

      <div className="grid gap-8">
        <div className="card bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Project Overview
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 leading-relaxed">
              HMS (Home Monitoring System) is a sophisticated surveillance solution powered by artificial intelligence
              and built on the Raspberry Pi 5 platform. It combines cutting-edge computer vision with efficient
              monitoring capabilities to provide comprehensive home security.
            </p>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Core Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-indigo-400">Hardware</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">▹</span>
                  <span>Raspberry Pi 5 - Latest Gen Computing</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">▹</span>
                  <span>High-Resolution Camera Module</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">▹</span>
                  <span>Advanced Motion Detection</span>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-indigo-400">Software Stack</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">▹</span>
                  <span>Next.js & TailwindCSS Frontend</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">▹</span>
                  <span>FastAPI Backend</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="text-purple-400">▹</span>
                  <span>Real-time Image Processing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card bg-gradient-to-br from-gray-900/50 to-black/50 backdrop-blur-sm">
          <h2 className="text-2xl font-semibold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <div className="p-6 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-indigo-500/50">
                <h3 className="text-xl font-medium text-indigo-400 mb-2">Aniket Desai</h3>
                <p className="text-gray-400 mb-4">Lead Developer & Hardware Engineer</p>
                <a
                  href="https://github.com/recursionReaper"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gray-300 hover:text-indigo-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
            <div className="group">
              <div className="p-6 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-purple-500/50">
                <h3 className="text-xl font-medium text-purple-400 mb-2">Yash Ogale</h3>
                <p className="text-gray-400 mb-4">AI Engineer & System Architect</p>
                <a
                  href="https://github.com/yashogale30"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" clipRule="evenodd" />
                  </svg>
                  <span>GitHub</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}