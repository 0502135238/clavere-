@echo off
REM CLAVERE - Quick Fresh Start (No Vercel Check)
REM Fastest way to get started

echo.
echo ========================================
echo   CLAVERE - Quick Fresh Start
echo ========================================
echo.

REM Step 1: Set Git author
echo [1/4] Setting Git author...
git config user.email "pepperclaude.official@gmail.com"
git config user.name "CLAVERE User"
echo ✓ Done

REM Step 2: Get repo name
echo.
echo [2/4] GitHub Repo Setup
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

REM Step 3: Push to new repo
echo.
echo [3/4] Pushing to new repo...
git remote set-url origin https://github.com/0502135238/%REPO_NAME%.git
git add .
git commit -m "Initial commit - CLAVERE" --author="CLAVERE User <pepperclaude.official@gmail.com>" 2>nul || echo (no changes)
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

REM Step 4: Deploy to Vercel (skip checks)
echo.
echo [4/4] Deploying to Vercel...
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
echo IMPORTANT: Set Node.js to 20.x in Vercel settings!
echo.
pause
