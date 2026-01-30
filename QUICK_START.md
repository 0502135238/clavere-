# 🚀 CLAVERE - Quick Start Guide

## Step 1: Create Environment File

Run this command in your terminal:

```bash
node create-env.js
```

This will create `.env.local` file with placeholders for your API keys.

## Step 2: Get Your API Keys

### Deepgram (Required for best experience)
1. Go to **https://console.deepgram.com/**
2. Sign up (it's free - 12,000 minutes/month)
3. Go to "API Keys" in dashboard
4. Click "Create New Key"
5. Copy the key

### OpenAI (Optional - for better context)
1. Go to **https://platform.openai.com/api-keys**
2. Log in or create account
3. Click "Create new secret key"
4. Copy the key

## Step 3: Paste Your Keys

1. Open `.env.local` file in the project root
2. Find these lines:
   ```
   NEXT_PUBLIC_DEEPGRAM_API_KEY=paste-your-deepgram-api-key-here
   NEXT_PUBLIC_OPENAI_API_KEY=paste-your-openai-api-key-here
   ```
3. Replace the placeholder text with your actual keys
4. Save the file

**Example:**
```
NEXT_PUBLIC_DEEPGRAM_API_KEY=abc123def456ghi789...
NEXT_PUBLIC_OPENAI_API_KEY=sk-abc123def456ghi789...
```

## Step 4: Restart Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

## Step 5: Test It! 🎉

1. Open http://localhost:3000
2. Click "Start Captions"
3. Allow microphone access
4. Start speaking!

You should see:
- ✅ Real-time transcription
- ✅ Speaker labels (Speaker 1, Speaker 2, etc.)
- ✅ Overlap detection
- ✅ Context display

## Troubleshooting

### "API key required" error
- Make sure `.env.local` exists
- Check you pasted keys correctly (no extra spaces)
- Restart dev server after adding keys

### No speaker diarization
- Verify Deepgram key is correct
- Check browser console for errors
- Make sure key starts with letters/numbers (not "paste-your...")

### Want to test without API keys?
Set in `.env.local`:
```
NEXT_PUBLIC_AI_SERVICE=webspeech
```
This uses browser's built-in speech recognition (no API key needed, but no speaker diarization).

## Need Help?

Check `SETUP_INSTRUCTIONS.md` for detailed instructions.
