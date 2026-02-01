@echo off
REM CLAVERE - Simple Fresh Start (Manual Repo Creation)
REM Use this if you want to create the repo manually first

echo.
echo ========================================
echo   CLAVERE - Simple Fresh Start
echo ========================================
echo.

REM Step 1: Set Git author
echo [1/5] Setting Git author...
git config user.email "pepperclaude.official@gmail.com"
git config user.name "CLAVERE User"
echo ✓ Done

REM Step 2: Get repo name
echo.
echo [2/5] GitHub Repo Setup
echo.
echo Please create a new repo on GitHub:
echo 1. Go to: https://github.com/new
echo 2. Name: clavere-fresh (or your choice)
echo 3. Set to: Private
echo 4. DO NOT initialize with README
echo.
echo Press any key when you've created the repo...
pause >nul

echo.
echo Enter the repo name you just created:
set /p REPO_NAME="Repo name: "
if "%REPO_NAME%"=="" set REPO_NAME=clavere-fresh

REM Step 3: Update remote and push
echo.
echo [3/5] Pushing to new repo...
git remote set-url origin https://github.com/0502135238/%REPO_NAME%.git
git add .
git commit -m "Initial commit - CLAVERE" --author="CLAVERE User <pepperclaude.official@gmail.com>" || echo (no changes)
git push -u origin main
if errorlevel 1 (
    echo.
    echo ⚠️  Push failed. Make sure:
    echo - Repo exists on GitHub
    echo - You have push access
    echo - Git credentials are set up
    pause
    exit /b 1
)
echo ✓ Code pushed

REM Step 4: Check Vercel
echo.
echo [4/5] Checking Vercel...
where vercel >nul 2>&1
if errorlevel 1 (
    echo Installing Vercel CLI...
    call npm install -g vercel
    if errorlevel 1 (
        echo ⚠️  Failed to install Vercel CLI
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
    echo ✓ Vercel CLI installed
) else (
    echo ✓ Vercel CLI found
)

echo.
echo Checking Vercel login status...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  Not logged in to Vercel
    echo.
    echo Please login now...
    vercel login
    if errorlevel 1 (
        echo.
        echo ⚠️  Login failed or cancelled
        echo You can login later and deploy manually
        echo.
        pause
        exit /b 1
    )
    echo.
    echo ✓ Logged into Vercel
) else (
    echo ✓ Already logged into Vercel
    vercel whoami
)

REM Step 5: Deploy
echo.
echo [5/5] Deploying to Vercel...
echo This will create a NEW Vercel project...
echo.
vercel --prod --yes
if errorlevel 1 (
    echo.
    echo ⚠️  Deployment failed
    echo.
    echo Next steps:
    echo 1. Go to Vercel dashboard
    echo 2. Settings → General → Node.js Version → Set to 20.x
    echo 3. Redeploy
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ COMPLETE!
echo ========================================
echo.
echo ✓ New repo: %REPO_NAME%
echo ✓ Deployed to Vercel
echo.
pause
