'use client'

import { CaptionChunk } from '@/lib/types'
import { BionicTextHighlight } from './BionicTextHighlight'

interface MobileCaptionDisplayProps {
  chunks: CaptionChunk[]
  currentIndex: number
}

/**
 * Mobile-first caption display with text hierarchy:
 * - Current sentence: Largest, most prominent
 * - Previous sentence: Medium, readable
 * - Older sentences: Small, faded but readable
 */
export function MobileCaptionDisplay({ chunks, currentIndex }: MobileCaptionDisplayProps) {
  if (chunks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Listening for speech...</p>
        </div>
      </div>
    )
  }

  // Get keywords from current chunk for highlighting
  const getKeywords = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/)
    return words.filter((w) => w.length > 5).slice(0, 3)
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-3">
      {/* Display chunks in reverse order (newest first) */}
      {chunks.map((chunk, index) => {
        const position = currentIndex - index
        const keywords = getKeywords(chunk.text)

        // Determine size and opacity based on position
        let size: 'small' | 'medium' | 'large' = 'small'
        let opacity = 0.3
        let className = ''

        if (position === 0) {
          // Current sentence - largest
          size = 'large'
          opacity = 1
          className = 'font-semibold'
        } else if (position === 1) {
          // Previous sentence - medium
          size = 'medium'
          opacity = 0.7
        } else if (position === 2) {
          // Second previous - smaller
          size = 'small'
          opacity = 0.5
        } else {
          // Older sentences - very small and faded
          size = 'small'
          opacity = 0.3
        }

        return (
          <div
            key={`${chunk.timestamp}-${index}`}
            className={`transition-all duration-300 ${className}`}
            style={{ opacity }}
          >
            <BionicTextHighlight text={chunk.text} size={size} highlightKeywords={keywords} />
          </div>
        )
      })}
    </div>
  )
}
