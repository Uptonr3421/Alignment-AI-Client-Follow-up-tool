#!/bin/bash

# Firebase Build Script for Cleveland LGBTQ Center Client Automation
# This script builds the frontend and prepares it for Firebase deployment

set -e  # Exit on error

echo "🔥 Firebase Build Starting..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

print_success "Node.js $(node --version) detected"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

print_success "npm $(npm --version) detected"

# Get script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

print_status "Working directory: $SCRIPT_DIR"
echo ""

# Install root dependencies if needed
if [ ! -d "node_modules" ]; then
    print_status "Installing root dependencies..."
    npm install
    print_success "Root dependencies installed"
    echo ""
fi

# Install functions dependencies
print_status "Installing Cloud Functions dependencies..."
cd functions
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Functions dependencies installed"
else
    print_status "Functions dependencies already installed (skipping)"
fi
cd ..
echo ""

# Build functions (TypeScript compilation)
print_status "Building Cloud Functions..."
cd functions
npm run build
if [ $? -eq 0 ]; then
    print_success "Cloud Functions built successfully"
else
    print_error "Failed to build Cloud Functions"
    exit 1
fi
cd ..
echo ""

# Install frontend dependencies
print_status "Installing frontend dependencies..."
cd src/web/frontend
if [ ! -d "node_modules" ]; then
    npm install
    print_success "Frontend dependencies installed"
else
    print_status "Frontend dependencies already installed (skipping)"
fi
echo ""

# Build frontend
print_status "Building React frontend with Vite..."
npm run build

if [ $? -eq 0 ]; then
    print_success "Frontend built successfully"
else
    print_error "Failed to build frontend"
    exit 1
fi

# Check if dist directory was created
if [ ! -d "dist" ]; then
    print_error "Build output directory 'dist' not found"
    exit 1
fi

print_success "Build output created in src/web/frontend/dist"
echo ""

# Move build output to root dist for Firebase Hosting
cd ../../..
print_status "Copying build output to root dist directory..."

# Remove old dist if it exists
if [ -d "dist" ]; then
    rm -rf dist
fi

# Copy new dist
cp -r src/web/frontend/dist ./dist
print_success "Build output copied to ./dist"
echo ""

# Verify critical files exist
print_status "Verifying build output..."
if [ -f "dist/index.html" ]; then
    print_success "index.html found"
else
    print_error "index.html not found in dist"
    exit 1
fi

if [ -d "dist/assets" ]; then
    print_success "Assets directory found"
else
    print_error "Assets directory not found in dist"
    exit 1
fi

echo ""
print_status "Build verification complete!"
echo ""

# Print summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✓ Build Complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📦 Frontend build:     dist/"
echo "⚡ Cloud Functions:    functions/lib/"
echo ""
echo "Next steps:"
echo "  1. Test locally:     firebase emulators:start"
echo "  2. Deploy:           firebase deploy"
echo "  3. Or use Firebase Studio for automated deployment"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
