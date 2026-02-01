'use client'

import { CaptionChunk } from '@/lib/types'
import { BionicTextHighlight } from './BionicTextHighlight'
import { getSpeakerLabel } from '@/lib/speakerUtils'

interface ARGlassesDisplayProps {
  chunks: CaptionChunk[]
  currentIndex: number
}

/**
 * Minimal AR Glasses Display
 * Optimized for small overlay screens with:
 * - Large, readable text
 * - Minimal UI elements
 * - High contrast for visibility
 * - Current speaker only (most recent)
 */
export function ARGlassesDisplay({ chunks, currentIndex }: ARGlassesDisplayProps) {
  // Show only the most recent caption for AR glasses
  const currentChunk = chunks[0]

  if (!currentChunk) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="text-white text-center">
          <div className="text-2xl mb-2">🎤</div>
          <div className="text-sm opacity-70">Listening...</div>
        </div>
      </div>
    )
  }

  const getKeywords = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/)
    return words.filter((w) => w.length > 5).slice(0, 3)
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-8 pointer-events-none">
      {/* Current Caption - Large and Centered */}
      <div className="max-w-4xl w-full text-center">
        {/* Speaker Label - Minimal */}
        {currentChunk.speakerId && (
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-400 font-medium">
              {getSpeakerLabel(currentChunk.speakerId)}
            </span>
            {currentChunk.isOverlap && (
              <span className="text-xs text-yellow-400 ml-2">⚡</span>
            )}
          </div>
        )}

        {/* Main Caption Text - Extra Large for AR Glasses */}
        <div className="text-white">
          <BionicTextHighlight
            text={currentChunk.text}
            size="large"
            highlightKeywords={getKeywords(currentChunk.text)}
          />
        </div>

        {/* Subtle indicator for new text */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>
    </div>
  )
}
