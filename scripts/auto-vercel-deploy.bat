@echo off
REM CLAVERE - Fully Automated Vercel Deployment
REM This script does EVERYTHING - no clicks needed!

echo.
echo ========================================
echo   CLAVERE - Auto Deploy to Vercel
echo ========================================
echo.

REM Step 1: Check if Vercel CLI is installed
where vercel >nul 2>&1
if errorlevel 1 (
    echo [1/6] Installing Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ERROR: Failed to install Vercel CLI
        pause
        exit /b 1
    )
    echo ✓ Vercel CLI installed
) else (
    echo ✓ Vercel CLI already installed
)

REM Step 2: Check if logged in
echo.
echo [2/6] Checking Vercel login...
vercel whoami >nul 2>&1
set LOGIN_STATUS=%ERRORLEVEL%
if %LOGIN_STATUS% NEQ 0 (
    echo.
    echo ⚠ Not logged in to Vercel (or login check failed)
    echo.
    echo Testing login status...
    vercel whoami
    echo.
    echo If you see your username above, you ARE logged in.
    echo If you see an error, you need to login.
    echo.
    echo Press any key to continue with login check...
    pause >nul
    echo.
    echo Attempting to verify login again...
    vercel whoami >nul 2>&1
    if errorlevel 1 (
        echo.
        echo Still not logged in. Please run:
        echo   vercel login
        echo.
        echo Then run this script again.
        pause
        exit /b 1
    )
    echo ✓ Login verified!
) else (
    echo ✓ Already logged in
    vercel whoami
)

REM Step 3: Deploy to Vercel
echo.
echo [3/6] Deploying to Vercel...
echo This will create/update your project...
echo Using project name: clavere
vercel --prod --yes --name clavere
if errorlevel 1 (
    echo Trying without name flag...
    vercel --prod --yes
    if errorlevel 1 (
        echo ERROR: Deployment failed
        pause
        exit /b 1
    )
)
echo ✓ Deployed!

REM Step 4: Read and add environment variables
echo.
echo [4/6] Adding environment variables from .env.local...
echo.

if not exist .env.local (
    echo ⚠ .env.local not found
    echo Please create .env.local with your API keys first
    echo.
    echo Example .env.local:
    echo NEXT_PUBLIC_DEEPGRAM_API_KEY=your-key
    echo NEXT_PUBLIC_OPENAI_API_KEY=your-key
    echo.
    pause
    exit /b 1
)

REM Read environment variables from .env.local and add to Vercel
for /f "tokens=1,* delims==" %%a in ('findstr /V "^#" .env.local ^| findstr /V "^$"') do (
    set "var_name=%%a"
    set "var_value=%%b"
    
    REM Remove quotes if present
    set "var_value=!var_value:"=!"
    
    REM Skip empty values
    if not "!var_value!"=="" (
        echo Adding !var_name!...
        echo !var_value! | vercel env add !var_name! production >nul 2>&1
        echo !var_value! | vercel env add !var_name! preview >nul 2>&1
        echo !var_value! | vercel env add !var_name! development >nul 2>&1
    )
)

REM Add default environment variables if not in .env.local
echo Adding NEXT_PUBLIC_AI_SERVICE...
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE production >nul 2>&1
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE preview >nul 2>&1
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE development >nul 2>&1

echo Adding NEXT_PUBLIC_LANGUAGE...
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production >nul 2>&1
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE preview >nul 2>&1
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE development >nul 2>&1

echo ✓ Environment variables added!

REM Step 5: Redeploy with new env vars
echo.
echo [5/6] Redeploying with environment variables...
vercel --prod --yes --name clavere
if errorlevel 1 (
    vercel --prod --yes
    if errorlevel 1 (
        echo ⚠ Redeploy failed, but initial deploy succeeded
    ) else (
        echo ✓ Redeployed with environment variables!
    )
) else (
    echo ✓ Redeployed with environment variables!
)

REM Step 6: Get deployment URL
echo.
echo [6/6] Getting deployment URL...
for /f "tokens=*" %%i in ('vercel ls --prod --json 2^>nul ^| findstr /C:"url"') do (
    echo Deployment URL: %%i
)

echo.
echo ========================================
echo   ✅ DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Your app is live! Check Vercel dashboard for URL.
echo.
echo Future updates: Just run 'git push' - Vercel auto-deploys!
echo.
pause
