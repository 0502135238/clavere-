# CLAVERE - Deployment Guide

## Quick Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to https://vercel.com
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_DEEPGRAM_API_KEY`
   - `NEXT_PUBLIC_OPENAI_API_KEY` (optional)
   - `NEXT_PUBLIC_AI_SERVICE=deepgram`
   - `NEXT_PUBLIC_LANGUAGE=en-US`
4. Deploy!

## Environment Variables for Production

Add these in your hosting platform:

```
NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key
NEXT_PUBLIC_OPENAI_API_KEY=your-key (optional)
NEXT_PUBLIC_AI_SERVICE=deepgram
NEXT_PUBLIC_LANGUAGE=en-US
```

## Build for Production

```bash
npm run build
npm start
```

## Performance Checklist

- ✅ Code splitting enabled
- ✅ Image optimization
- ✅ Compression enabled
- ✅ Security headers
- ✅ Error boundaries
- ✅ Memory leak prevention

## Monitoring

Consider adding:
- Sentry for error tracking
- Vercel Analytics (privacy-friendly)
- LogRocket for session replay (optional)

---

**Ready to deploy! 🚀**
