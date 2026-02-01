@echo off
REM Set Node.js version in Vercel project

echo.
echo ========================================
echo   Setting Node.js Version in Vercel
echo ========================================
echo.

REM Check if vercel CLI is installed
where vercel >nul 2>&1
if errorlevel 1 (
    echo [1/3] Installing Vercel CLI...
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

REM Update vercel.json
echo.
echo [2/3] Updating vercel.json with Node.js 20.x...
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('vercel.json','utf8'));p.nodeVersion='20.x';fs.writeFileSync('vercel.json',JSON.stringify(p,null,2)+'\n');"
if errorlevel 1 (
    echo ERROR: Failed to update vercel.json
    pause
    exit /b 1
)
echo ✓ vercel.json updated

REM Deploy to apply changes
echo.
echo [3/3] Deploying to Vercel to apply Node.js version...
vercel --prod --yes
if errorlevel 1 (
    echo.
    echo ⚠️  Deployment failed, but vercel.json is updated
    echo    Next deployment will use Node.js 20.x
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ Node.js version set to 20.x!
echo ========================================
echo.
pause
