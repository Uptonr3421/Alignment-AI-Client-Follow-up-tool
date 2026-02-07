# Firebase Deployment Checklist

## Pre-Deployment

### Prerequisites
- [ ] Firebase project created: `cleveland-lgbtq-center`
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Logged into Firebase: `firebase login`
- [ ] Google OAuth credentials created (for Gmail integration)

### Files Created/Verified
- [ ] `firebase.json` - Hosting + Functions + Firestore config
- [ ] `.firebaserc` - Project ID set
- [ ] `firestore.rules` - Security rules defined
- [ ] `firestore.indexes.json` - Database indexes defined
- [ ] `functions/package.json` - Dependencies listed
- [ ] `functions/tsconfig.json` - TypeScript config
- [ ] `functions/src/index.ts` - Function exports
- [ ] `functions/src/api.ts` - Express API
- [ ] `functions/src/routes/*.ts` - All API routes
- [ ] `functions/src/services/*.ts` - Business logic
- [ ] `functions/src/triggers.ts` - Firestore triggers
- [ ] `functions/src/scheduled.ts` - Cron jobs
- [ ] `src/web/frontend/src/firebase.ts` - Firebase init
- [ ] `src/web/frontend/src/hooks/useFirebase.ts` - Auth hooks
- [ ] `src/web/frontend/src/hooks/useApi.ts` - API hooks
- [ ] `src/web/frontend/src/components/Auth.tsx` - Auth UI

## Firebase Studio Import

### Step 1: Import
- [ ] Go to https://firebase.studio
- [ ] Click "Import Project"
- [ ] Connect GitHub repository
- [ ] Select `projects/nonprofit-client-automation` folder
- [ ] Let Gemini analyze codebase

### Step 2: Review Configuration
- [ ] Frontend framework: React ✅
- [ ] Build command: `npm run build` ✅
- [ ] Output directory: `src/web/frontend/dist` ✅
- [ ] Functions folder: `functions/` ✅

### Step 3: Deploy
- [ ] Click "Deploy"
- [ ] Wait for build to complete
- [ ] Verify deployment success

## Post-Deployment Configuration

### Firebase Console Setup
- [ ] **Authentication**: Enable Email/Password sign-in
- [ ] **Firestore**: Database created in native mode
- [ ] **Functions**: All functions deployed successfully
- [ ] **Hosting**: Site live at `.web.app` domain

### Environment Variables
Set these in Firebase Functions config:
```bash
firebase functions:config:set gmail.client_id="YOUR_CLIENT_ID"
firebase functions:config:set gmail.client_secret="YOUR_CLIENT_SECRET"
firebase functions:config:set gmail.redirect_uri="https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/gmail/callback"
```

### Google Cloud Console
- [ ] Gmail API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth credentials created
- [ ] Redirect URI added to authorized URLs

## Testing

### Authentication
- [ ] Can sign up with email/password
- [ ] Can sign in with existing account
- [ ] Auth state persists across refresh

### Setup Wizard
- [ ] Setup wizard appears for new users
- [ ] Can enter center information
- [ ] Can connect Gmail account
- [ ] Setup completes successfully

### Client Management
- [ ] Can add new client
- [ ] Can edit existing client
- [ ] Can delete client
- [ ] Client list loads correctly
- [ ] Search/filter works

### Email Features
- [ ] Default templates created on first login
- [ ] Can edit email templates
- [ ] Gmail OAuth connects successfully
- [ ] Can send test email
- [ ] Scheduled emails process (wait 5 minutes)

### Dashboard
- [ ] Stats load correctly
- [ ] Recent clients display
- [ ] Today's tasks show

## URLs to Verify

| Service | URL | Status |
|---------|-----|--------|
| Web App | https://cleveland-lgbtq-center.web.app | ⬜ |
| API Health | https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/health | ⬜ |
| API Docs | https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api/ | ⬜ |

## Security Checklist

- [ ] Firestore rules restrict access to authenticated users
- [ ] API endpoints verify authentication
- [ ] Gmail tokens stored securely in Firestore
- [ ] No sensitive data exposed in client-side code
- [ ] HTTPS enforced on all endpoints

## Performance Checklist

- [ ] Frontend loads in < 3 seconds
- [ ] API responses < 500ms
- [ ] Images optimized
- [ ] Build output minimized

## Final Verification

- [ ] All 8 pages load without errors
- [ ] Console shows no errors
- [ ] Mobile responsive (test on phone)
- [ ] Can complete full workflow:
  1. Sign up
  2. Complete setup
  3. Add client
  4. Connect Gmail
  5. Send test email

## Deployment Complete! 🎉

Your LGBTQ Center Client Automation app is now live and ready for the nonprofit to use.

### Share These URLs:
- **Main App**: https://cleveland-lgbtq-center.web.app
- **Firebase Console**: https://console.firebase.google.com/project/cleveland-lgbtq-center

### Next Steps:
1. Invite nonprofit staff as users
2. Provide training on the system
3. Set up monitoring and alerts
4. Schedule regular backups review
