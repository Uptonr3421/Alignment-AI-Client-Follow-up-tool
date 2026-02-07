# Cleveland LGBTQ Center Client Automation

<p align="center">
  <strong>Automated client follow-up system for nonprofit organizations</strong><br>
  <em>Built with care for the Cleveland LGBTQ Center</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/NGLCC-Certified%20LGBTBE-orange" alt="NGLCC Certified">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/Status-Production%20Ready-blue" alt="Production Ready">
</p>

---

## What This Is

A complete client follow-up automation system designed specifically for the Cleveland LGBTQ Center. It automatically sends a sequence of emails to clients: welcome, appointment reminder, no-show follow-up, and re-engagement.

**This is a pro bono gift.** The Center owns everything—source code, data, and full rights to modify or distribute.

## 🔐 Authentication & Independence

**Google OAuth Sign-In:**
- Staff sign in with Google accounts (@lgbtqcleveland.org)
- No password management required
- Secure OAuth 2.0 authentication
- Automatic Gmail integration

**Complete Independence:**
- ✅ $0/month operational cost (Firebase free tier)
- ✅ 100% data ownership (your Firebase project)
- ✅ No dependencies on Alignment AI
- ✅ MIT License - full rights
- ✅ Export and migrate anytime

**See:** [CLIENT_INDEPENDENCE_GUIDE.md](CLIENT_INDEPENDENCE_GUIDE.md) for complete details.

## Quick Start

### Option 1: Firebase Deployment (Recommended for Production)

**Automated Installation:**
```bash
git clone https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool.git
cd Alignment-AI-Client-Follow-up-tool
./install-firebase.sh
```

**Or using Firebase Studio (No-Code):**
1. Go to [Firebase Studio](https://firebase.studio)
2. Import from GitHub: `Uptonr3421/Alignment-AI-Client-Follow-up-tool`
3. Let AI configure and deploy automatically

See [firebase-studio-handoff.md](firebase-studio-handoff.md) for complete Firebase setup.

### Option 2: Local Development

```bash
# Install dependencies
npm install
cd functions && npm install && cd ..
cd src/web/frontend && npm install && cd ../../..

# Start Firebase emulators
npm run emulators

# In another terminal, start frontend
cd src/web/frontend && npm run dev
```

### Option 3: Windows Desktop App

1. Download `LGBTQ-Center-Automation-Setup.exe` from [Releases](../../releases)
2. Double-click to install (works like any Windows program)
3. Launch and follow the setup wizard

## What It Does

| Feature | Description |
|---------|-------------|
| **4-Email Sequence** | Welcome → Reminder → No-show → Re-engagement |
| **Client Database** | Track intake, appointments, status, history |
| **Staff Dashboard** | See today's tasks and upcoming appointments |
| **Gmail Integration** | Sends from your existing email account |
| **Template Editor** | Customize emails without touching code |
| **Zero Monthly Cost** | No subscriptions, no hidden fees |

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  Desktop App    │     │  Firebase Web   │
│  (Tauri + React)│     │  (React + Vite) │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │                       ▼
         │              ┌──────────────────┐
         │              │ Firebase Hosting │
         │              │ Cloud Functions  │
         │              │ Firestore DB     │
         │              │ Firebase Auth    │
         ▼              └──────────────────┘
  ┌──────────────┐              │
  │   SQLite     │              ▼
  │  (Local DB)  │        ┌──────────┐
  └──────────────┘        │ Gmail API│
                          └──────────┘
```

- **Firebase (Production)**: Cloud Firestore, serverless functions, zero config
- **Desktop (Offline)**: Local SQLite, works offline, single computer
- **Shared**: Gmail API for both deployment options

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Firebase Cloud Functions (Node.js)
- **Database**: Cloud Firestore (production) / SQLite (desktop)
- **Hosting**: Firebase Hosting
- **Authentication**: Firebase Auth
- **Email**: Gmail API with OAuth 2.0
- **Desktop**: Tauri (Rust) - optional offline mode

## Documentation

**Deployment & Setup:**
- [Firebase Studio Handoff Guide](firebase-studio-handoff.md) - Complete Firebase deployment instructions
- [Firebase Setup](FIREBASE_SETUP.md) - Quick Firebase commands
- [Firebase Deployment](FIREBASE_DEPLOYMENT.md) - Detailed deployment guide
- [Deployment Checklist](DEPLOYMENT_CHECKLIST_FIREBASE.md) - Step-by-step checklist

**User Documentation:**
- [User Guide](docs/USER_GUIDE.md) - Complete usage instructions
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Common issues and fixes
- [Quick Start](docs/QUICK_START.md) - Get running fast
- [API Reference](docs/API_REFERENCE.md) - Technical details

## Screenshots

<!-- TODO: Add screenshots of dashboard, client form, template editor -->

## Contributing

This project was built specifically for the Cleveland LGBTQ Center, but we welcome adaptations for other nonprofits. If you'd like to use this for your organization:

1. Fork the repository
2. Customize the email templates for your needs
3. Deploy following our setup guides

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## About Alignment AI

We are an NGLCC-certified LGBTBE providing AI and automation services. This project represents our commitment to supporting mission-driven organizations in Cleveland and beyond.

- **Website**: [alignment-ai.io](https://alignment-ai.io)
- **Email**: hello@alignment-ai.io
- **Phone**: 216-200-7861

## License

MIT License - see [LICENSE](LICENSE) for details.

The Cleveland LGBTQ Center owns full rights to this software. Use it, modify it, share it—it's yours.

---

<p align="center">
  <em>Built with care in Cleveland, for Cleveland.</em>
</p>
