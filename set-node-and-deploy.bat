@echo off
REM Automatically set Node.js 20.x in Vercel and deploy

echo.
echo ========================================
echo   Setting Node.js 20.x in Vercel
echo ========================================
echo.

REM Update vercel.json
echo [1/3] Updating vercel.json...
node -e "const fs=require('fs');const p=JSON.parse(fs.readFileSync('vercel.json','utf8'));p.nodeVersion='20.x';fs.writeFileSync('vercel.json',JSON.stringify(p,null,2)+'\n');"
if errorlevel 1 (
    echo ERROR: Failed to update vercel.json
    pause
    exit /b 1
)
echo ✓ vercel.json updated with nodeVersion: 20.x

REM Commit the change
echo.
echo [2/3] Committing changes...
git add vercel.json
git commit -m "Set Node.js to 20.x for Vercel" || echo (no changes to commit)
git push origin main
echo ✓ Changes pushed

REM Deploy to Vercel
echo.
echo [3/3] Deploying to Vercel...
echo This will apply the Node.js 20.x setting...
vercel --prod --yes
if errorlevel 1 (
    echo.
    echo ⚠️  Deployment failed, but vercel.json is updated
    echo    Vercel should use Node.js 20.x on next build
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ COMPLETE!
echo ========================================
echo.
echo Node.js version set to 20.x
echo Project deployed to Vercel
echo.
pause
