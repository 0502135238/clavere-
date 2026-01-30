# 🚀 Vercel - Fully Automated Hosting (3 Clicks)

## Why Vercel?

✅ **Fully automated** - Every `git push` auto-deploys  
✅ **Zero configuration** - Detects Next.js automatically  
✅ **Free tier** - Perfect for this app  
✅ **API Routes** - Next.js API routes work automatically  
✅ **Environment variables** - Set once, works forever  
✅ **Global CDN** - Fast worldwide  
✅ **Mobile-friendly** - Works perfectly on phones  

## One-Time Setup (3 Clicks)

### Click 1: Go to Vercel
**https://vercel.com/new**

### Click 2: Import Repository
- Click "Import Git Repository"
- Select `clavere` from your GitHub
- Click "Import"

### Click 3: Add Environment Variables & Deploy
Add these (paste your API keys):
```
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-key
NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
NEXT_PUBLIC_AI_SERVICE=deepgram
NEXT_PUBLIC_LANGUAGE=en-US
```

Click **"Deploy"**

**Done!** Get your URL in 2 minutes! 🎉

## After First Deploy: Fully Automated

**Every time you push:**
```bash
git push
```

**Vercel automatically:**
- ✅ Detects the push
- ✅ Builds your app
- ✅ Deploys to production
- ✅ Updates your URL

**Zero clicks needed!** 🚀

## Your Live URL

After deployment:
- `https://clavere.vercel.app`
- Or `https://clavere-0502135238.vercel.app`

**Open this on your phone!** 📱

## GitHub Actions (Already Configured)

Your repo already has `.github/workflows/vercel-deploy.yml` configured!

To enable it:
1. Go to your GitHub repo settings
2. Add these secrets:
   - `VERCEL_TOKEN` (get from Vercel dashboard)
   - `VERCEL_ORG_ID` (get from Vercel dashboard)
   - `VERCEL_PROJECT_ID` (get from Vercel dashboard)
   - `DEEPGRAM_API_KEY`
   - `OPENAI_API_KEY`

Then every push will auto-deploy via GitHub Actions too!

## Alternative: Railway (If You Prefer)

Railway is also fully automated:
- **Setup:** https://railway.app
- Connect GitHub repo
- Add environment variables
- Auto-deploys on every push

But **Vercel is recommended** for Next.js apps.

---

**Total setup time: 3 minutes**  
**After setup: Fully automated!**  
**No more clicks needed!** ✨
