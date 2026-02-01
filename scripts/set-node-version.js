#!/usr/bin/env node

/**
 * Set Node.js version in Vercel project settings
 * Uses Vercel CLI to update project configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting Node.js version in Vercel...\n');

try {
  // Check if vercel CLI is installed
  try {
    execSync('vercel --version', { stdio: 'ignore' });
  } catch {
    console.error('❌ Vercel CLI not found. Installing...');
    execSync('npm install -g vercel', { stdio: 'inherit' });
  }

  // Read package.json to get Node version
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );
  const nodeVersion = packageJson.engines?.node || '>=20.9.0';
  
  console.log(`📦 Node.js version from package.json: ${nodeVersion}`);
  
  // Update vercel.json with explicit Node.js version
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  let vercelConfig = {};
  
  if (fs.existsSync(vercelJsonPath)) {
    vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  }
  
  // Set Node.js version in vercel.json
  vercelConfig.nodeVersion = '20.x';
  
  fs.writeFileSync(
    vercelJsonPath,
    JSON.stringify(vercelConfig, null, 2) + '\n'
  );
  
  console.log('✅ Updated vercel.json with Node.js 20.x');
  
  // Try to update via Vercel API if possible
  console.log('\n📤 Deploying to update Vercel settings...');
  console.log('   (Vercel will use Node.js version from vercel.json)');
  
  // Deploy to production to apply changes
  try {
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('\n✅ Deployment complete! Node.js version should be set to 20.x');
  } catch (error) {
    console.log('\n⚠️  Deployment failed, but vercel.json is updated.');
    console.log('   Next deployment will use Node.js 20.x');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
