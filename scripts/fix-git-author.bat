@echo off
REM Fix Git author to match Vercel account

echo.
echo ========================================
echo   Fixing Git Author for Vercel
echo ========================================
echo.

echo Current Git author:
git config user.name
git config user.email
echo.

echo.
echo This script will help you set the correct Git author.
echo Your Vercel account email must match your Git author email.
echo.

REM Get Vercel account info
echo Checking Vercel account...
vercel whoami
if errorlevel 1 (
    echo.
    echo ⚠️  Not logged in to Vercel
    echo Please run: vercel login
    pause
    exit /b 1
)

echo.
echo Please enter your Vercel account email:
set /p VERCEL_EMAIL="Email: "

if "%VERCEL_EMAIL%"=="" (
    echo ERROR: Email is required
    pause
    exit /b 1
)

echo.
echo Setting Git author to: %VERCEL_EMAIL%
git config user.email "%VERCEL_EMAIL%"

echo.
echo ✅ Git author updated!
echo.
echo Current Git author:
git config user.name
git config user.email
echo.

echo.
echo Now try deploying again:
echo   vercel --prod --yes
echo.
pause
