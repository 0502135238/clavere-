@echo off
REM Quick auto-sync environment variables to Vercel

echo.
echo Syncing environment variables to Vercel...
echo.

REM Read .env.local and add each variable to Vercel
if exist .env.local (
    echo Reading .env.local...
    for /f "tokens=1,* delims==" %%a in ('findstr /V "^#" .env.local ^| findstr /V "^$"') do (
        set "var_name=%%a"
        set "var_value=%%b"
        
        REM Remove quotes if present
        set "var_value=!var_value:"=!"
        
        REM Skip empty values
        if not "!var_value!"=="" (
            REM Only sync NEXT_PUBLIC_* variables
            echo !var_name! | findstr /C:"NEXT_PUBLIC" >nul
            if not errorlevel 1 (
                echo Adding !var_name!...
                echo !var_value! | vercel env add !var_name! production >nul 2>&1
                echo !var_value! | vercel env add !var_name! preview >nul 2>&1
                echo !var_value! | vercel env add !var_name! development >nul 2>&1
            )
        )
    )
    
    REM Add defaults if not in .env.local
    echo Adding defaults...
    echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE production >nul 2>&1
    echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production >nul 2>&1
    echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE preview >nul 2>&1
    echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE preview >nul 2>&1
    echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE development >nul 2>&1
    echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE development >nul 2>&1
    
    echo.
    echo ✅ Environment variables synced!
) else (
    echo ⚠️  .env.local not found
    echo Creating defaults...
    echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE production >nul 2>&1
    echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production >nul 2>&1
    echo.
    echo ✅ Default variables added
)

echo.
echo Done! Variables are now in Vercel.
pause
