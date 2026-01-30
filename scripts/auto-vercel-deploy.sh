#!/bin/bash

# CLAVERE - Fully Automated Vercel Deployment
# This script does EVERYTHING - no clicks needed!

set -e

echo ""
echo "========================================"
echo "  CLAVERE - Auto Deploy to Vercel"
echo "========================================"
echo ""

# Step 1: Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "[1/6] Installing Vercel CLI..."
    npm install -g vercel
    echo "✓ Vercel CLI installed"
else
    echo "✓ Vercel CLI already installed"
fi

# Step 2: Check if logged in
echo ""
echo "[2/6] Checking Vercel login..."
if ! vercel whoami &> /dev/null; then
    echo "⚠ Not logged in. Logging in..."
    vercel login
else
    echo "✓ Already logged in"
fi

# Step 3: Deploy to Vercel
echo ""
echo "[3/6] Deploying to Vercel..."
echo "This will create/update your project..."
vercel --prod --yes

# Step 4: Read and add environment variables
echo ""
echo "[4/6] Adding environment variables from .env.local..."
echo ""

if [ ! -f .env.local ]; then
    echo "⚠ .env.local not found"
    echo "Please create .env.local with your API keys first"
    echo ""
    echo "Example .env.local:"
    echo "NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key"
    echo "NEXT_PUBLIC_OPENAI_API_KEY=your-key"
    echo ""
    exit 1
fi

# Read environment variables from .env.local and add to Vercel
while IFS='=' read -r key value || [ -n "$key" ]; do
    # Skip comments and empty lines
    [[ "$key" =~ ^#.*$ ]] && continue
    [[ -z "$key" ]] && continue
    
    # Remove quotes if present
    value=$(echo "$value" | sed 's/^"\(.*\)"$/\1/')
    
    # Skip empty values
    if [ -n "$value" ]; then
        echo "Adding $key..."
        echo "$value" | vercel env add "$key" production > /dev/null 2>&1 || true
        echo "$value" | vercel env add "$key" preview > /dev/null 2>&1 || true
        echo "$value" | vercel env add "$key" development > /dev/null 2>&1 || true
    fi
done < .env.local

# Add default environment variables
echo "Adding NEXT_PUBLIC_AI_SERVICE..."
echo "deepgram" | vercel env add NEXT_PUBLIC_AI_SERVICE production > /dev/null 2>&1 || true
echo "deepgram" | vercel env add NEXT_PUBLIC_AI_SERVICE preview > /dev/null 2>&1 || true
echo "deepgram" | vercel env add NEXT_PUBLIC_AI_SERVICE development > /dev/null 2>&1 || true

echo "Adding NEXT_PUBLIC_LANGUAGE..."
echo "en-US" | vercel env add NEXT_PUBLIC_LANGUAGE production > /dev/null 2>&1 || true
echo "en-US" | vercel env add NEXT_PUBLIC_LANGUAGE preview > /dev/null 2>&1 || true
echo "en-US" | vercel env add NEXT_PUBLIC_LANGUAGE development > /dev/null 2>&1 || true

echo "✓ Environment variables added!"

# Step 5: Redeploy with new env vars
echo ""
echo "[5/6] Redeploying with environment variables..."
vercel --prod --yes

# Step 6: Get deployment URL
echo ""
echo "[6/6] Getting deployment URL..."
vercel ls --prod 2>/dev/null | head -1 || echo "Check Vercel dashboard for URL"

echo ""
echo "========================================"
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "Your app is live! Check Vercel dashboard for URL."
echo ""
echo "Future updates: Just run 'git push' - Vercel auto-deploys!"
echo ""
