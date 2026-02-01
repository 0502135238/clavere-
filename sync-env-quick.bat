@echo off
REM Quick sync - reads .env.local and adds to Vercel automatically

echo.
echo Auto-syncing environment variables to Vercel...
echo.

if exist .env.local (
    REM Use Node.js script for reliable syncing
    node scripts/sync-env-to-vercel.js
) else (
    echo ⚠️  .env.local not found
    echo.
    echo Adding default variables...
    echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE production 2>nul
    echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production 2>nul
    echo ✓ Defaults added
)

echo.
echo ✅ Done!
pause
