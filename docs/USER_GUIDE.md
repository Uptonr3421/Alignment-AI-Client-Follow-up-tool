# User Guide
## Client Follow-Up Automation System

**For:** Program Coordinators, Case Managers, and Support Staff  
**Last Updated:** February 2026

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Adding a Client](#adding-a-client)
3. [Managing Clients](#managing-clients)
4. [Understanding Email Sequences](#understanding-email-sequences)
5. [Daily Workflow](#daily-workflow)
6. [Settings](#settings)
7. [FAQ](#faq)

---

## Getting Started

### First Login

When you open the system for the first time, you'll see a **Setup Wizard** that walks you through everything:

1. **Welcome Screen** — Click "Get Started"
2. **Connect Your Gmail** — This lets the system send emails on your behalf (see screenshot below)
3. **Add Your Center Details** — Center name, address, phone number
4. **Choose Email Templates** — We recommend starting with the default templates
5. **Add Your Signature** — How you want to sign emails
6. **Send a Test Email** — Make sure everything works

⚠️ **Tip:** The Gmail connection is secure. The system can only send emails — it cannot read your inbox or access other Google data.

### Dashboard Overview

After setup, you'll see your **Dashboard**. This is your home base:

```
┌─────────────────────────────────────────────────────────┐
│  📊 Dashboard                                    [Menu] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  TODAY'S FOLLOW-UPS          CLIENT STATUS              │
│  ┌─────────────────┐        ┌─────────────────┐        │
│  │ 3 emails to send│        │ Intake:     12  │        │
│  │ 2 no-shows      │        │ Confirmed:   8  │        │
│  │                 │        │ Completed:  45  │        │
│  │ [View All]      │        │                 │        │
│  └─────────────────┘        └─────────────────┘        │
│                                                         │
│  RECENT ACTIVITY                                        │
│  • Welcome email sent to Alex M. (10 min ago)          │
│  • Reminder sent to Jordan K. (1 hour ago)             │
│  • New client added: Sam T. (2 hours ago)              │
│                                                         │
│              [+ Add New Client]                         │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**What each section means:**

- **Today's Follow-Ups** — Emails that need to go out today and clients who missed appointments
- **Client Status** — How many clients are at each stage of the process
- **Recent Activity** — A log of what the system has done recently

---

## Adding a Client

### Step-by-Step

When someone calls or visits for intake, here's how to add them:

**Step 1:** Click the big **"+ Add New Client"** button on the Dashboard

**Step 2:** Fill out the intake form:

| Field | What to Enter | Example |
|-------|---------------|---------|
| First Name | Their preferred first name | Alex |
| Last Name | Their last name | Martinez |
| Email | Their email address | alex@email.com |
| Phone | Their phone number | (555) 123-4567 |
| Intake Date | Today (auto-filled) | Feb 6, 2026 |
| Appointment Date | When is their first appointment? | Feb 10, 2026 |
| Appointment Time | What time? | 2:00 PM |
| Notes | Anything important to remember | Prefers email over phone |

**Step 3:** Click **"Save Client"**

✅ **Success!** The system automatically:
- Saves the client to your database
- Schedules the welcome email (sends immediately)
- Schedules a reminder email (sends 1 day before the appointment)
- Schedules a no-show email (sends if they miss the appointment)
- Schedules a re-engagement email (sends 1 week later if needed)

⚠️ **Tip:** You can add a client even if they don't have an email yet. Just leave that field blank and add it later.

---

## Managing Clients

### Viewing Your Client List

Click **"Clients"** in the top menu to see everyone in your system:

```
┌─────────────────────────────────────────────────────────┐
│  🔍 Search by name...                        [Filter ▼] │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Name              Status      Appointment    Actions   │
│  ─────────────────────────────────────────────────────  │
│  Alex Martinez     Confirmed   Feb 10, 2PM    [Edit]    │
│  Jordan Kim        Reminded    Feb 8, 10AM    [Edit]    │
│  Sam Thompson      Intake      Feb 12, 3PM    [Edit]    │
│  ...                                                    │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Status colors help you see at a glance:**
- 🟡 **Intake** — Just added, no appointment yet
- 🟢 **Confirmed** — Has an upcoming appointment
- 🔵 **Reminded** — Reminder email sent
- 🔴 **No-Show** — Missed their appointment
- 🟣 **Rescheduled** — Appointment moved to new date
- ⚫ **Completed** — Appointment happened successfully

### Searching for a Client

Type any part of a name in the search box at the top. The list updates automatically as you type.

**Examples:**
- Type "Alex" → finds Alex Martinez
- Type "Martinez" → finds Alex Martinez
- Type "555" → finds anyone with that phone number

### Editing a Client

Click the **"Edit"** button next to any client to:
- Update their contact information
- Change their appointment date/time
- Add notes
- Mark them as a no-show or completed

⚠️ **Tip:** If you reschedule someone's appointment, the system automatically updates which emails get sent and when.

### Viewing Client Details

Click on a client's name to see their full record:

```
┌─────────────────────────────────────────────────────────┐
│  Alex Martinez                               [Edit ✏️]  │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📧 alex@email.com                                      │
│  📱 (555) 123-4567                                      │
│                                                         │
│  Status: Confirmed                                      │
│  Appointment: Feb 10, 2026 at 2:00 PM                   │
│                                                         │
│  Notes:                                                 │
│  Prefers email over phone. First time seeking services. │
│                                                         │
│  ── EMAIL HISTORY ──                                    │
│  ✅ Feb 6 — Welcome email sent                          │
│  ⏳ Feb 9 — Reminder scheduled                          │
│  ⏳ Feb 11 — No-show follow-up (if needed)              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## Understanding Email Sequences

The system sends **four types of emails** automatically. Here's what each one does and when it sends:

### The Four Emails

| Email | When It Sends | What It Says |
|-------|---------------|--------------|
| **Welcome** | Immediately after you add the client | "Thank you for contacting us. Your appointment is confirmed for [date] at [time]." |
| **Reminder** | 1 day before the appointment | "Just a friendly reminder about your appointment tomorrow at [time]." |
| **No-Show** | 1 day after a missed appointment | "We missed you. Would you like to reschedule?" |
| **Re-engagement** | 1 week after a no-show | "We're still here if you need support. Here's how to reach us." |

### Visual Timeline

```
Day 0          Day -1         Appointment    Day +1         Day +7
  │              │               │              │              │
  ▼              ▼               ▼              ▼              ▼
┌─────┐      ┌─────┐        ┌─────┐       ┌─────┐        ┌─────┐
│WELCOME│    │REMINDER│     │Visit│       │NO-SHOW│      │RE-   │
│EMAIL │      │EMAIL │        │?    │       │EMAIL │      │ENGAGE│
└─────┘      └─────┘        └──┬──┘       └─────┘        │MENT │
                               │                         └─────┘
                    ┌─────────┴─────────┐
                    │                   │
                    ▼                   ▼
               They show up!        They don't show
                    │                   │
                    ▼                   ▼
              Mark "Completed"     Email sends
                                     automatically
```

### What If...

**The client reschedules?**
- The system updates all future emails automatically
- The reminder will send 1 day before the NEW appointment date

**You mark them as a no-show early?**
- The no-show email sends the next day (not immediately — gives them a chance to explain)

**They don't have an email address?**
- Only the welcome and reminder emails require email
- You can still track them in the system and call them instead

**You want to skip an email?**
- Go to the client's detail page
- Find the scheduled email
- Click "Cancel This Email"

---

## Daily Workflow

### Morning Routine (5 Minutes)

Every morning, check your Dashboard:

1. **Open the system** — Bookmark the web address or click the desktop icon
2. **Look at "Today's Follow-Ups"** — This tells you what needs attention
3. **Check for no-shows** — Anyone who missed an appointment yesterday?

### Handling No-Shows

When someone misses an appointment:

1. The system automatically sends a no-show email the next day
2. **You should still call them** — Personal contact makes a difference
3. Update their status based on what happens:
   - They want to reschedule → Click "Reschedule" and pick a new date
   - They don't answer → Leave them in "No-Show" status
   - They say they don't need services → Mark as "Completed"

⚠️ **Tip:** The re-engagement email sends 1 week after a no-show automatically. This gentle reminder often brings people back.

### Adding New Intakes

When someone new contacts your center:

1. Click **"+ Add New Client"**
2. Get their basic info (name, email, phone)
3. Schedule their first appointment
4. Click **Save**
5. The welcome email sends automatically

### End of Day (2 Minutes)

Before you leave:

1. Glance at the Dashboard — anything urgent?
2. Check that today's emails all sent (you'll see checkmarks ✓)
3. You're done! The system works overnight.

---

## Settings

Click **"Settings"** in the top menu to customize the system.

### Center Information

Update your center's details:
- **Center Name** — Shows in all emails
- **Address** — Where clients should go
- **Phone Number** — For rescheduling calls
- **Business Hours** — Shows in emails

⚠️ **Tip:** Keep this updated! Clients use this info to find you.

### Email Templates

You can customize what the emails say:

1. Click **"Templates"** in Settings
2. Choose which email to edit (Welcome, Reminder, No-Show, or Re-engagement)
3. Edit the text
4. Click **"Preview"** to see how it looks
5. Click **"Save"**

**Special codes (merge fields) you can use:**

| Type This | It Becomes This |
|-----------|-----------------|
| `[First Name]` | The client's first name |
| `[Appointment Date]` | Their appointment date |
| `[Appointment Time]` | Their appointment time |
| `[Center Name]` | Your center's name |
| `[Phone]` | Your center's phone number |
| `[Staff Name]` | Your name |

**Example:**
```
Hi [First Name],

We're looking forward to seeing you on [Appointment Date] at [Appointment Time].

Best,
[Staff Name]
```

Becomes:
```
Hi Alex,

We're looking forward to seeing you on February 10 at 2:00 PM.

Best,
Sarah
```

### Staff Signature

Add your signature to the bottom of every email:

```
Sarah Johnson (she/her)
Program Coordinator
Cleveland LGBTQ Center
(555) 123-4567
www.cleveland-lgbtq.org
```

### Gmail Connection

If you need to reconnect your Gmail:

1. Go to Settings → Gmail
2. Click **"Disconnect"** (if connected)
3. Click **"Connect Gmail"**
4. Sign in with your Google account
5. Grant permission to send emails

✅ **Success:** You'll see a green checkmark when connected.

---

## FAQ

### Getting Started

**Q: Do I need to be technical to use this?**  
A: Not at all! If you can use email and fill out forms online, you can use this system. Everything is designed for non-technical staff.

**Q: Can I use this on my phone?**  
A: Yes! The web version works on phones, tablets, and computers. The layout adjusts automatically.

**Q: What if I make a mistake entering a client's info?**  
A: No problem! You can edit any client anytime. Just go to Clients → find them → click Edit.

### Email Questions

**Q: Do the emails look like they come from me?**  
A: Yes! Emails send from your Gmail address, so clients see your name and can reply directly to you.

**Q: Can clients reply to the automated emails?**  
A: Yes, replies go to your Gmail inbox just like normal emails. You can respond normally.

**Q: What if I want to change just one email for one client?**  
A: Go to that client's detail page, find the scheduled email, and click "Cancel This Email." Then send a personal email from your Gmail.

**Q: Is there a limit to how many emails I can send?**  
A: Gmail allows up to 1 million emails per day (you'll never hit this). If using the free web version, the database allows 2 million actions per month.

**Q: Can I add my own email templates?**  
A: Currently, you can customize the four built-in templates. Adding entirely new template types requires technical help.

### Client Management

**Q: What happens if I delete a client?**  
A: Their record is permanently removed. Any scheduled emails for them are canceled. Be careful — this cannot be undone!

**Q: Can I export my client list?**  
A: Yes! Go to Clients → click "Export" to download a spreadsheet with all your data.

**Q: How do I handle a walk-in (no appointment)?**  
A: Add them like any client, but leave the appointment fields blank. You can always add an appointment later.

**Q: What if someone calls to cancel?**  
A: Find their record, click Edit, and either delete the appointment date or change their status to "Completed." This stops future emails.

### Technical Issues

**Q: I forgot my password. What do I do?**  
A: Click "Forgot Password" on the login screen. You'll get an email with a reset link.

**Q: The page won't load. What's wrong?**  
A: Check your internet connection first. If other websites work, try refreshing the page. Still stuck? See the Troubleshooting guide.

**Q: Can I use this offline?**  
A: The desktop version works offline for viewing data, but emails only send when you're connected to the internet.

**Q: Is my data safe?**  
A: Yes. All data is encrypted, and the system uses the same security standards as banks. Only your staff can access your center's data.

### Privacy & Security

**Q: Who can see my client data?**  
A: Only people with your staff login. We recommend giving each staff member their own login rather than sharing one account.

**Q: Do you share data with anyone?**  
A: Never. Your client data stays in your system only. We don't analyze it, sell it, or share it.

**Q: Is this HIPAA compliant?**  
A: The system follows HIPAA-aware design practices (encryption, access controls, audit logs). However, formal HIPAA compliance requires additional steps from your organization.

### Billing & Accounts

**Q: How much does this cost?**  
A: Nothing! This system was built pro bono for your organization. Operating costs are $0 using free tiers of web services.

**Q: What if we need help?**  
A: Email support@alignment-ai.io for technical issues. For questions about using features, check this guide first.

**Q: Can we customize the system?**  
A: The source code is yours forever. Any developer familiar with React/Node.js can modify it. Or contact Alignment AI for customization help.

---

## Need More Help?

- **Technical Problems:** See `TROUBLESHOOTING.md`
- **Quick Setup:** See `QUICK_START.md`
- **Emergency Support:** support@alignment-ai.io

---

*This guide is updated regularly. Last updated: February 2026*
