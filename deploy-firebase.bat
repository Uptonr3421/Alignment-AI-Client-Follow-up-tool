@echo off
REM Firebase Deployment Script for LGBTQ Center Client Automation

echo ==========================================
echo Firebase Deployment Script
echo ==========================================

REM Check if Firebase CLI is installed
firebase --version >nul 2>&1
if errorlevel 1 (
    echo Firebase CLI not found. Installing...
    npm install -g firebase-tools
)

REM Login to Firebase (if not already logged in)
echo.
echo Checking Firebase authentication...
firebase login

REM Install root dependencies
echo.
echo Installing root dependencies...
call npm install

REM Build frontend
echo.
echo Building frontend...
cd src\web\frontend
call npm install
call npm run build
cd ..\..\..

REM Install functions dependencies
echo.
echo Installing functions dependencies...
cd functions
call npm install
cd ..

REM Deploy to Firebase
echo.
echo ==========================================
echo Deploying to Firebase...
echo ==========================================
firebase deploy

echo.
echo ==========================================
echo Deployment Complete!
echo ==========================================
echo Your app is now live at:
echo   https://cleveland-lgbtq-center.web.app
echo.
echo API endpoint:
echo   https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api
echo.
pause
