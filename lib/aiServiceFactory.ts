/**
 * AI Service Factory
 * Creates the appropriate AI service based on configuration
 */

import { DeepgramService, DeepgramConfig } from './deepgramService'
import { OpenAIContextService } from './openAIContext'
import { AITranscriptionService } from './aiTranscription'
import { SpeechRecognitionStream } from './speechRecognition'

export type AIServiceType = 'deepgram' | 'assemblyai' | 'whisper' | 'webspeech' | 'mock'

export interface AIServiceConfig {
  type: AIServiceType
  deepgramApiKey?: string
  openaiApiKey?: string
  assemblyaiApiKey?: string
  language?: string
}

/**
 * Factory to create AI services
 */
export class AIServiceFactory {
  /**
   * Create transcription service
   */
  static createTranscriptionService(config: AIServiceConfig) {
    switch (config.type) {
      case 'deepgram':
        if (!config.deepgramApiKey) {
          throw new Error('Deepgram API key required')
        }
        return new DeepgramService({
          apiKey: config.deepgramApiKey,
          language: config.language || 'en-US',
          diarize: true,
          punctuate: true,
        })

      case 'webspeech':
        return new SpeechRecognitionStream({
          language: config.language || 'en-US',
          continuous: true,
          interimResults: true,
        })

      case 'mock':
      default:
        // Fallback to placeholder (for development)
        return new AITranscriptionService({
          language: config.language || 'en-US',
          enableDiarization: true,
          enableContext: true,
        })
    }
  }

  /**
   * Create context service
   */
  static createContextService(config: AIServiceConfig) {
    if (config.openaiApiKey && config.openaiApiKey !== 'your-openai-api-key') {
      return new OpenAIContextService(config.openaiApiKey)
    }
    // Return null to use simple extraction
    return null
  }

  /**
   * Get available service types
   */
  static getAvailableServices(): AIServiceType[] {
    const services: AIServiceType[] = ['webspeech', 'mock']

    // Check for API keys in environment
    if (typeof window !== 'undefined') {
      // In browser, check localStorage or env
      const deepgramKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
      if (deepgramKey) services.push('deepgram')
    }

    return services
  }
}
