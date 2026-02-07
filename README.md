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

## Quick Start (5 Minutes)

### Option 1: Windows Desktop App (Recommended)

1. Download `LGBTQ-Center-Automation-Setup.exe` from [Releases](../../releases)
2. Double-click to install (works like any Windows program)
3. Launch and follow the setup wizard

### Option 2: Web Application

1. Clone this repository
2. Run `npm install` then `npm run dev`
3. Open http://localhost:3000

See [QUICK_START.md](docs/QUICK_START.md) for detailed instructions.

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
│  Desktop App    │     │   Web App       │
│  (Tauri + React)│     │ (React + Express)│
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
         ┌───────────┴───────────┐
         │   SQLite / PostgreSQL  │
         │   Gmail API            │
         └───────────────────────┘
```

- **Desktop**: Local SQLite, works offline, single computer
- **Web**: PostgreSQL, multi-user, cloud-hosted

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Desktop**: Tauri (Rust)
- **Backend**: Node.js, Express
- **Database**: SQLite (desktop) / PostgreSQL (web)
- **Email**: Gmail API with SMTP fallback

## Documentation

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
