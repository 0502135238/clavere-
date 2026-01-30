@echo off
REM CLAVERE - Fix Errors and Deploy
REM This script checks for errors, fixes them, and deploys

echo.
echo ========================================
echo   CLAVERE - Fix Errors and Deploy
echo ========================================
echo.

REM Step 1: Check for missing dependencies
echo [1/4] Checking dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo ✓ Dependencies installed

REM Step 2: Build to check for errors
echo.
echo [2/4] Building to check for errors...
call npm run build
if errorlevel 1 (
    echo.
    echo ⚠ Build failed! Check errors above.
    echo.
    pause
    exit /b 1
)
echo ✓ Build successful!

REM Step 3: Check Vercel CLI
echo.
echo [3/4] Checking Vercel CLI...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Installing Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ERROR: Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

REM Check if logged in
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠ Not logged in to Vercel
    echo Please run: vercel login
    echo Then run this script again
    pause
    exit /b 1
)
echo ✓ Vercel CLI ready

REM Step 4: Deploy
echo.
echo [4/4] Deploying to Vercel...
echo.
vercel --prod --yes
if errorlevel 1 (
    echo.
    echo ⚠ Deployment failed! Check errors above.
    echo.
    echo Common issues:
    echo - Make sure you're logged in: vercel login
    echo - Check environment variables in Vercel dashboard
    echo - Check build errors above
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is live! Check Vercel dashboard for URL.
echo.
pause
