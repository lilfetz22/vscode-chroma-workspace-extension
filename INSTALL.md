# Installation Instructions

## Installing from VSIX

After downloading the `.vsix` file from the [Releases page](https://github.com/lilfetz22/vscode-chroma-workspace-extension/releases):

### Option 1: Install via VS Code UI
1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Click the `...` menu > **Install from VSIX...**
4. Select the downloaded `.vsix` file
5. **IMPORTANT**: After installation, rebuild the native module:
   - Open PowerShell/Terminal
   - Navigate to the extension directory:
     ```powershell
     cd $env:USERPROFILE\.vscode\extensions\lilfetz22.chroma-workspace-*
     ```
   - Run:
     ```powershell
     npm install --build-from-source
     ```
6. Reload VS Code when prompted

### Option 2: Install via Command Line
```powershell
code --install-extension chroma-workspace-1.0.3.vsix
cd $env:USERPROFILE\.vscode\extensions\lilfetz22.chroma-workspace-*
npm install --build-from-source
```

## Why the extra step?

The extension uses `better-sqlite3`, a native Node.js addon that must be compiled for your specific platform (Windows/Mac/Linux) and Node.js version. The VSIX includes the source files but not prebuilt binaries to ensure compatibility across all platforms.

## Troubleshooting

If you see errors about "Cannot find module 'bindings'" or "not a valid Win32 application":
1. Make sure you ran `npm install --build-from-source` in the extension directory
2. Ensure you have build tools installed:
   - **Windows**: Install [windows-build-tools](https://github.com/felixrieseberg/windows-build-tools) or Visual Studio Build Tools
   - **Mac**: Install Xcode Command Line Tools (`xcode-select --install`)
   - **Linux**: Install `build-essential` package
3. Reload VS Code after rebuilding
