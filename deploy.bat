@echo off
REM CLAVERE - Automated Deployment Script for Windows
REM This script automates everything possible

echo.
echo ========================================
echo   CLAVERE - Automated Deployment
echo ========================================
echo.

REM Check if git is initialized
if not exist ".git" (
    echo [1/5] Initializing Git...
    git init
    git branch -M main
    echo ✓ Git initialized
) else (
    echo ✓ Git already initialized
)

REM Stage all files
echo.
echo [2/5] Staging files...
git add .

REM Check git user
git config user.name >nul 2>&1
if errorlevel 1 (
    echo.
    echo Git user not configured. Please enter:
    set /p GIT_NAME="Your name: "
    set /p GIT_EMAIL="Your email: "
    git config user.name "%GIT_NAME%"
    git config user.email "%GIT_EMAIL%"
)

REM Commit
echo.
echo [3/5] Committing changes...
git commit -m "Initial commit: CLAVERE v1.0.0 - Production Ready" 2>nul
if errorlevel 1 (
    echo ✓ No changes to commit
) else (
    echo ✓ Committed
)

REM Check remote
echo.
echo [4/5] Checking GitHub remote...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠ GitHub remote not configured
    echo.
    echo Please:
    echo 1. Go to: https://github.com/new
    echo 2. Create private repo named: clavare
    echo 3. Then run:
    echo    git remote add origin https://github.com/YOUR_USERNAME/clavare.git
    echo    git push -u origin main
    echo.
) else (
    echo ✓ Remote configured
    echo.
    echo [5/5] Pushing to GitHub...
    git push -u origin main 2>nul
    if errorlevel 1 (
        echo ⚠ Push failed - you may need to authenticate
        echo   Or push manually: git push -u origin main
    ) else (
        echo ✓ Pushed to GitHub!
    )
)

echo.
echo ========================================
echo   Next: Deploy to Vercel
echo ========================================
echo.
echo 1. Go to: https://vercel.com/new
echo 2. Import your GitHub repository
echo 3. Add environment variables
echo 4. Deploy!
echo.
echo After first deploy, every push auto-deploys!
echo.
pause
