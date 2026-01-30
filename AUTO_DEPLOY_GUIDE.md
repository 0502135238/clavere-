# 🚀 CLAVERE - Automated Deployment Guide

## Quick Setup (5 minutes, minimal clicks)

### Step 1: Run Setup Script

```bash
chmod +x scripts/setup-deployment.sh
./scripts/setup-deployment.sh
```

This will:
- Initialize git (if needed)
- Guide you through GitHub repo creation
- Set up remote connection

### Step 2: Create GitHub Repo (One-time, 2 clicks)

1. Go to: **https://github.com/new**
2. Repository name: `clavare` (or your choice)
3. Set to: **Private** ✅
4. **DO NOT** check any boxes (no README, .gitignore, license)
5. Click **"Create repository"**

### Step 3: Push to GitHub

```bash
git push -u origin main
```

Or use GitHub CLI (if installed):
```bash
gh repo create clavare --private --source=. --remote=origin --push
```

### Step 4: Deploy to Vercel (Fully Automated)

#### Option A: GitHub Integration (Recommended - Zero Clicks After Setup)

1. Go to: **https://vercel.com/new**
2. Click **"Import Git Repository"**
3. Select your `clavare` repository
4. Click **"Import"**
5. Add environment variables:
   - `NEXT_PUBLIC_DEEPGRAM_API_KEY` = (your key)
   - `NEXT_PUBLIC_OPENAI_API_KEY` = (your key, optional)
   - `NEXT_PUBLIC_AI_SERVICE` = `deepgram`
   - `NEXT_PUBLIC_LANGUAGE` = `en-US`
6. Click **"Deploy"**

**That's it!** Every push to `main` will auto-deploy. 🎉

#### Option B: Vercel CLI (Command Line)

```bash
npm i -g vercel
vercel
```

Follow the prompts. It will:
- Detect Next.js automatically
- Ask for environment variables
- Deploy and give you a URL

### Step 5: Get Your URL

After deployment, Vercel will give you:
- **Production URL**: `https://clavare.vercel.app` (or your custom domain)
- **Preview URLs**: For every branch/PR

## 🎯 Automated Workflow

Once set up, deployment is **fully automated**:

1. **Make changes** to your code
2. **Run**: `./scripts/auto-deploy.sh`
3. **That's it!** Vercel auto-deploys from GitHub

Or just:
```bash
git add .
git commit -m "Update"
git push
```

Vercel will automatically deploy! 🚀

## 📱 Access on Your Phone

After deployment, you'll get a URL like:
- `https://clavare.vercel.app`
- Or your custom domain

**Open this URL on your phone** - it's mobile-optimized!

## 🔄 Continuous Deployment

Every time you:
- Push to `main` branch → Auto-deploys to production
- Create a PR → Auto-deploys preview
- Push to any branch → Auto-deploys preview

## 🛠️ Alternative: Firebase Hosting

If you prefer Firebase:

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

But **Vercel is recommended** for Next.js (zero config, faster).

## ✅ Checklist

- [ ] Run `./scripts/setup-deployment.sh`
- [ ] Create GitHub repo (private)
- [ ] Push code to GitHub
- [ ] Connect to Vercel
- [ ] Add environment variables
- [ ] Deploy!
- [ ] Get URL and test on phone

## 🎉 You're Done!

Your app is now:
- ✅ On GitHub (private repo)
- ✅ Auto-deploying on every push
- ✅ Live on a URL you can open on your phone
- ✅ Fully automated!

---

**Need help?** Check the scripts - they guide you through everything!
