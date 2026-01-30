/**
 * Deepgram Real-time Speech-to-Text Service
 * Provides speaker diarization, overlap detection, and real-time transcription
 */

import { CaptionChunk } from './types'

export interface DeepgramConfig {
  apiKey: string
  language?: string
  model?: string
  diarize?: boolean
  punctuate?: boolean
  interim_results?: boolean
}

export interface DeepgramTranscript {
  channel: {
    alternatives: Array<{
      transcript: string
      words: Array<{
        word: string
        start: number
        end: number
        speaker?: number
        confidence: number
      }>
    }>
  }
  is_final: boolean
  speech_final: boolean
}

export class DeepgramService {
  private config: DeepgramConfig
  private socket: WebSocket | null = null
  private mediaRecorder: MediaRecorder | null = null
  private audioStream: MediaStream | null = null
  private isConnected = false
  private speakers: Map<number, string> = new Map()
  private speakerCounter = 0

  constructor(config: DeepgramConfig) {
    this.config = {
      language: 'en-US',
      model: 'nova-2',
      diarize: true,
      punctuate: true,
      interim_results: true,
      ...config,
    }
  }

  /**
   * Initialize and connect to Deepgram
   */
  async initialize(): Promise<void> {
    // Get microphone access
    this.audioStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: true,
        noiseSuppression: true,
      },
    })

    // Connect to Deepgram WebSocket
    const wsUrl = `wss://api.deepgram.com/v1/listen?` +
      `language=${this.config.language}&` +
      `model=${this.config.model}&` +
      `diarize=${this.config.diarize}&` +
      `punctuate=${this.config.punctuate}&` +
      `interim_results=${this.config.interim_results}`

    this.socket = new WebSocket(wsUrl, ['token', this.config.apiKey])

    return new Promise((resolve, reject) => {
      if (!this.socket) {
        reject(new Error('Failed to create WebSocket'))
        return
      }

      this.socket.onopen = () => {
        this.isConnected = true
        this.startAudioStream()
        resolve()
      }

      this.socket.onerror = (error) => {
        reject(new Error(`Deepgram connection error: ${error}`))
      }

      this.socket.onclose = () => {
        this.isConnected = false
      }
    })
  }

  /**
   * Start streaming audio to Deepgram
   */
  private startAudioStream(): void {
    if (!this.audioStream || !this.socket) return

    // Create MediaRecorder for audio streaming
    const options: MediaRecorderOptions = {
      mimeType: 'audio/webm',
      audioBitsPerSecond: 16000,
    }

    this.mediaRecorder = new MediaRecorder(this.audioStream, options)

    this.mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && this.socket?.readyState === WebSocket.OPEN) {
        this.socket.send(event.data)
      }
    }

    // Send audio chunks every 250ms
    this.mediaRecorder.start(250)
  }

  /**
   * Start transcription with callbacks
   */
  start(
    onTranscript: (chunk: CaptionChunk) => void,
    onError?: (error: Error) => void
  ): void {
    if (!this.socket) {
      throw new Error('Service not initialized. Call initialize() first.')
    }

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as DeepgramTranscript

        if (data.channel?.alternatives?.[0]) {
          const transcript = data.channel.alternatives[0]
          const text = transcript.transcript.trim()

          if (text && (data.is_final || data.speech_final)) {
            // Get speaker ID from words
            const words = transcript.words || []
            const speakerId = this.getSpeakerId(words)

            // Detect overlaps (multiple speakers in same segment)
            const uniqueSpeakers = new Set(
              words.map((w) => w.speaker).filter((s) => s !== undefined)
            )
            const isOverlap = uniqueSpeakers.size > 1

            const chunk: CaptionChunk = {
              text,
              speakerId,
              timestamp: Date.now(),
              isOverlap,
              speed: 'normal',
              emotion: 'neutral',
            }

            onTranscript(chunk)
          }
        }
      } catch (error) {
        if (onError) {
          onError(error as Error)
        }
      }
    }

    this.socket.onerror = (error) => {
      if (onError) {
        onError(new Error('Deepgram WebSocket error'))
      }
    }
  }

  /**
   * Get or create speaker ID from Deepgram speaker number
   */
  private getSpeakerId(words: Array<{ speaker?: number }>): string {
    const speakerNum = words.find((w) => w.speaker !== undefined)?.speaker

    if (speakerNum === undefined) {
      return 'unknown'
    }

    if (!this.speakers.has(speakerNum)) {
      this.speakerCounter++
      this.speakers.set(speakerNum, `speaker-${this.speakerCounter}`)
    }

    return this.speakers.get(speakerNum) || 'unknown'
  }

  /**
   * Stop transcription
   */
  stop(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop()
    }

    if (this.socket) {
      this.socket.close()
    }

    if (this.audioStream) {
      this.audioStream.getTracks().forEach((track) => track.stop())
    }

    this.isConnected = false
  }

  /**
   * Check if connected
   */
  isReady(): boolean {
    return this.isConnected && this.socket?.readyState === WebSocket.OPEN
  }
}
