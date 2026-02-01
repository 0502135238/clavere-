@echo off
REM Fix Node.js version for Vercel - Fully Automated

echo.
echo ========================================
echo   Fixing Node.js Version for Vercel
echo ========================================
echo.

REM Verify package.json has engines.node
echo [1/4] Verifying package.json...
findstr /C:"\"node\":" package.json >nul
if errorlevel 1 (
    echo ERROR: package.json missing engines.node
    pause
    exit /b 1
)
echo ✓ package.json has engines.node

REM Verify .nvmrc exists
echo.
echo [2/4] Verifying .nvmrc...
if not exist .nvmrc (
    echo ERROR: .nvmrc not found
    pause
    exit /b 1
)
echo ✓ .nvmrc exists

REM Show current settings
echo.
echo [3/4] Current Node.js configuration:
type .nvmrc
findstr /C:"\"node\":" package.json

REM Deploy to Vercel
echo.
echo [4/4] Deploying to Vercel...
echo Vercel will auto-detect Node.js 20.x from package.json and .nvmrc
echo.
vercel --prod --yes
if errorlevel 1 (
    echo.
    echo ⚠️  Deployment failed
    echo.
    echo 💡 Vercel should still use Node.js 20.x on next build because:
    echo    - package.json has engines.node: ^>=20.9.0
    echo    - .nvmrc contains: 20.9.0
    echo.
    echo    If it still fails, manually set in Vercel dashboard:
    echo    Settings → General → Node.js Version → 20.x
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ COMPLETE!
echo ========================================
echo.
echo Node.js version is configured for 20.x
echo Vercel will use Node.js 20.x automatically
echo.
pause
