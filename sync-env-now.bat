@echo off
REM Automatically sync environment variables to Vercel

echo.
echo ========================================
echo   Syncing Environment Variables
echo ========================================
echo.

if not exist .env.local (
    echo ⚠️  .env.local not found
    echo.
    echo Creating default .env.local...
    (
        echo NEXT_PUBLIC_AI_SERVICE=webspeech
        echo NEXT_PUBLIC_LANGUAGE=en-US
    ) > .env.local
    echo ✓ Created .env.local with defaults
    echo.
    echo You can add your API keys to .env.local later
    echo.
)

echo Syncing to Vercel...
echo.

REM Use the Node.js script to sync
node scripts/sync-env-to-vercel.js

if errorlevel 1 (
    echo.
    echo ⚠️  Sync had issues, but continuing...
)

echo.
echo ========================================
echo   ✅ DONE!
echo ========================================
echo.
echo Environment variables synced to Vercel
echo.
pause
