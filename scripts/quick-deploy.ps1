# CLAVERE - Quick Deploy Script for Windows
# Run this to automatically set up and deploy

Write-Host "🚀 CLAVERE - Quick Deploy Setup" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is initialized
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Blue
    git init
    git branch -M main
    Write-Host "✅ Git initialized" -ForegroundColor Green
}

# Check if .gitignore exists
if (-not (Test-Path ".gitignore")) {
    Write-Host "⚠️  .gitignore not found - creating..." -ForegroundColor Yellow
}

# Add all files
Write-Host "📝 Staging files..." -ForegroundColor Blue
git add .

# Check if there are changes
$status = git status --porcelain
if ($status) {
    Write-Host "💾 Committing changes..." -ForegroundColor Blue
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "Initial commit: CLAVERE v1.0.0 - $timestamp"
} else {
    Write-Host "✅ No changes to commit" -ForegroundColor Green
}

Write-Host ""
Write-Host "📤 Next Steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Create GitHub repo:" -ForegroundColor White
Write-Host "   Go to: https://github.com/new" -ForegroundColor Gray
Write-Host "   - Name: clavare" -ForegroundColor Gray
Write-Host "   - Set to: Private" -ForegroundColor Gray
Write-Host "   - Click: Create repository" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Connect and push:" -ForegroundColor White
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/clavare.git" -ForegroundColor Gray
Write-Host "   git push -u origin main" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy to Vercel:" -ForegroundColor White
Write-Host "   Go to: https://vercel.com/new" -ForegroundColor Gray
Write-Host "   - Import your GitHub repo" -ForegroundColor Gray
Write-Host "   - Add environment variables" -ForegroundColor Gray
Write-Host "   - Click Deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "✅ Setup script complete!" -ForegroundColor Green
