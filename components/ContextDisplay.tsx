'use client'

import { useState } from 'react'

interface ContextDisplayProps {
  topic?: string
  sentiment?: 'positive' | 'neutral' | 'negative'
  keywords?: string[]
  activeSpeakers?: string[]
}

/**
 * Displays conversation context
 * Compact on mobile, expandable for details
 */
export function ContextDisplay({
  topic,
  sentiment,
  keywords = [],
  activeSpeakers = [],
}: ContextDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const sentimentColors = {
    positive: 'bg-green-500/20 text-green-400 border-green-500/30',
    negative: 'bg-red-500/20 text-red-400 border-red-500/30',
    neutral: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  }

  return (
    <div className="border-t border-dark-border bg-dark-surface/50">
      {/* Compact View - Always Visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-2 flex items-center justify-between hover:bg-dark-border/50 transition-colors"
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Active Speakers */}
          {activeSpeakers.length > 0 && (
            <div className="flex items-center gap-1.5">
              {activeSpeakers.slice(0, 3).map((speaker, i) => (
                <div
                  key={speaker}
                  className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-xs font-semibold text-white"
                  style={{
                    marginLeft: i > 0 ? '-8px' : '0',
                    zIndex: 10 - i,
                  }}
                >
                  {speaker.slice(-1)}
                </div>
              ))}
              {activeSpeakers.length > 3 && (
                <span className="text-xs text-gray-400 ml-1">+{activeSpeakers.length - 3}</span>
              )}
            </div>
          )}

          {/* Topic/Keywords */}
          {keywords.length > 0 && (
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-xs text-gray-500">Topic:</span>
              <span className="text-xs text-white truncate">{keywords[0]}</span>
            </div>
          )}

          {/* Sentiment */}
          {sentiment && (
            <div
              className={`px-2 py-0.5 rounded-full text-xs border ${sentimentColors[sentiment]}`}
            >
              {sentiment === 'positive' ? '😊' : sentiment === 'negative' ? '😐' : '😐'}
            </div>
          )}
        </div>

        {/* Expand Icon */}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded View */}
      {isExpanded && (
        <div className="px-4 py-3 space-y-3 border-t border-dark-border">
          {/* Keywords */}
          {keywords.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2">Keywords</div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword, i) => (
                  <span
                    key={i}
                    className="px-2 py-1 bg-purple-600/20 text-purple-400 rounded text-xs border border-purple-600/30"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Speakers */}
          {activeSpeakers.length > 0 && (
            <div>
              <div className="text-xs text-gray-500 mb-2">Active Speakers</div>
              <div className="flex flex-wrap gap-2">
                {activeSpeakers.map((speaker, i) => (
                  <div
                    key={speaker}
                    className="flex items-center gap-2 px-2 py-1 bg-dark-border rounded text-xs"
                  >
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    <span className="text-gray-300">Speaker {speaker.slice(-1)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Sentiment Details */}
          {sentiment && (
            <div>
              <div className="text-xs text-gray-500 mb-2">Conversation Tone</div>
              <div
                className={`px-3 py-2 rounded border ${sentimentColors[sentiment]} text-sm`}
              >
                {sentiment === 'positive'
                  ? 'Positive and engaging'
                  : sentiment === 'negative'
                  ? 'Neutral to serious'
                  : 'Neutral conversation'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
