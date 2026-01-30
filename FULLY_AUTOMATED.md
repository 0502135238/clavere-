# 🚀 FULLY AUTOMATED DEPLOYMENT - Zero Clicks!

## Just Run One Command!

### Windows:
```bash
.\scripts\auto-vercel-deploy.bat
```

### Mac/Linux:
```bash
chmod +x scripts/auto-vercel-deploy.sh
./scripts/auto-vercel-deploy.sh
```

## What It Does Automatically:

1. ✅ Installs Vercel CLI (if needed)
2. ✅ Logs you into Vercel (one-time, opens browser)
3. ✅ Deploys your app
4. ✅ **Reads `.env.local` automatically**
5. ✅ **Adds ALL environment variables to Vercel** (production, preview, development)
6. ✅ Redeploys with environment variables
7. ✅ Done! Get your URL!

## Prerequisites:

Just make sure you have `.env.local` with your API keys:
```
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key-here
NEXT_PUBLIC_OPENAI_API_KEY=your-key-here
```

That's it! The script reads this file and uploads everything automatically!

## First Time:

The script will ask you to login to Vercel (one-time only):
- It will open a browser
- Click "Authorize" (this is the ONLY click needed!)
- Then it continues automatically

## After First Deploy:

**Fully automated!** Every time you:
```bash
git push
```

Vercel automatically:
- ✅ Detects the push
- ✅ Builds your app
- ✅ Deploys to production
- ✅ Updates your URL

**Zero clicks needed!** 🎉

---

**That's it! One command, fully automated, zero clicks!** 🚀
