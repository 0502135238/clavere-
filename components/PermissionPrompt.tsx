'use client'

import { useState } from 'react'
import { requestMicrophonePermission } from '@/lib/speechRecognition'

interface PermissionPromptProps {
  onPermissionGranted: () => void
  onPermissionDenied: () => void
}

export function PermissionPrompt({ onPermissionGranted, onPermissionDenied }: PermissionPromptProps) {
  const [isRequesting, setIsRequesting] = useState(false)

  const handleRequest = async () => {
    setIsRequesting(true)
    try {
      const stream = await requestMicrophonePermission()
      stream.getTracks().forEach((track) => track.stop())
      onPermissionGranted()
    } catch (error) {
      console.error('Permission denied:', error)
      onPermissionDenied()
    } finally {
      setIsRequesting(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-dark-surface border border-dark-border rounded-lg p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Microphone Access Required</h2>
          <p className="text-gray-400">
            CLAVERE needs access to your microphone to provide live captions. Your audio is processed
            locally and never sent to our servers.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRequest}
            disabled={isRequesting}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {isRequesting ? 'Requesting...' : 'Allow Microphone Access'}
          </button>

          <button
            onClick={onPermissionDenied}
            className="w-full bg-dark-border hover:bg-gray-700 text-gray-300 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Cancel
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-6 text-center">
          You can change this permission later in your browser settings.
        </p>
      </div>
    </div>
  )
}
