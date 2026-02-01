@echo off
REM Fix Vercel access by setting correct Git author

echo.
echo ========================================
echo   Fixing Vercel Access
echo ========================================
echo.

REM Check Vercel login
echo [1/3] Checking Vercel login...
vercel whoami >nul 2>&1
if errorlevel 1 (
    echo ⚠️  Not logged in to Vercel
    echo Please login first: vercel login
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('vercel whoami 2^>nul') do set VERCEL_USER=%%i
echo ✓ Logged in as: %VERCEL_USER%

REM Get Vercel account email
echo.
echo [2/3] Getting Vercel account email...
echo Please enter the email address for your Vercel account:
set /p VERCEL_EMAIL="Email: "

if "%VERCEL_EMAIL%"=="" (
    echo ERROR: Email is required
    pause
    exit /b 1
)

REM Set Git author
echo.
echo [3/3] Setting Git author to match Vercel account...
git config user.email "%VERCEL_EMAIL%"
git config user.name "%VERCEL_USER%"

echo.
echo ✅ Git author updated!
echo    Name: %VERCEL_USER%
echo    Email: %VERCEL_EMAIL%
echo.

REM Show current config
echo Current Git configuration:
git config user.name
git config user.email
echo.

echo ========================================
echo   ✅ READY TO DEPLOY
echo ========================================
echo.
echo Now try deploying:
echo   vercel --prod --yes
echo.
pause
