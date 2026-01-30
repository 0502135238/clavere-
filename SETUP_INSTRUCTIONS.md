# CLAVERE - API Keys Setup Instructions

## Quick Setup (2 minutes)

### Step 1: Get Your API Keys

#### Deepgram (Required for best experience)
1. Go to https://console.deepgram.com/
2. Click "Sign Up" (or "Log In" if you have an account)
3. After logging in, go to "API Keys" in the dashboard
4. Click "Create New Key"
5. Copy the API key (starts with something like `abc123...`)

#### OpenAI (Optional - for better context)
1. Go to https://platform.openai.com/api-keys
2. Log in or create account
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-...`)

### Step 2: Paste Your Keys

1. Open the file `.env.local` in the project root
2. Find these lines:
   ```
   NEXT_PUBLIC_DEEPGRAM_API_KEY=paste-your-deepgram-api-key-here
   NEXT_PUBLIC_OPENAI_API_KEY=paste-your-openai-api-key-here
   ```
3. Replace `paste-your-deepgram-api-key-here` with your actual Deepgram key
4. Replace `paste-your-openai-api-key-here` with your actual OpenAI key (if you have one)
5. Save the file

### Step 3: Restart the Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Test It

1. Open http://localhost:3000
2. Click "Start Captions"
3. Allow microphone access
4. Start speaking - you should see real-time transcription with speaker labels!

## What Each Service Does

### Deepgram (Required)
- ✅ Real-time speech-to-text
- ✅ Speaker diarization (identifies who said what)
- ✅ Overlap detection (handles multiple speakers)
- ✅ Low latency (~200ms)
- **Free tier: 12,000 minutes/month**

### OpenAI (Optional)
- ✅ Better topic extraction
- ✅ Sentiment analysis
- ✅ Conversation summarization
- ✅ Entity detection
- **Cost: Pay-as-you-go (~$0.002 per request)**

## Troubleshooting

### "API key required" error
- Make sure `.env.local` exists in the project root
- Check that you pasted the key correctly (no extra spaces)
- Restart the dev server after adding keys

### "Service not initialized"
- Check browser console for errors
- Verify microphone permission is granted
- Try Web Speech API as fallback (set `NEXT_PUBLIC_AI_SERVICE=webspeech`)

### No speaker diarization
- Make sure Deepgram key is set correctly
- Check that `NEXT_PUBLIC_AI_SERVICE=deepgram` (or remove this line to auto-detect)
- Verify the API key is valid in Deepgram dashboard

## Fallback Options

If you don't want to use API keys right now:

1. Set in `.env.local`:
   ```
   NEXT_PUBLIC_AI_SERVICE=webspeech
   ```

2. This uses browser's built-in speech recognition (no API key needed)
   - ⚠️ No speaker diarization
   - ⚠️ No overlap detection
   - ✅ Works immediately
   - ✅ Free, no limits

## Security Note

- `.env.local` is already in `.gitignore` - your keys won't be committed
- Never share your API keys publicly
- If a key is exposed, regenerate it immediately in the service dashboard
