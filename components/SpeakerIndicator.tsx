'use client'

import { useSettings } from '@/lib/settings'

interface SpeakerIndicatorProps {
  speakerId: string | null
  speakerLabel: string
}

const speakerColors: Record<string, string> = {
  'speaker-1': 'bg-speaker-1',
  'speaker-2': 'bg-speaker-2',
  'speaker-3': 'bg-speaker-3',
  'speaker-4': 'bg-speaker-4',
}

export function SpeakerIndicator({ speakerId, speakerLabel }: SpeakerIndicatorProps) {
  const { settings } = useSettings()

  if (!speakerId) {
    return null
  }

  const colorClass = speakerColors[speakerId] || 'bg-gray-500'

  return (
    <div className="flex items-center gap-2 mb-2">
      {settings.speakerColorMode === 'colorful' && (
        <div className={`w-3 h-3 rounded-full ${colorClass}`} aria-hidden="true" />
      )}
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
        {speakerLabel}
      </span>
    </div>
  )
}
