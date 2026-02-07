# Firebase Studio Handoff Guide

## 🎯 Quick Start for Cleveland LGBTQ Center

This document provides step-by-step instructions to deploy the Client Follow-up Automation tool to Firebase using Firebase Studio Preview.

---

## Overview

**What You're Getting:**
- ✅ Automated client follow-up system
- ✅ Email automation (welcome, reminders, no-show, re-engagement)
- ✅ Staff dashboard for tracking
- ✅ Gmail integration
- ✅ 100% within Firebase Free Tier
- ✅ Zero monthly costs
- ✅ Complete data ownership

**Technology Stack:**
- Frontend: React + Vite + Tailwind CSS
- Backend: Firebase Cloud Functions
- Database: Cloud Firestore
- Authentication: Firebase Auth
- Email: Gmail API (your existing Gmail account)

---

## Prerequisites

Before starting, you need:

1. **Google Account** - For Firebase and Gmail
2. **Firebase Project** - Create at https://console.firebase.google.com
3. **GitHub Account** - Repository is at https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool

---

## Deployment Methods

### Option 1: Firebase Studio (Recommended - Easiest)

Firebase Studio uses AI to automatically detect and configure your project.

#### Step 1: Access Firebase Studio
1. Go to https://firebase.studio
2. Sign in with your Google account
3. Click "Import Project from GitHub"

#### Step 2: Connect Repository
1. Authorize Firebase Studio to access GitHub
2. Select repository: `Uptonr3421/Alignment-AI-Client-Follow-up-tool`
3. Branch: `main`

#### Step 3: Let AI Configure
Firebase Studio's Gemini will automatically detect:
- ✅ React frontend with Vite
- ✅ Firebase Functions
- ✅ Firestore database
- ✅ Build configuration

#### Step 4: Review & Deploy
1. Verify detected configuration:
   - Frontend build: `npm run build:firebase`
   - Functions path: `functions/`
   - Public directory: `dist/`
2. Click "Deploy"
3. Wait 5-10 minutes for deployment

#### Step 5: Post-Deployment Setup
After deployment completes:

1. **Enable Authentication**
   - Go to Firebase Console → Authentication
   - Enable "Email/Password" sign-in method
   - Enable "Google" sign-in (for Gmail integration)

2. **Configure Gmail OAuth** (See section below)

3. **Test the Application**
   - Visit: https://cleveland-lgbtq-center.web.app
   - Sign up for an account
   - Complete setup wizard
   - Test email sending

---

### Option 2: Manual Deployment (Advanced)

If Firebase Studio is unavailable, use the Firebase CLI:

#### Prerequisites
```bash
# Install Node.js 18+ from https://nodejs.org
# Install Firebase CLI
npm install -g firebase-tools
```

#### Steps
```bash
# 1. Clone repository
git clone https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool.git
cd Alignment-AI-Client-Follow-up-tool

# 2. Login to Firebase
firebase login

# 3. Select project
firebase use cleveland-lgbtq-center

# 4. Install dependencies
npm install
cd functions && npm install && cd ..
cd src/web/frontend && npm install && cd ../../..

# 5. Build frontend
npm run build:firebase

# 6. Deploy everything
firebase deploy
```

---

## Gmail Integration Setup

**Required for email sending to work:**

### Step 1: Create Google Cloud OAuth Credentials

1. Go to https://console.cloud.google.com
2. Select your Firebase project
3. Navigate to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client ID"
5. Application type: "Web application"
6. Name: "LGBTQ Center Email Automation"
7. Authorized redirect URIs:
   ```
   https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/gmail/callback
   ```
8. Click "Create" and save:
   - Client ID
   - Client Secret

### Step 2: Enable Gmail API

1. In Google Cloud Console
2. Go to "APIs & Services" → "Library"
3. Search for "Gmail API"
4. Click "Enable"

### Step 3: Configure Firebase Functions

```bash
# Set Gmail credentials
firebase functions:config:set \
  gmail.client_id="YOUR_CLIENT_ID_HERE" \
  gmail.client_secret="YOUR_CLIENT_SECRET_HERE"

# Redeploy functions
firebase deploy --only functions
```

### Step 4: Test Gmail Connection

1. Log into your app
2. Go to Settings → Gmail Integration
3. Click "Connect Gmail"
4. Complete OAuth flow
5. Send test email

---

## Environment Variables

The application requires these environment variables:

### Frontend (.env in src/web/frontend/)
```bash
# Automatically populated by Firebase Studio
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=cleveland-lgbtq-center.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=cleveland-lgbtq-center
VITE_FIREBASE_STORAGE_BUCKET=cleveland-lgbtq-center.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_API_URL=https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api
```

### Functions (via firebase functions:config:set)
```bash
gmail.client_id=your_google_client_id
gmail.client_secret=your_google_client_secret
```

---

## Free Tier Limits

This application is designed to stay within Firebase's free tier:

| Service | Free Tier Limit | Usage Estimate |
|---------|----------------|----------------|
| **Hosting** | 10 GB transfer/month | ~1000 page loads |
| **Firestore** | 50K reads, 20K writes/day | ~500 clients |
| **Functions** | 2M invocations/month | ~10,000 emails |
| **Authentication** | Unlimited | ✅ |
| **Gmail API** | 1 billion quota units/day | ~10,000 emails |

**Estimated capacity**: 500-1000 clients, 300+ emails/day

---

## Testing Checklist

After deployment, verify these features:

### Authentication
- [ ] Can create new account with email/password
- [ ] Can sign in with existing account
- [ ] Password reset works
- [ ] Auth state persists on refresh

### Setup Wizard
- [ ] Wizard appears for new users
- [ ] Can enter center information
- [ ] Can skip Gmail setup initially
- [ ] Setup completes successfully

### Client Management
- [ ] Can add new client
- [ ] Can view client list
- [ ] Can search/filter clients
- [ ] Can edit client details
- [ ] Can delete client (with confirmation)

### Email Templates
- [ ] Default templates load
- [ ] Can edit template text
- [ ] Can save changes
- [ ] Merge fields ({{firstName}}, etc.) work

### Gmail Integration
- [ ] Can initiate OAuth flow
- [ ] Can connect Gmail account
- [ ] Can send test email
- [ ] Can disconnect Gmail

### Email Automation
- [ ] New client creates 4 scheduled emails
- [ ] Scheduled emails process (wait 5 minutes)
- [ ] Email status updates correctly
- [ ] Can cancel pending emails

### Dashboard
- [ ] Stats display correctly
- [ ] Recent clients show
- [ ] Today's tasks appear
- [ ] Activity log loads

---

## Troubleshooting

### Deployment Issues

**Problem: "firebase.json not found"**
- Solution: Ensure you're in the repository root directory

**Problem: "Build failed"**
- Solution: Run `npm install` in root, functions/, and src/web/frontend/

**Problem: "Permission denied"**
- Solution: Run `firebase login` and ensure you're project owner

### Gmail Issues

**Problem: "OAuth error"**
- Verify redirect URI matches exactly
- Check OAuth credentials are correct
- Ensure Gmail API is enabled

**Problem: "Emails not sending"**
- Check Gmail connection status in Settings
- Verify scheduled function is running (check logs)
- Ensure user has connected their Gmail

### Firestore Issues

**Problem: "Permission denied"**
- Verify user is authenticated
- Check Firestore rules deployed correctly
- Try redeploying: `firebase deploy --only firestore:rules`

**Problem: "Data not loading"**
- Check browser console for errors
- Verify API endpoint is accessible
- Check Functions logs: `firebase functions:log`

---

## Support & Maintenance

### Monitoring

**Firebase Console**: https://console.firebase.google.com/project/cleveland-lgbtq-center

Check regularly:
- Functions logs for errors
- Firestore usage (stay under limits)
- Authentication activity
- Hosting traffic

### Logs

```bash
# View function logs
firebase functions:log

# View specific function
firebase functions:log --only api

# Follow logs in real-time
firebase functions:log --follow
```

### Backup

Firestore data should be backed up regularly:

1. Go to Firebase Console → Firestore
2. Click "Import/Export"
3. Export to Google Cloud Storage
4. Schedule monthly exports

### Updates

To update the application:

1. Pull latest code from GitHub
2. Build: `npm run build:firebase`
3. Deploy: `firebase deploy`
4. Test all features

---

## Security Best Practices

✅ **Already Implemented:**
- HTTPS only
- Firebase Authentication
- Firestore security rules (user data isolation)
- OAuth 2.0 for Gmail
- CORS configuration
- Input validation

✅ **Recommended:**
- Enable 2FA on Google account
- Regularly review Firebase Console access
- Monitor unusual activity
- Keep dependencies updated
- Backup Firestore regularly

---

## Data Privacy

**Data Storage:**
- All client data stored in Firebase Firestore
- Gmail tokens encrypted and stored securely
- No third-party data sharing
- Full GDPR compliance

**Data Access:**
- Only authenticated staff can access data
- Each user sees only their own clients
- Audit logs track all actions
- Data exportable at any time

**Data Deletion:**
- Clients can be deleted anytime
- All associated emails automatically canceled
- Gmail connection can be disconnected
- Account deletion removes all user data

---

## Getting Help

**Documentation:**
- User Guide: See `docs/USER_GUIDE.md`
- API Reference: See `docs/API_REFERENCE.md`
- Troubleshooting: See `docs/TROUBLESHOOTING.md`

**Firebase Support:**
- Firebase Docs: https://firebase.google.com/docs
- Firebase Console: https://console.firebase.google.com
- Stack Overflow: Tag with `firebase`

**Developer Contact:**
- Alignment AI: hello@alignment-ai.io
- Phone: 216-200-7861
- GitHub: https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool

---

## License & Ownership

**MIT License** - The Cleveland LGBTQ Center owns full rights to:
- ✅ Source code
- ✅ All modifications
- ✅ All data
- ✅ Right to redistribute

You can:
- Use commercially
- Modify freely
- Distribute
- Use privately
- Sublicense

See `LICENSE` file for full terms.

---

## Summary

This tool provides automated client follow-up with:
- Zero monthly costs (Firebase free tier)
- Full data ownership
- Transparent operation
- Professional email automation
- Staff dashboard
- Easy installation

**Next Steps:**
1. Deploy using Firebase Studio (Option 1 above)
2. Configure Gmail OAuth
3. Test all features
4. Train staff
5. Start using with real clients

**Questions?** Contact hello@alignment-ai.io

---

*Built with care for the Cleveland LGBTQ Center by Alignment AI*
