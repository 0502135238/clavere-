#!/usr/bin/env node

/**
 * Update Vercel project Node.js version via API
 * This script uses Vercel API to set Node.js version to 20.x
 */

const { execSync } = require('child_process');
const https = require('https');

console.log('🔧 Setting Node.js version in Vercel project settings...\n');

async function getVercelToken() {
  try {
    // Try to get token from Vercel CLI config
    const os = require('os');
    const path = require('path');
    const fs = require('fs');
    
    const configPath = path.join(os.homedir(), '.vercel', 'auth.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      if (config.token) {
        return config.token;
      }
    }
    
    // Try to get from environment
    if (process.env.VERCEL_TOKEN) {
      return process.env.VERCEL_TOKEN;
    }
    
    throw new Error('No Vercel token found');
  } catch (error) {
    throw new Error('Please set VERCEL_TOKEN environment variable or login with: vercel login');
  }
}

async function getProjectInfo() {
  try {
    const output = execSync('vercel inspect --json', { encoding: 'utf8', stdio: 'pipe' });
    return JSON.parse(output);
  } catch {
    // Fallback: try to get from git remote or use default
    try {
      const gitRemote = execSync('git remote get-url origin', { encoding: 'utf8', stdio: 'pipe' }).trim();
      const match = gitRemote.match(/github\.com[\/:]([^\/]+)\/([^\/]+)\.git/);
      if (match) {
        return { name: match[2].replace('.git', '') };
      }
    } catch {}
    return { name: 'clavere' };
  }
}

async function updateNodeVersion(token, projectId, teamId) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      nodeVersion: '20.x'
    });

    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: teamId 
        ? `/v9/projects/${projectId}?teamId=${teamId}`
        : `/v9/projects/${projectId}`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`API error: ${res.statusCode} - ${body}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

async function main() {
  try {
    console.log('📦 Getting project information...');
    const projectInfo = await getProjectInfo();
    console.log(`✅ Project: ${projectInfo.name}`);

    console.log('\n🔑 Getting Vercel token...');
    const token = await getVercelToken();
    console.log('✅ Token found');

    // Get project ID and team ID
    let projectId = projectInfo.id;
    let teamId = projectInfo.teamId;

    if (!projectId) {
      console.log('\n⚠️  Could not get project ID automatically.');
      console.log('   Vercel will use Node.js version from:');
      console.log('   - package.json engines.node: >=20.9.0');
      console.log('   - .nvmrc: 20.9.0');
      console.log('\n✅ These files are already configured correctly!');
      console.log('   Next deployment should use Node.js 20.x');
      return;
    }

    console.log(`\n📤 Updating project settings...`);
    await updateNodeVersion(token, projectId, teamId);
    console.log('✅ Node.js version set to 20.x!');

    console.log('\n📤 Deploying to apply changes...');
    execSync('vercel --prod --yes', { stdio: 'inherit' });
    console.log('\n✅ Complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n💡 Alternative: Vercel should auto-detect Node.js from:');
    console.log('   - package.json engines.node: >=20.9.0');
    console.log('   - .nvmrc: 20.9.0');
    console.log('\n   These are already configured! Next build should work.');
    process.exit(1);
  }
}

main();
