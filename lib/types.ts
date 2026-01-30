export interface CaptionChunk {
  text: string
  speakerId: string | null
  timestamp: number
  // Conversation analysis fields
  speed?: 'slow' | 'normal' | 'fast'
  emotion?: 'neutral' | 'happy' | 'excited' | 'serious'
  isOverlap?: boolean
  isInterruption?: boolean
  hasLaughter?: boolean
  isJoke?: boolean
  // Overlap handling
  overlapGroupId?: string
  displayPriority?: number
}

export interface ConversationEvent {
  type: 'new-speaker' | 'side-conversation' | 'topic-change' | 'overlap' | 'interruption' | 'laughter' | 'joke'
  timestamp: number
  speakerId?: string | null
  message: string
}

export interface ConversationSummary {
  summary: string
  mainSpeaker: string | null
  keyPoints: string[]
  reactions: string[]
  timestamp: number
}

export interface Speaker {
  id: string
  label: string
  color: string
  lastSpokeAt?: number
  totalSpeakingTime?: number
}

export type TextSize = 'small' | 'medium' | 'large'
export type Theme = 'light' | 'dark' | 'high-contrast'
export type ChunkLength = 'short' | 'medium' | 'long'
export type SpeakerColorMode = 'colorful' | 'minimal'
export type ViewMode = 'chunk' | 'scroll'
export type CaptionMode = 'social' | 'accuracy'
export type DisplayMode = 'personal' | 'shared'

export interface AppSettings {
  textSize: TextSize
  theme: Theme
  chunkLength: ChunkLength
  speakerColorMode: SpeakerColorMode
  showHistory: boolean
  captionMode: CaptionMode
  displayMode: DisplayMode
  groupFeedbackEnabled: boolean
}

export interface GroupFeedback {
  type: 'overlap' | 'exclusion' | 'turn-taking'
  message: string
  timestamp: number
  severity: 'low' | 'medium' | 'high'
}
