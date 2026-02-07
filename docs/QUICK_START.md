# Quick Start Guide

Welcome! This guide will help you get started with the Cleveland LGBTQ Center Client Follow-Up Automation System in just a few minutes.

## Choose Your Version

### 🖥️ Desktop App (Recommended for Individual Staff)

**Best for**: Single user on a Windows computer

**Installation Steps**:

1. **Download** the installer
   - Go to the [Releases page](https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool/releases)
   - Download the latest `.msi` file (e.g., `lgbtq-center-automation-1.0.0.msi`)

2. **Install** the application
   - Double-click the downloaded `.msi` file
   - Click "Next" through the installation wizard
   - Accept the default installation folder (or choose your own)
   - Click "Install"
   - Wait for the installation to complete (about 1 minute)
   - Click "Finish"

3. **Launch** the application
   - Find "LGBTQ Center Automation" in your Start Menu
   - Double-click to launch
   - The app will open to the setup screen

4. **Configure** email settings
   - Click on "Settings" in the left sidebar
   - Enter your email address (e.g., `contact@lgbtqcleveland.org`)
   - Enter your SMTP server details:
     - **Host**: `smtp.gmail.com` (for Gmail) or your provider's SMTP server
     - **Port**: `587` (TLS) or `465` (SSL)
     - **Username**: Your full email address
     - **Password**: Use an app-specific password (see below)
   - Click "Test Connection" to verify
   - Click "Save"

5. **Start using** the system
   - Click "Clients" to add your first client
   - The system will automatically send emails based on your schedule

### 🌐 Web App (Recommended for Teams)

**Best for**: Multiple staff members accessing from different computers

**Installation Steps**:

1. **Download** the web package
   - Go to the [Releases page](https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool/releases)
   - Download `lgbtq-center-web-1.0.0.zip`

2. **Extract** the files
   - Right-click the downloaded file
   - Choose "Extract All..."
   - Choose a location (e.g., `C:\LGBTQCenter\` or `/opt/lgbtq-center/`)
   - Click "Extract"

3. **Install Node.js** (if not already installed)
   - Go to [nodejs.org](https://nodejs.org)
   - Download the LTS version
   - Run the installer
   - Accept all defaults

4. **Start** the application
   - **Windows**: Double-click `start.bat` in the extracted folder
   - **Mac/Linux**: Run `./start.sh` in a terminal
   - Wait for "Server running on port 3000" message

5. **Open** in your browser
   - Navigate to `http://localhost:3000`
   - You should see the login screen

6. **Create** your first account
   - Click "Create Account"
   - Enter your name and email
   - Create a secure password
   - Click "Register"

7. **Configure** email settings
   - Click your profile icon (top right)
   - Select "Settings"
   - Go to "Email Configuration"
   - Enter your SMTP details (same as desktop app above)
   - Click "Test Connection"
   - Click "Save"

## Setting Up Email (Gmail Example)

If you're using Gmail, you'll need an **app-specific password**:

1. Go to your [Google Account](https://myaccount.google.com)
2. Click "Security" in the left sidebar
3. Under "Signing in to Google," select "2-Step Verification"
4. Scroll down and click "App passwords"
5. Select "Mail" and "Windows Computer" (or "Other")
6. Click "Generate"
7. Copy the 16-character password
8. Use this password in the automation system (NOT your regular Google password)

### For Other Email Providers

**Microsoft 365 / Outlook.com**:
- SMTP Host: `smtp.office365.com`
- Port: `587`
- Enable app password in your Microsoft account settings

**Yahoo Mail**:
- SMTP Host: `smtp.mail.yahoo.com`
- Port: `587`
- Generate app password at [Yahoo Account Security](https://login.yahoo.com/account/security)

## Your First Client

Once your email is configured:

1. Click "Add Client" or "New Client"
2. Enter client information:
   - **Name**: Client's first and last name
   - **Email**: Client's email address
   - **Appointment Date**: When they're scheduled to come in
   - **Status**: "Scheduled" for new appointments
3. Click "Save"

The system will automatically:
- Send a welcome email immediately
- Send a reminder 48 hours before the appointment
- Track whether they showed up
- Send follow-up emails if needed

## Customizing Email Templates

1. Click "Templates" in the sidebar
2. Select which template to edit (Welcome, Reminder, No-Show, Re-Engagement)
3. Edit the text:
   - Use `{{client_name}}` to insert the client's name
   - Use `{{appointment_date}}` to insert their appointment
   - Keep the tone warm and professional
4. Preview your changes
5. Click "Save Template"

## Common First-Time Issues

### "Connection Failed" Error
- **Check**: Is your internet working?
- **Check**: Did you use an app-specific password, not your regular password?
- **Check**: Are you using the correct SMTP server and port?

### "Permission Denied" on Windows
- **Right-click** the installer
- **Select** "Run as Administrator"
- Try installation again

### Web App Won't Start
- **Check**: Is Node.js installed? Run `node --version` in a terminal
- **Check**: Is port 3000 already in use? Try restarting your computer
- **Check**: Are you in the correct folder? You should see `start.bat` or `start.sh`

## Next Steps

✅ **Read the [User Guide](USER_GUIDE.md)** — Learn all features in detail  
✅ **Set up your email templates** — Customize messages for your clients  
✅ **Import existing clients** — If you have a list in Excel/CSV  
✅ **Configure backup schedule** — Protect your data  

## Need Help?

- 📖 [User Guide](USER_GUIDE.md) — Detailed feature documentation
- 🔧 [Troubleshooting](TROUBLESHOOTING.md) — Solutions to common problems
- 💻 [API Reference](API_REFERENCE.md) — For technical integration
- 📧 Email Support: [contact@alignment-ai.io](mailto:contact@alignment-ai.io)

---

**Welcome to easier client management! You're all set to start automating follow-ups. 🎉**
