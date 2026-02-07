# Zero-Configuration Setup Architecture
## Cleveland LGBTQ Center Client Automation

**Agent:** Agent 2 (Zero-Config Architect)  
**Date:** 2026-02-06  
**Status:** Design Complete - Ready for Implementation

---

## Executive Summary

This document outlines a **true zero-configuration** setup experience where Cleveland LGBTQ Center staff can be up and running in under 3 minutes with **zero technical knowledge required**.

**Key Principle:** The user should never see a terminal, edit a config file, or create a cloud account.

---

## RECOMMENDED APPROACH: Desktop App (Primary)

The desktop application is the **strongly recommended** option for the Cleveland LGBTQ Center because:
- ✅ No hosting required
- ✅ No database setup
- ✅ Works offline
- ✅ Single download + install
- ✅ Data stays on their computer
- ✅ No monthly costs ever

---

## ZERO-CONFIG SETUP FLOW (Desktop App)

### User Experience (Total Time: ~2-3 Minutes)

```
┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Download & Install (30 seconds)                        │
├─────────────────────────────────────────────────────────────────┤
│  User Action:                                                   │
│  • Click download link on gift page                             │
│  • Double-click downloaded .exe file                            │
│  • Click "Next" through installer wizard                        │
│                                                                 │
│  System Response:                                               │
│  • Auto-installs to Program Files                               │
│  • Creates desktop shortcut                                     │
│  • Creates Start Menu entry                                     │
│  • SQLite database auto-created on first launch                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: First Launch (10 seconds)                              │
├─────────────────────────────────────────────────────────────────┤
│  User Action:                                                   │
│  • Double-click desktop icon                                    │
│                                                                 │
│  System Response:                                               │
│  • App opens to welcome screen                                  │
│  • Database initialized automatically                           │
│  • Default email templates loaded                               │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: ONE Button Setup (60-90 seconds)                       │
├─────────────────────────────────────────────────────────────────┤
│  User Action:                                                   │
│  • Click big orange "Connect Gmail" button                      │
│  • Sign in to their Gmail in popup (standard Google login)      │
│  • Click "Allow" to grant permission                            │
│                                                                 │
│  System Response:                                               │
│  • Uses PRE-REGISTERED OAuth app (no config needed)             │
│  • Stores tokens securely in local encrypted storage            │
│  • Shows "Connected as: user@gmail.com"                         │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Center Info (30 seconds)                               │
├─────────────────────────────────────────────────────────────────┤
│  User Action:                                                   │
│  • Fill in 4 simple fields:                                     │
│    - Center Name (e.g., "Cleveland LGBTQ Center")               │
│    - Address (e.g., "6705 Detroit Ave, Cleveland, OH")          │
│    - Phone (e.g., "(216) 651-5428")                             │
│    - Staff Name (e.g., "Sarah")                                 │
│  • Click "Save"                                                 │
│                                                                 │
│  System Response:                                               │
│  • Saves to local SQLite database                               │
│  • Pre-fills email templates with center info                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 5: Done! App is Ready                                     │
├─────────────────────────────────────────────────────────────────┤
│  User Action:                                                   │
│  • Click "Add First Client" (optional)                          │
│  • Or just start using the app                                  │
│                                                                 │
│  System Response:                                               │
│  • Dashboard appears                                            │
│  • Ready to add clients and send automated emails               │
└─────────────────────────────────────────────────────────────────┘
```

---

## TECHNICAL IMPLEMENTATION

### 1. Gmail: Pre-Registered OAuth App (SOLUTION)

**Problem:** Gmail API requires OAuth credentials (Client ID + Secret), but users can't create Google Cloud projects.

**Solution:** We register ONE OAuth application and distribute credentials WITH the app.

```
┌─────────────────────────────────────────────────────────────────┐
│  SHARED OAUTH APP ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Alignment AI Google Cloud Project                              │
│  ├── OAuth 2.0 App: "LGBTQ Center Automation"                   │
│  ├── Client ID: (embedded in desktop app)                       │
│  ├── Client Secret: (embedded in desktop app)                   │
│  └── Redirect URI: http://localhost:8765/oauth/callback         │
│                           │                                     │
│                           │ (User authorizes)                   │
│                           ↓                                     │
│  User's Gmail Account ←───┘                                     │
│  • User signs in with THEIR Gmail                               │
│  • User grants permission to send emails                        │
│  • Refresh token stored locally on THEIR computer               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Security Considerations:**
- ✅ Client ID/Secret embedded in compiled binary (not plain text)
- ✅ Refresh tokens stored in OS keychain (encrypted)
- ✅ No server component = no token interception risk
- ✅ Users can revoke access anytime in Google Account settings
- ✅ OAuth app limited to `gmail.send` scope only

**Files to Modify:**
- `src/desktop/src-tauri/src/main.rs` - Add OAuth handler
- `src/desktop/src-tauri/tauri.conf.json` - Add OAuth plugin
- `src/desktop/src/components/SetupWizard.tsx` - Simplified 3-step flow

---

### 2. Database: SQLite with Zero Config (SOLUTION)

**Problem:** Databases normally require setup, configuration, and connection strings.

**Solution:** SQLite file-based database that auto-creates on first launch.

```rust
// Tauri main.rs - Database initialization
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

fn main() {
    tauri::Builder::default()
        .plugin(
            Builder::default()
                .add_migrations(
                    "sqlite:lgbtq_center.db",  // Auto-created in app data dir
                    vec![
                        Migration {
                            version: 1,
                            description: "create_initial_tables",
                            sql: include_str!("../migrations/001_initial.sql"),
                            kind: MigrationKind::Up,
                        }
                    ],
                )
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

**Database Location:**
- Windows: `%APPDATA%/LGBTQ Center Automation/lgbtq_center.db`
- macOS: `~/Library/Application Support/LGBTQ Center Automation/lgbtq_center.db`
- Linux: `~/.local/share/LGBTQ Center Automation/lgbtq_center.db`

**Benefits:**
- ✅ No database server to install
- ✅ No connection strings to configure
- ✅ No network setup
- ✅ Auto-migrations on app update
- ✅ Easy backup (just copy the .db file)

**Files to Modify:**
- `src/desktop/src-tauri/Cargo.toml` - Add tauri-plugin-sql
- `src/desktop/src-tauri/src/main.rs` - Initialize database
- `src/desktop/src-tauri/migrations/` - Create migration files

---

### 3. Hosting: Desktop App = No Hosting Needed (SOLUTION)

**Problem:** Web apps require servers, databases, and ongoing maintenance.

**Solution:** Desktop app runs entirely on user's computer.

```
┌─────────────────────────────────────────────────────────────────┐
│  DESKTOP APP ARCHITECTURE                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Tauri Desktop App                                       │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐  │   │
│  │  │ React UI    │  │ SQLite DB   │  │ Gmail OAuth     │  │   │
│  │  │ (Frontend)  │  │ (Local)     │  │ (Pre-embedded)  │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘  │   │
│  │           │              │                   │           │   │
│  │           └──────────────┴───────────────────┘           │   │
│  │                          │                               │   │
│  │                   ┌──────┴──────┐                        │   │
│  │                   │  Rust Core  │                        │   │
│  │                   │  (Tauri)    │                        │   │
│  │                   └─────────────┘                        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              │ (Only external connection)       │
│                              ↓                                  │
│                      Gmail API (sends emails)                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Auto-Update Mechanism:**
- Tauri has built-in auto-updater
- Checks for updates on launch
- Downloads and installs silently
- User just restarts the app

---

## WEB APP OPTION (Secondary)

For organizations that need multi-user access or cloud hosting, we provide a one-click deploy option.

### Option A: Pre-Configured Instance (EASIEST)

**Setup Flow:**
```
1. User visits: https://lgbtq-center.alignment-ai.io
2. User clicks "Sign in with Gmail"
3. User is logged in and ready to use
4. We handle all backend infrastructure
```

**Technical Implementation:**
- We host ONE instance on Vercel + Supabase
- Multi-tenancy: Each center gets isolated data via `center_id`
- OAuth: Same pre-registered app, but with web redirect URI
- Cost: ~$20/month (covered by Alignment AI as donation)

### Option B: One-Click Self-Host (ADVANCED)

**For:** Organizations with IT staff who want full control

```markdown
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/alignment-ai/lgbtq-center-automation&env=DATABASE_URL,GMAIL_CLIENT_ID,GMAIL_CLIENT_SECRET&envDescription=Required%20environment%20variables&envLink=https://github.com/alignment-ai/lgbtq-center-automation/blob/main/docs/ENV_SETUP.md)
```

**User Flow:**
1. Click "Deploy to Vercel" button
2. Create Vercel account (or login)
3. Create Supabase account (one-click from Vercel)
4. Copy-paste 3 environment variables (we provide clear instructions)
5. Deploy

**Estimated Setup Time:** 10-15 minutes (for technical users)

---

## FILES TO MODIFY

### Desktop App Changes

| File | Change |
|------|--------|
| `src/desktop/src-tauri/Cargo.toml` | Add `tauri-plugin-sql`, `tauri-plugin-oauth` dependencies |
| `src/desktop/src-tauri/src/main.rs` | Initialize SQLite, add OAuth callback handler |
| `src/desktop/src-tauri/tauri.conf.json` | Add plugins, configure window |
| `src/desktop/src-tauri/migrations/001_initial.sql` | Create database schema |
| `src/desktop/src/components/SetupWizard.tsx` | Simplify to 3-step flow (Gmail → Center Info → Done) |
| `src/desktop/src/App.tsx` | Add auto-redirect to setup if not configured |
| `src/desktop/package.json` | Add build scripts |

### Shared OAuth App Setup (One-Time)

| Task | Description |
|------|-------------|
| Google Cloud Console | Create project "LGBTQ Center Automation" |
| OAuth Consent Screen | Configure app name, logo, support email |
| Credentials | Create OAuth 2.0 Client ID for Desktop + Web |
| Scopes | Request only `gmail.send` and `userinfo.email` |
| Verification | Submit for Google verification (if >100 users) |

---

## ESTIMATED SETUP TIME FOR USER

### Desktop App (Recommended)

| Step | Time |
|------|------|
| Download installer | 30 seconds |
| Run installer | 30 seconds |
| First launch | 10 seconds |
| Connect Gmail | 60 seconds |
| Enter center info | 30 seconds |
| **TOTAL** | **~3 minutes** |

### Web App (Pre-Configured)

| Step | Time |
|------|------|
| Visit website | 5 seconds |
| Sign in with Gmail | 30 seconds |
| **TOTAL** | **~1 minute** |

---

## COMPARISON: Before vs After Zero-Config

### Before (Current State)

```
❌ User must create Google Cloud project
❌ User must enable Gmail API
❌ User must create OAuth credentials
❌ User must copy Client ID/Secret to .env file
❌ User must set up PostgreSQL database
❌ User must run npm install
❌ User must run database migrations
❌ User must start backend server
❌ User must start frontend dev server
```

**Setup Time:** 2-4 hours (for technical users)  
**Setup Time:** Impossible (for non-technical users)

### After (Zero-Config)

```
✅ Download .exe file
✅ Double-click to install
✅ Click "Connect Gmail" button
✅ Sign in to Gmail
✅ Enter center name/address
✅ Done!
```

**Setup Time:** 3 minutes (any user)  
**Technical Knowledge Required:** ZERO

---

## IMPLEMENTATION CHECKLIST

### Phase 1: Desktop App Zero-Config (Priority)

- [ ] Set up shared Google OAuth app
- [ ] Add tauri-plugin-sql to desktop app
- [ ] Create database migration files
- [ ] Implement OAuth callback handler in Rust
- [ ] Simplify SetupWizard to 3 steps
- [ ] Add auto-setup detection (skip wizard if already configured)
- [ ] Test end-to-end flow
- [ ] Build NSIS installer
- [ ] Test on clean Windows VM

### Phase 2: Web App Zero-Config (Optional)

- [ ] Set up multi-tenant architecture
- [ ] Deploy pre-configured instance
- [ ] Add subdomain routing
- [ ] Test multi-center isolation
- [ ] Create "Deploy to Vercel" button flow

---

## SECURITY ARCHITECTURE

### OAuth Token Storage

```
┌─────────────────────────────────────────────────────────────────┐
│  TOKEN STORAGE                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Refresh Tokens (Long-lived)                                    │
│  ├── Stored in: OS Keychain / Credential Manager               │
│  ├── Encrypted: Yes (OS-level encryption)                      │
│  ├── Accessible: Only by our app                               │
│  └── Scope: gmail.send only                                    │
│                                                                 │
│  Access Tokens (Short-lived, 1 hour)                           │
│  ├── Stored in: Memory only                                    │
│  ├── Persisted: No                                             │
│  └── Refreshed: Automatically using refresh token              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Data Privacy

- ✅ All client data stored locally on user's computer
- ✅ No data sent to Alignment AI servers
- ✅ No analytics or tracking
- ✅ No cloud dependencies
- ✅ Full data export available anytime

---

## CONCLUSION

This zero-configuration architecture makes the LGBTQ Center Client Automation system accessible to **any nonprofit**, regardless of technical resources.

**The 5-year-old test:** A child could download, install, and use this app with only adult supervision for the Gmail sign-in step.

**Next Step:** Proceed to Phase 1 implementation (Desktop App Zero-Config).

---

*Document Version: 1.0*  
*Author: Agent 2 (Zero-Config Architect)*  
*Review Required By: Agent 3 (Implementation)*
