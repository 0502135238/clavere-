#!/usr/bin/env node

/**
 * Automated GitHub repo creation using GitHub CLI
 * Requires: gh CLI installed and authenticated
 * Install: https://cli.github.com/
 */

const { execSync } = require('child_process')

console.log('🚀 CLAVERE - Automated GitHub Repo Creation\n')

// Check if gh CLI is installed
try {
  execSync('gh --version', { stdio: 'ignore' })
} catch (e) {
  console.error('❌ GitHub CLI (gh) not found!')
  console.error('\nInstall it from: https://cli.github.com/')
  console.error('\nOr create repo manually:')
  console.error('1. Go to: https://github.com/new')
  console.error('2. Name: clavare')
  console.error('3. Set to: Private')
  console.error('4. Create repository')
  process.exit(1)
}

// Check if authenticated
try {
  execSync('gh auth status', { stdio: 'ignore' })
} catch (e) {
  console.error('❌ Not authenticated with GitHub!')
  console.error('\nRun: gh auth login')
  process.exit(1)
}

// Create private repo
const repoName = process.argv[2] || 'clavare'

console.log(`📦 Creating private GitHub repository: ${repoName}...`)

try {
  // Create repo
  execSync(`gh repo create ${repoName} --private --source=. --remote=origin --push`, {
    stdio: 'inherit'
  })
  
  console.log('\n✅ Repository created and pushed!')
  console.log(`\n🔗 URL: https://github.com/${execSync('gh api user -q .login', { encoding: 'utf-8' }).trim()}/${repoName}`)
  console.log('\n📤 Next: Deploy to Vercel')
  console.log('   Go to: https://vercel.com/new')
  console.log('   Import your repository')
  
} catch (error) {
  console.error('\n❌ Error creating repository')
  console.error('Make sure the repo name is available and you have permissions')
  process.exit(1)
}
