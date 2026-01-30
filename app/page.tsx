'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function LandingPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md flex flex-col items-center space-y-8">
        {/* Logo/App Name */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-purple-600 rounded flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1">
              <div className="w-2 h-2 bg-white rounded-sm"></div>
              <div className="w-2 h-2 bg-white rounded-sm"></div>
              <div className="w-2 h-2 bg-white rounded-sm"></div>
              <div className="w-2 h-2 bg-white rounded-sm"></div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            CLAVERE
          </h1>
        </div>
        <p className="text-lg md:text-xl text-gray-400 text-center">
          Real-time conversation captions for deaf and hard-of-hearing people
        </p>

        {/* Main CTA */}
        <button
          onClick={() => router.push('/captions')}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xl py-4 px-8 rounded-lg shadow-lg transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Start captions"
        >
          Start Captions
        </button>

        {/* Settings Link */}
        <button
          onClick={() => router.push('/settings')}
          className="text-gray-400 hover:text-white text-sm underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
          aria-label="Open settings"
        >
          Settings
        </button>

        {/* Info Note */}
        <div className="mt-8 text-center text-sm text-gray-500 space-y-2">
          <p>No signup required.</p>
          <p>Works best in quiet environments.</p>
          <p>Built for deaf and hard-of-hearing people.</p>
        </div>
      </div>
    </div>
  )
}
