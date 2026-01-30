# 🔄 Sync Environment Variables to Vercel

This guide shows you how to automatically sync your `.env.local` file to Vercel.

## Quick Start

### Option 1: Use the Batch Script (Windows)
```bash
scripts\sync-env.bat
```

### Option 2: Use the Node Script Directly
```bash
npm run sync-env
# or
node scripts/sync-env-to-vercel.js
```

## What It Does

1. ✅ Reads your `.env.local` file
2. ✅ Extracts all `NEXT_PUBLIC_*` variables
3. ✅ Sets them in Vercel for all environments (production, preview, development)
4. ✅ Auto-detects `NEXT_PUBLIC_AI_SERVICE` if not set
5. ✅ Verifies variables were set correctly

## Required Variables

Make sure your `.env.local` has:

```env
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-api-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
NEXT_PUBLIC_AI_SERVICE=deepgram
NEXT_PUBLIC_LANGUAGE=en-US
```

## Prerequisites

1. ✅ Vercel CLI installed: `npm install -g vercel`
2. ✅ Logged in to Vercel: `vercel login`
3. ✅ `.env.local` file exists with your API keys

## Automatic Sync on Deploy

The `deploy-now.bat` script now automatically syncs environment variables before deploying!

## Troubleshooting

### "Not logged in to Vercel"
Run: `vercel login`

### ".env.local not found"
Create `.env.local` in the project root with your API keys.

### Variables not showing in Vercel
1. Check that variables start with `NEXT_PUBLIC_`
2. Make sure values aren't empty or placeholders
3. Run `vercel env ls` to verify

## Manual Check

After syncing, verify in Vercel:
```bash
vercel env ls
```

Or check in Vercel Dashboard → Your Project → Settings → Environment Variables
