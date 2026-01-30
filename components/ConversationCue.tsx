'use client'

import { ConversationEvent } from '@/lib/types'

interface ConversationCueProps {
  event: ConversationEvent
}

const eventIcons: Record<ConversationEvent['type'], string> = {
  'new-speaker': '👤',
  'side-conversation': '💬',
  'topic-change': '🔄',
  overlap: '⚡',
  interruption: '⚠️',
  laughter: '😂',
  joke: '😄',
}

const eventColors: Record<ConversationEvent['type'], string> = {
  'new-speaker': 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  'side-conversation': 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
  'topic-change': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  overlap: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
  interruption: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
  laughter: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  joke: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
}

export function ConversationCue({ event }: ConversationCueProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium animate-fade-in ${eventColors[event.type]}`}
    >
      <span>{eventIcons[event.type]}</span>
      <span>{event.message}</span>
    </div>
  )
}
