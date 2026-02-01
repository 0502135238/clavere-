@echo off
REM Automatically fix Git email for Vercel

echo.
echo ========================================
echo   Auto-Fix Git Email for Vercel
echo ========================================
echo.

REM Check if logged into Vercel
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Not logged in to Vercel
    echo Please login first: vercel login
    pause
    exit /b 1
)

echo ✓ Logged into Vercel
echo.

REM The issue: Git author email must match Vercel account email
echo Current Git author email: 
git config user.email
echo.

echo ⚠️  This email must match your Vercel account email.
echo.
echo Please enter your Vercel account email address:
set /p VERCEL_EMAIL="Email: "

if "%VERCEL_EMAIL%"=="" (
    echo ERROR: Email is required
    pause
    exit /b 1
)

echo.
echo Setting Git author email to: %VERCEL_EMAIL%
git config user.email "%VERCEL_EMAIL%"

echo.
echo ✅ Git author email updated!
echo.
echo New configuration:
git config user.name
git config user.email
echo.

echo ========================================
echo   ✅ READY TO DEPLOY
echo ========================================
echo.
echo Now run: vercel --prod --yes
echo.
pause
