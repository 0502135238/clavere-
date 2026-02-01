@echo off
REM Fix GitHub commit author email to match Vercel account

echo.
echo ========================================
echo   Fix GitHub Commit Author Email
echo ========================================
echo.

echo Current Git config email:
git config user.email
echo.

echo Current last commit author email:
git log --format="%%ae" -1
echo.

echo.
echo Setting Git author email to match Vercel account...
git config user.email "pepperclaude.official@gmail.com"
git config user.name "CLAVERE User"

echo.
echo ✅ Git author email updated to: pepperclaude.official@gmail.com
echo.

echo To update the last commit with the correct email:
echo   git commit --amend --author="CLAVERE User <pepperclaude.official@gmail.com>" --no-edit
echo   git push --force origin main
echo.

echo Or create a new commit with the correct email:
echo   git commit --allow-empty -m "Update commit author email"
echo   git push origin main
echo.

pause
