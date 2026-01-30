# 🚀 CLAVERE - Automated Deployment

## ⚡ FASTEST WAY (Windows PowerShell)

Just run:

```powershell
.\DEPLOY.ps1
```

This script will:
1. ✅ Initialize git (if needed)
2. ✅ Configure git user (if needed)
3. ✅ Stage and commit all files
4. ✅ Guide you through GitHub repo creation
5. ✅ Push to GitHub
6. ✅ Guide you through Vercel deployment

**Total time: 5 minutes, minimal clicks!**

---

## 📋 Step-by-Step (If Script Doesn't Work)

### Step 1: Git Setup

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Create GitHub Repo

1. Go to: **https://github.com/new**
2. Repository name: `clavare`
3. Set to: **Private** ✅
4. **Don't** check any boxes
5. Click **"Create repository"**

### Step 3: Push Code

```bash
git add .
git commit -m "Initial commit: CLAVERE v1.0.0"
git remote add origin https://github.com/YOUR_USERNAME/clavare.git
git push -u origin main
```

### Step 4: Deploy to Vercel

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

### Step 5: Get Your URL

Vercel gives you: `https://clavare.vercel.app`

**Open this on your phone!** 📱

---

## 🔄 After First Deploy: Fully Automated

Every time you push:
```bash
git add .
git commit -m "Update"
git push
```

**Vercel automatically deploys!** 🎉

No more clicks needed - it's fully automated!

---

## 🎯 Alternative: Vercel CLI (Even Faster)

```bash
npm i -g vercel
vercel
```

Follow prompts. Done in 2 minutes!

---

## ✅ Checklist

- [ ] Run `.\DEPLOY.ps1` (or follow manual steps)
- [ ] Create GitHub repo (private)
- [ ] Push code
- [ ] Deploy to Vercel
- [ ] Add environment variables
- [ ] Get URL and test on phone

---

**Your app will be live and accessible on your phone!** 🚀📱
