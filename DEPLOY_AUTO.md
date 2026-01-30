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
2. ✅ Logs you into Vercel (one-time)
3. ✅ Deploys your app
4. ✅ Reads API keys from `.env.local`
5. ✅ Adds all environment variables
6. ✅ Redeploys with env vars
7. ✅ Done! Get your URL!

## Prerequisites:

Make sure you have `.env.local` with your API keys:
```
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key-here
NEXT_PUBLIC_OPENAI_API_KEY=your-key-here
```

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

Vercel auto-deploys! **Zero clicks!** 🎉

---

**That's it! One command, fully automated!** 🚀
