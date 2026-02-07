#!/bin/bash

# Automated Firebase Installation Script
# Cleveland LGBTQ Center Client Automation Tool

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

clear

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Cleveland LGBTQ Center - Client Automation Tool       ║"
echo "║   Firebase Installation & Deployment Script             ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "This script will:"
echo "  1. Check prerequisites"
echo "  2. Install dependencies"
echo "  3. Build the application"
echo "  4. Deploy to Firebase"
echo ""
read -p "Continue? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Installation cancelled."
    exit 0
fi
echo ""

# Function to print status
print_status() {
    echo -e "${BLUE}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check Node.js
print_status "Checking Node.js..."
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js $NODE_VERSION detected"

# Check npm
print_status "Checking npm..."
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi

NPM_VERSION=$(npm --version)
print_success "npm $NPM_VERSION detected"
echo ""

# Check Firebase CLI
print_status "Checking Firebase CLI..."
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    if [ $? -eq 0 ]; then
        print_success "Firebase CLI installed"
    else
        print_error "Failed to install Firebase CLI"
        exit 1
    fi
else
    FIREBASE_VERSION=$(firebase --version)
    print_success "Firebase CLI $FIREBASE_VERSION detected"
fi
echo ""

# Check if logged into Firebase
print_status "Checking Firebase authentication..."
if firebase projects:list &> /dev/null; then
    print_success "Logged into Firebase"
else
    print_warning "Not logged into Firebase. Starting login..."
    firebase login
    if [ $? -ne 0 ]; then
        print_error "Firebase login failed"
        exit 1
    fi
    print_success "Logged into Firebase"
fi
echo ""

# Get Firebase project ID
print_status "Checking Firebase project..."
if [ -f ".firebaserc" ]; then
    PROJECT_ID=$(grep -oP '(?<="default": ")[^"]*' .firebaserc)
    print_success "Found project: $PROJECT_ID"
    
    read -p "Use this project? (y/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter Firebase project ID: " PROJECT_ID
        echo "{\"projects\":{\"default\":\"$PROJECT_ID\"}}" > .firebaserc
    fi
else
    echo "No Firebase project configured."
    read -p "Enter Firebase project ID: " PROJECT_ID
    echo "{\"projects\":{\"default\":\"$PROJECT_ID\"}}" > .firebaserc
fi
echo ""

# Set project
print_status "Setting Firebase project to $PROJECT_ID..."
firebase use "$PROJECT_ID"
if [ $? -ne 0 ]; then
    print_error "Failed to set Firebase project"
    echo "Make sure the project exists and you have access."
    exit 1
fi
print_success "Using project: $PROJECT_ID"
echo ""

# Install dependencies
print_status "Installing dependencies..."
echo ""

print_status "  Installing root dependencies..."
npm install --quiet
print_success "  Root dependencies installed"

print_status "  Installing Cloud Functions dependencies..."
cd functions
npm install --quiet
print_success "  Functions dependencies installed"
cd ..

print_status "  Installing frontend dependencies..."
cd src/web/frontend
npm install --quiet
print_success "  Frontend dependencies installed"
cd ../../..
echo ""

# Build application
print_status "Building application..."
echo ""

# Run build script
./build-for-firebase.sh

if [ $? -ne 0 ]; then
    print_error "Build failed"
    exit 1
fi
echo ""

# Deploy
print_status "Deploying to Firebase..."
echo ""
echo "This will deploy:"
echo "  - Hosting (React frontend)"
echo "  - Cloud Functions (API backend)"
echo "  - Firestore Rules & Indexes"
echo ""
read -p "Deploy now? (y/n) " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    print_warning "Deployment skipped. Run 'firebase deploy' manually when ready."
    exit 0
fi

firebase deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "╔══════════════════════════════════════════════════════════╗"
    echo "║             🎉 Deployment Successful! 🎉                ║"
    echo "╚══════════════════════════════════════════════════════════╝"
    echo ""
    print_success "Your application is now live!"
    echo ""
    echo "🌐 Web App:  https://$PROJECT_ID.web.app"
    echo "⚡ API:      https://us-central1-$PROJECT_ID.cloudfunctions.net/api"
    echo "🎛️  Console:  https://console.firebase.google.com/project/$PROJECT_ID"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Next Steps:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1. Enable Authentication:"
    echo "   - Go to Firebase Console → Authentication"
    echo "   - Enable Email/Password sign-in"
    echo ""
    echo "2. Configure Gmail OAuth:"
    echo "   - Create OAuth credentials in Google Cloud Console"
    echo "   - Run: firebase functions:config:set gmail.client_id=\"YOUR_ID\""
    echo "   - Run: firebase functions:config:set gmail.client_secret=\"YOUR_SECRET\""
    echo "   - Redeploy: firebase deploy --only functions"
    echo ""
    echo "3. Test the Application:"
    echo "   - Visit: https://$PROJECT_ID.web.app"
    echo "   - Sign up for an account"
    echo "   - Complete setup wizard"
    echo ""
    echo "📖 For detailed instructions, see: firebase-studio-handoff.md"
    echo ""
    echo "Need help? Contact: hello@alignment-ai.io"
    echo ""
else
    print_error "Deployment failed"
    echo ""
    echo "Check the error messages above and try again."
    echo "Common issues:"
    echo "  - Billing not enabled (required for Functions)"
    echo "  - Insufficient permissions"
    echo "  - Project doesn't exist"
    exit 1
fi
