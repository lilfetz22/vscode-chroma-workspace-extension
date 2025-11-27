# Installation Instructions

## Installing from VSIX

After downloading the `.vsix` file from the [Releases page](https://github.com/lilfetz22/vscode-chroma-workspace-extension/releases):

### Option 1: Install via VS Code UI
1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Click the `...` menu > **Install from VSIX...**
4. Select the downloaded `.vsix` file
5. Reload VS Code when prompted

### Option 2: Install via Command Line
```powershell
code --install-extension chroma-workspace-1.1.0.vsix
```

Then reload VS Code (Ctrl+Shift+P  "Developer: Reload Window")

## What''s Different in v1.1.0+?

**No more native module rebuilding!** 

Starting with version 1.1.0, this extension uses `sql.js` (WebAssembly-based SQLite) instead of `better-sqlite3`. This means:

 **No build tools required** - Works on Windows, Mac, and Linux without Visual Studio Build Tools or Xcode  
 **Instant installation** - No need to run `npm rebuild` after installing  
 **No NPM required** - Install and use immediately  
 **Smaller package** - Everything bundles cleanly with esbuild

## Troubleshooting

If you experience any issues:

1. **Reload VS Code**: Press `Ctrl+Shift+P` and run "Developer: Reload Window"
2. **Check for errors**: Open Output panel (View  Output) and select "Chroma Workspace" from the dropdown
3. **Report issues**: [GitHub Issues](https://github.com/lilfetz22/vscode-chroma-workspace-extension/issues)

## For Developers

To build from source, see [BUILD.md](BUILD.md).
