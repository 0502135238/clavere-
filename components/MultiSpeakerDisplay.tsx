'use client'

import { CaptionChunk } from '@/lib/types'
import { BionicTextHighlight } from './BionicTextHighlight'
import { getSpeakerLabel } from '@/lib/speakerUtils'

interface MultiSpeakerDisplayProps {
  chunks: CaptionChunk[]
  currentIndex: number
}

/**
 * Smart multi-speaker display that handles overlaps gracefully
 * Shows current speaker prominently, overlapping speakers alongside
 */
export function MultiSpeakerDisplay({ chunks, currentIndex }: MultiSpeakerDisplayProps) {
  // Show empty state without loading spinner - just empty space
  if (chunks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Ready to listen</p>
        </div>
      </div>
    )
  }

  const getKeywords = (text: string): string[] => {
    const words = text.toLowerCase().split(/\s+/)
    return words.filter((w) => w.length > 5).slice(0, 3)
  }

  // Group chunks by overlap status and speaker
  const currentChunk = chunks[0]
  const overlappingChunks = chunks.filter(
    (c, i) => i > 0 && i <= 2 && c.isOverlap && c.timestamp >= currentChunk.timestamp - 2000
  )
  const previousChunks = chunks.filter((c, i) => i > 0 && !c.isOverlap)

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
      {/* Current Speaker - Largest */}
      {currentChunk && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            <span className="text-xs text-gray-400 font-medium">
              {getSpeakerLabel(currentChunk.speakerId)}
            </span>
            {currentChunk.isOverlap && (
              <span className="text-xs text-yellow-400">⚡ Overlap</span>
            )}
          </div>
          <div className="transition-all duration-300">
            <BionicTextHighlight
              text={currentChunk.text}
              size="large"
              highlightKeywords={getKeywords(currentChunk.text)}
            />
          </div>
        </div>
      )}

      {/* Overlapping Speakers - Side by side on mobile, stacked */}
      {overlappingChunks.length > 0 && (
        <div className="space-y-3 pt-2 border-t border-dark-border/50">
          <div className="text-xs text-gray-500 font-medium">Speaking simultaneously:</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overlappingChunks.map((chunk, index) => (
              <div
                key={`${chunk.timestamp}-${index}`}
                className="bg-dark-surface/50 rounded-lg p-3 border border-dark-border"
                style={{ opacity: 0.8 - index * 0.1 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-xs text-gray-400">
                    {getSpeakerLabel(chunk.speakerId)}
                  </span>
                </div>
                <BionicTextHighlight
                  text={chunk.text}
                  size="medium"
                  highlightKeywords={getKeywords(chunk.text)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Chunks - Fading hierarchy */}
      <div className="space-y-2 pt-4">
        {previousChunks.slice(0, 10).map((chunk, index) => {
          const position = index + 1
          let size: 'small' | 'medium' | 'large' = 'small'
          let opacity = 0.3

          if (position === 1) {
            size = 'medium'
            opacity = 0.6
          } else if (position === 2) {
            size = 'small'
            opacity = 0.4
          }

          return (
            <div
              key={`${chunk.timestamp}-prev-${index}`}
              className="transition-all duration-300"
              style={{ opacity }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-600"></div>
                <span className="text-[10px] text-gray-500">
                  {getSpeakerLabel(chunk.speakerId)}
                </span>
              </div>
              <BionicTextHighlight
                text={chunk.text}
                size={size}
                highlightKeywords={getKeywords(chunk.text)}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
