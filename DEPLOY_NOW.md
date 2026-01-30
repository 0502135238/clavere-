# 🚀 DEPLOY NOW - 3 Commands

## Fastest Way (If you have GitHub CLI)

```bash
# 1. Create repo and push
npm run setup

# 2. Go to Vercel and import (one-time)
# https://vercel.com/new

# 3. Done! Every push auto-deploys
```

## Manual Way (Still Easy)

### Step 1: Create GitHub Repo
1. Go to: https://github.com/new
2. Name: `clavare`
3. Set to: **Private** ✅
4. **Don't** check any boxes
5. Click "Create repository"

### Step 2: Push Code

```bash
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/clavare.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select `clavare`
4. Add environment variables:
   ```
   NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key
   NEXT_PUBLIC_OPENAI_API_KEY=your-key
   NEXT_PUBLIC_AI_SERVICE=deepgram
   NEXT_PUBLIC_LANGUAGE=en-US
   ```
5. Click **"Deploy"**

### Step 4: Get Your URL

Vercel will give you: `https://clavare.vercel.app`

**Open this on your phone!** 📱

## After First Deploy

Every time you push:
```bash
git add .
git commit -m "Update"
git push
```

**Vercel auto-deploys automatically!** 🎉

---

**That's it! Your app is live and accessible on your phone.**
