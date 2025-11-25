# Building Chroma Workspace Extension from Source

This guide provides comprehensive instructions for building and installing the Chroma Workspace extension from source code.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Detailed Build Steps](#detailed-build-steps)
4. [Installation Methods](#installation-methods)
5. [Development Workflow](#development-workflow)
6. [Troubleshooting](#troubleshooting)
7. [Build Scripts Reference](#build-scripts-reference)

---

## Prerequisites

Before building the extension, ensure you have the following installed:

### Required Software

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **npm** (comes with Node.js)
   - Verify installation: `npm --version`

3. **Visual Studio Code** (latest version recommended)
   - Download from: https://code.visualstudio.com/

### Optional Tools

- **Git** - For cloning the repository
- **TypeScript** - Installed automatically as dev dependency

---

## Quick Start

For those familiar with Node.js and VS Code extension development:

```powershell
# Clone the repository (or navigate to your existing folder)
cd c:\Users\YourName\Documents\vscode-chroma-workspace-extension

# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Build the extension bundle
node esbuild.js

# Package as VSIX (requires vsce)
npm install -g @vscode/vsce
vsce package

# Install in VS Code
# Option 1: From VS Code UI (Extensions > ... > Install from VSIX)
# Option 2: Command line
code --install-extension chroma-workspace-0.0.1.vsix
```

---

## Detailed Build Steps

### Step 1: Clone or Download Repository

**Option A: Using Git**
```powershell
git clone https://github.com/lilfetz22/vscode-notes.git
cd vscode-notes
```

**Option B: Download ZIP**
1. Download the repository as a ZIP file
2. Extract to a folder (e.g., `c:\Users\YourName\Documents\vscode-chroma-workspace-extension`)
3. Open the folder in your terminal

### Step 2: Install Dependencies

Navigate to the project root and install all required npm packages:

```powershell
npm install
```

This installs:
- **Production dependencies**: `better-sqlite3`, `compromise`, `uuid`
- **Development dependencies**: TypeScript, esbuild, testing frameworks, type definitions

**Expected output:**
```
added 503 packages in ~30s
```

### Step 3: Compile TypeScript

The extension includes TypeScript source files that must be compiled to JavaScript:

```powershell
npm run compile
```

This runs `tsc -p ./` which:
- Compiles all `.ts` files in `src/`, `vscode/`, and subdirectories
- Outputs JavaScript files to the `out/` directory
- Uses settings from `tsconfig.json`

**Verify compilation:**
- Check that `out/` directory exists
- Contains compiled `.js` files matching source structure

### Step 4: Bundle with esbuild

Bundle the extension into a single file for distribution:

```powershell
node esbuild.js
```

This:
- Bundles `vscode/extension.js` and most dependencies
- Creates `dist/extension_bundled.js` (the main extension file)
- Generates source maps for debugging (`dist/extension_bundled.js.map`)
- Excludes VS Code API and native modules (marked as external)

Important:
- The native module `better-sqlite3` and the compiled `out/database.js` are marked as external in `esbuild.js`.
   This avoids bundling issues with the `bindings` package used by `better-sqlite3` and ensures the native addon
   resolves correctly when loaded by the VS Code extension host.

**Expected output:**
```
[watch] build started
[watch] build finished
```

**Verify bundling:**
- Check `dist/extension_bundled.js` exists
- File size should be ~2-3 MB

### Step 5: Package as VSIX

Create a `.vsix` package for distribution and installation:

#### Install vsce (one-time setup)

```powershell
npm install -g @vscode/vsce
```

#### Package the extension

```powershell
vsce package
```

**Expected output:**
```
INFO  Files included in the VSIX:
chroma-workspace-0.0.1.vsix
├─ [Content_Types].xml
├─ extension.vsixmanifest
└─ extension/ (120 files) [2.91 MB]

DONE  Packaged: chroma-workspace-0.0.1.vsix (122 files, 932.16 KB)
```

**Output location:**
- Creates `chroma-workspace-0.0.1.vsix` in the project root directory

---

## Installation Methods

Once you have the `.vsix` file, install it using one of these methods:

### Method 1: VS Code UI (Recommended)

1. Open Visual Studio Code
2. Go to Extensions view (`Ctrl+Shift+X` on Windows/Linux, `Cmd+Shift+X` on Mac)
3. Click the `...` (More Actions) menu at the top of the Extensions view
4. Select **Install from VSIX...**
5. Browse to `chroma-workspace-0.0.1.vsix` and select it
6. Reload VS Code when prompted

### Method 2: Command Line

```powershell
code --install-extension chroma-workspace-0.0.1.vsix
```

Then reload VS Code:
- Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
- Type "Reload Window" and press Enter

### Method 3: Development Mode (For Testing)

Run the extension in a separate VS Code window without installing:

1. Open the project folder in VS Code
2. Press `F5` (or Run > Start Debugging)
3. This launches an "Extension Development Host" window
4. Test the extension in this window

**Note:** Changes require reloading the Extension Development Host window.

---

## Development Workflow

### Making Changes

1. **Edit Source Files**: Modify TypeScript files in `src/`, `vscode/`, etc.
2. **Compile TypeScript**: Run `npm run compile`
3. **Bundle**: Run `node esbuild.js`
4. **Test**: Press `F5` to launch Extension Development Host
5. **Package** (for distribution): Run `vsce package`

### Watch Mode (for active development)

For automatic rebuilding during development:

```powershell
# Terminal 1: Watch TypeScript compilation
npm run compile -- --watch

# Terminal 2: Watch esbuild bundling
node esbuild.js --watch
```

Then press `F5` to launch Extension Development Host and test changes.

### Running Tests

```powershell
npm test
```

This runs the Jest test suite covering:
- Database operations
- Task scheduling and recurrence
- Tag management
- Search functionality
- Export/import features

---

## Troubleshooting

### Common Issues and Solutions

#### 1. npm install fails with PowerShell execution policy error

**Error:**
```
npm.ps1 cannot be loaded because running scripts is disabled on this system
```

**Solution:**
Use `cmd` instead of PowerShell:
```cmd
cmd /c npm install
```

Or temporarily enable scripts in PowerShell (run as Administrator):
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

#### 2. TypeScript compilation errors

**Error:**
```
error TS2307: Cannot find module 'vscode'
```

**Solution:**
Ensure all dependencies are installed:
```powershell
npm install
```

Verify `@types/vscode` is in `node_modules/@types/`

#### 3. esbuild fails with "Could not resolve" errors

**Error:**
```
ERROR: Could not resolve "../out/views/TaskProvider"
```

**Solution:**
1. Ensure TypeScript compilation succeeded: `npm run compile`
2. Verify `out/` directory exists and contains compiled files
3. Check import paths in `vscode/extension.js` match actual file locations

#### 4. vsce package fails with version mismatch

**Error:**
```
@types/vscode ^1.105.0 greater than engines.vscode ^1.10.0
```

**Solution:**
This has been fixed in the repository. If you see this error:
1. Open `package.json`
2. Update `engines.vscode` to match `@types/vscode` version:
   ```json
   "engines": {
     "vscode": "^1.105.0"
   }
   ```

#### 5. Extension doesn't activate after installation

**Issue:** Extension installs but doesn't appear in sidebar

**Solutions:**
1. **Reload VS Code**: `Ctrl+Shift+P` > "Reload Window"
2. **Check workspace**: Extension requires a folder/workspace to be open
3. **View Output logs**: `View > Output` > Select "Chroma Workspace" from dropdown
4. **Verify installation**: `Ctrl+Shift+X` > Search for "Chroma Workspace" to confirm it's installed

#### 6. Database initializes in the extension folder (wrong location)

**Symptom:** Log shows database path like:

```
...\.vscode\extensions\lilfetz22.chroma-workspace-0.0.1\.chroma\chroma.db
```

**Cause:** The extension didn't receive a workspace root at startup.

**Solution:** Open a folder/workspace in VS Code before activating the extension. The extension initializes
the database using your workspace root and the configurable relative path `chroma.database.path` (default `.chroma/chroma.db`).

#### 7. Database initialization fails

**Error:**
```
Failed to initialize database
```

**Solutions:**
1. Ensure workspace folder is writable
2. Check disk space is available
3. Close other VS Code instances using the same workspace
4. Delete `.chroma/` directory and let extension recreate it

#### 8. better-sqlite3 binary compatibility issues

**Error:**
```
Error: The module '.../better-sqlite3.node' was compiled against a different Node.js version
```

**Solution:**
Rebuild native modules for your Node.js version:
```powershell
npm rebuild better-sqlite3
```

---

## Build Scripts Reference

### package.json scripts

```json
{
  "scripts": {
    "test": "jest",
    "compile": "tsc -p ./"
  }
}
```

- **`npm test`**: Run Jest test suite
- **`npm run compile`**: Compile TypeScript to JavaScript

### Manual commands

- **`node esbuild.js`**: Bundle extension with esbuild
- **`node esbuild.js --watch`**: Bundle in watch mode (auto-rebuild)
- **`node esbuild.js --production`**: Production build (minified, no source maps)
- **`vsce package`**: Create .vsix package
- **`vsce ls`**: List files included in package
- **`vsce ls --tree`**: Show file tree of package contents

---

## Build Output Structure

After successful build, your directory structure includes:

```
vscode-chroma-workspace-extension/
├─ out/                          # Compiled TypeScript (JavaScript)
│  ├─ database.js
│  ├─ Task.js
│  ├─ logic/
│  ├─ models/
│  └─ views/
├─ dist/                         # Bundled extension
│  ├─ extension_bundled.js       # Main extension bundle
│  └─ extension_bundled.js.map   # Source map
├─ chroma-workspace-0.0.1.vsix  # Installable package
├─ node_modules/                 # Dependencies
└─ [source files]
```

---

## Environment-Specific Notes

### Windows

- Use PowerShell or Command Prompt
- Paths use backslashes: `c:\Users\...`
- May need to adjust execution policy for npm scripts

### macOS/Linux

- Use Terminal or Bash
- Paths use forward slashes: `/home/user/...`
- May need to use `sudo` for global npm installs

### VS Code Remote Development

If using VS Code Remote (SSH, Containers, WSL):
- Build must be done in the remote environment
- Node.js must be installed in the remote environment
- Extension will run in the remote context

---

## Distribution

### Sharing the Extension

After building, you can share the `.vsix` file with others:

1. **Email or file transfer**: Send the `.vsix` file directly
2. **GitHub Releases**: Attach to a GitHub release
3. **Internal repository**: Host on company file server
4. **VS Code Marketplace** (requires publisher account):
   ```powershell
   vsce publish
   ```

### Version Management

Update version in `package.json` before each release:
```json
{
  "version": "0.0.2"
}
```

This will generate `chroma-workspace-0.0.2.vsix` when packaging.

---

## Next Steps

After building and installing:

1. **Read the User Guide**: See [USER_GUIDE.md](USER_GUIDE.md) for comprehensive feature documentation
2. **Migration**: Import data from Chroma Parse Notes using [MIGRATION.md](MIGRATION.md)
3. **Quick Start**: Follow the quick start guide in [QUICKSTART.md](QUICKSTART.md)
4. **Configuration**: Customize settings for your workflow

---

## Support

For build-related issues:

1. **Check this document** for troubleshooting steps
2. **Review build output** for specific error messages
3. **Check Node.js version**: `node --version` (should be v18+)
4. **Verify npm packages**: `npm ls` to see installed packages
5. **File an issue** on GitHub with:
   - Operating system and version
   - Node.js and npm versions
   - Complete error output
   - Steps you've already tried

---

## Additional Resources

- **VS Code Extension API**: https://code.visualstudio.com/api
- **esbuild Documentation**: https://esbuild.github.io/
- **vsce (packaging tool)**: https://github.com/microsoft/vscode-vsce
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

---

**Last Updated**: November 8, 2025  
**Extension Version**: 0.0.1  
**Node.js Version**: 18+  
**VS Code Version**: 1.105.0+
