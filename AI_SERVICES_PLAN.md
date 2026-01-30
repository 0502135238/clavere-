# CLAVERE - AI Services Integration Plan

## Current State: Placeholders ❌
- Speaker detection: Basic audio analysis (not real AI)
- Context extraction: Simple keyword matching (not real NLP)
- Overlap detection: Time-based only (not audio analysis)

## Real AI Services Options

### Option 1: Deepgram (Recommended for Production) ⭐
**Best for: Real-time, Speaker Diarization, Overlap Detection**

**Pros:**
- ✅ Real-time streaming API
- ✅ Built-in speaker diarization
- ✅ Excellent overlap detection
- ✅ Low latency (~200ms)
- ✅ Good accuracy
- ✅ Free tier: 12,000 minutes/month

**Cons:**
- ❌ Paid after free tier
- ❌ Requires API key

**Pricing:**
- Free: 12k minutes/month
- Pay-as-you-go: $0.0043/minute

**Implementation:**
- Real-time WebSocket API
- Speaker labels included
- Overlap detection built-in

---

### Option 2: AssemblyAI (Good Alternative)
**Best for: Accuracy, Context Understanding**

**Pros:**
- ✅ Excellent accuracy
- ✅ Speaker diarization
- ✅ Auto chapters (topic detection)
- ✅ Sentiment analysis
- ✅ Entity detection
- ✅ Free tier: 5 hours/month

**Cons:**
- ❌ Slightly higher latency
- ❌ More expensive

**Pricing:**
- Free: 5 hours/month
- Pay-as-you-go: $0.00025/second (~$0.015/minute)

**Implementation:**
- Real-time streaming API
- WebSocket connection
- Rich metadata included

---

### Option 3: OpenAI Whisper (Self-hosted)
**Best for: Privacy, Cost Control**

**Pros:**
- ✅ Completely free (self-hosted)
- ✅ Excellent accuracy
- ✅ Privacy (runs locally/your server)
- ✅ No API limits

**Cons:**
- ❌ No built-in speaker diarization (need separate model)
- ❌ Requires server setup
- ❌ Higher latency
- ❌ Need to add diarization separately (pyannote.audio)

**Implementation:**
- API endpoint on your server
- Whisper for transcription
- pyannote.audio for diarization

---

### Option 4: Google Cloud Speech-to-Text
**Best for: Enterprise, Multi-language**

**Pros:**
- ✅ Enterprise-grade
- ✅ Multi-language support
- ✅ Speaker diarization
- ✅ Good accuracy

**Cons:**
- ❌ More complex setup
- ❌ Higher cost
- ❌ Requires GCP account

**Pricing:**
- $0.006 per 15 seconds
- Free tier: 60 minutes/month

---

## Recommended Implementation Strategy

### Phase 1: Deepgram (MVP) ⭐
**Why:**
- Best real-time performance
- Built-in speaker diarization
- Free tier sufficient for testing
- Easy WebSocket integration

**Implementation:**
1. Set up Deepgram account
2. Get API key
3. Implement WebSocket client
4. Replace placeholder AI service

### Phase 2: Add Fallbacks
- Web Speech API (browser-native, free, no diarization)
- AssemblyAI (if Deepgram fails)
- Whisper (self-hosted option)

### Phase 3: Hybrid Approach
- Use Deepgram for real-time
- Use OpenAI for context/summarization
- Use local models for privacy mode

---

## Implementation Details

### Deepgram Integration
```typescript
// Real-time WebSocket connection
// Speaker diarization enabled
// Overlap detection via timestamps
// Context from transcript
```

### AssemblyAI Integration
```typescript
// Real-time streaming
// Auto chapters for topics
// Sentiment analysis
// Entity extraction
```

### OpenAI Integration (for context)
```typescript
// GPT-4 for summarization
// Topic extraction
// Sentiment analysis
// Keyword extraction
```

---

## Cost Analysis (Monthly)

### Deepgram (Recommended)
- Free tier: 12,000 minutes = 200 hours
- Typical use: 2 hours/day = 60 hours/month
- **Cost: $0 (within free tier)**

### AssemblyAI
- Free tier: 5 hours
- Typical use: 60 hours/month
- **Cost: ~$54/month** (55 hours × $0.015/min)

### Self-hosted (Whisper)
- Server costs: $20-50/month
- **Cost: $20-50/month** (fixed)

---

## Decision Matrix

| Feature | Deepgram | AssemblyAI | Whisper | Web Speech API |
|---------|----------|------------|---------|----------------|
| Real-time | ✅ Excellent | ✅ Good | ❌ Slower | ✅ Good |
| Speaker Diarization | ✅ Built-in | ✅ Built-in | ⚠️ Separate | ❌ No |
| Overlap Detection | ✅ Yes | ✅ Yes | ⚠️ Manual | ❌ No |
| Context/Topics | ⚠️ Basic | ✅ Excellent | ❌ Manual | ❌ No |
| Cost (Free tier) | ✅ 200h | ⚠️ 5h | ✅ Unlimited | ✅ Unlimited |
| Setup Complexity | ✅ Easy | ✅ Easy | ❌ Hard | ✅ Easy |
| Privacy | ⚠️ Cloud | ⚠️ Cloud | ✅ Self-hosted | ✅ Local |

---

## Final Recommendation

**Start with Deepgram** for MVP:
1. Best real-time performance
2. Free tier sufficient
3. Built-in diarization
4. Easy integration

**Add OpenAI** for context:
1. Better topic extraction
2. Summarization
3. Sentiment analysis

**Keep Web Speech API** as fallback:
1. No API key needed
2. Works offline
3. Good for testing

---

## Next Steps

1. ✅ Set up Deepgram account
2. ✅ Get API key
3. ✅ Implement WebSocket client
4. ✅ Replace placeholder AI service
5. ✅ Add OpenAI for context (optional)
6. ✅ Test with real audio
