'use client'

import { GroupFeedback } from '@/lib/types'

interface GroupFeedbackPanelProps {
  feedbacks: GroupFeedback[]
}

const feedbackIcons: Record<GroupFeedback['type'], string> = {
  overlap: '⚡',
  exclusion: '👤',
  'turn-taking': '🔄',
}

const severityColors: Record<GroupFeedback['severity'], string> = {
  low: 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-800',
  medium: 'bg-yellow-50 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800',
  high: 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-800',
}

export function GroupFeedbackPanel({ feedbacks }: GroupFeedbackPanelProps) {
  if (feedbacks.length === 0) return null

  return (
    <div className="fixed bottom-20 right-4 max-w-sm space-y-2 z-40">
      {feedbacks.map((feedback, index) => (
        <div
          key={index}
          className={`${severityColors[feedback.severity]} border rounded-lg p-3 shadow-lg animate-fade-in`}
        >
          <div className="flex items-start gap-2">
            <span className="text-xl">{feedbackIcons[feedback.type]}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{feedback.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
