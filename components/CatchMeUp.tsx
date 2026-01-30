'use client'

import { ConversationSummary } from '@/lib/types'
import { getSpeakerLabel } from '@/lib/speakerUtils'

interface CatchMeUpProps {
  summary: ConversationSummary
  onClose: () => void
}

export function CatchMeUp({ summary, onClose }: CatchMeUpProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-black rounded-2xl max-w-lg w-full p-6 animate-fade-in shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Catch Me Up</h2>
          <button
            onClick={onClose}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
              Summary
            </h3>
            <p className="text-gray-900 dark:text-white leading-relaxed">{summary.summary}</p>
          </div>

          {summary.mainSpeaker && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                Main Speaker
              </h3>
              <p className="text-gray-900 dark:text-white">{getSpeakerLabel(summary.mainSpeaker)}</p>
            </div>
          )}

          {summary.keyPoints.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                Key Points
              </h3>
              <ul className="list-disc list-inside space-y-1 text-gray-900 dark:text-white">
                {summary.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm">{point}</li>
                ))}
              </ul>
            </div>
          )}

          {summary.reactions.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase">
                Reactions
              </h3>
              <div className="flex flex-wrap gap-2">
                {summary.reactions.map((reaction, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {reaction}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
