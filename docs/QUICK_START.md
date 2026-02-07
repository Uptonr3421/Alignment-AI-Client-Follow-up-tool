# Quick Start Guide

Get the LGBTQ Center Client Automation system running in 5 minutes.

## Option 1: Windows Desktop App (Easiest)

### Step 1: Download
- Go to [GitHub Releases](../../releases)
- Download `LGBTQ-Center-Automation-Setup.exe`

### Step 2: Install
- Double-click the downloaded file
- Follow the visual wizard (Next → Next → Finish)
- A desktop shortcut will be created

### Step 3: Launch
- Double-click the desktop icon
- The setup wizard will guide you through:
  - Connecting your Gmail account
  - Entering your center information
  - Customizing email templates (optional)

### Step 4: Add Your First Client
- Click "Add Client"
- Fill in their information
- The automation begins automatically

---

## Option 2: Web Application

For multiple staff or cloud access.

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (or use SQLite for testing)

### Step 1: Clone and Install
```bash
git clone https://github.com/YOUR_USERNAME/lgbtq-center-automation.git
cd lgbtq-center-automation
npm install
```

### Step 2: Configure
```bash
cp src/web/backend/.env.example src/web/backend/.env
# Edit .env with your database credentials
```

### Step 3: Run
```bash
npm run dev:web
```

### Step 4: Open Browser
Navigate to http://localhost:3000

---

## First-Time Setup Checklist

- [ ] Gmail account connected
- [ ] Center name and contact info entered
- [ ] Email templates reviewed
- [ ] Test client added
- [ ] First welcome email sent successfully

## Next Steps

- Read the [User Guide](USER_GUIDE.md) for detailed features
- Check [Troubleshooting](TROUBLESHOOTING.md) if issues arise
- Review [API Reference](API_REFERENCE.md) for technical details

## Need Help?

- Email: hello@alignment-ai.io
- Phone: 216-200-7861
