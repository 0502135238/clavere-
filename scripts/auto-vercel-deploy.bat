@echo off
REM CLAVERE - Fully Automated Vercel Deployment
REM This script does EVERYTHING - no clicks needed!

echo.
echo ========================================
echo   CLAVERE - Auto Deploy to Vercel
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>&1
if errorlevel 1 (
    echo [1/5] Installing Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ERROR: Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
    echo ✓ Vercel CLI installed
) else (
    echo ✓ Vercel CLI already installed
)

REM Check if logged in
echo.
echo [2/5] Checking Vercel login...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠ Not logged in. Logging in...
    vercel login
    if errorlevel 1 (
        echo ERROR: Login failed
        pause
        exit /b 1
    )
) else (
    echo ✓ Already logged in
)

REM Deploy to Vercel
echo.
echo [3/5] Deploying to Vercel...
echo This will create/update your project...
vercel --prod --yes
if errorlevel 1 (
    echo ERROR: Deployment failed
    pause
    exit /b 1
)

REM Add environment variables
echo.
echo [4/5] Adding environment variables...
echo.

REM Check if .env.local exists
if exist .env.local (
    echo Reading API keys from .env.local...
    
    REM Read Deepgram key
    for /f "tokens=2 delims==" %%a in ('findstr "NEXT_PUBLIC_DEEPGRAM_API_KEY" .env.local') do set DEEPGRAM_KEY=%%a
    REM Read OpenAI key
    for /f "tokens=2 delims==" %%a in ('findstr "NEXT_PUBLIC_OPENAI_API_KEY" .env.local') do set OPENAI_KEY=%%a
    
    if defined DEEPGRAM_KEY (
        echo Adding NEXT_PUBLIC_DEEPGRAM_API_KEY...
        echo %DEEPGRAM_KEY% | vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY production
        echo %DEEPGRAM_KEY% | vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY preview
        echo %DEEPGRAM_KEY% | vercel env add NEXT_PUBLIC_DEEPGRAM_API_KEY development
    )
    
    if defined OPENAI_KEY (
        echo Adding NEXT_PUBLIC_OPENAI_API_KEY...
        echo %OPENAI_KEY% | vercel env add NEXT_PUBLIC_OPENAI_API_KEY production
        echo %OPENAI_KEY% | vercel env add NEXT_PUBLIC_OPENAI_API_KEY preview
        echo %OPENAI_KEY% | vercel env add NEXT_PUBLIC_OPENAI_API_KEY development
    )
) else (
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

REM Add default environment variables
echo Adding NEXT_PUBLIC_AI_SERVICE...
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE production
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE preview
echo deepgram | vercel env add NEXT_PUBLIC_AI_SERVICE development

echo Adding NEXT_PUBLIC_LANGUAGE...
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE preview
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE development

REM Redeploy with new env vars
echo.
echo [5/5] Redeploying with environment variables...
vercel --prod --yes

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
