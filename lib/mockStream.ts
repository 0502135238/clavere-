import { CaptionChunk } from './types'

// Mock conversation chunks for demo
const mockConversations: string[][] = [
  [
    "Hello, how are you doing today?",
    "I'm doing great, thanks for asking.",
    "That's wonderful to hear.",
    "What are your plans for the weekend?",
    "I'm thinking about going hiking.",
    "That sounds like a fun activity.",
    "Would you like to join me?",
    "I'd love to, but I have other commitments.",
    "No problem, maybe next time.",
    "Absolutely, let's plan something soon.",
  ],
  [
    "Can you help me with this project?",
    "Of course, what do you need?",
    "I'm having trouble with the design.",
    "Let me take a look at it.",
    "Here's what I have so far.",
    "I see the issue. Try this approach instead.",
    "That makes much more sense.",
    "Glad I could help.",
  ],
]

const speakers = ['speaker-1', 'speaker-2', 'speaker-3']
const speakerLabels: Record<string, string> = {
  'speaker-1': 'Speaker 1',
  'speaker-2': 'Speaker 2',
  'speaker-3': 'Speaker 3',
}

export function getSpeakerLabel(speakerId: string | null): string {
  if (!speakerId) return 'Unknown'
  return speakerLabels[speakerId] || 'Unknown'
}

export class MockCaptionStream {
  private callback: ((chunk: CaptionChunk) => void) | null = null
  private intervalId: NodeJS.Timeout | null = null
  private isPaused = false
  private conversationIndex = 0
  private chunkIndex = 0
  private speakerIndex = 0

  start(callback: (chunk: CaptionChunk) => void) {
    this.callback = callback
    this.isPaused = false
    this.conversationIndex = Math.floor(Math.random() * mockConversations.length)
    this.chunkIndex = 0
    this.speakerIndex = 0

    const sendChunk = () => {
      if (this.isPaused || !this.callback) return

      const conversation = mockConversations[this.conversationIndex]
      if (this.chunkIndex >= conversation.length) {
        // Restart with a new conversation
        this.conversationIndex = (this.conversationIndex + 1) % mockConversations.length
        this.chunkIndex = 0
        this.speakerIndex = 0
      }

      const text = conversation[this.chunkIndex]
      const speakerId = speakers[this.speakerIndex % speakers.length]
      const now = Date.now()

      // Add some variety to mock data
      const hasLaughter = Math.random() > 0.8 && (text.toLowerCase().includes('fun') || Math.random() > 0.9)
      const isJoke = Math.random() > 0.9
      const speed = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'fast' : 'slow') : 'normal'

      this.callback({
        text,
        speakerId,
        timestamp: now,
        speed,
        emotion: hasLaughter ? 'happy' : 'neutral',
        hasLaughter,
        isJoke,
        isOverlap: Math.random() > 0.95,
        isInterruption: Math.random() > 0.97,
      })

      this.chunkIndex++
      this.speakerIndex++

      // Random delay between 1.5 and 4 seconds
      const delay = 1500 + Math.random() * 2500
      this.intervalId = setTimeout(sendChunk, delay)
    }

    // Start after initial delay
    this.intervalId = setTimeout(sendChunk, 1000)
  }

  pause() {
    this.isPaused = true
    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }
  }

  resume() {
    if (this.isPaused) {
      this.isPaused = false
      if (this.callback) {
        // Resume sending chunks
        const sendChunk = () => {
          if (this.isPaused || !this.callback) return

          const conversation = mockConversations[this.conversationIndex]
          if (this.chunkIndex >= conversation.length) {
            this.conversationIndex = (this.conversationIndex + 1) % mockConversations.length
            this.chunkIndex = 0
            this.speakerIndex = 0
          }

          const text = conversation[this.chunkIndex]
          const speakerId = speakers[this.speakerIndex % speakers.length]
          const now = Date.now()

          // Add some variety to mock data
          const hasLaughter = Math.random() > 0.8 && (text.toLowerCase().includes('fun') || Math.random() > 0.9)
          const isJoke = Math.random() > 0.9
          const speed = Math.random() > 0.7 ? (Math.random() > 0.5 ? 'fast' : 'slow') : 'normal'

          this.callback({
            text,
            speakerId,
            timestamp: now,
            speed,
            emotion: hasLaughter ? 'happy' : 'neutral',
            hasLaughter,
            isJoke,
            isOverlap: Math.random() > 0.95,
            isInterruption: Math.random() > 0.97,
          })

          this.chunkIndex++
          this.speakerIndex++

          const delay = 1500 + Math.random() * 2500
          this.intervalId = setTimeout(sendChunk, delay)
        }

        this.intervalId = setTimeout(sendChunk, 1000)
      }
    }
  }

  stop() {
    this.isPaused = true
    if (this.intervalId) {
      clearTimeout(this.intervalId)
      this.intervalId = null
    }
    this.callback = null
  }
}
