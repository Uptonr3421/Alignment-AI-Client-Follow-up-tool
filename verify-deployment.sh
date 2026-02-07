#!/bin/bash

# Deployment Verification Script
# Tests if Firebase deployment is working correctly

set -e

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_test() {
    echo -e "${BLUE}Testing: $1${NC}"
}

print_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
}

print_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
}

print_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
}

# Get project ID
if [ -f ".firebaserc" ]; then
    PROJECT_ID=$(grep -oP '(?<="default": ")[^"]*' .firebaserc)
else
    echo "No .firebaserc found. Run install-firebase.sh first."
    exit 1
fi

echo "╔══════════════════════════════════════════════════════════╗"
echo "║         Firebase Deployment Verification                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Project: $PROJECT_ID"
echo ""

HOSTING_URL="https://$PROJECT_ID.web.app"
API_URL="https://us-central1-$PROJECT_ID.cloudfunctions.net/api"

# Test 1: Check if hosting is accessible
print_test "Hosting URL accessibility"
if curl -s -o /dev/null -w "%{http_code}" "$HOSTING_URL" | grep -q "200"; then
    print_pass "Hosting is accessible at $HOSTING_URL"
else
    print_fail "Hosting is not accessible at $HOSTING_URL"
fi
echo ""

# Test 2: Check if API health endpoint works
print_test "API health check"
if curl -s "$API_URL/health" | grep -q "ok"; then
    print_pass "API is healthy at $API_URL/health"
else
    print_fail "API health check failed at $API_URL/health"
fi
echo ""

# Test 3: Check if API returns expected structure
print_test "API endpoint structure"
if curl -s "$API_URL" | grep -q "LGBTQ Center"; then
    print_pass "API root endpoint returns expected content"
else
    print_fail "API root endpoint response unexpected"
fi
echo ""

# Test 4: Check if Firestore rules are deployed
print_test "Firestore deployment"
if firebase firestore:rules 2>/dev/null | grep -q "rules_version"; then
    print_pass "Firestore rules are deployed"
else
    print_warn "Could not verify Firestore rules"
fi
echo ""

# Test 5: Check if Functions are deployed
print_test "Cloud Functions deployment"
FUNCTIONS=$(firebase functions:list 2>/dev/null | grep -c "api\|health\|processScheduledEmails" || echo "0")
if [ "$FUNCTIONS" -gt 0 ]; then
    print_pass "Cloud Functions are deployed ($FUNCTIONS functions found)"
else
    print_warn "Could not list Cloud Functions (may need authentication)"
fi
echo ""

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Verification Complete"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "URLs to test manually:"
echo "  🌐 Web App:  $HOSTING_URL"
echo "  ⚡ API Docs: $API_URL"
echo "  ❤️  Health:   $API_URL/health"
echo ""
echo "Manual testing checklist:"
echo "  [ ] Visit web app and verify it loads"
echo "  [ ] Sign up for a new account"
echo "  [ ] Complete setup wizard"
echo "  [ ] Add a test client"
echo "  [ ] Connect Gmail (after OAuth setup)"
echo "  [ ] Send test email"
echo ""
echo "Need to configure Gmail OAuth? See firebase-studio-handoff.md"
echo ""
