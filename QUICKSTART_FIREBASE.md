# Quick Start: Firebase Studio Deployment

**Time to Deploy: 15-30 minutes**

This is the easiest way to deploy the Cleveland LGBTQ Center Client Automation tool.

---

## What You Need

- ✅ Google Account
- ✅ GitHub Account
- ✅ 15-30 minutes

---

## Step 1: Firebase Project (5 minutes)

1. Go to https://console.firebase.google.com
2. Click "Add project" or "Create a project"
3. Enter project name: **"Cleveland LGBTQ Center"**
4. Accept terms and click "Continue"
5. Disable Google Analytics (optional) or keep it enabled
6. Click "Create project"
7. Wait for project creation to complete
8. **Note your Project ID** (shown in console, e.g., `cleveland-lgbtq-center`)

---

## Step 2: Enable Billing (2 minutes)

⚠️ **Don't worry!** You'll stay in the free tier ($0/month). Billing is just required for Cloud Functions.

1. In Firebase Console, click ⚙️ (Settings) → "Usage and billing"
2. Click "Modify plan"
3. Select "Blaze (Pay as you go)"
4. Add a payment method
5. Set a budget alert at $5 (optional safety measure)

**You will not be charged.** The free tier includes:
- 2 million function calls/month
- 10 GB hosting
- 50K database reads/day
- Way more than you'll use!

---

## Step 3: Firebase Studio Deployment (5-10 minutes)

### Option A: Using Firebase Studio (Easiest)

1. **Go to Firebase Studio**
   - Visit: https://firebase.studio
   - Sign in with your Google account (same one as Firebase)

2. **Import Project**
   - Click "Import Project" or "New Project"
   - Select "Import from GitHub"

3. **Connect GitHub**
   - Authorize Firebase Studio to access GitHub
   - Select repository: `Uptonr3421/Alignment-AI-Client-Follow-up-tool`
   - Branch: `main`

4. **Let AI Configure (Automatic)**
   
   Firebase Studio's Gemini will automatically detect:
   - ✅ React frontend with Vite
   - ✅ Firebase Cloud Functions
   - ✅ Firestore database
   - ✅ Build configuration
   
   This takes 1-2 minutes.

5. **Review Configuration**
   
   Verify these settings (should be auto-detected):
   ```
   Frontend:
   - Framework: React
   - Build command: npm run build:firebase
   - Output directory: dist
   
   Backend:
   - Functions path: functions/
   - Runtime: Node.js 20
   ```

6. **Deploy**
   - Click "Deploy"
   - Wait 5-10 minutes
   - Watch the build progress

7. **Deployment Complete! 🎉**
   
   You'll get these URLs:
   - Web app: `https://[your-project-id].web.app`
   - API: `https://us-central1-[your-project-id].cloudfunctions.net/api`

### Option B: Using Automated Script (Alternative)

If Firebase Studio isn't available:

```bash
# Clone repository
git clone https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool.git
cd Alignment-AI-Client-Follow-up-tool

# Run automated installer
./install-firebase.sh

# Follow the prompts
# The script will:
# 1. Check prerequisites
# 2. Install dependencies
# 3. Build the application
# 4. Deploy to Firebase
```

---

## Step 4: Enable Authentication (3 minutes)

1. Go to Firebase Console → Authentication
2. Click "Get started"
3. Click on "Google"
4. Enable the Google sign-in provider
5. Click "Save"

**Why?** Staff will sign in with their Google accounts.

---

## Step 5: Configure Gmail (10 minutes)

This allows the system to send emails on your behalf.

### 5.1: Create OAuth Credentials

1. Go to https://console.cloud.google.com
2. Select your Firebase project from dropdown
3. Click "APIs & Services" → "Library"
4. Search for "Gmail API"
5. Click "Enable"

6. Go to "APIs & Services" → "Credentials"
7. Click "Configure Consent Screen"
   - User Type: External
   - App name: "LGBTQ Center Client Automation"
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue
   - Skip scopes
   - Skip test users
   - Save

8. Click "Create Credentials" → "OAuth 2.0 Client ID"
   - Application type: Web application
   - Name: "LGBTQ Center Email"
   - Authorized redirect URIs: Add this EXACTLY:
     ```
     https://us-central1-[YOUR-PROJECT-ID].cloudfunctions.net/api/gmail/callback
     ```
     Replace `[YOUR-PROJECT-ID]` with your actual project ID
   - Click "Create"

9. **Save these values** (you'll need them):
   - Client ID (looks like: `123456-abc.apps.googleusercontent.com`)
   - Client Secret (looks like: `GOCSPX-abc123def456`)

### 5.2: Configure Firebase Functions

```bash
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login
firebase login

# Set your project
firebase use [YOUR-PROJECT-ID]

# Set Gmail credentials
firebase functions:config:set \
  gmail.client_id="YOUR_CLIENT_ID_HERE" \
  gmail.client_secret="YOUR_CLIENT_SECRET_HERE"

# Redeploy functions to apply changes
firebase deploy --only functions
```

**Wait 2-3 minutes** for functions to redeploy.

---

## Step 6: Test Everything! (5 minutes)

### 6.1: Visit Your App

Go to: `https://[your-project-id].web.app`

### 6.2: Create Account

1. Click "Sign Up"
2. Enter email and password
3. Click "Create Account"

### 6.3: Complete Setup Wizard

The wizard will appear automatically:

1. **Center Information**
   - Name: Cleveland LGBTQ Center
   - Email: (your email)
   - Phone: (your phone)
   - Click "Next"

2. **Email Templates**
   - Review default templates
   - Click "Next"

3. **Gmail Connection**
   - Click "Connect Gmail"
   - Choose your Google account
   - Click "Allow" to grant permissions
   - Should redirect back with "Connected" ✓

4. **Complete Setup**
   - Click "Finish Setup"

### 6.4: Test Creating a Client

1. Click "Add Client"
2. Fill in:
   - First name: Test
   - Last name: Client
   - Email: your-email@example.com
   - Appointment: (choose a date)
3. Click "Save Client"

**This will automatically:**
- Create the client record
- Schedule 4 emails
- Show in your dashboard

### 6.5: Send Test Email

1. Go to Settings
2. Find "Send Test Email"
3. Send to your own email
4. Check your inbox

**Success!** ✅ If you received the email, everything works!

---

## You're Done! 🎉

Your client automation system is now live and ready to use.

**What happens now:**
- Emails process automatically every 5 minutes
- Staff can log in and add clients
- Dashboard shows stats and upcoming tasks
- All within Firebase free tier

---

## Next Steps

### Train Your Team

1. Create accounts for each staff member
2. Show them how to:
   - Add clients
   - View client details
   - Check the dashboard
   - Edit email templates

### Regular Maintenance

- Check Firebase Console weekly
- Monitor email sending
- Back up data monthly (Firestore export)

### Get Help

If you need assistance:
- 📖 Full guide: See `firebase-studio-handoff.md`
- 📧 Email: hello@alignment-ai.io
- 🐛 Issues: GitHub issues page

---

## Troubleshooting

### "Function deployment failed"
- Check that billing is enabled
- Verify you have owner role on project
- Try: `firebase deploy --only functions`

### "Gmail connection fails"
- Verify OAuth redirect URI matches EXACTLY
- Check Client ID and Secret are correct
- Ensure Gmail API is enabled

### "Permission denied" in Firestore
- Check user is logged in
- Verify firestore rules deployed
- Try: `firebase deploy --only firestore:rules`

### "App not loading"
- Check hosting deployed: `firebase hosting:list`
- Verify URL is correct
- Clear browser cache

---

## Cost Monitoring

Check your usage monthly:

1. Go to Firebase Console
2. Click "Usage" in sidebar
3. Verify you're under free tier limits:
   - Functions: < 2M invocations
   - Firestore: < 50K reads/day
   - Hosting: < 10 GB transfer

**Expected usage:**
- 500 clients = ~5,000 database operations/day
- 300 emails/day = ~10,000 function calls/month
- **Well within free tier!**

---

## Summary

✅ **What you deployed:**
- Web-based client management system
- Automated email follow-up (4 email sequence)
- Staff dashboard with statistics
- Gmail integration for sending
- Secure authentication

✅ **What it costs:**
- $0/month (free tier)

✅ **What you own:**
- All source code (MIT license)
- All data (in your Firestore)
- Full control to modify

✅ **What happens if you exceed free tier:**
- You'll get an email alert (if you set one up)
- Estimated: $0.50-$2/month if you 3x the capacity
- Can always return to free tier by reducing usage

---

**Congratulations!** You've successfully deployed a professional client automation system. 

*Built with care for the Cleveland LGBTQ Center by Alignment AI* ❤️
