# Case Study Handoff Document
## Cleveland LGBTQ Center Client Follow-Up Automation

**Prepared by:** Upton Rand, Alignment AI  
**Date:** [Delivery Date]  
**Contact:** 216-200-7861 | hello@alignment-ai.io

---

## Project Overview

### The Organization
**Cleveland LGBTQ Center** (Greater Cleveland)  
A vital community resource providing support services, healthcare navigation, and safe spaces for LGBTQ+ individuals in Northeast Ohio.

### The Challenge
- **40% client drop-off** between intake and first appointment
- Small team (2-5 staff) overwhelmed with manual follow-up
- Vulnerable clients falling through the cracks
- Hours spent weekly on repetitive email tasks

### Our Solution
A **pro bono** custom automation system that:
- Automatically sends 4-email follow-up sequences
- Requires zero technical expertise to operate
- Runs at **$0/month** on free infrastructure
- Gives the center **full ownership** of their data

---

## Technical Architecture

### System Design
```
Client Intake → Database → Email Scheduler → Gmail API
                    ↓
              Staff Dashboard (View/Edit/Monitor)
```

### Tech Stack
| Layer | Technology | Why We Chose It |
|-------|-----------|-----------------|
| **Frontend** | React + TypeScript | Maintainable, modern, accessible |
| **Backend** | Node.js + Express | Fast to develop, widely supported |
| **Database** | PostgreSQL (web) / SQLite (desktop) | Reliable, free, portable |
| **Desktop** | Tauri (Rust) | Secure, small footprint, native feel |
| **Email** | Gmail OAuth | Center already uses Gmail, no new accounts |
| **Installer** | NSIS (Windows) | Professional, double-clickable |

### Key Technical Decisions

1. **Email Scheduling Strategy**
   - Cron job checks every 5 minutes for due emails
   - Immediate welcome on intake
   - Day-before reminder at 9am
   - No-show detection 2 hours after appointment
   - 7-day re-engagement for lost clients

2. **Template System**
   - Merge fields: `{{first_name}}`, `{{appointment_date}}`, etc.
   - Pre-written templates (staff can customize without code)
   - Preview before sending
   - No technical jargon exposed to users

3. **Database Design**
   - Clients table: contact info, status tracking, notes
   - Email sequences table: scheduled sends, status, errors
   - Settings table: center info, Gmail tokens (encrypted)

4. **Security Measures**
   - OAuth 2.0 for Gmail (industry standard)
   - Refresh tokens stored, not passwords
   - HTTPS everywhere (web version)
   - Local SQLite for desktop (data never leaves computer)

---

## Development Process

### Phase 1: Research & Planning (Day 1)
- Identified core pain point: 40% no-show rate
- Researched nonprofit email automation best practices
- Designed 4-email sequence based on behavioral science
- Chose tech stack for maintainability

### Phase 2: Core Development (Days 2-4)
**Parallel Agent Approach:**
- **Agent 1:** Backend API (Express routes, database queries)
- **Agent 2:** Frontend UI (React components, dashboard)
- **Agent 3:** Gmail integration (OAuth, email service)
- **Agent 4:** Documentation (user guides, troubleshooting)

**Integration:** Combined all components, wired API to UI, tested end-to-end

### Phase 3: Polish & Packaging (Day 5)
- Built NSIS installer (visual wizard, no terminal)
- Created web-based installer alternative
- Wrote comprehensive documentation
- Prepared handoff materials

### Total Development Time
**5 days** from concept to delivery-ready system

---

## The Application

### Screenshots & UI Walkthrough

#### 1. Setup Wizard
*5-step guided onboarding*
- Welcome & introduction
- Center information (name, address, phone)
- Gmail OAuth connection
- Email template review
- Test email & completion

#### 2. Staff Dashboard
*Daily operations hub*
- Stats: Total clients, today's appointments, pending follow-ups
- Recent clients list
- Today's scheduled emails
- Quick "Add Client" button

#### 3. Client Management
*Database interface*
- Searchable client list
- Status badges (intake, confirmed, reminded, no-show, etc.)
- Edit/delete with confirmation
- View email history per client

#### 4. Email Templates
*Customization interface*
- Visual editor (no code)
- Merge field reference
- Live preview
- Reset to defaults

#### 5. Settings
*Configuration panel*
- Center information
- Gmail connection status
- Staff signature
- Backup/export data

---

## Delivery Package

### What They Receive

| Component | Description |
|-----------|-------------|
| **Windows Installer** | Double-click `.exe`, visual wizard, branded |
| **Web Application** | Deployable to Vercel/Render/Supabase (free) |
| **Desktop Application** | Tauri-based, works offline, local SQLite |
| **Source Code** | Full MIT-licensed codebase |
| **Documentation** | User guide, troubleshooting, API docs |
| **Training** | 1-hour video call session |
| **Support** | 30-day email support window |

### Installation Options

**Option A: Windows Installer (Recommended)**
```
Download → Double-click → Next → Next → Finish → Launch
```
Time: 2 minutes

**Option B: Web Application**
```
Run ./setup/install.sh → Choose web → Deploy → Access via browser
```
Time: 10 minutes

**Option C: Desktop (Mac/Linux)**
```
./setup/install.sh → Choose desktop → Run installer
```
Time: 5 minutes

---

## Impact Metrics

### Before Automation
- Manual follow-up: **5-10 hours/week**
- Missed clients: **40% no-show rate**
- Staff stress: High (repetitive tasks)

### After Automation
- Manual follow-up: **0 hours/week** (automated)
- Missed clients: **Projected 15-20% no-show rate**
- Staff focus: Client care, not admin

### Cost Analysis
| Item | Before | After |
|------|--------|-------|
| Staff time | $150-300/week | $0/week |
| Software | None | $0 (pro bono) |
| Hosting | N/A | $0 (free tier) |
| **Total** | **$7,800-15,600/year** | **$0** |

---

## Why This Matters

### The Stakes
- LGBTQ+ youth are **4x more likely** to attempt suicide (Trevor Project)
- Timely mental health support is **literally life-saving**
- Every client who falls through the cracks is someone who needed help

### Our Philosophy
> "Nonprofits deserve the same quality technology as Fortune 500s."

We built this **pro bono** because:
- Mission-driven work deserves mission-critical tools
- Small teams shouldn't be limited by technology
- Automation should amplify human connection, not replace it

---

## Future Possibilities

### If They Want to Expand
- **SMS Integration:** Twilio for text reminders (~$0.01/message)
- **Calendar Sync:** Google Calendar integration
- **Multi-location:** Support for satellite centers
- **Reporting Dashboard:** Advanced analytics
- **Mobile App:** React Native for staff on-the-go

### How to Extend
1. Any React/Node.js developer can work with this
2. Open source community can contribute
3. We remain available for future pro bono work

---

## Contact & Support

**Upton Rand**  
Alignment AI  
📞 216-200-7861  
📧 hello@alignment-ai.io  
🌐 https://alignment-ai.io

### Credentials
- **NGLCC Certified LGBTBE** business
- 6+ years AI/automation experience
- Amazon #1 bestselling author
- Based in Cleveland, Ohio

---

## Conclusion

This project demonstrates what happens when:
- **Technical expertise** meets **mission-driven work**
- **Modern automation** serves **human connection**
- **Pro bono contribution** creates **lasting impact**

The Cleveland LGBTQ Center now owns a professional-grade automation system that will help them serve more clients, more effectively, for years to come.

**We'd love to do more.** If there are other ways we can support the LGBTQ+ community in Cleveland—or if you know other nonprofits who could benefit—please reach out.

---

*Built with care in Cleveland, for Cleveland.*
