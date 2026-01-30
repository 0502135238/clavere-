#!/usr/bin/env node
/**
 * Sync environment variables from .env.local to Vercel
 * This script reads .env.local and automatically sets all variables in Vercel
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const ENV_FILE = path.join(process.cwd(), '.env.local')
const REQUIRED_VARS = [
  'NEXT_PUBLIC_DEEPGRAM_API_KEY',
  'NEXT_PUBLIC_OPENAI_API_KEY',
  'NEXT_PUBLIC_AI_SERVICE',
  'NEXT_PUBLIC_LANGUAGE',
]

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function readEnvFile() {
  if (!fs.existsSync(ENV_FILE)) {
    log(`❌ .env.local not found at ${ENV_FILE}`, 'red')
    log('\nPlease create .env.local with your API keys:', 'yellow')
    log('  NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-key', 'cyan')
    log('  NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key', 'cyan')
    log('  NEXT_PUBLIC_AI_SERVICE=deepgram', 'cyan')
    log('  NEXT_PUBLIC_LANGUAGE=en-US', 'cyan')
    process.exit(1)
  }

  const content = fs.readFileSync(ENV_FILE, 'utf-8')
  const vars = {}

  content.split('\n').forEach((line) => {
    line = line.trim()
    // Skip comments and empty lines
    if (!line || line.startsWith('#')) return

    const match = line.match(/^([^=]+)=(.*)$/)
    if (match) {
      const key = match[1].trim()
      let value = match[2].trim()
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }

      vars[key] = value
    }
  })

  return vars
}

function checkVercelLogin() {
  try {
    const output = execSync('vercel whoami', { encoding: 'utf-8', stdio: 'pipe' })
    log(`✓ Logged in as: ${output.trim()}`, 'green')
    return true
  } catch (error) {
    log('❌ Not logged in to Vercel', 'red')
    log('\nPlease run: vercel login', 'yellow')
    return false
  }
}

function setVercelEnv(varName, varValue, environment = 'production') {
  try {
    // Use echo to pipe the value to vercel env add
    // This avoids interactive prompts
    const command = `echo ${JSON.stringify(varValue)} | vercel env add ${varName} ${environment} --force`
    execSync(command, { 
      encoding: 'utf-8', 
      stdio: ['pipe', 'pipe', 'pipe'],
      input: varValue + '\n'
    })
    return true
  } catch (error) {
    // Try alternative method if the first fails
    try {
      const command = `vercel env add ${varName} ${environment} --force`
      execSync(command, {
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe'],
        input: varValue + '\n'
      })
      return true
    } catch (error2) {
      log(`  ⚠️  Failed to set ${varName} for ${environment}`, 'yellow')
      return false
    }
  }
}

function syncEnvVars() {
  log('\n🔧 Syncing environment variables to Vercel...\n', 'cyan')

  const envVars = readEnvFile()
  const environments = ['production', 'preview', 'development']

  // Auto-detect service if not set
  if (!envVars.NEXT_PUBLIC_AI_SERVICE) {
    if (envVars.NEXT_PUBLIC_DEEPGRAM_API_KEY) {
      envVars.NEXT_PUBLIC_AI_SERVICE = 'deepgram'
      log('✓ Auto-detected: NEXT_PUBLIC_AI_SERVICE=deepgram', 'green')
    } else {
      envVars.NEXT_PUBLIC_AI_SERVICE = 'webspeech'
      log('⚠️  No Deepgram key found, defaulting to webspeech', 'yellow')
    }
  }

  // Set default language if not set
  if (!envVars.NEXT_PUBLIC_LANGUAGE) {
    envVars.NEXT_PUBLIC_LANGUAGE = 'en-US'
  }

  let successCount = 0
  let failCount = 0

  // Sync all variables to all environments
  for (const [key, value] of Object.entries(envVars)) {
    // Only sync NEXT_PUBLIC_* variables
    if (!key.startsWith('NEXT_PUBLIC_')) {
      continue
    }

    // Skip empty values
    if (!value || value.trim() === '') {
      log(`⏭️  Skipping ${key} (empty value)`, 'yellow')
      continue
    }

    // Skip placeholder values
    if (value.includes('paste-your') || value.includes('your-key-here') || value.includes('your-')) {
      log(`⏭️  Skipping ${key} (placeholder value)`, 'yellow')
      continue
    }

    log(`\n📝 Setting ${key}...`, 'blue')
    
    for (const env of environments) {
      const success = setVercelEnv(key, value, env)
      if (success) {
        log(`  ✓ ${env}`, 'green')
        successCount++
      } else {
        log(`  ✗ ${env}`, 'red')
        failCount++
      }
    }
  }

  log('\n' + '='.repeat(50), 'cyan')
  log(`✅ Sync complete!`, 'green')
  log(`   Success: ${successCount}`, 'green')
  if (failCount > 0) {
    log(`   Failed: ${failCount}`, 'yellow')
  }
  log('='.repeat(50) + '\n', 'cyan')

  // Verify variables were set
  log('🔍 Verifying environment variables...\n', 'cyan')
  try {
    const output = execSync('vercel env ls', { encoding: 'utf-8' })
    log(output, 'reset')
  } catch (error) {
    log('⚠️  Could not list environment variables', 'yellow')
  }
}

// Main execution
function main() {
  log('\n' + '='.repeat(50), 'cyan')
  log('  CLAVERE - Vercel Environment Sync', 'cyan')
  log('='.repeat(50) + '\n', 'cyan')

  // Check Vercel login
  if (!checkVercelLogin()) {
    process.exit(1)
  }

  // Sync environment variables
  syncEnvVars()

  log('💡 Next steps:', 'yellow')
  log('   1. Variables are now set in Vercel', 'reset')
  log('   2. Redeploy your app: vercel --prod', 'reset')
  log('   3. Or wait for automatic deployment on next git push\n', 'reset')
}

main()
