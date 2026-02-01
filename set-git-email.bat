@echo off
REM Quick script to set Git email for Vercel deployment

echo.
echo ========================================
echo   Set Git Author Email for Vercel
echo ========================================
echo.
echo Your Git author email must match your Vercel account email.
echo.
echo Current Git email: 
git config user.email
echo.
echo Please enter your Vercel account email:
set /p GIT_EMAIL="Email: "

if "%GIT_EMAIL%"=="" (
    echo ERROR: Email is required
    pause
    exit /b 1
)

echo.
echo Setting Git author email to: %GIT_EMAIL%
git config user.email "%GIT_EMAIL%"

echo.
echo ✅ Git author email updated!
echo.
echo New Git configuration:
git config user.name
git config user.email
echo.
echo Now try deploying again:
echo   vercel --prod --yes
echo.
pause
