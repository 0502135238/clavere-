import { CaptionChunk } from './types'

export interface SpeechRecognitionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  maxAlternatives?: number
}

export class SpeechRecognitionStream {
  private recognition: any = null
  private callback: ((chunk: CaptionChunk) => void) | null = null
  private isListening = false
  private currentSpeakerId: string | null = null
  private speakerCounter = 0
  private lastChunkTime = 0
  private speakerHistory: Array<{ speakerId: string; lastSpokeAt: number }> = []
  private readonly SPEAKER_TIMEOUT = 30000 // 30 seconds - if same person doesn't speak for 30s, might be new speaker
  private readonly PAUSE_THRESHOLD = 10000 // 10 seconds - pause vs new speaker threshold

  constructor(options: SpeechRecognitionOptions = {}) {
    if (typeof window === 'undefined') {
      throw new Error('Speech Recognition is only available in the browser')
    }

    // Check for browser support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      throw new Error('Speech Recognition is not supported in this browser')
    }

    this.recognition = new SpeechRecognition()
    this.recognition.lang = options.language || 'en-US'
    this.recognition.continuous = options.continuous !== false
    this.recognition.interimResults = options.interimResults !== false
    this.recognition.maxAlternatives = options.maxAlternatives || 1

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.recognition.onresult = (event: any) => {
      const result = event.results[event.resultIndex]
      const transcript = result[0].transcript
      const isFinal = result.isFinal

      if (isFinal && transcript.trim()) {
        const now = Date.now()
        const timeSinceLastChunk = now - this.lastChunkTime
        
        // Smart speaker detection:
        // - If no current speaker, assign first one
        // - If gap < 10 seconds, keep same speaker (just a pause)
        // - If gap > 30 seconds, might be new speaker (but still prefer keeping same if only one person)
        // - Only create new speaker if we have evidence of multiple people
        
        if (!this.currentSpeakerId) {
          // First speaker
          this.speakerCounter = 1
          this.currentSpeakerId = `speaker-${this.speakerCounter}`
          this.speakerHistory.push({ speakerId: this.currentSpeakerId, lastSpokeAt: now })
        } else if (timeSinceLastChunk > this.SPEAKER_TIMEOUT) {
          // Very long gap (30+ seconds) - might be new speaker, but be conservative
          // Only create new speaker if we've seen multiple distinct speakers before
          // For now, keep same speaker (single person scenario)
          // In a real multi-person scenario, Deepgram would handle this
          this.currentSpeakerId = this.currentSpeakerId // Keep same speaker
        } else if (timeSinceLastChunk > this.PAUSE_THRESHOLD) {
          // Medium gap (10-30 seconds) - likely just a pause, keep same speaker
          this.currentSpeakerId = this.currentSpeakerId
        }
        // Short gap (< 10 seconds) - definitely same speaker
        
        // Update speaker history
        const speakerEntry = this.speakerHistory.find(s => s.speakerId === this.currentSpeakerId)
        if (speakerEntry) {
          speakerEntry.lastSpokeAt = now
        }
        
        this.lastChunkTime = now

        if (this.callback) {
          this.callback({
            text: transcript.trim(),
            speakerId: this.currentSpeakerId,
            timestamp: Date.now(),
            speed: 'normal',
            emotion: 'neutral',
          })
        }
      }
    }

    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
      // Auto-restart on certain errors
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        if (this.isListening) {
          setTimeout(() => {
            try {
              this.recognition.start()
            } catch (e) {
              // Already started, ignore
            }
          }, 1000)
        }
      }
    }

    this.recognition.onend = () => {
      // Auto-restart if still listening
      if (this.isListening) {
        setTimeout(() => {
          try {
            this.recognition.start()
          } catch (e) {
            // Already started, ignore
          }
        }, 100)
      }
    }
  }

  start(callback: (chunk: CaptionChunk) => void) {
    if (this.isListening) {
      return
    }

    this.callback = callback
    this.isListening = true

    try {
      this.recognition.start()
    } catch (e) {
      console.error('Failed to start recognition:', e)
      throw new Error('Failed to start speech recognition. Please check microphone permissions.')
    }
  }

  pause() {
    if (!this.isListening) {
      return
    }

    this.isListening = false
    try {
      this.recognition.stop()
    } catch (e) {
      // Already stopped, ignore
    }
  }

  resume() {
    if (this.isListening) {
      return
    }

    this.isListening = true
    try {
      this.recognition.start()
    } catch (e) {
      console.error('Failed to resume recognition:', e)
    }
  }

  stop() {
    this.isListening = false
    this.callback = null
    try {
      this.recognition.stop()
    } catch (e) {
      // Already stopped, ignore
    }
  }

  setLanguage(language: string) {
    if (this.recognition) {
      this.recognition.lang = language
    }
  }

  isSupported(): boolean {
    if (typeof window === 'undefined') {
      return false
    }
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    return !!SpeechRecognition
  }
}

export function checkMicrophonePermission(): Promise<boolean> {
  return navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      stream.getTracks().forEach((track) => track.stop())
      return true
    })
    .catch(() => false)
}

export function requestMicrophonePermission(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ audio: true })
}
