#!/bin/bash

# CLAVERE - Fully Automated Vercel Deployment
# This script does EVERYTHING - no clicks needed!

set -e

echo ""
echo "========================================"
echo "  CLAVERE - Auto Deploy to Vercel"
echo "========================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "[1/5] Installing Vercel CLI..."
    npm install -g vercel
    echo "✓ Vercel CLI installed"
else
    echo "✓ Vercel CLI already installed"
fi

# Check if logged in
echo ""
echo "[2/5] Checking Vercel login..."
if ! vercel whoami &> /dev/null; then
    echo "⚠ Not logged in. Logging in..."
    vercel login
else
    echo "✓ Already logged in"
fi

# Deploy to Vercel
echo ""
echo "[3/5] Deploying to Vercel..."
echo "This will create/update your project..."
vercel --prod --yes

# Add environment variables
echo ""
echo "[4/5] Adding environment variables..."
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "Reading API keys from .env.local..."
    
    # Read Deepgram key
    DEEPGRAM_KEY=$(grep "NEXT_PUBLIC_DEEPGRAM_API_KEY" .env.local | cut -d '=' -f2 | tr -d ' ')
    # Read OpenAI key
    OPENAI_KEY=$(grep "NEXT_PUBLIC_OPENAI_API_KEY" .env.local | cut -d '=' -f2 | tr -d ' ')
    
    if [ -n "$DEEPGRAM_KEY" ]; then
        echo "Adding NEXT_PUBLIC_DEEPGRAM_API_KEY..."
        echo "$DEEPGRAM_KEY" | vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY production
        echo "$DEEPGRAM_KEY" | vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY preview
        echo "$DEEPGRAM_KEY" | vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY development
    fi
    
    if [ -n "$OPENAI_KEY" ]; then
        echo "Adding NEXT_PUBLIC_OPENAI_API_KEY..."
        echo "$OPENAI_KEY" | vercel env add NEXT_PUBLIC_OPENAI_API_KEY production
        echo "$OPENAI_KEY" | vercel env add NEXT_PUBLIC_OPENAI_API_KEY preview
        echo "$OPENAI_KEY" | vercel env add NEXT_PUBLIC_OPENAI_API_KEY development
    fi
else
    echo "⚠ .env.local not found"
    echo "Please create .env.local with your API keys first"
    echo ""
    echo "Example .env.local:"
    echo "NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key"
    echo "NEXT_PUBLIC_OPENAI_API_KEY=your-key"
    echo ""
    exit 1
fi

# Add default environment variables
echo "Adding NEXT_PUBLIC_AI_SERVICE..."
echo "deepgram" | vercel env add NEXT_PUBLIC_AI_SERVICE production
echo "deepgram" | vercel env add NEXT_PUBLIC_AI_SERVICE preview
echo "deepgram" | vercel env add NEXT_PUBLIC_AI_SERVICE development

echo "Adding NEXT_PUBLIC_LANGUAGE..."
echo "en-US" | vercel env add NEXT_PUBLIC_LANGUAGE production
echo "en-US" | vercel env add NEXT_PUBLIC_LANGUAGE preview
echo "en-US" | vercel env add NEXT_PUBLIC_LANGUAGE development

# Redeploy with new env vars
echo ""
echo "[5/5] Redeploying with environment variables..."
vercel --prod --yes

echo ""
echo "========================================"
echo "  ✅ DEPLOYMENT COMPLETE!"
echo "========================================"
echo ""
echo "Your app is live! Check Vercel dashboard for URL."
echo ""
echo "Future updates: Just run 'git push' - Vercel auto-deploys!"
echo ""
