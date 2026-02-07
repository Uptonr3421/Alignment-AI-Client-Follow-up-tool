# Firebase Setup Commands

## Step 1: Install Firebase CLI
```bash
npm install -g firebase-tools
```

## Step 2: Login (You complete this)
```bash
firebase login
```
**This will output a URL. Share it with me or I'll detect it.**

## Step 3: Initialize Project
```bash
firebase init
```
Select:
- [x] Firestore
- [x] Functions
- [x] Hosting
- [x] Emulators (optional, for testing)

## Step 4: Deploy
```bash
firebase deploy
```

---

## Alternative: Use Your Free Firebase Studio Credits

1. Go to https://firebase.studio
2. Click "Import from GitHub"
3. Select: `Uptonr3421/Alignment-AI-Client-Follow-up-tool`
4. Let Firebase Studio AI agents configure and deploy

This uses your preview credits and requires minimal setup.

---

## Post-Deployment: OAuth Setup

After Firebase deploys, you'll need to enable Google Sign-In:

1. Go to Firebase Console → Authentication → Sign-in method
2. Enable "Google" provider
3. Add your domain to authorized domains
4. Gmail OAuth will work automatically

---

Ready to start with Step 1?
