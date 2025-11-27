# Test VSIX Locally Before Pushing to GitHub
# This script helps catch errors before they reach production

Write-Host "=== Local VSIX Testing Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Build and package
Write-Host "Step 1: Building and packaging extension..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed!" -ForegroundColor Red
    exit 1
}

vsce package --out test-package.vsix
if ($LASTEXITCODE -ne 0) {
    Write-Host "Packaging failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Package created: test-package.vsix" -ForegroundColor Green
Write-Host ""

# Step 2: Install in a test location
Write-Host "Step 2: Installing extension for testing..." -ForegroundColor Yellow
$testExtensionPath = "$env:USERPROFILE\.vscode\extensions-test"

# Uninstall previous test version
code --extensions-dir="$testExtensionPath" --uninstall-extension lilfetz22.chroma-workspace 2>$null

# Install new version
code --extensions-dir="$testExtensionPath" --install-extension test-package.vsix
if ($LASTEXITCODE -ne 0) {
    Write-Host "Installation failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✓ Extension installed to test location" -ForegroundColor Green
Write-Host ""

# Step 3: Test database initialization
Write-Host "Step 3: Testing database initialization..." -ForegroundColor Yellow
Write-Host "Opening VS Code with test extension directory..." -ForegroundColor Gray
Write-Host ""
Write-Host "MANUAL TEST REQUIRED:" -ForegroundColor Yellow
Write-Host "1. VS Code will open with the test extension loaded" -ForegroundColor White
Write-Host "2. Check the 'Chroma Workspace' output panel for errors" -ForegroundColor White
Write-Host "3. Look for chroma-debug.log in your workspace" -ForegroundColor White
Write-Host "4. Try creating a note, board, or task" -ForegroundColor White
Write-Host "5. If everything works, press Ctrl+C here and run 'git push'" -ForegroundColor White
Write-Host ""

# Open VS Code with test extensions directory
code --extensions-dir="$testExtensionPath" .

Write-Host "Waiting for you to test the extension..." -ForegroundColor Cyan
Write-Host "Press Ctrl+C when done testing" -ForegroundColor Gray
Read-Host "Press Enter to continue (or Ctrl+C to abort)"

Write-Host ""
Write-Host "=== Testing Complete ===" -ForegroundColor Green
Write-Host ""
Write-Host "If tests passed, you can now:" -ForegroundColor Cyan
Write-Host "  git add -A" -ForegroundColor White
Write-Host "  git commit -m 'fix: your commit message'" -ForegroundColor White
Write-Host "  git push origin master" -ForegroundColor White
Write-Host ""
Write-Host "Cleanup: Remove test package with:" -ForegroundColor Gray
Write-Host "  Remove-Item test-package.vsix" -ForegroundColor White
