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
        // Detect speaker change (simplified - in production, use diarization)
        const now = Date.now()
        if (now - this.lastChunkTime > 2000) {
          // New speaker if gap > 2 seconds
          this.speakerCounter++
          this.currentSpeakerId = `speaker-${this.speakerCounter}`
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
