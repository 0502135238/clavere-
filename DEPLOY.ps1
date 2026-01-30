# CLAVERE - Fully Automated Deployment Script
# This script does EVERYTHING: Git setup, GitHub repo, Vercel deployment

Write-Host ""
Write-Host "🚀 CLAVERE - Automated Deployment" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check/Setup Git
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing Git..." -ForegroundColor Blue
    git init
    git branch -M main
}

# Step 2: Set Git User (if not set)
$gitUser = git config user.name 2>$null
if (-not $gitUser) {
    Write-Host "⚙️  Git user not configured" -ForegroundColor Yellow
    $userName = Read-Host "Enter your name (for git commits)"
    $userEmail = Read-Host "Enter your email (for git commits)"
    git config user.name $userName
    git config user.email $userEmail
    Write-Host "✅ Git configured" -ForegroundColor Green
}

# Step 3: Stage and commit
Write-Host "📝 Staging files..." -ForegroundColor Blue
git add .

$hasChanges = git diff --staged --quiet 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "💾 Committing..." -ForegroundColor Blue
    git commit -m "Initial commit: CLAVERE v1.0.0 - Production Ready"
    Write-Host "✅ Committed" -ForegroundColor Green
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

# Step 4: Check if remote exists
$hasRemote = git remote get-url origin 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "📤 GitHub Repository Setup" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Create a private GitHub repo:" -ForegroundColor White
    Write-Host "1. Go to: https://github.com/new" -ForegroundColor Gray
    Write-Host "2. Repository name: clavare" -ForegroundColor Gray
    Write-Host "3. Set to: Private ✅" -ForegroundColor Gray
    Write-Host "4. DO NOT check any boxes" -ForegroundColor Gray
    Write-Host "5. Click 'Create repository'" -ForegroundColor Gray
    Write-Host ""
    
    $githubUser = Read-Host "Enter your GitHub username"
    $repoName = Read-Host "Enter repository name (default: clavare)"
    if ([string]::IsNullOrWhiteSpace($repoName)) { $repoName = "clavare" }
    
    Write-Host ""
    Write-Host "🔗 Adding remote..." -ForegroundColor Blue
    git remote add origin "https://github.com/$githubUser/$repoName.git"
    
    Write-Host ""
    Write-Host "📤 Pushing to GitHub..." -ForegroundColor Blue
    Write-Host "   (You may be prompted for GitHub credentials)" -ForegroundColor Yellow
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pushed to GitHub!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Push failed. You may need to:" -ForegroundColor Yellow
        Write-Host "   - Use a personal access token" -ForegroundColor Gray
        Write-Host "   - Or push manually: git push -u origin main" -ForegroundColor Gray
    }
} else {
    Write-Host "✅ Remote already configured: $hasRemote" -ForegroundColor Green
    Write-Host "📤 Pushing changes..." -ForegroundColor Blue
    git push origin main
}

Write-Host ""
Write-Host "🎯 Vercel Deployment" -ForegroundColor Cyan
Write-Host "===================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Now deploy to Vercel (fully automated after first setup):" -ForegroundColor White
Write-Host ""
Write-Host "1. Go to: https://vercel.com/new" -ForegroundColor Yellow
Write-Host "2. Click 'Import Git Repository'" -ForegroundColor Yellow
Write-Host "3. Select your 'clavare' repository" -ForegroundColor Yellow
Write-Host "4. Add environment variables:" -ForegroundColor Yellow
Write-Host "   - NEXT_PUBLIC_DEEPGRAM_API_KEY = (your key)" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_OPENAI_API_KEY = (your key, optional)" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_AI_SERVICE = deepgram" -ForegroundColor Gray
Write-Host "   - NEXT_PUBLIC_LANGUAGE = en-US" -ForegroundColor Gray
Write-Host "5. Click 'Deploy'" -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ After first deploy, every 'git push' auto-deploys!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Your app will be live at: https://clavare.vercel.app" -ForegroundColor Cyan
Write-Host "   (or your custom domain)" -ForegroundColor Gray
Write-Host ""
