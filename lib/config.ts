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
  
  // Validate Deepgram key
  const hasValidDeepgramKey = deepgramKey && 
    deepgramKey !== 'paste-your-deepgram-api-key-here' && 
    deepgramKey.length > 10 &&
    !deepgramKey.includes('your-key-here')
  
  // Validate AssemblyAI key
  const hasValidAssemblyKey = assemblyaiKey && 
    assemblyaiKey !== 'paste-your-assemblyai-api-key-here' && 
    assemblyaiKey.length > 10 &&
    !assemblyaiKey.includes('your-key-here')
  
  if (!serviceType) {
    // Auto-select based on available keys (prioritize Deepgram)
    if (hasValidDeepgramKey) {
      aiService = 'deepgram'
    } else if (hasValidAssemblyKey) {
      aiService = 'assemblyai'
    } else {
      aiService = 'webspeech'
    }
  } else if (serviceType === 'deepgram' && !hasValidDeepgramKey) {
    // If explicitly set to deepgram but key is invalid, fall back to webspeech
    console.warn('⚠️ Deepgram selected but API key invalid, falling back to Web Speech API')
    aiService = 'webspeech'
  }
  
  // Log configuration for debugging
  if (typeof window !== 'undefined') {
    console.log('🔧 Service Configuration:', {
      requested: serviceType || 'auto',
      selected: aiService,
      hasDeepgramKey: hasValidDeepgramKey,
      hasAssemblyKey: hasValidAssemblyKey,
      deepgramKeyLength: deepgramKey?.length || 0,
    })
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
