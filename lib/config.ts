/**
 * Configuration helper
 * Reads environment variables and provides defaults
 */

export interface AppConfig {
  deepgramApiKey: string | undefined
  openaiApiKey: string | undefined
  assemblyaiApiKey: string | undefined
  aiService: 'deepgram' | 'assemblyai' | 'webspeech' | 'mock'
  language: string
}

/**
 * Get app configuration from environment variables
 */
export function getAppConfig(): AppConfig {
  const deepgramKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
  const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
  const assemblyaiKey = process.env.NEXT_PUBLIC_ASSEMBLYAI_API_KEY
  const serviceType = process.env.NEXT_PUBLIC_AI_SERVICE as AppConfig['aiService']
  const language = process.env.NEXT_PUBLIC_LANGUAGE || 'en-US'

  // Auto-detect service if not specified
  let aiService: AppConfig['aiService'] = serviceType || 'webspeech'
  
  if (!serviceType) {
    // Auto-select based on available keys
    if (deepgramKey && deepgramKey !== 'paste-your-deepgram-api-key-here' && deepgramKey.length > 10) {
      aiService = 'deepgram'
    } else if (assemblyaiKey && assemblyaiKey !== 'paste-your-assemblyai-api-key-here' && assemblyaiKey.length > 10) {
      aiService = 'assemblyai'
    } else {
      aiService = 'webspeech'
    }
  }

  return {
    deepgramApiKey: deepgramKey && deepgramKey !== 'paste-your-deepgram-api-key-here' ? deepgramKey : undefined,
    openaiApiKey: openaiKey && openaiKey !== 'paste-your-openai-api-key-here' ? openaiKey : undefined,
    assemblyaiApiKey: assemblyaiKey && assemblyaiKey !== 'paste-your-assemblyai-api-key-here' ? assemblyaiKey : undefined,
    aiService,
    language,
  }
}

/**
 * Check if API keys are configured
 */
export function checkApiKeys(): {
  deepgram: boolean
  openai: boolean
  assemblyai: boolean
  hasAny: boolean
} {
  const config = getAppConfig()
  
  return {
    deepgram: !!config.deepgramApiKey,
    openai: !!config.openaiApiKey,
    assemblyai: !!config.assemblyaiApiKey,
    hasAny: !!(config.deepgramApiKey || config.openaiApiKey || config.assemblyaiApiKey),
  }
}
