@echo off
REM CLAVERE - Sync Environment Variables to Vercel
REM This script reads .env.local and automatically sets all variables in Vercel

echo.
echo ========================================
echo   CLAVERE - Sync Env to Vercel
echo ========================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is required but not found
    echo Please install Node.js first
    pause
    exit /b 1
)

REM Check if .env.local exists
if not exist .env.local (
    echo ERROR: .env.local not found
    echo.
    echo Please create .env.local with your API keys:
    echo   NEXT_PUBLIC_DEEPGRAM_API_KEY=your-deepgram-key
    echo   NEXT_PUBLIC_OPENAI_API_KEY=your-openai-key
    echo   NEXT_PUBLIC_AI_SERVICE=deepgram
    echo   NEXT_PUBLIC_LANGUAGE=en-US
    echo.
    pause
    exit /b 1
)

REM Check Vercel login
echo [1/2] Checking Vercel login...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo Not logged in to Vercel
    echo Please run: vercel login
    echo.
    pause
    exit /b 1
)
vercel whoami
echo.

REM Run the sync script
echo [2/2] Syncing environment variables...
echo.
node scripts/sync-env-to-vercel.js

if errorlevel 1 (
    echo.
    echo ERROR: Sync failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ SYNC COMPLETE!
echo ========================================
echo.
echo Your environment variables are now set in Vercel!
echo.
echo Next steps:
echo   1. Redeploy: vercel --prod
echo   2. Or wait for auto-deploy on next git push
echo.
pause
