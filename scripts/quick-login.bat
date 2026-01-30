@echo off
REM Quick Vercel login helper
REM Run this first if you need to login

echo.
echo ========================================
echo   Vercel Login Helper
echo ========================================
echo.
echo This will open your browser for Vercel authentication.
echo.
echo Steps:
echo 1. Browser will open automatically
echo 2. Click "Authorize" or "Continue"
echo 3. Come back here when done
echo.
echo Press any key to start login...
pause >nul

vercel login

echo.
echo ========================================
echo   Login Complete!
echo ========================================
echo.
echo You can now run the deployment script:
echo   .\scripts\auto-vercel-deploy.bat
echo.
pause
