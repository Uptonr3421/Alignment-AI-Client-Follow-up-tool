# Cleveland LGBTQ Center Client Follow-Up Automation

<div align="center">

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
[![NGLCC Certified](https://img.shields.io/badge/NGLCC-Certified-orange.svg)](https://nglcc.org/)

**A pro bono gift from [Alignment AI](https://alignment-ai.io) to the Cleveland LGBTQ Center**

*No SaaS. No monthly fees. Just solid software that serves the community.*

</div>

---

## 🎁 What This Is

This is a **gift** — a complete, production-ready client follow-up automation system built specifically for the Cleveland LGBTQ Center. It automates the four-email sequence that keeps clients engaged:

1. **Welcome Email** — Sent immediately after initial contact
2. **Reminder Email** — Sent 48 hours before scheduled appointment
3. **No-Show Email** — Sent if client misses appointment
4. **Re-Engagement Email** — Sent 7 days after no-show to reconnect

The system runs on your hardware (desktop or server), requires no monthly subscriptions, and gives you complete control over your data. If something breaks, email [contact@alignment-ai.io](mailto:contact@alignment-ai.io) and we'll fix it.

## 🚀 Quick Start (Non-Technical Users)

### Desktop App (Recommended for Individual Use)
1. **Download** the installer from [Releases](../../releases)
2. **Double-click** the `.msi` file and follow the wizard
3. **Launch** the app, enter your email credentials in Settings, and you're done

### Web App (Recommended for Teams)
1. **Download** the web package from [Releases](../../releases)
2. **Extract** to a folder on your server
3. **Run** `start.bat` (Windows) or `start.sh` (Mac/Linux)
4. **Open** `http://localhost:3000` in your browser

👉 **Need Help?** See [Quick Start Guide](docs/QUICK_START.md) for detailed instructions.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│  OPTION 1: Desktop App (Windows)                   │
│  ┌─────────────────────────────────────────────┐   │
│  │  Tauri + React UI                           │   │
│  │  ↓                                           │   │
│  │  Local SQLite Database                      │   │
│  │  ↓                                           │   │
│  │  SMTP Client (sends emails)                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  OPTION 2: Web App (Any Platform)                  │
│  ┌─────────────────────────────────────────────┐   │
│  │  React Frontend                              │   │
│  │  ↓                                           │   │
│  │  Express Backend API                        │   │
│  │  ↓                                           │   │
│  │  PostgreSQL or SQLite Database              │   │
│  │  ↓                                           │   │
│  │  SMTP Client (sends emails)                 │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Both options do the same thing. Choose desktop for simplicity, web for team collaboration.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Desktop Backend**: Tauri (Rust)
- **Web Backend**: Express.js, Node.js
- **Database**: SQLite (desktop) or PostgreSQL (web)
- **Email**: Nodemailer with SMTP
- **Styling**: CSS3 with custom design system
- **Testing**: Vitest, Playwright

### Why These Technologies?

- **Open Source**: No vendor lock-in
- **Battle-Tested**: Used by thousands of companies
- **Maintainable**: Large community, easy to find help
- **Accessible**: Built with WCAG 2.1 AA compliance

## 📸 Screenshots

<!-- Screenshots will be added here after UI implementation -->

### Desktop App
```
[Screenshot: Main Dashboard]
[Screenshot: Client List]
[Screenshot: Email Templates Editor]
[Screenshot: Settings Panel]
```

### Web App
```
[Screenshot: Login Screen]
[Screenshot: Dashboard with Analytics]
[Screenshot: Client Management]
[Screenshot: Email Automation Settings]
```

## 🤝 Contributing

This project is open source! If you work with another nonprofit and want to adapt this system, you're welcome to:

1. **Fork** this repository
2. **Customize** email templates, branding, and workflows
3. **Deploy** to your organization
4. **Share** improvements back via pull request (optional but appreciated)

See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup instructions.

## 📚 Documentation

- [User Guide](docs/USER_GUIDE.md) — How to use the system day-to-day
- [Quick Start](docs/QUICK_START.md) — Installation and setup
- [Troubleshooting](docs/TROUBLESHOOTING.md) — Common issues and solutions
- [API Reference](docs/API_REFERENCE.md) — For developers integrating or extending

## 🔒 Security

We take security seriously. This system:

- **Never stores passwords in plain text** — Uses encrypted credential storage
- **Validates all inputs** — Protection against injection attacks
- **Uses parameterized queries** — SQL injection prevention
- **Sanitizes HTML outputs** — XSS protection
- **Runs locally** — Your data never leaves your network

Found a vulnerability? Please email [security@alignment-ai.io](mailto:security@alignment-ai.io). See [SECURITY.md](SECURITY.md) for our responsible disclosure policy.

## 📜 License

**MIT License** — This means:

- ✅ The Cleveland LGBTQ Center owns this software completely
- ✅ You can modify it however you need
- ✅ You can share it with other nonprofits
- ✅ No attribution required (though appreciated!)
- ✅ No warranty implied — use at your own risk

See [LICENSE](LICENSE) for full legal text.

## 🎨 Brand Guidelines

This system uses the Cleveland LGBTQ Center's brand colors:

- **Primary Orange**: `#E6511A` — Call-to-action buttons, headers
- **Charcoal**: `#252422` — Body text, dark backgrounds
- **Mist**: `#f5f5f5` — Light backgrounds, cards

Design philosophy: Professional, warm, gracious, empowering. No jargon. No hype. Just tools that work.

## 💝 Credits

**Built by**: [Alignment AI](https://alignment-ai.io) (Upton Rand)  
**For**: Cleveland LGBTQ Center  
**Status**: NGLCC Certified Business Enterprise  

This is pro bono work — a contribution to a community that deserves better tools. If your nonprofit needs similar automation, reach out at [contact@alignment-ai.io](mailto:contact@alignment-ai.io).

---

<div align="center">

**Made with ❤️ in Cleveland**

*Serving the LGBTQ+ community with dignity, respect, and excellent software.*

</div>
