#!/bin/bash
# deploy.sh - One-command deployment for Cleveland LGBTQ Center
# Usage: ./deploy.sh

set -e

echo "🚀 Cleveland LGBTQ Center - Firebase Deployment"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not found${NC}"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged in to Firebase${NC}"
    echo "Run: firebase login"
    exit 1
fi

# Set default project
echo -e "${YELLOW}📁 Setting up project...${NC}"
firebase use cleveland-lgbtq-center 2>/dev/null || {
    echo -e "${YELLOW}⚠️  Project not found. Creating...${NC}"
    firebase projects:create cleveland-lgbtq-center \
        --display-name "Cleveland LGBTQ Center" || true
    firebase use cleveland-lgbtq-center
}

# Enable required APIs
echo -e "${YELLOW}🔧 Enabling required APIs...${NC}"
gcloud services enable firestore.googleapis.com --project=cleveland-lgbtq-center 2>/dev/null || true
gcloud services enable cloudfunctions.googleapis.com --project=cleveland-lgbtq-center 2>/dev/null || true
gcloud services enable cloudscheduler.googleapis.com --project=cleveland-lgbtq-center 2>/dev/null || true
gcloud services enable identitytoolkit.googleapis.com --project=cleveland-lgbtq-center 2>/dev/null || true

# Deploy Firestore rules
echo -e "${YELLOW}🔒 Deploying Firestore security rules...${NC}"
firebase deploy --only firestore:rules

# Deploy Firestore indexes
echo -e "${YELLOW}📊 Deploying Firestore indexes...${NC}"
firebase deploy --only firestore:indexes

# Deploy Cloud Functions
echo -e "${YELLOW}⚡ Deploying Cloud Functions...${NC}"
cd functions
npm install
npm run build
firebase deploy --only functions
cd ..

# Deploy Hosting (if dist folder exists)
if [ -d "dist" ]; then
    echo -e "${YELLOW}🌐 Deploying to Firebase Hosting...${NC}"
    firebase deploy --only hosting
else
    echo -e "${YELLOW}⚠️  dist folder not found, skipping hosting deployment${NC}"
    echo "Build your frontend app first to deploy hosting."
fi

echo ""
echo -e "${GREEN}✅ Deployment complete!${NC}"
echo ""
echo "📋 Project Details:"
echo "   Project ID: cleveland-lgbtq-center"
echo "   Region: us-central1"
echo ""
echo "🔗 URLs:"
echo "   Web App: https://cleveland-lgbtq-center.web.app"
echo "   Firestore: https://console.firebase.google.com/project/cleveland-lgbtq-center/firestore"
echo "   Functions: https://console.firebase.google.com/project/cleveland-lgbtq-center/functions"
echo ""
echo "📖 Next Steps:"
echo "   1. Visit the web app URL"
echo "   2. Sign in with @lgbtqcleveland.org Google account"
echo "   3. First user becomes admin automatically"
echo "   4. Add additional staff from Settings"
echo ""
