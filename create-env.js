#!/usr/bin/env node

/**
 * Script to create .env.local file with API key placeholders
 * Run: node create-env.js
 */

const fs = require('fs')
const path = require('path')

const envContent = `# CLAVERE - AI Services Configuration
# Paste your API keys below

# ============================================
# DEEPGRAM API KEY (Recommended)
# ============================================
# Get your free API key at: https://console.deepgram.com/
# Free tier: 12,000 minutes/month (200 hours)
# Features: Real-time transcription, speaker diarization, overlap detection
NEXT_PUBLIC_DEEPGRAM_API_KEY=paste-your-deepgram-api-key-here

# ============================================
# OPENAI API KEY (Optional - for better context)
# ============================================
# Get your API key at: https://platform.openai.com/api-keys
# Features: Advanced topic extraction, sentiment analysis, summarization
NEXT_PUBLIC_OPENAI_API_KEY=paste-your-openai-api-key-here

# ============================================
# AI SERVICE SELECTION
# ============================================
# Options: 'deepgram' (recommended), 'webspeech' (no API key needed), 'mock' (testing)
# If Deepgram key is set, it will auto-use Deepgram
NEXT_PUBLIC_AI_SERVICE=deepgram

# ============================================
# LANGUAGE SETTING
# ============================================
# Language code for transcription (en-US, es-ES, fr-FR, etc.)
NEXT_PUBLIC_LANGUAGE=en-US

# ============================================
# ASSEMBLYAI API KEY (Alternative to Deepgram)
# ============================================
# Get your API key at: https://www.assemblyai.com/
# Free tier: 5 hours/month
# Uncomment and use if you prefer AssemblyAI over Deepgram
# NEXT_PUBLIC_ASSEMBLYAI_API_KEY=paste-your-assemblyai-api-key-here
`

const envPath = path.join(process.cwd(), '.env.local')

if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!')
  console.log('   Opening it for you to edit...')
  console.log('   File location:', envPath)
} else {
  fs.writeFileSync(envPath, envContent, 'utf8')
  console.log('✅ Created .env.local file!')
  console.log('   Location:', envPath)
  console.log('')
  console.log('📝 Next steps:')
  console.log('   1. Open .env.local in your editor')
  console.log('   2. Replace "paste-your-deepgram-api-key-here" with your actual Deepgram API key')
  console.log('   3. (Optional) Replace "paste-your-openai-api-key-here" with your OpenAI API key')
  console.log('   4. Save the file')
  console.log('   5. Restart your dev server (npm run dev)')
  console.log('')
  console.log('🔑 Get your API keys:')
  console.log('   Deepgram: https://console.deepgram.com/')
  console.log('   OpenAI: https://platform.openai.com/api-keys')
}
