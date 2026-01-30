#!/bin/bash

# CLAVERE - One-Click Deployment Script
# Automates: Git commit, push, and triggers Vercel deployment

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "${BLUE}🚀 CLAVERE - Auto Deploy${NC}"
echo "=========================="
echo ""

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "${YELLOW}⚠️  Git not initialized. Run: ./scripts/setup-deployment.sh first${NC}"
    exit 1
fi

# Check if remote exists
if ! git remote | grep -q "origin"; then
    echo "${YELLOW}⚠️  No git remote found. Run: ./scripts/setup-deployment.sh first${NC}"
    exit 1
fi

# Add all changes
echo "${BLUE}📝 Staging changes...${NC}"
git add .

# Check if there are changes
if git diff --staged --quiet; then
    echo "${GREEN}✅ No changes to commit${NC}"
else
    # Commit
    echo "${BLUE}💾 Committing changes...${NC}"
    git commit -m "Update: $(date +'%Y-%m-%d %H:%M:%S')" || true
fi

# Push to GitHub
echo "${BLUE}📤 Pushing to GitHub...${NC}"
git push origin main || git push origin master

echo ""
echo "${GREEN}✅ Pushed to GitHub!${NC}"
echo ""
echo "If Vercel is connected to your GitHub repo, deployment will start automatically."
echo "Check your Vercel dashboard for deployment status."
echo ""
echo "Your app will be available at: https://your-project.vercel.app"
