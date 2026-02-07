# Windows Installer

This folder contains the NSIS installer script for the LGBTQ Center Automation desktop application.

## Prerequisites

1. **NSIS Installed**: Download from https://nsis.sourceforge.io/Download
   - Or install via Chocolatey: `choco install nsis`
   - Must be added to PATH

2. **Desktop App Built**: Run `npm run build:desktop` first
   - Output should be in `../src/desktop/src-tauri/target/release/`

## Building the Installer

### Option 1: Double-click
Simply double-click `build.bat`

### Option 2: Command Line
```bash
cd installer
build.bat
```

### Option 3: From Project Root
```bash
npm run build:installer
```

## Output

The installer will be created as:
```
installer/LGBTQ-Center-Automation-Setup.exe
```

## Assets (Optional)

For branded installer, add these files to `assets/` folder:

| File | Size | Purpose |
|------|------|---------|
| `icon.ico` | Multi-size (16-256px) | Application icon |
| `header.bmp` | 150x57 | Header banner |
| `wizard.bmp` | 164x314 | Welcome/finish sidebar |

If assets are missing, NSIS defaults will be used.

## What the Installer Does

1. **Welcome Screen** - Professional wizard interface
2. **License** - Shows MIT license
3. **Directory** - Choose install location (default: `%LOCALAPPDATA%`)
4. **Components** - Select optional features:
   - Desktop Shortcut
   - Start Menu Shortcuts
   - Documentation
   - Sample Data
5. **Install** - Copies files, creates shortcuts
6. **Finish** - Option to launch application

## Uninstaller

Created automatically at:
- `Add/Remove Programs` in Windows Settings
- `Start Menu > LGBTQ Center Automation > Uninstall`
- `Uninstall.exe` in install directory

## Troubleshooting

### "NSIS not found"
Install NSIS and ensure `makensis.exe` is in your PATH.

### "Application EXE not found"
Build the desktop app first:
```bash
npm run build:desktop
```

### "Installer build failed"
Check the console output for specific errors. Common issues:
- Missing source files
- Permission denied (run as Administrator)
- Syntax error in .nsi file

## Testing the Installer

1. Run `LGBTQ-Center-Automation-Setup.exe`
2. Verify wizard appears (not a terminal)
3. Complete installation
4. Check desktop shortcut created
5. Check Start Menu folder created
6. Launch application
7. Uninstall and verify cleanup

## Distribution

After building:
1. Copy `LGBTQ-Center-Automation-Setup.exe` to `../presentation/`
2. Deploy gift page: `cd ../presentation && vercel --prod`
3. Test download from deployed URL
