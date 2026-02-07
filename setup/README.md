# Automated Setup System

## Quick Start (One Command)

```bash
# Clone and setup everything
git clone https://github.com/your-org/nonprofit-client-automation.git
cd nonprofit-client-automation
chmod +x setup/install.sh
./setup/install.sh
```

That's it. The installer handles:
- ✅ Dependency installation (Node.js, npm, Rust if desktop)
- ✅ Database setup (PostgreSQL or SQLite)
- ✅ Environment configuration
- ✅ Gmail OAuth app creation helper
- ✅ Build process
- ✅ Service startup

## What Gets Installed

### Web Version
- Node.js 18+ (via nvm if not present)
- PostgreSQL (via Docker or system package)
- Backend API server
- Frontend React app
- Automated database migrations

### Desktop Version
- Node.js 18+
- Rust toolchain
- Tauri CLI
- SQLite (built-in)
- NSIS installer builder (Windows)

## Post-Setup

After installation completes:

1. **Web:** Visit `http://localhost:3000` for setup wizard
2. **Desktop:** Run the built installer from `dist/`
3. **Configure:** Follow the 5-minute setup wizard (Gmail, center info, templates)

## Updating

```bash
./setup/update.sh
```

Pulls latest code, reinstalls dependencies, rebuilds, preserves data.

## Backup & Restore

```bash
# Backup
./setup/backup.sh

# Restore
./setup/restore.sh backup-2024-01-15.sql
```

## Support

- Documentation: `/docs`
- Troubleshooting: `/docs/TROUBLESHOOTING.md`
- Email: support@alignment-ai.io
