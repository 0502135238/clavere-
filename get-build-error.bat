@echo off
REM Get the actual build error from Vercel

echo.
echo ========================================
echo   Get Vercel Build Error
echo ========================================
echo.

echo To see the actual build error:
echo.
echo 1. Go to Vercel Dashboard:
echo    https://vercel.com/pepperclaudeofficial-6144s-projects/clavere
echo.
echo 2. Click on the latest failed deployment
echo.
echo 3. Scroll down to "Build Logs" section
echo.
echo 4. Look for the actual error message
echo.
echo Common errors:
echo - "Node.js version" → Set Node.js to 20.x in Vercel settings
echo - "Module not found" → Missing dependency
echo - "Type error" → TypeScript issue
echo - "Cannot find module" → Import path issue
echo.
echo ========================================
echo.
echo Quick fix: Set Node.js version in Vercel:
echo 1. Go to: https://vercel.com/pepperclaudeofficial-6144s-projects/clavere/settings/general
echo 2. Find "Node.js Version"
echo 3. Set to: 20.x
echo 4. Save and redeploy
echo.
pause
