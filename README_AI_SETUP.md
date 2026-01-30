# CLAVERE - AI Services Setup Guide

## Quick Start

### Option 1: Deepgram (Recommended) ⭐

1. **Get Free API Key:**
   - Go to https://console.deepgram.com/
   - Sign up (free tier: 12,000 minutes/month)
   - Create API key

2. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_DEEPGRAM_API_KEY=your-actual-api-key-here
   NEXT_PUBLIC_AI_SERVICE=deepgram
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

**Features you get:**
- ✅ Real-time transcription
- ✅ Speaker diarization (who said what)
- ✅ Overlap detection
- ✅ Low latency (~200ms)

---

### Option 2: Web Speech API (No Setup)

**No API key needed!** Works immediately.

1. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_AI_SERVICE=webspeech
   ```

2. **Restart dev server**

**Limitations:**
- ❌ No speaker diarization
- ❌ No overlap detection
- ✅ Free, no API key
- ✅ Works offline

---

### Option 3: OpenAI for Context (Optional)

Enhance context understanding with GPT:

1. **Get API Key:**
   - Go to https://platform.openai.com/api-keys
   - Create API key

2. **Add to `.env.local`:**
   ```bash
   NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
   ```

**What it adds:**
- ✅ Better topic extraction
- ✅ Sentiment analysis
- ✅ Summarization
- ✅ Entity detection

---

## Service Comparison

| Feature | Deepgram | Web Speech API | AssemblyAI |
|---------|----------|----------------|------------|
| Setup | API key | None | API key |
| Cost | Free (200h/mo) | Free | Free (5h/mo) |
| Speaker Diarization | ✅ | ❌ | ✅ |
| Overlap Detection | ✅ | ❌ | ✅ |
| Real-time | ✅ Excellent | ✅ Good | ✅ Good |
| Latency | ~200ms | ~300ms | ~400ms |

---

## Configuration

Create `.env.local` file:

```bash
# Required for Deepgram
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key-here

# Optional: Choose service
NEXT_PUBLIC_AI_SERVICE=deepgram  # or 'webspeech', 'assemblyai'

# Optional: OpenAI for context
NEXT_PUBLIC_OPENAI_API_KEY=your-key-here

# Optional: Language
NEXT_PUBLIC_LANGUAGE=en-US
```

---

## Testing

1. **Start the app:**
   ```bash
   npm run dev
   ```

2. **Open in Chrome/Edge:**
   - Navigate to http://localhost:3000
   - Click "Start Captions"
   - Allow microphone

3. **Test with multiple speakers:**
   - Have 2-3 people speak
   - Watch for speaker labels
   - Check overlap detection

---

## Troubleshooting

### "API key required" error
- Make sure `.env.local` exists
- Restart dev server after adding keys
- Check key is correct (no quotes)

### "Service not initialized"
- Check browser console for errors
- Verify microphone permission
- Try Web Speech API as fallback

### No speaker diarization
- Make sure using Deepgram (not Web Speech API)
- Check API key is valid
- Verify `diarize=true` in config

---

## Next Steps

1. ✅ Set up Deepgram (recommended)
2. ✅ Test with real audio
3. ⏳ Add OpenAI for better context (optional)
4. ⏳ Set up AssemblyAI as backup (optional)
