# 🔧 Vercel Environment Variables Setup

## Fixed!

The `vercel.json` file was referencing secrets that don't exist. It's now fixed to use direct environment variables.

## How to Add Environment Variables in Vercel

### Step 1: Go to Project Settings
1. In Vercel dashboard, click on your `clavere` project
2. Go to **Settings** tab
3. Click **Environment Variables** in the sidebar

### Step 2: Add Each Variable
Click **"Add New"** and add these one by one:

1. **NEXT_PUBLIC_DEEPGRAM_API_KEY**
   - Value: `your-deepgram-api-key-here`
   - Environment: Select all (Production, Preview, Development)

2. **NEXT_PUBLIC_OPENAI_API_KEY**
   - Value: `your-openai-api-key-here`
   - Environment: Select all (Production, Preview, Development)

3. **NEXT_PUBLIC_AI_SERVICE**
   - Value: `deepgram`
   - Environment: Select all (Production, Preview, Development)

4. **NEXT_PUBLIC_LANGUAGE**
   - Value: `en-US`
   - Environment: Select all (Production, Preview, Development)

### Step 3: Redeploy
After adding all variables:
1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Click **"Redeploy"**

Or just push a new commit:
```bash
git push
```

## Important Notes

- ✅ Use **NEXT_PUBLIC_** prefix for client-side variables
- ✅ Add variables in Vercel dashboard (not in vercel.json)
- ✅ Select all environments (Production, Preview, Development)
- ✅ After adding variables, redeploy

## Verification

After redeploy, check:
- Build logs should show no errors
- App should work with real AI services
- No more "secret does not exist" errors

---

**Fixed and ready to deploy!** 🚀
