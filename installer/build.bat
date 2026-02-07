@echo off
REM Build script for Windows installer
REM Requires NSIS (Nullsoft Scriptable Install System) to be installed

echo ========================================
echo Building Cleveland LGBTQ Center Automation Installer
echo ========================================
echo.

REM Check if NSIS is installed
where makensis >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: NSIS (makensis) not found in PATH
    echo Please install NSIS from https://nsis.sourceforge.io/
    echo.
    pause
    exit /b 1
)

echo Step 1: Building desktop application...
cd ..\src\desktop
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Desktop build failed
    cd ..\..\installer
    pause
    exit /b 1
)
echo Desktop build complete.
echo.

echo Step 2: Creating installer...
cd ..\..\installer
makensis installer.nsi
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Installer creation failed
    pause
    exit /b 1
)
echo.

echo ========================================
echo Build complete!
echo ========================================
echo Installer created: lgbtq-center-automation-1.0.0-setup.exe
echo.
pause
