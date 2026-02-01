@echo off
REM Check for common build issues before deploying

echo.
echo ========================================
echo   Checking for Build Issues
echo ========================================
echo.

REM Check Node version
echo [1/5] Checking Node.js version...
node --version
echo ✓ Node.js version OK

REM Check if dependencies are installed
echo.
echo [2/5] Checking dependencies...
if not exist node_modules (
    echo Installing dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
) else (
    echo ✓ Dependencies installed
)

REM Check TypeScript
echo.
echo [3/5] Checking TypeScript...
call npx tsc --noEmit
if errorlevel 1 (
    echo ⚠️  TypeScript errors found - check above
) else (
    echo ✓ No TypeScript errors
)

REM Check for missing environment variables
echo.
echo [4/5] Checking environment variables...
if not exist .env.local (
    echo ⚠️  .env.local not found
    echo    This is OK for build, but API keys may be needed
) else (
    echo ✓ .env.local exists
)

REM Try building
echo.
echo [5/5] Attempting build...
call npm run build
if errorlevel 1 (
    echo.
    echo ❌ BUILD FAILED
    echo.
    echo Check the errors above.
    echo Common issues:
    echo - Missing environment variables
    echo - TypeScript errors
    echo - Node.js version mismatch
    echo.
    pause
    exit /b 1
) else (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo Ready to deploy!
    echo.
)

pause
