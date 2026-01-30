import { CaptionChunk } from './types'

/**
 * AI-powered transcription service
 * Handles multiple speakers, overlapping speech, and context understanding
 */

export interface AITranscriptionOptions {
  language?: string
  enableDiarization?: boolean
  enableContext?: boolean
}

export interface TranscriptionResult {
  chunks: CaptionChunk[]
  speakers: Map<string, { id: string; label: string; confidence: number }>
  context?: {
    topic?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
    keywords?: string[]
  }
  overlaps?: Array<{
    speaker1: string
    speaker2: string
    timestamp: number
  }>
}

export class AITranscriptionService {
  private options: AITranscriptionOptions
  private audioContext: AudioContext | null = null
  private mediaStream: MediaStream | null = null
  private recognition: any = null
  private speakers: Map<string, { id: string; label: string; confidence: number }> = new Map()
  private conversationContext: string[] = []
  private lastSpeakerId: string | null = null
  private speakerCounter = 0

  constructor(options: AITranscriptionOptions = {}) {
    this.options = {
      language: 'en-US',
      enableDiarization: true,
      enableContext: true,
      ...options,
    }
  }

  /**
   * Initialize audio capture and processing
   */
  async initialize(): Promise<void> {
    if (typeof window === 'undefined') {
      throw new Error('AI Transcription requires browser environment')
    }

    // Get microphone access
    this.mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true })

    // Set up audio context for analysis
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

    // Initialize speech recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      throw new Error('Speech Recognition not supported')
    }

    this.recognition = new SpeechRecognition()
    this.recognition.lang = this.options.language || 'en-US'
    this.recognition.continuous = true
    this.recognition.interimResults = true
    this.recognition.maxAlternatives = 3
  }

  /**
   * Detect speaker changes using audio analysis
   */
  private detectSpeakerChange(audioData: Float32Array): string | null {
    // Simplified speaker detection based on audio characteristics
    // In production, use proper speaker diarization (Deepgram, AssemblyAI, etc.)
    
    const energy = this.calculateEnergy(audioData)
    const zeroCrossingRate = this.calculateZeroCrossingRate(audioData)
    
    // Create speaker signature
    const signature = `${energy.toFixed(2)}-${zeroCrossingRate.toFixed(2)}`
    
    // Check if this matches a known speaker
    let matchedSpeaker: string | null = null
    for (const [id, data] of this.speakers.entries()) {
      // Simplified matching - in production use ML models
      if (Math.abs(parseFloat(signature.split('-')[0]) - parseFloat(data.label)) < 0.1) {
        matchedSpeaker = id
        break
      }
    }

    if (!matchedSpeaker) {
      // New speaker detected
      this.speakerCounter++
      matchedSpeaker = `speaker-${this.speakerCounter}`
      this.speakers.set(matchedSpeaker, {
        id: matchedSpeaker,
        label: `Speaker ${this.speakerCounter}`,
        confidence: 0.7,
      })
    }

    return matchedSpeaker
  }

  /**
   * Calculate audio energy
   */
  private calculateEnergy(audioData: Float32Array): number {
    let sum = 0
    for (let i = 0; i < audioData.length; i++) {
      sum += audioData[i] * audioData[i]
    }
    return Math.sqrt(sum / audioData.length)
  }

  /**
   * Calculate zero crossing rate
   */
  private calculateZeroCrossingRate(audioData: Float32Array): number {
    let crossings = 0
    for (let i = 1; i < audioData.length; i++) {
      if ((audioData[i - 1] >= 0 && audioData[i] < 0) || (audioData[i - 1] < 0 && audioData[i] >= 0)) {
        crossings++
      }
    }
    return crossings / audioData.length
  }

  /**
   * Detect overlapping speech
   */
  private detectOverlaps(chunks: CaptionChunk[]): Array<{ speaker1: string; speaker2: string; timestamp: number }> {
    const overlaps: Array<{ speaker1: string; speaker2: string; timestamp: number }> = []
    
    for (let i = 1; i < chunks.length; i++) {
      const prev = chunks[i - 1]
      const curr = chunks[i]
      
      // If two different speakers within 500ms, likely overlap
      if (
        prev.speakerId &&
        curr.speakerId &&
        prev.speakerId !== curr.speakerId &&
        curr.timestamp - prev.timestamp < 500
      ) {
        overlaps.push({
          speaker1: prev.speakerId,
          speaker2: curr.speakerId,
          timestamp: curr.timestamp,
        })
      }
    }
    
    return overlaps
  }

  /**
   * Extract context from conversation
   */
  private extractContext(chunks: CaptionChunk[]): {
    topic?: string
    sentiment?: 'positive' | 'neutral' | 'negative'
    keywords?: string[]
  } {
    if (!this.options.enableContext) {
      return {}
    }

    // Get recent text
    const recentText = chunks
      .slice(-5)
      .map((c) => c.text)
      .join(' ')
      .toLowerCase()

    // Simple keyword extraction (in production, use NLP)
    const words = recentText.split(/\s+/).filter((w) => w.length > 4)
    const keywordCounts = new Map<string, number>()
    words.forEach((word) => {
      keywordCounts.set(word, (keywordCounts.get(word) || 0) + 1)
    })

    const keywords = Array.from(keywordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word)

    // Simple sentiment (in production, use sentiment analysis API)
    const positiveWords = ['good', 'great', 'excellent', 'love', 'happy', 'wonderful']
    const negativeWords = ['bad', 'terrible', 'hate', 'awful', 'sad', 'angry']
    
    let positiveCount = 0
    let negativeCount = 0
    
    positiveWords.forEach((word) => {
      if (recentText.includes(word)) positiveCount++
    })
    negativeWords.forEach((word) => {
      if (recentText.includes(word)) negativeCount++
    })

    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'
    if (positiveCount > negativeCount) sentiment = 'positive'
    if (negativeCount > positiveCount) sentiment = 'negative'

    return {
      keywords,
      sentiment,
    }
  }

  /**
   * Process transcription with AI enhancements
   */
  async processTranscription(
    text: string,
    timestamp: number,
    audioData?: Float32Array
  ): Promise<TranscriptionResult> {
    // Detect speaker
    let speakerId: string | null = null
    if (this.options.enableDiarization && audioData) {
      speakerId = this.detectSpeakerChange(audioData)
    } else {
      // Fallback: simple speaker detection based on gaps
      const now = Date.now()
      if (!this.lastSpeakerId || now - timestamp > 2000) {
        this.speakerCounter++
        speakerId = `speaker-${this.speakerCounter}`
        this.lastSpeakerId = speakerId
      } else {
        speakerId = this.lastSpeakerId
      }
    }

    // Create chunk
    const chunk: CaptionChunk = {
      text: text.trim(),
      speakerId,
      timestamp,
      speed: 'normal',
      emotion: 'neutral',
    }

    // Update conversation context
    this.conversationContext.push(text)
    if (this.conversationContext.length > 10) {
      this.conversationContext.shift()
    }

    // Build result
    const chunks = [chunk]
    const overlaps = this.detectOverlaps(chunks)
    const context = this.extractContext(chunks)

    return {
      chunks,
      speakers: this.speakers,
      context,
      overlaps,
    }
  }

  /**
   * Start transcription
   */
  start(
    onResult: (result: TranscriptionResult) => void,
    onError?: (error: Error) => void
  ): void {
    if (!this.recognition) {
      throw new Error('Service not initialized. Call initialize() first.')
    }

    this.recognition.onresult = async (event: any) => {
      try {
        const result = event.results[event.resultIndex]
        const transcript = result[0].transcript
        const isFinal = result.isFinal

        if (isFinal && transcript.trim()) {
          // Get audio data if available
          let audioData: Float32Array | undefined
          if (this.audioContext && this.mediaStream) {
            // In production, capture actual audio buffer
            // For now, we'll use a simplified approach
          }

          const result = await this.processTranscription(transcript, Date.now(), audioData)
          onResult(result)
        }
      } catch (error) {
        if (onError) {
          onError(error as Error)
        }
      }
    }

    this.recognition.onerror = (event: any) => {
      if (onError) {
        onError(new Error(`Speech recognition error: ${event.error}`))
      }
    }

    this.recognition.onend = () => {
      // Auto-restart
      try {
        this.recognition.start()
      } catch (e) {
        // Already started
      }
    }

    this.recognition.start()
  }

  /**
   * Stop transcription
   */
  stop(): void {
    if (this.recognition) {
      this.recognition.stop()
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop())
    }
    if (this.audioContext) {
      this.audioContext.close()
    }
  }

  /**
   * Get current speakers
   */
  getSpeakers(): Map<string, { id: string; label: string; confidence: number }> {
    return this.speakers
  }
}
