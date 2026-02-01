@echo off
REM CLAVERE - Fresh Start: New Repo + New Vercel Project
REM This script does EVERYTHING automatically

echo.
echo ========================================
echo   CLAVERE - Fresh Start Automation
echo ========================================
echo.
echo This will:
echo 1. Create a new GitHub repo
echo 2. Push all code to it
echo 3. Create a new Vercel project
echo 4. Deploy to production
echo.
pause

REM Step 1: Set Git author to match Vercel
echo.
echo [1/7] Setting Git author email...
git config user.email "pepperclaude.official@gmail.com"
git config user.name "CLAVERE User"
echo ✓ Git author set

REM Step 2: Check if GitHub CLI is installed
echo.
echo [2/7] Checking GitHub CLI...
where gh >nul 2>&1
if errorlevel 1 (
    echo Installing GitHub CLI...
    winget install --id GitHub.cli
    if errorlevel 1 (
        echo ⚠️  GitHub CLI not installed. Please install from: https://cli.github.com/
        echo Or we'll create repo manually via GitHub website
        set USE_GITHUB_CLI=0
    ) else (
        set USE_GITHUB_CLI=1
    )
) else (
    echo ✓ GitHub CLI found
    set USE_GITHUB_CLI=1
)

REM Step 3: Create new GitHub repo
echo.
echo [3/7] Creating new GitHub repo...
if "%USE_GITHUB_CLI%"=="1" (
    echo Please enter new repo name (or press Enter for 'clavere-fresh'):
    set /p REPO_NAME="Repo name: "
    if "!REPO_NAME!"=="" set REPO_NAME=clavere-fresh
    
    gh repo create !REPO_NAME! --private --source=. --remote=fresh-origin --push
    if errorlevel 1 (
        echo ⚠️  Failed to create repo via CLI, will use manual method
        set USE_GITHUB_CLI=0
    ) else (
        echo ✓ Repo created: !REPO_NAME!
        git remote set-url origin https://github.com/0502135238/!REPO_NAME!.git
    )
) else (
    echo.
    echo ⚠️  Please create a new repo manually:
    echo 1. Go to: https://github.com/new
    echo 2. Name it: clavere-fresh (or your choice)
    echo 3. Set to Private
    echo 4. DO NOT initialize with README
    echo 5. Press any key when done...
    pause >nul
    echo.
    echo Please enter the repo name you created:
    set /p REPO_NAME="Repo name: "
    git remote set-url origin https://github.com/0502135238/!REPO_NAME!.git
)

REM Step 4: Push code to new repo
echo.
echo [4/7] Pushing code to GitHub...
git add .
git commit -m "Initial commit - CLAVERE fresh start" --author="CLAVERE User <pepperclaude.official@gmail.com>" || echo (no changes)
git push -u origin main
if errorlevel 1 (
    echo ⚠️  Push failed. Check your GitHub credentials.
    pause
    exit /b 1
)
echo ✓ Code pushed to GitHub

REM Step 5: Check Vercel CLI
echo.
echo [5/7] Checking Vercel CLI...
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
echo ✓ Vercel CLI ready

REM Step 6: Login to Vercel (if needed)
echo.
echo [6/7] Checking Vercel login...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo Please login to Vercel...
    vercel login
    if errorlevel 1 (
        echo ERROR: Vercel login failed
        pause
        exit /b 1
    )
)
echo ✓ Logged into Vercel

REM Step 7: Create and deploy Vercel project
echo.
echo [7/7] Creating new Vercel project and deploying...
echo.
vercel --prod --yes
if errorlevel 1 (
    echo.
    echo ⚠️  Deployment failed. Check errors above.
    echo.
    echo Common fixes:
    echo - Set Node.js to 20.x in Vercel dashboard
    echo - Check build logs for specific errors
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ FRESH START COMPLETE!
echo ========================================
echo.
echo ✓ New GitHub repo created and pushed
echo ✓ New Vercel project created and deployed
echo.
echo Your app should be live!
echo Check Vercel dashboard for the URL.
echo.
pause
