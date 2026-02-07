# Firebase Studio Import Instructions

## Quick Import (Recommended)

### Step 1: Prepare Your Repository
The codebase is already configured for Firebase Studio. These files have been created:

```
nonprofit-client-automation/
├── firebase.json          # Firebase configuration
├── .firebaserc            # Project settings
├── firestore.rules        # Security rules
├── firestore.indexes.json # Database indexes
├── functions/             # Cloud Functions
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts       # Function exports
│       ├── api.ts         # Express API
│       ├── routes/        # API routes
│       ├── services/      # Business logic
│       ├── types/         # TypeScript types
│       ├── triggers.ts    # Firestore triggers
│       └── scheduled.ts   # Scheduled functions
└── src/web/frontend/      # React frontend
    ├── src/
    │   ├── firebase.ts    # Firebase init
    │   ├── hooks/         # Firebase hooks
    │   └── components/
    │       └── Auth.tsx   # Auth component
```

### Step 2: Import to Firebase Studio

1. **Go to Firebase Studio**: https://firebase.studio

2. **Click "Import Project"**

3. **Connect GitHub**: 
   - Authorize Firebase Studio to access your GitHub
   - Select your repository

4. **Select Folder**: Choose `projects/nonprofit-client-automation`

5. **Let Gemini Analyze**: Firebase Studio will automatically:
   - Detect React + Vite frontend
   - Detect Firebase Functions
   - Identify Firestore collections
   - Configure build settings

6. **Review Configuration**: Check that Firebase Studio detected:
   - ✅ Frontend framework: React
   - ✅ Build command: `npm run build`
   - ✅ Output directory: `src/web/frontend/dist`
   - ✅ Functions: `functions/` folder

7. **Click "Deploy"**

### Step 3: Configure Gmail OAuth (Post-Deploy)

After deployment, configure Gmail integration:

```bash
# Set environment variables
firebase functions:config:set gmail.client_id="YOUR_GOOGLE_CLIENT_ID"
firebase functions:config:set gmail.client_secret="YOUR_GOOGLE_CLIENT_SECRET"

# Redeploy functions
firebase deploy --only functions
```

### Step 4: Enable Authentication

In Firebase Console:
1. Go to **Authentication** → **Sign-in method**
2. Enable **Email/Password**
3. (Optional) Enable **Google** sign-in

### Step 5: Test the Deployment

Visit your deployed app:
- **Web App**: https://cleveland-lgbtq-center.web.app
- **API**: https://us-central1-cleveland-lgbtq-center.cloudfunctions.net/api

Test checklist:
- [ ] Sign up for a new account
- [ ] Complete setup wizard
- [ ] Add a test client
- [ ] Connect Gmail
- [ ] Send test email

## What Firebase Studio Does Automatically

✅ **Hosting**: Deploys React app with SPA routing  
✅ **Functions**: Deploys all Cloud Functions  
✅ **Firestore**: Creates database with security rules  
✅ **Indexes**: Sets up database indexes  
✅ **Build**: Runs `npm run build` for production  

## Manual Deployment (Alternative)

If Firebase Studio is unavailable:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize (if not done)
firebase init

# Build frontend
cd src/web/frontend
npm install
npm run build
cd ../../..

# Install function dependencies
cd functions
npm install
cd ..

# Deploy everything
firebase deploy
```

## Troubleshooting

### "Project not found"
- Create project at: https://console.firebase.google.com
- Update `.firebaserc` with your project ID

### "Functions deployment failed"
- Check `functions/package.json` dependencies
- Run `cd functions && npm install` locally first
- Check Firebase Console Functions logs

### "Firestore permission denied"
- Verify `firestore.rules` deployed correctly
- Check user is authenticated

### "Gmail connection fails"
- Verify OAuth credentials in Google Cloud Console
- Check redirect URI matches exactly
- Ensure Gmail API is enabled

## Next Steps

After successful deployment:

1. **Set up custom domain** (optional)
2. **Configure billing** for production traffic
3. **Set up monitoring** in Firebase Console
4. **Invite team members** to Firebase project

## Support

- Firebase Docs: https://firebase.google.com/docs
- Firebase Studio Help: https://firebase.google.com/studio
- Functions Logs: `firebase functions:log`
