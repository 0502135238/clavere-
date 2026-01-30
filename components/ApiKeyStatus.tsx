'use client'

import { useEffect, useState } from 'react'
import { checkApiKeys, getAppConfig } from '@/lib/config'

/**
 * Shows API key configuration status
 * Helpful for debugging and setup
 */
export function ApiKeyStatus() {
  const [keys, setKeys] = useState<ReturnType<typeof checkApiKeys> | null>(null)
  const [config, setConfig] = useState<ReturnType<typeof getAppConfig> | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    setKeys(checkApiKeys())
    setConfig(getAppConfig())
  }, [])

  if (!keys || !config) return null

  const isUsingDeepgram = config.aiService === 'deepgram' && keys.deepgram

  return (
    <div className="fixed bottom-4 right-4 bg-dark-surface border border-dark-border rounded-lg p-3 text-xs max-w-xs z-50">
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="w-full text-left flex items-center justify-between"
      >
        <span className="text-gray-400">API Keys Status</span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${showDetails ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDetails && (
        <div className="mt-2 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Deepgram:</span>
            <span className={keys.deepgram ? 'text-green-400' : 'text-red-400'}>
              {keys.deepgram ? '✓ Configured' : '✗ Not set'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">OpenAI:</span>
            <span className={keys.openai ? 'text-green-400' : 'text-gray-500'}>
              {keys.openai ? '✓ Configured' : 'Optional'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-500">Service:</span>
            <span className={isUsingDeepgram ? 'text-green-400 font-bold' : 'text-yellow-400'}>
              {isUsingDeepgram ? 'Deepgram ✅' : 'Web Speech API ⚠️'}
            </span>
          </div>
          {isUsingDeepgram && (
            <div className="mt-2 pt-2 border-t border-green-700/50 text-green-300 text-[10px] bg-green-900/20 p-2 rounded">
              ✅ Real voice diarization active - Speakers detected by voice characteristics
            </div>
          )}
          {!isUsingDeepgram && (
            <div className="mt-2 pt-2 border-t border-dark-border text-yellow-300 text-[10px] bg-yellow-900/20 p-2 rounded">
              ⚠️ Voice detection is time-based only. Add Deepgram API key for real voice detection.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
