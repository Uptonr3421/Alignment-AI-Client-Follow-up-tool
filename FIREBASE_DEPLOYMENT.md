# Firebase Deployment Guide

## Overview
This guide walks through deploying the LGBTQ Center Client Automation app to Firebase using Firebase Studio.

## Prerequisites
- Firebase CLI installed (`npm install -g firebase-tools`)
- Firebase project created: `cleveland-lgbtq-center`
- Google OAuth credentials (for Gmail integration)

## Firebase Studio Import Process

### Step 1: Prepare Repository
The repository is already configured with:
- `firebase.json` - Firebase configuration
- `.firebaserc` - Project settings
- `firestore.rules` - Security rules
- `firestore.indexes.json` - Database indexes
- `functions/` - Cloud Functions

### Step 2: Environment Variables
Create a `.env` file in the project root with:

```bash
# Google OAuth (for Gmail integration)
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/gmail/callback
```

### Step 3: Firebase Studio Import

1. Go to [Firebase Studio](https://firebase.studio)
2. Click "Import Project"
3. Connect your GitHub repository
4. Select the `nonprofit-client-automation` folder
5. Let Gemini analyze the codebase
6. Click "Deploy"

### Step 4: Manual Configuration

After Firebase Studio deployment, configure these settings:

#### 1. Authentication
- Enable Email/Password authentication in Firebase Console
- Enable Google Sign-In (optional)

#### 2. Firestore Database
- Create database in native mode
- Rules are automatically deployed from `firestore.rules`

#### 3. Cloud Functions
Functions are automatically deployed:
- `api` - Main API endpoint
- `processScheduledEmails` - Email scheduler (runs every 5 minutes)
- `onUserCreated` - User initialization trigger
- `onClientDeleted` - Cleanup trigger

#### 4. Hosting
- Frontend builds from `src/web/frontend/dist`
- SPA routing configured for React Router

#### 5. Gmail Integration
Set these environment variables for the functions:

```bash
firebase functions:config:set gmail.client_id="YOUR_CLIENT_ID"
firebase functions:config:set gmail.client_secret="YOUR_CLIENT_SECRET"
firebase functions:config:set gmail.redirect_uri="https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/gmail/callback"
```

### Step 5: Build and Deploy

```bash
# Install dependencies
npm install

# Build frontend
cd src/web/frontend
npm install
npm run build
cd ../../..

# Install functions dependencies
cd functions
npm install
cd ..

# Deploy to Firebase
firebase deploy
```

## Post-Deployment Checklist

- [ ] App loads at `https://cleveland-lgbtq-center.web.app`
- [ ] Sign-up/sign-in works
- [ ] Can add a new client
- [ ] Email templates are created on first login
- [ ] Gmail OAuth connects successfully
- [ ] Test emails send correctly
- [ ] Scheduled emails process (check in 5 minutes)

## URLs After Deployment

| Service | URL |
|---------|-----|
| Web App | https://cleveland-lgbtq-center.web.app |
| API | https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api |
| Firebase Console | https://console.firebase.google.com/project/cleveland-lgbtq-center |

## Troubleshooting

### Gmail Connection Issues
1. Verify OAuth credentials in Google Cloud Console
2. Check redirect URI matches exactly
3. Ensure Gmail API is enabled

### Functions Not Working
1. Check logs: `firebase functions:log`
2. Verify environment variables are set
3. Redeploy: `firebase deploy --only functions`

### Firestore Permission Denied
1. Check user is authenticated
2. Verify security rules allow access
3. Redeploy rules: `firebase deploy --only firestore:rules`

## Support
For issues, check:
- Firebase Console logs
- Functions logs: `firebase functions:log`
- Browser console for frontend errors
