@echo off
setlocal EnableDelayedExpansion

echo ==========================================
echo LGBTQ Center Automation Installer Builder
echo ==========================================
echo.

REM Check for NSIS
where makensis >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: NSIS not found. Please install NSIS and add to PATH.
    echo.
    echo Download NSIS from: https://nsis.sourceforge.io/Download
    echo.
    echo Or install with Chocolatey:
    echo   choco install nsis
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('where makensis') do set NSIS_PATH=%%a
echo [OK] NSIS found at: %NSIS_PATH%
echo.

REM Check for Tauri build output
echo Checking for application files...
set TAURI_PATH=..\src\desktop\src-tauri\target\release
set EXE_FOUND=0

if exist "%TAURI_PATH%\LGBTQ Center Automation.exe" (
    echo [OK] Found: LGBTQ Center Automation.exe
    set EXE_FOUND=1
) else (
    echo [WARNING] Application EXE not found at expected location.
    echo   Expected: %TAURI_PATH%\LGBTQ Center Automation.exe
    echo.
    echo   Please build the desktop app first:
    echo     npm run build:desktop
    echo.
    echo   Continuing anyway - installer will include files if found.
)

REM Check for assets
echo.
echo Checking installer assets...
if exist "assets\icon.ico" (
    echo [OK] Found: icon.ico
) else (
    echo [INFO] icon.ico not found - installer will use default icon
)

if exist "assets\header.bmp" (
    echo [OK] Found: header.bmp
) else (
    echo [INFO] header.bmp not found - installer will use default header
)

if exist "assets\wizard.bmp" (
    echo [OK] Found: wizard.bmp
) else (
    echo [INFO] wizard.bmp not found - installer will use default wizard image
)

echo.
echo ==========================================
echo Building installer...
echo ==========================================
echo.

REM Build the installer
makensis installer.nsi

if %errorlevel% neq 0 (
    echo.
    echo ==========================================
    echo ERROR: Installer build failed!
    echo ==========================================
    echo.
    echo Common issues:
    echo   - NSIS script syntax error
    echo   - Missing required files
    echo   - Permission denied
    echo.
    pause
    exit /b 1
)

echo.
echo ==========================================
echo Build completed successfully!
echo ==========================================
echo.
echo Output: LGBTQ-Center-Automation-Setup.exe

if %EXE_FOUND%==0 (
    echo.
    echo WARNING: The installer was built but the application EXE
    echo          was not found. The installer may not work correctly.
    echo.
    echo To fix this:
    echo   1. Build the desktop app: npm run build:desktop
    echo   2. Re-run this script
)

echo.
echo Next steps:
echo   1. Test the installer: double-click LGBTQ-Center-Automation-Setup.exe
echo   2. Copy to presentation folder for distribution
echo   3. Deploy gift page: cd ..\presentation ^&^& vercel --prod
echo.
pause
