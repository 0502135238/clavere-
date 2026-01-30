# CLAVERE

A production-ready real-time conversation caption app designed for deaf and hard-of-hearing people. Features AI-powered speaker diarization, overlap detection, bionic reading, and a beautiful dark-themed UI.

## ✨ Features

### Core Features
- **Real-time Transcription**: AI-powered speech-to-text with Deepgram or Web Speech API
- **Speaker Diarization**: Automatically identifies who said what (with Deepgram)
- **Overlap Detection**: Handles multiple speakers talking simultaneously
- **Bionic Reading**: Enhanced readability with bolded word beginnings
- **Mobile-First Design**: Optimized for phones with responsive layout
- **Context Display**: Shows topics, keywords, and conversation sentiment
- **Smart Text Hierarchy**: Current sentence largest, previous medium, older small

### Advanced Features
- **Conversation Analysis**: Detects turn-taking, interruptions, topic changes
- **Visual Cues**: Real-time indicators for conversation events
- **Catch Me Up**: One-tap summary of recent conversation
- **Group Feedback**: Subtle nudges for hearing people (optional)
- **Social vs Accuracy Mode**: Choose between summarized or verbatim captions
- **Settings Persistence**: All preferences saved locally

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up API Keys

```bash
# Create environment file
node create-env.js

# Then edit .env.local and add your API keys
```

**Get API Keys:**
- **Deepgram** (Recommended): https://console.deepgram.com/ (Free: 12k min/month)
- **OpenAI** (Optional): https://platform.openai.com/api-keys

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in Chrome or Edge.

## 📋 Requirements

- Node.js 18+
- Chrome, Edge, or Safari (for speech recognition)
- Microphone access
- (Optional) Deepgram API key for speaker diarization

## 🎯 Usage

1. **Start Captions**: Click "Start Captions" on the landing page
2. **Allow Microphone**: Grant microphone permission when prompted
3. **Speak**: Start speaking - captions appear in real-time
4. **Multiple Speakers**: The app automatically detects different speakers
5. **View Context**: Tap the context bar at bottom to see topics and keywords

## 🛠️ Configuration

### Environment Variables

Create `.env.local`:

```bash
# Required for best experience
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-api-key

# Optional - for better context understanding
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key

# Service selection (auto-detected if Deepgram key exists)
NEXT_PUBLIC_AI_SERVICE=deepgram

# Language
NEXT_PUBLIC_LANGUAGE=en-US
```

### Settings

Access settings from the captions page:
- Text size (small/medium/large)
- Theme (light/dark/high-contrast)
- Caption mode (social/accuracy)
- Display mode (personal/shared)
- Speaker display (colorful/minimal)

## 🏗️ Project Structure

```
├── app/
│   ├── captions/          # Main captions page
│   ├── settings/          # Settings page
│   ├── group-feedback/    # Group feedback page
│   └── page.tsx           # Landing page
├── components/
│   ├── MultiSpeakerDisplay.tsx    # Smart multi-speaker UI
│   ├── ContextDisplay.tsx          # Context panel
│   ├── BionicTextHighlight.tsx     # Bionic reading
│   └── ...
├── lib/
│   ├── deepgramService.ts          # Deepgram integration
│   ├── speechRecognition.ts        # Web Speech API
│   ├── overlapManager.ts           # Overlap handling
│   ├── conversationAnalysis.ts     # Conversation analysis
│   └── ...
└── hooks/
    └── useToast.ts                 # Toast notifications
```

## 🔧 Technologies

- **Next.js 16**: React framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Deepgram**: Real-time transcription (optional)
- **OpenAI**: Context understanding (optional)
- **Web Speech API**: Browser-native fallback

## 📱 Browser Support

- ✅ **Chrome** (Recommended) - Full support
- ✅ **Edge** - Full support
- ⚠️ **Safari** - Limited support
- ❌ **Firefox** - Not supported

## 🔒 Privacy & Security

- All speech recognition can run locally (Web Speech API)
- API keys stored in `.env.local` (not committed to git)
- No audio data stored permanently
- Optional cloud services (Deepgram, OpenAI) for enhanced features

## 📚 Documentation

- `QUICK_START.md` - Quick setup guide
- `SETUP_INSTRUCTIONS.md` - Detailed setup
- `AI_SERVICES_PLAN.md` - AI services comparison
- `PRODUCTION_PLAN.md` - Production roadmap

## 🐛 Troubleshooting

### "API key required" error
- Check `.env.local` exists
- Verify API key is correct (no extra spaces)
- Restart dev server after adding keys

### No speaker diarization
- Make sure Deepgram key is set
- Check browser console for errors
- Try Web Speech API as fallback

### Microphone not working
- Check browser permissions
- Try different browser (Chrome/Edge)
- Check system microphone settings

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Add environment variables in Vercel dashboard.

### Self-hosted

```bash
# Build
npm run build

# Start
npm start
```

## 📄 License

MIT

## 🙏 Acknowledgments

- Built for deaf and hard-of-hearing community
- Inspired by accessibility-first design principles
- Uses modern AI for better conversation understanding

---

**Made with ❤️ for accessible communication**
