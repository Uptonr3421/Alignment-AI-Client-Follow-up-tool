# Zero-Config Implementation Guide

**Quick reference for implementing the zero-configuration architecture.**

---

## 1. Shared OAuth App Setup (One-Time)

### Step 1: Create Google Cloud Project

```
1. Visit: https://console.cloud.google.com/
2. Click "Select a project" → "New Project"
3. Project Name: "LGBTQ Center Automation"
4. Organization: alignment-ai.io
5. Click "Create"
```

### Step 2: Enable Gmail API

```
1. Navigation menu → "APIs & Services" → "Library"
2. Search: "Gmail API"
3. Click "Enable"
```

### Step 3: Configure OAuth Consent Screen

```
1. APIs & Services → "OAuth consent screen"
2. User Type: "External" (any Gmail user)
3. App Name: "LGBTQ Center Automation"
4. User Support Email: support@alignment-ai.io
5. App Logo: (upload app icon)
6. App Domain: alignment-ai.io
7. Authorized Domains: alignment-ai.io
8. Developer Contact: support@alignment-ai.io
9. Scopes: Add "gmail.send" and "userinfo.email"
10. Save & Continue
```

### Step 4: Create OAuth Credentials

**For Desktop App:**
```
1. APIs & Services → "Credentials"
2. Create Credentials → "OAuth client ID"
3. Application Type: "Desktop app"
4. Name: "LGBTQ Center Desktop"
5. Click "Create"
6. Download JSON (save as client_secret_desktop.json)
```

**For Web App (Optional):**
```
1. Create Credentials → "OAuth client ID"
2. Application Type: "Web application"
3. Name: "LGBTQ Center Web"
4. Authorized redirect URIs:
   - https://lgbtq-center.alignment-ai.io/oauth/callback
   - http://localhost:5173/oauth/callback (for dev)
5. Click "Create"
6. Download JSON (save as client_secret_web.json)
```

---

## 2. Desktop App Implementation

### Add Dependencies (Cargo.toml)

```toml
[dependencies]
tauri = { version = "2.0", features = [] }
tauri-plugin-sql = { version = "2.0", features = ["sqlite"] }
tauri-plugin-oauth = "2.0"
tauri-plugin-store = "2.0"
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
```

### Database Initialization (main.rs)

```rust
use tauri_plugin_sql::{Builder, Migration, MigrationKind};

fn main() {
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: include_str!("../migrations/001_initial.sql"),
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            Builder::default()
                .add_migrations("sqlite:lgbtq_center.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![
            connect_gmail,
            get_gmail_status,
            save_settings,
            get_settings,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
```

### OAuth Handler (main.rs)

```rust
use tauri::command;
use serde_json::json;

const GOOGLE_CLIENT_ID: &str = env!("GOOGLE_CLIENT_ID");  // Embedded at compile time
const GOOGLE_CLIENT_SECRET: &str = env!("GOOGLE_CLIENT_SECRET");

#[command]
async fn connect_gmail(window: tauri::Window) -> Result<String, String> {
    // Start local OAuth callback server
    let port = 8765;
    let redirect_uri = format!("http://localhost:{}/oauth/callback", port);
    
    // Generate OAuth URL
    let auth_url = format!(
        "https://accounts.google.com/o/oauth2/v2/auth?\
        client_id={}&\
        redirect_uri={}&\
        response_type=code&\
        scope=https://www.googleapis.com/auth/gmail.send%20https://www.googleapis.com/auth/userinfo.email&\
        access_type=offline&\
        prompt=consent",
        GOOGLE_CLIENT_ID, redirect_uri
    );
    
    // Open browser for OAuth
    window.shell().open(auth_url, None).map_err(|e| e.to_string())?;
    
    // Wait for callback (implemented via tiny-http or similar)
    // Exchange code for tokens
    // Store refresh token securely
    
    Ok("Connected".to_string())
}

#[command]
async fn get_gmail_status() -> Result<serde_json::Value, String> {
    // Check if refresh token exists in secure storage
    // Return connection status
    Ok(json!({
        "connected": true,
        "email": "user@gmail.com"
    }))
}
```

### Database Schema (migrations/001_initial.sql)

```sql
-- Clients table
CREATE TABLE IF NOT EXISTS clients (
    id TEXT PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    intake_date TEXT NOT NULL,
    appointment_date TEXT,
    status TEXT DEFAULT 'intake',
    notes TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Email sequences table
CREATE TABLE IF NOT EXISTS email_sequences (
    id TEXT PRIMARY KEY,
    client_id TEXT NOT NULL,
    template_type TEXT NOT NULL,
    scheduled_send_at TEXT NOT NULL,
    sent_at TEXT,
    status TEXT DEFAULT 'scheduled',
    FOREIGN KEY (client_id) REFERENCES clients(id)
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    center_name TEXT DEFAULT 'LGBTQ+ Center',
    center_address TEXT,
    center_phone TEXT,
    staff_name TEXT,
    staff_signature TEXT,
    gmail_connected INTEGER DEFAULT 0,
    gmail_email TEXT,
    setup_completed INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert default settings
INSERT OR IGNORE INTO settings (id) VALUES ('default');

-- Email templates table
CREATE TABLE IF NOT EXISTS email_templates (
    id TEXT PRIMARY KEY,
    type TEXT UNIQUE NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Insert default templates
INSERT OR IGNORE INTO email_templates (id, type, subject, body) VALUES
('1', 'welcome', 'Welcome to {{center_name}} - Your Appointment is Confirmed', 'Hi {{client_first_name}},

Thank you for reaching out to {{center_name}}. We''ve received your intake and your appointment is confirmed.

📅 Appointment Details:
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

If you need to reschedule, please call us at {{center_phone}} or reply to this email.

We look forward to seeing you!

{{staff_signature}}'),

('2', 'reminder', 'Reminder: Your Appointment Tomorrow at {{center_name}}', 'Hi {{client_first_name}},

This is a friendly reminder about your appointment tomorrow:

📅 Appointment Details:
Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

Need to reschedule? Call {{center_phone}} or reply to this email.

See you tomorrow!

{{staff_signature}}'),

('3', 'no_show', 'We Missed You Today - Can We Reschedule?', 'Hi {{client_first_name}},

We missed you at your appointment today. We understand that things come up!

Would you like to reschedule? We''re here to help and would love to connect with you.

Please call {{center_phone}} or reply to this email to find a time that works better.

{{staff_signature}}'),

('4', 're_engagement', 'Checking In - {{center_name}}', 'Hi {{client_first_name}},

We wanted to check in and see how you''re doing. We know life gets busy, but we''re still here to support you.

If you''d like to schedule a new appointment, just reply to this email or call {{center_phone}}.

Take care,

{{staff_signature}}');
```

---

## 3. Simplified Setup Wizard

### New 3-Step Flow

```typescript
// src/desktop/src/components/SimpleSetup.tsx

import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

const STEPS = [
  { id: 1, title: 'Connect Gmail', description: 'Sign in with your Gmail account' },
  { id: 2, title: 'Center Info', description: 'Tell us about your organization' },
  { id: 3, title: 'Done!', description: 'Start using the app' },
];

export function SimpleSetup({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [centerInfo, setCenterInfo] = useState({
    centerName: '',
    centerAddress: '',
    centerPhone: '',
    staffName: '',
  });

  const handleGmailConnect = async () => {
    await invoke('connect_gmail');
    setStep(2);
  };

  const handleSaveCenterInfo = async () => {
    await invoke('save_settings', { settings: centerInfo });
    setStep(3);
  };

  const handleComplete = () => {
    onComplete();
  };

  return (
    <div className="setup-wizard">
      {step === 1 && (
        <div>
          <h2>Connect Your Gmail</h2>
          <p>The app will send emails from your Gmail account.</p>
          <button onClick={handleGmailConnect}>
            Connect Gmail Account
          </button>
        </div>
      )}
      
      {step === 2 && (
        <div>
          <h2>Center Information</h2>
          <input 
            placeholder="Center Name" 
            value={centerInfo.centerName}
            onChange={e => setCenterInfo({...centerInfo, centerName: e.target.value})}
          />
          <input 
            placeholder="Address" 
            value={centerInfo.centerAddress}
            onChange={e => setCenterInfo({...centerInfo, centerAddress: e.target.value})}
          />
          <input 
            placeholder="Phone" 
            value={centerInfo.centerPhone}
            onChange={e => setCenterInfo({...centerInfo, centerPhone: e.target.value})}
          />
          <input 
            placeholder="Your Name" 
            value={centerInfo.staffName}
            onChange={e => setCenterInfo({...centerInfo, staffName: e.target.value})}
          />
          <button onClick={handleSaveCenterInfo}>Continue</button>
        </div>
      )}
      
      {step === 3 && (
        <div>
          <h2>You're All Set!</h2>
          <p>The app is ready to use. You can now add clients and the system will automatically send follow-up emails.</p>
          <button onClick={handleComplete}>Go to Dashboard</button>
        </div>
      )}
    </div>
  );
}
```

---

## 4. Build Configuration

### Environment Variables (Build-Time)

```bash
# .env (for building - NOT distributed)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Tauri Config (tauri.conf.json)

```json
{
  "build": {
    "beforeBuildCommand": "npm run build",
    "beforeDevCommand": "npm run dev",
    "devPath": "http://localhost:5173",
    "distDir": "../dist"
  },
  "tauri": {
    "allowlist": {
      "all": false,
      "shell": {
        "open": true
      },
      "window": {
        "all": false,
        "close": true,
        "hide": true,
        "show": true
      }
    },
    "bundle": {
      "active": true,
      "category": "Productivity",
      "copyright": "MIT License",
      "deb": {
        "depends": []
      },
      "externalBin": [],
      "icon": [
        "icons/32x32.png",
        "icons/128x128.png",
        "icons/128x128@2x.png",
        "icons/icon.icns",
        "icons/icon.ico"
      ],
      "identifier": "io.alignment-ai.lgbtq-center",
      "longDescription": "Client follow-up automation for LGBTQ+ centers",
      "macOS": {
        "entitlements": null,
        "exceptionDomain": "",
        "frameworks": [],
        "providerShortName": null,
        "signingIdentity": null
      },
      "resources": [],
      "shortDescription": "Client Automation",
      "targets": "all",
      "windows": {
        "certificateThumbprint": null,
        "digestAlgorithm": "sha256",
        "timestampUrl": ""
      }
    },
    "security": {
      "csp": null
    },
    "updater": {
      "active": true,
      "endpoints": [
        "https://releases.alignment-ai.io/lgbtq-center/latest.json"
      ],
      "dialog": true,
      "pubkey": "YOUR_PUBLIC_KEY"
    },
    "windows": [
      {
        "fullscreen": false,
        "height": 800,
        "resizable": true,
        "title": "LGBTQ Center Automation",
        "width": 1200
      }
    ]
  }
}
```

---

## 5. NSIS Installer Script

```nsis
; installer.nsi - Zero-config desktop installer

!define APP_NAME "LGBTQ Center Automation"
!define APP_VERSION "1.0.0"
!define APP_PUBLISHER "Alignment AI"
!define APP_WEBSITE "https://alignment-ai.io"
!define APP_EXE "LGBTQ Center Automation.exe"

Name "${APP_NAME}"
OutFile "LGBTQ-Center-Automation-Setup.exe"
InstallDir "$PROGRAMFILES64\${APP_NAME}"
InstallDirRegKey HKCU "Software\${APP_NAME}" ""
RequestExecutionLevel admin

; Modern UI
!include "MUI2.nsh"
!define MUI_ABORTWARNING
!define MUI_ICON "assets\icon.ico"
!define MUI_UNICON "assets\icon.ico"

; Pages
!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_LICENSE "..\LICENSE"
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_WELCOME
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_UNPAGE_FINISH

; Languages
!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath "$INSTDIR"
  
  ; Main executable
  File "..\src\desktop\src-tauri\target\release\${APP_EXE}"
  
  ; Resources
  File /r "..\src\desktop\src-tauri\target\release\resources"
  
  ; Create shortcuts
  CreateDirectory "$SMPROGRAMS\${APP_NAME}"
  CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
  CreateShortcut "$DESKTOP\${APP_NAME}.lnk" "$INSTDIR\${APP_EXE}"
  
  ; Registry entries
  WriteRegStr HKCU "Software\${APP_NAME}" "" $INSTDIR
  WriteUninstaller "$INSTDIR\uninstall.exe"
  
  ; Add/Remove Programs entry
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "DisplayName" "${APP_NAME}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "UninstallString" "$INSTDIR\uninstall.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "DisplayIcon" "$INSTDIR\${APP_EXE}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "Publisher" "${APP_PUBLISHER}"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}" \
                   "DisplayVersion" "${APP_VERSION}"
SectionEnd

Section "Uninstall"
  ; Remove files
  Delete "$INSTDIR\${APP_EXE}"
  Delete "$INSTDIR\uninstall.exe"
  RMDir /r "$INSTDIR\resources"
  RMDir "$INSTDIR"
  
  ; Remove shortcuts
  Delete "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk"
  RMDir "$SMPROGRAMS\${APP_NAME}"
  Delete "$DESKTOP\${APP_NAME}.lnk"
  
  ; Remove registry entries
  DeleteRegKey HKCU "Software\${APP_NAME}"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_NAME}"
SectionEnd
```

---

## Quick Build Commands

```bash
# Build desktop app
cd src/desktop
npm run tauri build

# Build installer
cd ../../installer
build.bat

# Copy to presentation folder
copy LGBTQ-Center-Automation-Setup.exe ..\presentation\

# Deploy to Vercel
cd ..\presentation
vercel --prod
```

---

## Testing Checklist

### Pre-Release Testing

- [ ] Install on clean Windows VM (no dev tools)
- [ ] Verify SQLite database auto-creates
- [ ] Test Gmail OAuth flow end-to-end
- [ ] Verify email sends successfully
- [ ] Test auto-updater
- [ ] Verify uninstaller removes all files
- [ ] Test with non-technical user (if possible)

### Edge Cases

- [ ] No internet connection on first launch
- [ ] User denies Gmail permission
- [ ] User closes OAuth window mid-flow
- [ ] Database file locked by another process
- [ ] Windows Defender false positive

---

*Implementation Guide Version: 1.0*
