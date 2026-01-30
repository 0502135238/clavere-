@echo off
git add scripts/auto-vercel-deploy.bat
git add scripts/auto-vercel-deploy.sh
git add DEPLOY_AUTO.md
git add VERCEL_ENV_SETUP.md
git add START_DEPLOY.txt
git commit -m "Add fully automated Vercel deployment - zero clicks"
git push origin main
echo Done!
