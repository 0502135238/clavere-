@echo off
REM Add environment variables to Vercel - Simple and Fast

echo.
echo Adding environment variables to Vercel...
echo.

REM Enable delayed expansion for variables
setlocal enabledelayedexpansion

REM Read .env.local and add each variable
if exist .env.local (
    echo Reading .env.local...
    for /f "usebackq tokens=1,* delims==" %%a in (".env.local") do (
        set "line=%%a=%%b"
        REM Skip comments and empty lines
        echo !line! | findstr /V "^#" | findstr /V "^$" >nul
        if not errorlevel 1 (
            REM Only process NEXT_PUBLIC_* variables
            echo !line! | findstr /C:"NEXT_PUBLIC" >nul
            if not errorlevel 1 (
                for /f "tokens=1,* delims==" %%x in ("!line!") do (
                    set "var_name=%%x"
                    set "var_value=%%y"
                    REM Remove quotes
                    set "var_value=!var_value:"=!"
                    REM Skip if empty or placeholder
                    if not "!var_value!"=="" (
                        if not "!var_value!"=="paste-your" (
                            echo Adding !var_name!...
                            echo !var_value! | vercel env add !var_name! production 2>nul
                            echo !var_value! | vercel env add !var_name! preview 2>nul
                            echo !var_value! | vercel env add !var_name! development 2>nul
                        )
                    )
                )
            )
        )
    )
)

REM Add defaults
echo.
echo Adding default variables...
echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE production 2>nul
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE production 2>nul
echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE preview 2>nul
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE preview 2>nul
echo webspeech | vercel env add NEXT_PUBLIC_AI_SERVICE development 2>nul
echo en-US | vercel env add NEXT_PUBLIC_LANGUAGE development 2>nul

echo.
echo ✅ Environment variables added to Vercel!
echo.
pause
