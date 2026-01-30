@echo off
REM CLAVERE - Simplified Deployment (Skip Login Check)
REM Use this if you're already logged in

echo.
echo ========================================
echo   CLAVERE - Quick Deploy
echo ========================================
echo.

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

REM Add environment variables from .env.local
echo.
echo [2/4] Adding environment variables...
if not exist .env.local (
    echo ⚠ .env.local not found - skipping env vars
    goto :redeploy
)

echo Reading .env.local...
for /f "tokens=1,* delims==" %%a in ('findstr /V "^#" .env.local ^| findstr /V "^$"') do (
    set "var_name=%%a"
    set "var_value=%%b"
    set "var_value=!var_value:"=!"
    if not "!var_value!"=="" (
        echo Adding !var_name!...
        echo !var_value! | vercel env add !var_name! production >nul 2>&1
        echo !var_value! | vercel env add !var_name! preview >nul 2>&1
        echo !var_value! | vercel env add !var_name! development >nul 2>&1
    )
)

echo Adding defaults...
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE production >nul 2>&1
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production >nul 2>&1

:redeploy
echo.
echo [3/4] Redeploying with environment variables...
vercel --prod --yes --name clavere
if errorlevel 1 (
    vercel --prod --yes
)

echo.
echo [4/4] Getting deployment URL...
vercel ls --prod 2>nul | findstr /C:"https" | head -1

echo.
echo ========================================
echo   ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
pause
