@echo off
REM CLAVERE - Simplified Deployment (Skip Login Check)
REM Use this if you're already logged in

echo.
echo ========================================
echo   CLAVERE - Quick Deploy
echo ========================================
echo.

REM Sync environment variables first
if exist .env.local (
    echo [0/4] Syncing environment variables to Vercel...
    call scripts\sync-env.bat
    if errorlevel 1 (
        echo ⚠️  Env sync had issues, but continuing with deployment...
    )
    echo.
)

REM Skip login check - just try to deploy
echo [1/4] Deploying to Vercel...
echo Using project name: clavere
vercel --prod --yes --name clavere
if errorlevel 1 (
    echo.
    echo ⚠ Deployment failed. Trying without name flag...
    vercel --prod --yes
    if errorlevel 1 (
        echo.
        echo ⚠ Deployment failed. You might need to login:
        echo   vercel login
        pause
        exit /b 1
    )
)

echo.
echo [2/4] Deployment complete!
vercel --prod --yes --name clavere
if errorlevel 1 (
    vercel --prod --yes
)

echo.
echo [3/4] Getting deployment URL...
vercel ls --prod 2>nul | findstr /C:"https" | head -1

echo.
echo ========================================
echo   ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
pause
