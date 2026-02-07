# Product Requirements Document
## LGBTQ+ Center Client Follow-Up Automation

### Problem Statement
40% of LGBTQ+ center intakes never make it to their first appointment. Small teams (2-5 staff) spend hours weekly on manual follow-up emails and still lose clients through the cracks.

### User Personas

**Primary: Program Coordinator (Sarah)**
- Non-technical staff member
- Manages client intake and scheduling
- Needs simple, reliable tools
- No time to learn complex software

**Secondary: Center Director (Michael)**
- Needs oversight and reporting
- Budget-conscious (nonprofit)
- Concerned about data privacy

### Core Features

#### 1. Setup Wizard
- Step-by-step onboarding
- Gmail OAuth connection
- Email template selection
- Test send confirmation

#### 2. Client Database
- Simple intake form
- Contact information
- Intake date tracking
- Appointment scheduling
- Status tracking (intake → confirmed → no-show → rescheduled)

#### 3. Email Automation
- Predefined sequences:
  - Day 0: Welcome/Confirmation
  - Day -1: Appointment reminder
  - Day +1: No-show follow-up
  - Day +7: Re-engagement
- Visual template editor
- Merge fields handled automatically
- Preview before sending

#### 4. Dashboard
- Today's follow-ups needed
- Recent activity feed
- Client status overview
- Simple analytics

#### 5. Settings
- Business hours
- Staff signatures
- Custom email templates
- Notification preferences

### Technical Requirements

#### Web Version (Free Tier)
- **Frontend:** Vercel (free)
- **Backend:** Render or Railway (free tier)
- **Database:** Supabase (free tier - 500MB, 2M requests/month)
- **Storage:** Supabase storage (1GB free)
- **Email:** Gmail API (free, 1M quota/day)

#### Desktop Version
- **Framework:** Tauri (Rust + WebView)
- **Database:** SQLite (local file)
- **Email:** Gmail API via local OAuth
- **Size:** <50MB installer
- **OS:** Windows 10/11, macOS, Linux

### Email Templates (Predefined)

#### Template 1: Welcome Confirmation
```
Subject: Welcome to [Center Name] — Your appointment is confirmed

Hi [First Name],

Thank you for reaching out to [Center Name]. We've scheduled your appointment:

Date: [Appointment Date]
Time: [Appointment Time]
Location: [Address]
With: [Staff Name]

If you need to reschedule, reply to this email or call us at [Phone].

We're here to support you.

[Staff Name]
[Center Name]
```

#### Template 2: Appointment Reminder
```
Subject: Reminder: Your appointment tomorrow

Hi [First Name],

Just a friendly reminder about your appointment tomorrow:

Date: [Appointment Date]
Time: [Appointment Time]

We're looking forward to meeting you.

[Staff Name]
```

#### Template 3: No-Show Follow-up
```
Subject: We missed you — Let's reschedule

Hi [First Name],

We missed you at your appointment today. We understand things come up.

Would you like to reschedule? Just reply to this email or call [Phone].

We're here when you're ready.

[Staff Name]
```

### User Flows

#### Setup Flow (First Run)
1. Welcome screen
2. Connect Gmail account (OAuth)
3. Select center name and details
4. Choose email templates
5. Add staff signature
6. Test email send
7. Ready to use

#### Daily Use Flow
1. Staff adds new client intake
2. System schedules automated emails
3. Dashboard shows upcoming follow-ups
4. Staff can view/reschedule as needed
5. Automated emails send at scheduled times

### Data Model

```
Client
- id (UUID)
- first_name (string)
- last_name (string)
- email (string)
- phone (string)
- intake_date (datetime)
- appointment_date (datetime)
- status (enum: intake, confirmed, reminded, no_show, rescheduled, completed)
- notes (text)
- created_at (datetime)
- updated_at (datetime)

EmailSequence
- id (UUID)
- client_id (UUID)
- template_type (enum: welcome, reminder, no_show, re_engagement)
- scheduled_send_at (datetime)
- sent_at (datetime)
- status (enum: scheduled, sent, failed)

Settings
- center_name (string)
- center_address (string)
- center_phone (string)
- staff_name (string)
- staff_signature (text)
- business_hours (JSON)
```

### Security & Privacy

- All data encrypted at rest
- Gmail OAuth with minimal scopes
- No sensitive data in logs
- HIPAA-aware design patterns
- Local-first for desktop version

### Success Metrics

- Zero manual follow-up emails missed
- 50%+ reduction in no-show rate
- Staff saves 5+ hours/week
- Setup completed in under 10 minutes

### Future Enhancements

- SMS integration (Twilio)
- Calendar integration (Google Calendar)
- Multi-language support
- Reporting dashboard
- Mobile app
