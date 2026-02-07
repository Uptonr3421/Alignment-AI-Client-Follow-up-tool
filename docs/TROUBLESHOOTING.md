# Troubleshooting Guide
## Client Follow-Up Automation System

**For:** Program Coordinators, Case Managers, and IT Support  
**Last Updated:** February 2026

---

## Quick Problem Finder

| Problem | Go To Section |
|---------|---------------|
| Emails aren't sending | [Emails Not Sending](#emails-not-sending) |
| Can't log in | [Can't Login](#cant-login) |
| Page shows an error | [Database Errors](#database-errors) |
| Gmail disconnected | [Gmail Disconnected](#gmail-disconnected) |
| Need to backup data | [Backup & Restore](#backup--restore) |
| Something else is wrong | [Emergency Contacts](#emergency-contacts) |

---

## Emails Not Sending

Follow this checklist in order:

### Step 1: Check Gmail Connection

**How to check:**
1. Go to **Settings** → **Gmail**
2. Look for a green checkmark ✅ or "Connected" status

**If it says "Disconnected":**
- See [Gmail Disconnected](#gmail-disconnected) section below

---

### Step 2: Check Your Gmail Quota

Gmail limits how many emails you can send per day:

| Account Type | Daily Limit |
|--------------|-------------|
| Regular Gmail (@gmail.com) | 500 emails/day |
| Google Workspace (business) | 2,000 emails/day |

**To check if you've hit the limit:**
1. Try sending an email from your regular Gmail
2. If Gmail says you've sent too many emails, wait 24 hours

⚠️ **Tip:** Most centers never hit this limit. You'd need 500+ clients in one day.

---

### Step 3: Check Email Template is Valid

A broken template can stop emails from sending:

1. Go to **Settings** → **Templates**
2. Look for any red error messages
3. Make sure you didn't accidentally delete merge fields like `[First Name]`
4. Click **"Test Send"** to yourself

**Common template mistakes:**
- ❌ `[FirstName]` (missing space)
- ✅ `[First Name]` (correct)
- ❌ `[first name]` (lowercase)
- ✅ `[First Name]` (correct)

---

### Step 4: Check if Emails are Scheduled

Emails don't send immediately — they're scheduled:

1. Go to **Dashboard**
2. Look at "Today's Follow-Ups"
3. Check that emails show as "Scheduled" or "Sent"

**Normal behavior:**
- Welcome emails: Send within 5 minutes of adding client
- Reminder emails: Send 1 day before appointment at 9 AM
- No-show emails: Send 1 day after missed appointment at 9 AM

---

### Step 5: Check Gmail Sent Folder

The emails might be sending but you don't realize it:

1. Open your regular Gmail
2. Look in the **Sent** folder
3. Do you see emails to clients?

**If emails are in Sent but clients say they didn't get them:**
- Ask clients to check their spam/junk folder
- Add your email address to their contacts to prevent spam filtering

---

### Step 6: Still Not Working?

If none of the above worked:

1. **Disconnect and reconnect Gmail:**
   - Settings → Gmail → Disconnect
   - Settings → Gmail → Connect Gmail
   - Sign in again

2. **Check for Google security alerts:**
   - Open Gmail
   - Look for any security warning emails from Google
   - If Google blocked "less secure app access," approve the system

3. **Contact support** (see [Emergency Contacts](#emergency-contacts))

---

## Can't Login

### Forgot Password

**Step 1:** Click **"Forgot Password"** on the login screen

**Step 2:** Enter your email address

**Step 3:** Check your email inbox (and spam folder) for a reset link

**Step 4:** Click the link and create a new password

⚠️ **Tip:** The reset link expires after 1 hour for security. If it expired, request a new one.

---

### "Session Expired" Error

This means you were logged in too long:

1. Click **"Login Again"**
2. Enter your username and password
3. You'll return to where you were

**To prevent this:** The system logs you out after 24 hours for security. This is normal.

---

### "Account Locked" Message

This happens after 5 failed login attempts:

1. Wait 15 minutes
2. Try again with the correct password
3. If you forgot your password, use "Forgot Password" (above)

**If still locked after 15 minutes:** Contact your center director or IT support.

---

### Page Just Keeps Loading

**Try these in order:**

1. **Refresh the page** (F5 or Ctrl+R on Windows, Cmd+R on Mac)

2. **Clear your browser cache:**
   - Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
   - Select "Cached images and files"
   - Click Clear
   - Try logging in again

3. **Try a different browser:**
   - If using Chrome, try Firefox or Edge
   - If using Safari, try Chrome

4. **Check if the website is down:**
   - Ask a coworker if they can log in
   - If nobody can log in, contact support

---

## Database Errors

### "Connection Failed" or "Database Error"

**First, check your internet:**
- Can you open other websites? (Google.com, etc.)
- If no internet, fix that first

**If internet works:**

1. **Wait 2 minutes and refresh**
   - Sometimes the database is temporarily busy

2. **Check system status:**
   - If using the web version, check if your hosting service is down
   - For Render: status.render.com
   - For Railway: status.railway.app
   - For Supabase: status.supabase.com

3. **Try logging out and back in**

---

### "Data Not Saving"

If you add a client but they don't appear in the list:

**Step 1:** Wait 10 seconds
- The system might still be saving

**Step 2:** Refresh the page
- Press F5 (Windows) or Cmd+R (Mac)
- Don't worry — if the save worked, your data is safe

**Step 3:** Check if required fields are filled
- First Name and Email are required
- If you left them blank, the system won't save

**Step 4:** Try again
- Sometimes the internet hiccups
- Re-enter the information and save again

---

### Client Data Looks Wrong or Missing

**If information you entered disappeared:**

1. Check if someone else edited it
   - The system logs all changes
   - Ask your coworkers if they made changes

2. Check the audit log:
   - Go to Settings → Audit Log
   - Look for recent changes to that client

3. If data is truly missing and you didn't delete it:
   - Contact support immediately
   - Do NOT add the client again yet (could cause duplicates)

---

## Gmail Disconnected

### How to Reconnect Gmail

**Step 1:** Go to **Settings** → **Gmail**

**Step 2:** Click **"Disconnect"** (if shown)

**Step 3:** Click **"Connect Gmail"**

**Step 4:** A Google sign-in window opens
- Sign in with the Gmail account you want to use
- This should be your work email

**Step 5:** Grant permissions
- Google will ask for permission to "Send email on your behalf"
- Click **"Allow"** or **"Yes"**

**Step 6:** Confirm connection
- You should see a green checkmark ✅
- The button should say "Connected"

---

### "Google Blocked This App" Error

Google sometimes blocks apps for security. Here's how to fix it:

**Option 1: Use App Passwords (Recommended)**

1. Go to myaccount.google.com
2. Click **Security** → **2-Step Verification** (turn it on if off)
3. Go back to Security → **App Passwords**
4. Click **Select app** → **Other**
5. Type "Client Automation System"
6. Click **Generate**
7. Copy the 16-character password
8. In your system, paste this instead of your regular Gmail password

**Option 2: Allow Less Secure Apps (Less Safe)**

⚠️ **Warning:** This reduces your account security. Only use if Option 1 doesn't work.

1. Go to myaccount.google.com
2. Click **Security**
3. Find **"Less secure app access"**
4. Turn it **ON**

---

### Gmail Keeps Disconnecting

If you have to reconnect Gmail every few days:

**Possible causes:**
- You changed your Google password
- Google security settings reset
- Your account has 2-factor authentication that expired

**To fix:**
1. Go to myaccount.google.com → Security → Third-party apps
2. Find "Client Automation System" or your app name
3. Remove it
4. Reconnect in your system (see steps above)

---

## Backup & Restore

### How to Backup Your Data

**Automatic Backups (Web Version):**

The system backs up automatically every day. But you should also do manual backups monthly.

**Manual Backup:**

1. Go to **Settings** → **Backup**
2. Click **"Export Database"**
3. Save the file to your computer or Google Drive
4. Name it with the date: `backup-2026-02-06.sql`

**What's in the backup:**
- All client records
- All email history
- All settings
- Email templates

**What's NOT in the backup:**
- Gmail connection (you'll reconnect after restore)
- Login passwords (you'll log in normally)

---

### How to Restore From Backup

⚠️ **Warning:** Restoring replaces ALL current data with the backup data. Any changes made since the backup will be lost.

**Before restoring:**
1. Make a new backup of current data (in case you need to go back)
2. Tell all staff to stop using the system temporarily

**To restore:**

1. Go to **Settings** → **Backup**
2. Click **"Restore Database"**
3. Click **"Choose File"** and select your backup file
4. Click **"Upload and Restore"**
5. Wait for the confirmation message
6. Log out and log back in

**After restoring:**
- Reconnect Gmail (Settings → Gmail)
- Check that all data looks correct
- Tell staff they can use the system again

---

### Exporting Client List to Excel

For a simple spreadsheet backup:

1. Go to **Clients**
2. Click **"Export to CSV"**
3. Open the file in Excel or Google Sheets
4. Save it to your computer or cloud storage

This doesn't restore the full system, but it's useful for:
- Reports to your director
- Sharing with other organizations
- Keeping a simple record

---

## Common Error Messages

| Error Message | What It Means | What To Do |
|---------------|---------------|------------|
| "Network Error" | Your internet disconnected | Check WiFi/cable, refresh page |
| "401 Unauthorized" | Login expired | Log in again |
| "404 Not Found" | Page doesn't exist | Check the URL, use the menu instead |
| "500 Server Error" | System problem | Wait 5 minutes, try again, contact support if persists |
| "Quota Exceeded" | Sent too many emails | Wait 24 hours for Gmail limit to reset |
| "Template Error" | Email template has mistake | Check for typos in merge fields like `[First Name]` |
| "Database Timeout" | Database busy | Wait 2 minutes, refresh |
| "OAuth Error" | Gmail connection broken | Reconnect Gmail (see above) |

---

## When Something Else Goes Wrong

### General Troubleshooting Steps

**Try these first for any problem:**

1. **Refresh the page** (F5 or Ctrl+R)
2. **Log out and log back in**
3. **Clear your browser cache** (Ctrl+Shift+Delete)
4. **Try a different browser**
5. **Restart your computer**

**If none of these work:** Move to emergency contacts below.

---

### Before Contacting Support

Please gather this information to help us help you faster:

1. **What were you trying to do?**
   - Example: "Add a new client"

2. **What happened instead?**
   - Example: "Got a red error message saying 'Database Error'"

3. **What browser are you using?**
   - Chrome? Firefox? Safari? Edge?

4. **Screenshots help!**
   - Press Print Screen (Windows) or Cmd+Shift+4 (Mac)
   - Paste or attach the image to your email

5. **When did this start?**
   - Just today? Has it been happening for a week?

---

## Emergency Contacts

### Who to Call for Help

| Issue | Contact | When |
|-------|---------|------|
| **System not working** | support@alignment-ai.io | Any technical problem |
| **Forgot password** | Your center director | If reset email doesn't work |
| **Urgent client need** | Call the client directly | Don't wait for system to be fixed |
| **Data breach concern** | support@alignment-ai.io | If you think data was accessed improperly |
| **Feature request** | support@alignment-ai.io | If you want new features |

### What Counts as an Emergency?

**Call/Email Immediately:**
- 🚨 System completely down and you can't access client data
- 🚨 You think client data was lost or stolen
- 🚨 Emails are sending to the wrong people

**Can Wait Until Tomorrow:**
- One email didn't send (send manually from Gmail)
- Page is slow but working
- Feature you'd like to see added

---

## Maintenance Windows

The web version may occasionally be down for maintenance:

- **Scheduled maintenance:** Sundays, 2-4 AM EST (rare)
- **Emergency maintenance:** As needed (we'll email you)

**During maintenance:**
- Desktop version: Works normally (emails queue until internet returns)
- Web version: Unavailable

---

## Quick Reference Card

Print this and keep it nearby:

```
┌────────────────────────────────────────────────────────────┐
│           EMERGENCY QUICK FIXES                            │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Emails not sending?                                       │
│  → Check Settings → Gmail is connected (green checkmark)   │
│                                                            │
│  Can't log in?                                             │
│  → Click "Forgot Password" on login screen                 │
│                                                            │
│  Page not loading?                                         │
│  → Press F5 to refresh                                     │
│                                                            │
│  Something weird happening?                                │
│  → Log out, close browser, log back in                     │
│                                                            │
│  Still stuck?                                              │
│  → support@alignment-ai.io                                 │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

*This guide is updated regularly. Last updated: February 2026*
