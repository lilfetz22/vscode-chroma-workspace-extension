# Testing Workflow

## Why Test Locally?

GitHub Actions builds the extension and publishes it automatically. However, runtime errors (like database initialization) only appear when the extension actually loads in VS Code. Testing locally catches these before users see them.

## Testing Process

### 1. Make Your Changes
Edit code in `src/`, `vscode/`, etc.

### 2. Build and Package Locally
```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm run build
vsce package
```

This creates `chroma-workspace-x.x.x.vsix`

### 3. Install Locally and Test
```powershell
# Uninstall current version
code --uninstall-extension lilfetz22.chroma-workspace

# Install newly built version
code --install-extension chroma-workspace-x.x.x.vsix

# Delete old debug log
Remove-Item chroma-debug.log -ErrorAction SilentlyContinue

# Reload VS Code
# Press Ctrl+Shift+P -> "Developer: Reload Window"
```

### 4. Check for Errors

**Check the debug log:**
```powershell
# After reloading VS Code, check for errors
Get-Content chroma-debug.log | Select-String "ERROR"
```

**Test key features:**
- Create a note file (`.notesnlh`)
- Open Chroma Workspace sidebar
- Create a board
- Create a task
- Try search

**Check Output panel:**
- View → Output
- Select "Chroma Workspace" from dropdown
- Look for errors

### 5. If Tests Pass, Push to GitHub
```powershell
git add -A
git commit -m "fix: your commit message"
git push origin master
```

Semantic-release will automatically:
- Bump version based on commit message
- Generate changelog
- Create GitHub release
- Publish to VS Code marketplace

## Quick Test Script

Use the provided test script:
```powershell
.\test-vsix-locally.ps1
```

## Common Errors to Check For

### Database Initialization
- ✓ No "pragma is not a function" errors
- ✓ No "no such module: fts5" errors  
- ✓ Migrations complete successfully

### SQL Compatibility
- ✓ No FTS5 queries (use LIKE instead)
- ✓ No PRAGMA statements
- ✓ No transactions (sql.js limitation)

### Files Included
- ✓ WASM file present: `vsce ls --tree | Select-String 'wasm'`
- ✓ Bundled JavaScript: `dist/extension_bundled.js`
- ✓ Package size reasonable (< 2 MB)

## Troubleshooting

### "Extension causes high CPU usage"
Check for infinite loops in watch mode or task schedulers.

### "Database file not found"
Check that `.chroma/chroma.db` path is created in workspace root.

### "WASM file not loading"
Verify `dist/sql-wasm.wasm` is included:
```powershell
vsce ls --tree | Select-String 'sql-wasm'
```
