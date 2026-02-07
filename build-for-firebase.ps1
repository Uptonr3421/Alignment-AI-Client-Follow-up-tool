# Firebase Build Script for Windows
# Cleveland LGBTQ Center Client Automation

Write-Host "🔥 Firebase Build Starting..." -ForegroundColor Cyan
Write-Host ""

# Function to print colored output
function Write-Status {
    param($message)
    Write-Host "▶ $message" -ForegroundColor Blue
}

function Write-Success {
    param($message)
    Write-Host "✓ $message" -ForegroundColor Green
}

function Write-Error {
    param($message)
    Write-Host "✗ $message" -ForegroundColor Red
}

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Success "Node.js $nodeVersion detected"
} catch {
    Write-Error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Success "npm $npmVersion detected"
} catch {
    Write-Error "npm is not installed"
    exit 1
}

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

Write-Status "Working directory: $ScriptDir"
Write-Host ""

# Install root dependencies if needed
if (-not (Test-Path "node_modules")) {
    Write-Status "Installing root dependencies..."
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install root dependencies"
        exit 1
    }
    Write-Success "Root dependencies installed"
    Write-Host ""
}

# Install functions dependencies
Write-Status "Installing Cloud Functions dependencies..."
Set-Location functions
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install functions dependencies"
        Set-Location ..
        exit 1
    }
    Write-Success "Functions dependencies installed"
} else {
    Write-Status "Functions dependencies already installed (skipping)"
}
Set-Location ..
Write-Host ""

# Build functions
Write-Status "Building Cloud Functions..."
Set-Location functions
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build Cloud Functions"
    Set-Location ..
    exit 1
}
Write-Success "Cloud Functions built successfully"
Set-Location ..
Write-Host ""

# Install frontend dependencies
Write-Status "Installing frontend dependencies..."
Set-Location src\web\frontend
if (-not (Test-Path "node_modules")) {
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to install frontend dependencies"
        Set-Location ..\..\..
        exit 1
    }
    Write-Success "Frontend dependencies installed"
} else {
    Write-Status "Frontend dependencies already installed (skipping)"
}
Write-Host ""

# Build frontend
Write-Status "Building React frontend with Vite..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to build frontend"
    Set-Location ..\..\..
    exit 1
}
Write-Success "Frontend built successfully"

# Check if dist directory was created
if (-not (Test-Path "dist")) {
    Write-Error "Build output directory 'dist' not found"
    Set-Location ..\..\..
    exit 1
}

Write-Success "Build output created in src\web\frontend\dist"
Write-Host ""

# Move build output to root dist for Firebase Hosting
Set-Location ..\..\..
Write-Status "Copying build output to root dist directory..."

# Remove old dist if it exists
if (Test-Path "dist") {
    Remove-Item -Path "dist" -Recurse -Force
}

# Copy new dist
Copy-Item -Path "src\web\frontend\dist" -Destination "dist" -Recurse
Write-Success "Build output copied to .\dist"
Write-Host ""

# Verify critical files exist
Write-Status "Verifying build output..."
if (Test-Path "dist\index.html") {
    Write-Success "index.html found"
} else {
    Write-Error "index.html not found in dist"
    exit 1
}

if (Test-Path "dist\assets") {
    Write-Success "Assets directory found"
} else {
    Write-Error "Assets directory not found in dist"
    exit 1
}

Write-Host ""
Write-Status "Build verification complete!"
Write-Host ""

# Print summary
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✓ Build Complete!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 Frontend build:     dist\"
Write-Host "⚡ Cloud Functions:    functions\lib\"
Write-Host ""
Write-Host "Next steps:"
Write-Host "  1. Test locally:     firebase emulators:start"
Write-Host "  2. Deploy:           firebase deploy"
Write-Host "  3. Or use Firebase Studio for automated deployment"
Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
