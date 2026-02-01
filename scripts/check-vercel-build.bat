@echo off
REM Check what might be causing Vercel build to fail

echo.
echo ========================================
echo   Vercel Build Debug
echo ========================================
echo.

echo Checking common issues...
echo.

REM 1. Check Node version requirement
echo [1] Node.js version in package.json:
findstr /C:"\"node\":" package.json
echo.

REM 2. Check .nvmrc
echo [2] .nvmrc file:
if exist .nvmrc (
    type .nvmrc
) else (
    echo .nvmrc not found
)
echo.

REM 3. Check for required env vars at build time
echo [3] Environment variables used in code:
findstr /S /C:"process.env" lib\*.ts app\*.tsx 2>nul | findstr /V "NEXT_PUBLIC" | findstr /V "node_modules"
echo.

REM 4. Check TypeScript config
echo [4] TypeScript target:
findstr /C:"\"target\":" tsconfig.json
echo.

REM 5. Check Next.js config
echo [5] Next.js config exists:
if exist next.config.js (
    echo ✓ next.config.js found
) else (
    echo ✗ next.config.js missing
)
echo.

echo ========================================
echo   Common Vercel Build Issues:
echo ========================================
echo.
echo 1. Node.js version mismatch
echo    - Check: package.json engines.node
echo    - Check: .nvmrc file
echo    - Fix: Set Node.js 20.x in Vercel dashboard
echo.
echo 2. Missing environment variables
echo    - Check: Vercel dashboard → Settings → Environment Variables
echo    - Add: NEXT_PUBLIC_* variables if needed
echo.
echo 3. TypeScript errors
echo    - Run: npx tsc --noEmit
echo    - Fix any TypeScript errors
echo.
echo 4. Build-time errors
echo    - Check Vercel build logs at the inspect URL
echo    - Look for specific error messages
echo.
echo ========================================
echo.
echo To see actual build errors, check:
echo https://vercel.com/pepperclaudeofficial-6144s-projects/clavere/FG5H4AAdVJVePHAno1cWgYTAN5B5
echo.
pause
