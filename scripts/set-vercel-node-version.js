#!/usr/bin/env node

/**
 * Automatically set Node.js version in Vercel project settings
 * Uses Vercel API to update project configuration
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Setting Node.js version in Vercel project settings...\n');

try {
  // Check if vercel CLI is installed and logged in
  try {
    execSync('vercel whoami', { stdio: 'pipe' });
  } catch {
    console.error('❌ Not logged in to Vercel. Please run: vercel login');
    process.exit(1);
  }

  // Get project info
  console.log('📦 Getting project information...');
  let projectInfo;
  try {
    const output = execSync('vercel inspect --json', { encoding: 'utf8', stdio: 'pipe' });
    projectInfo = JSON.parse(output);
  } catch (error) {
    console.log('⚠️  Could not get project info, trying alternative method...');
    // Try to get from vercel.json
    const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
    projectInfo = { name: vercelJson.name || 'clavere' };
  }

  console.log(`✅ Project: ${projectInfo.name || 'clavere'}`);

  // Update vercel.json with explicit Node.js version
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
  
  vercelConfig.nodeVersion = '20.x';
  
  fs.writeFileSync(
    vercelJsonPath,
    JSON.stringify(vercelConfig, null, 2) + '\n'
  );
  
  console.log('✅ Updated vercel.json with nodeVersion: 20.x');

  // Deploy to apply the changes
  console.log('\n📤 Deploying to Vercel to apply Node.js version...');
  console.log('   This will update the project settings automatically.\n');
  
  try {
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('\n✅ Deployment complete!');
    console.log('✅ Node.js version should now be set to 20.x in Vercel');
  } catch (error) {
    console.log('\n⚠️  Deployment had issues, but vercel.json is updated.');
    console.log('   Next deployment will use Node.js 20.x');
    console.log('\n💡 You can also manually set it in Vercel dashboard:');
    console.log('   Settings → General → Node.js Version → 20.x');
  }
  
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}
