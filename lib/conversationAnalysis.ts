import { CaptionChunk, ConversationEvent, ConversationSummary, GroupFeedback } from './types'

export class ConversationAnalyzer {
  private chunks: CaptionChunk[] = []
  private speakers: Map<string, number> = new Map() // speakerId -> lastSpokeAt
  private lastSpeakerId: string | null = null
  private lastTopicChunk: string | null = null
  private recentChunks: CaptionChunk[] = []
  private readonly MAX_HISTORY = 20

  analyzeChunk(chunk: CaptionChunk): ConversationEvent[] {
    const events: ConversationEvent[] = []
    this.chunks.push(chunk)
    this.recentChunks.push(chunk)
    if (this.recentChunks.length > this.MAX_HISTORY) {
      this.recentChunks.shift()
    }

    // Detect new speaker
    if (chunk.speakerId && chunk.speakerId !== this.lastSpeakerId && this.lastSpeakerId !== null) {
      events.push({
        type: 'new-speaker',
        timestamp: chunk.timestamp,
        speakerId: chunk.speakerId,
        message: 'New speaker',
      })
    }

    // Detect overlap (two speakers within 1 second)
    if (this.chunks.length >= 2) {
      const prevChunk = this.chunks[this.chunks.length - 2]
      if (
        prevChunk.speakerId &&
        chunk.speakerId &&
        prevChunk.speakerId !== chunk.speakerId &&
        chunk.timestamp - prevChunk.timestamp < 1000
      ) {
        events.push({
          type: 'overlap',
          timestamp: chunk.timestamp,
          speakerId: chunk.speakerId,
          message: 'Two people talking at once',
        })
      }
    }

    // Detect interruption (very quick speaker change)
    if (this.chunks.length >= 2) {
      const prevChunk = this.chunks[this.chunks.length - 2]
      if (
        prevChunk.speakerId &&
        chunk.speakerId &&
        prevChunk.speakerId !== chunk.speakerId &&
        chunk.timestamp - prevChunk.timestamp < 500
      ) {
        events.push({
          type: 'interruption',
          timestamp: chunk.timestamp,
          speakerId: chunk.speakerId,
          message: 'Interruption detected',
        })
      }
    }

    // Detect laughter/jokes (simple keyword detection for demo)
    const lowerText = chunk.text.toLowerCase()
    if (lowerText.includes('haha') || lowerText.includes('lol') || lowerText.includes('😄') || lowerText.includes('😂')) {
      events.push({
        type: 'laughter',
        timestamp: chunk.timestamp,
        speakerId: chunk.speakerId,
        message: 'Laughter detected',
      })
    }

    if (lowerText.includes('joke') || lowerText.includes('funny') || lowerText.includes('hilarious')) {
      events.push({
        type: 'joke',
        timestamp: chunk.timestamp,
        speakerId: chunk.speakerId,
        message: 'Joke detected',
      })
    }

    // Detect topic change (simplified: if text is very different from last topic chunk)
    if (this.lastTopicChunk && this.chunks.length > 5) {
      const words = chunk.text.toLowerCase().split(/\s+/)
      const lastWords = this.lastTopicChunk.toLowerCase().split(/\s+/)
      const commonWords = words.filter((w) => lastWords.includes(w))
      if (commonWords.length / Math.max(words.length, lastWords.length) < 0.2) {
        events.push({
          type: 'topic-change',
          timestamp: chunk.timestamp,
          speakerId: chunk.speakerId,
          message: 'Topic changed',
        })
        this.lastTopicChunk = chunk.text
      }
    } else {
      this.lastTopicChunk = chunk.text
    }

    // Update speaker tracking
    if (chunk.speakerId) {
      this.speakers.set(chunk.speakerId, chunk.timestamp)
      this.lastSpeakerId = chunk.speakerId
    }

    return events
  }

  generateSummary(chunks: CaptionChunk[]): ConversationSummary {
    if (chunks.length === 0) {
      return {
        summary: 'No conversation yet',
        mainSpeaker: null,
        keyPoints: [],
        reactions: [],
        timestamp: Date.now(),
      }
    }

    const recent = chunks.slice(-5) // Last 5 chunks
    const speakers = new Map<string, number>()
    let mainSpeaker: string | null = null
    let maxCount = 0

    recent.forEach((chunk) => {
      if (chunk.speakerId) {
        const count = (speakers.get(chunk.speakerId) || 0) + 1
        speakers.set(chunk.speakerId, count)
        if (count > maxCount) {
          maxCount = count
          mainSpeaker = chunk.speakerId
        }
      }
    })

    const keyPoints = recent
      .filter((c) => c.text.length > 20)
      .map((c) => c.text)
      .slice(0, 3)

    const reactions: string[] = []
    recent.forEach((chunk) => {
      if (chunk.hasLaughter) reactions.push('Laughter')
      if (chunk.isJoke) reactions.push('Joke')
      if (chunk.isOverlap) reactions.push('Overlap')
    })

    const summary = `Recent conversation: ${recent
      .map((c) => c.text)
      .join(' ')
      .substring(0, 150)}...`

    return {
      summary,
      mainSpeaker,
      keyPoints,
      reactions,
      timestamp: Date.now(),
    }
  }

  checkGroupFeedback(): GroupFeedback[] {
    const feedbacks: GroupFeedback[] = []
    const now = Date.now()
    const TWO_MINUTES = 120000

    // Check for overlap
    if (this.chunks.length >= 2) {
      const lastTwo = this.chunks.slice(-2)
      if (
        lastTwo[0].speakerId &&
        lastTwo[1].speakerId &&
        lastTwo[0].speakerId !== lastTwo[1].speakerId &&
        lastTwo[1].timestamp - lastTwo[0].timestamp < 1000
      ) {
        feedbacks.push({
          type: 'overlap',
          message: 'Two people talking at once',
          timestamp: now,
          severity: 'medium',
        })
      }
    }

    // Check for exclusion (speaker hasn't spoken in 2 minutes)
    const activeSpeakers = Array.from(this.speakers.entries())
    activeSpeakers.forEach(([speakerId, lastSpokeAt]) => {
      if (now - lastSpokeAt > TWO_MINUTES && this.speakers.size > 1) {
        feedbacks.push({
          type: 'exclusion',
          message: "Someone hasn't been included for 2 minutes",
          timestamp: now,
          severity: 'low',
        })
      }
    })

    // Check for turn-taking issues
    if (this.chunks.length > 5) {
      const recentSpeakers = this.chunks
        .slice(-5)
        .map((c) => c.speakerId)
        .filter((id) => id !== null)
      const uniqueSpeakers = new Set(recentSpeakers)
      if (uniqueSpeakers.size === 1 && this.speakers.size > 1) {
        feedbacks.push({
          type: 'turn-taking',
          message: 'Turn-taking recommended',
          timestamp: now,
          severity: 'low',
        })
      }
    }

    return feedbacks
  }

  getRecentChunks(): CaptionChunk[] {
    return this.recentChunks
  }
}
