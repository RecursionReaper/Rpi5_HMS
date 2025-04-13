export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          About HMS
        </h1>
        <p className="text-gray-400 text-xl max-w-2xl mx-auto">
          Next-generation AI-powered home surveillance system
        </p>
        <div className="pt-4">
          <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 text-sm font-medium">
            Smart Security • Real-time Monitoring • Privacy-focused
          </span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-12">
        {/* Project Overview with Image */}
        <div className="card bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-3/5">
              <h2 className="text-3xl font-semibold mb-6 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                Project Overview
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 leading-relaxed text-lg">
                  HMS (Home Monitoring System) is a sophisticated surveillance solution powered by artificial intelligence
                  and built on the Raspberry Pi 5 platform. It combines cutting-edge computer vision with efficient
                  monitoring capabilities to provide comprehensive home security.
                </p>
                <p className="text-gray-300 leading-relaxed mt-4">
                  Designed with both security and privacy in mind, HMS offers real-time alerts, intelligent object recognition,
                  and customizable monitoring zones—all accessible through an intuitive mobile and web interface.
                </p>
              </div>
              <div className="mt-6">
                <a href="/features" className="inline-flex items-center text-indigo-400 hover:text-indigo-300 transition-colors">
                  <span>Explore all features</span>
                  <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </a>
              </div>
            </div>
            <div className="md:w-2/5 flex items-center justify-center">
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-purple-600/20 flex items-center justify-center">
                  <svg className="w-32 h-32 text-indigo-400/80" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Core Technology with Icons */}
        <div className="card bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Core Technology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full p-3 bg-indigo-500/20 text-indigo-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-indigo-400">Hardware</h3>
              </div>
              <ul className="space-y-4 text-gray-300 pl-4">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 text-lg mt-0.5">▹</span>
                  <div>
                    <span className="font-medium text-white">Raspberry Pi 5</span>
                    <p className="text-sm text-gray-400 mt-1">Cutting-edge computing power in a compact form factor</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 text-lg mt-0.5">▹</span>
                  <div>
                    <span className="font-medium text-white">High-Resolution Camera Module</span>
                    <p className="text-sm text-gray-400 mt-1">1080p HD video with night vision capabilities</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 text-lg mt-0.5">▹</span>
                  <div>
                    <span className="font-medium text-white">Advanced Motion Detection</span>
                    <p className="text-sm text-gray-400 mt-1">PIR sensors with adjustable sensitivity</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full p-3 bg-purple-500/20 text-purple-400">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-purple-400">Software Stack</h3>
              </div>
              <ul className="space-y-4 text-gray-300 pl-4">
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 text-lg mt-0.5">▹</span>
                  <div>
                    <span className="font-medium text-white">Next.js & TailwindCSS Frontend</span>
                    <p className="text-sm text-gray-400 mt-1">Responsive, modern interface across all devices</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 text-lg mt-0.5">▹</span>
                  <div>
                    <span className="font-medium text-white">FastAPI Backend</span>
                    <p className="text-sm text-gray-400 mt-1">High-performance Python-based API services</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="text-purple-400 text-lg mt-0.5">▹</span>
                  <div>
                    <span className="font-medium text-white">Real-time Image Processing</span>
                    <p className="text-sm text-gray-400 mt-1">OpenCV and TensorFlow for object detection</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Key Features */}
        <div className="card bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-indigo-500/40 group">
              <div className="rounded-full p-3 mb-4 w-12 h-12 flex items-center justify-center bg-indigo-500/20 text-indigo-400 group-hover:bg-indigo-500/30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-indigo-400 mb-3">Intelligent Detection</h3>
              <p className="text-gray-400">HMS can distinguish between people, pets, and objects with high accuracy.</p>
            </div>
            <div className="p-6 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-indigo-500/40 group">
              <div className="rounded-full p-3 mb-4 w-12 h-12 flex items-center justify-center bg-purple-500/20 text-purple-400 group-hover:bg-purple-500/30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-purple-400 mb-3">Instant Alerts</h3>
              <p className="text-gray-400">Receive immediate notifications when unusual activity is detected.</p>
            </div>
            <div className="p-6 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-indigo-500/40 group">
              <div className="rounded-full p-3 mb-4 w-12 h-12 flex items-center justify-center bg-pink-500/20 text-pink-400 group-hover:bg-pink-500/30 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-pink-400 mb-3">Privacy-First</h3>
              <p className="text-gray-400">All processing happens locally with no cloud dependency for your privacy.</p>
            </div>
          </div>
        </div>

        {/* The Team */}
        <div className="card bg-gradient-to-br from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800 hover:border-indigo-500/30 transition-all duration-300 shadow-xl">
          <h2 className="text-3xl font-semibold mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            The Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <div className="p-8 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-indigo-500/70 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-indigo-500/20 mb-6 flex items-center justify-center">
                    <span className="text-3xl font-bold text-indigo-400">AD</span>
                  </div>
                  <h3 className="text-2xl font-medium text-indigo-400 mb-2">Aniket Desai</h3>
                  <p className="text-gray-400 mb-4 text-lg">Lead Developer & Hardware Engineer</p>
                  <p className="text-gray-300 mb-6">
                    Raspberry Pi enthusiast with extensive experience in IoT and embedded systems. Specializes in hardware-software integration and real-time processing.
                  </p>
                  <div className="flex space-x-4">
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
                    <a
                      href="https://linkedin.com/in/aniketdesai"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-gray-300 hover:text-indigo-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="group">
              <div className="p-8 rounded-lg bg-black/30 hover:bg-black/50 transition-all duration-300 border border-gray-800 hover:border-purple-500/70 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="w-20 h-20 rounded-full bg-purple-500/20 mb-6 flex items-center justify-center">
                    <span className="text-3xl font-bold text-purple-400">YO</span>
                  </div>
                  <h3 className="text-2xl font-medium text-purple-400 mb-2">Yash Ogale</h3>
                  <p className="text-gray-400 mb-4 text-lg">AI Engineer & System Architect</p>
                  <p className="text-gray-300 mb-6">
                    Computer vision specialist with a focus on machine learning applications. Responsible for developing the core AI algorithms that power HMS's detection capabilities.
                  </p>
                  <div className="flex space-x-4">
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
                    <a
                      href="https://linkedin.com/in/yashogale"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-gray-300 hover:text-purple-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                      <span>LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-8">
          <div className="inline-block p-px rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            <a
              href="/demo"
              className="block px-8 py-3 rounded-lg bg-gray-900 hover:bg-gray-900/80 transition-colors text-white font-medium"
            >
              Try HMS Demo
            </a>
          </div>
          <p className="text-gray-400 mt-4">
            Experience the next generation of home security
          </p>
        </div>
      </div>
    </div>
  )
}