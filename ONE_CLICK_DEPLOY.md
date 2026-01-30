# 🎯 ONE-CLICK DEPLOYMENT

## Option 1: GitHub CLI (Fully Automated) ⭐

If you have GitHub CLI installed:

```bash
# Install GitHub CLI (if not installed)
# Windows: winget install GitHub.cli
# Mac: brew install gh
# Linux: sudo apt install gh

# Login to GitHub
gh auth login

# Create repo and push (ONE COMMAND!)
npm run setup
```

Then:
1. Go to https://vercel.com/new
2. Import your repo
3. Add environment variables
4. Deploy!

**Done!** Every push auto-deploys.

---

## Option 2: Manual (5 minutes)

### 1. Create GitHub Repo (2 clicks)
- Go to: https://github.com/new
- Name: `clavare`
- Private: ✅
- Create

### 2. Push Code (3 commands)
```bash
git remote add origin https://github.com/YOUR_USERNAME/clavare.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Vercel (3 clicks)
- Go to: https://vercel.com/new
- Import repo
- Deploy

**Done!** Get your URL and open on phone.

---

## After Setup: Fully Automated

Just push code:
```bash
git add .
git commit -m "Update"
git push
```

Vercel auto-deploys! 🚀

---

## Your Phone URL

After deployment, you'll get:
- `https://clavare.vercel.app`
- Or custom domain

**Open this on your phone - it's mobile-optimized!** 📱
