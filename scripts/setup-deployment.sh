#!/bin/bash

# CLAVERE - Automated Deployment Setup Script
# This script automates GitHub repo creation and Vercel deployment

set -e

echo "🚀 CLAVERE - Automated Deployment Setup"
echo "========================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "${BLUE}📦 Initializing git repository...${NC}"
    git init
    git branch -M main
    echo "${GREEN}✅ Git initialized${NC}"
else
    echo "${GREEN}✅ Git already initialized${NC}"
fi

# Check if .gitignore exists
if [ ! -f ".gitignore" ]; then
    echo "${YELLOW}⚠️  Creating .gitignore...${NC}"
    cat > .gitignore << EOF
# Dependencies
node_modules/
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
EOF
    echo "${GREEN}✅ .gitignore created${NC}"
fi

# Check if repo is already connected
if git remote | grep -q "origin"; then
    echo "${GREEN}✅ Git remote already configured${NC}"
    REMOTE_URL=$(git remote get-url origin)
    echo "   Remote: $REMOTE_URL"
else
    echo "${BLUE}📝 GitHub Repository Setup${NC}"
    echo ""
    echo "To create a private GitHub repo and push:"
    echo ""
    echo "1. Go to: https://github.com/new"
    echo "2. Repository name: clavare (or your choice)"
    echo "3. Set to: Private"
    echo "4. DO NOT initialize with README, .gitignore, or license"
    echo "5. Click 'Create repository'"
    echo ""
    read -p "Enter your GitHub username: " GITHUB_USER
    read -p "Enter repository name (default: clavare): " REPO_NAME
    REPO_NAME=${REPO_NAME:-clavare}
    
    echo ""
    echo "${BLUE}📤 Setting up remote and pushing...${NC}"
    
    git remote add origin "https://github.com/$GITHUB_USER/$REPO_NAME.git" 2>/dev/null || \
    git remote set-url origin "https://github.com/$GITHUB_USER/$REPO_NAME.git"
    
    git add .
    git commit -m "Initial commit: CLAVERE v1.0.0" || echo "No changes to commit"
    
    echo ""
    echo "${YELLOW}⚠️  You'll need to push manually the first time:${NC}"
    echo "   git push -u origin main"
    echo ""
    echo "Or use GitHub CLI (if installed):"
    echo "   gh repo create $REPO_NAME --private --source=. --remote=origin --push"
fi

echo ""
echo "${BLUE}🔧 Vercel Deployment Setup${NC}"
echo ""
echo "For automated deployment to Vercel:"
echo ""
echo "Option 1: GitHub Integration (Recommended - Fully Automated)"
echo "1. Go to: https://vercel.com/new"
echo "2. Import your GitHub repository"
echo "3. Add environment variables:"
echo "   - NEXT_PUBLIC_DEEPGRAM_API_KEY"
echo "   - NEXT_PUBLIC_OPENAI_API_KEY (optional)"
echo "   - NEXT_PUBLIC_AI_SERVICE=deepgram"
echo "   - NEXT_PUBLIC_LANGUAGE=en-US"
echo "4. Click Deploy"
echo "5. Every push to main will auto-deploy!"
echo ""
echo "Option 2: Vercel CLI (Command Line)"
echo "   npm i -g vercel"
echo "   vercel"
echo ""

echo "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Push to GitHub (if not done)"
echo "2. Connect to Vercel (see instructions above)"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Get your live URL!"
