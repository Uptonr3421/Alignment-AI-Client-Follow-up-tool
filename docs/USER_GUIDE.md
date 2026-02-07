# User Guide

Complete documentation for the Cleveland LGBTQ Center Client Follow-Up Automation System.

## Table of Contents

1. [Overview](#overview)
2. [Dashboard](#dashboard)
3. [Managing Clients](#managing-clients)
4. [Email Templates](#email-templates)
5. [Automation Rules](#automation-rules)
6. [Reports and Analytics](#reports-and-analytics)
7. [Settings](#settings)
8. [Data Management](#data-management)

---

## Overview

This system automates the client follow-up process through four key emails:

1. **Welcome Email** — Confirms appointment, shares what to expect
2. **Reminder Email** — Sent 48 hours before appointment
3. **No-Show Follow-Up** — Reaches out if client doesn't attend
4. **Re-Engagement Email** — Reconnects with client after 7 days

### How It Works

The system runs continuously in the background, checking every hour for:
- New clients to welcome
- Upcoming appointments to remind about
- Missed appointments to follow up on
- Clients to re-engage

You don't need to do anything once a client is added — the system handles everything automatically.

---

## Dashboard

The dashboard shows your key metrics at a glance:

### Today's Summary
- **Scheduled Today**: Number of appointments today
- **Emails Sent**: How many automated emails went out
- **Response Rate**: Percentage of clients who reply
- **No-Shows**: Clients who missed appointments

### This Week
- Chart showing appointments by day
- Email open rates (if tracking enabled)
- Client engagement trends

### Quick Actions
- Add New Client
- View Today's Appointments
- Send Manual Email
- Edit Templates

---

## Managing Clients

### Adding a New Client

1. Click "**Add Client**" button (top right)
2. Fill in the form:
   - **First Name** (required)
   - **Last Name** (required)
   - **Email Address** (required)
   - **Phone Number** (optional)
   - **Appointment Date & Time** (required)
   - **Service Type** (dropdown)
   - **Notes** (optional, private)
3. Click "**Save Client**"

The system immediately sends the welcome email.

### Editing Client Information

1. Find the client in the list
2. Click their name or the "**Edit**" button
3. Make your changes
4. Click "**Update Client**"

**Note**: Changing the appointment date will trigger a new reminder email if the new date is more than 48 hours away.

### Client Statuses

Clients can have these statuses:

- **Scheduled**: Appointment is upcoming
- **Reminded**: Reminder email has been sent
- **Attended**: Client showed up for appointment
- **No-Show**: Client missed appointment
- **Cancelled**: Appointment was cancelled
- **Re-Engaged**: Follow-up after no-show sent

### Marking Attendance

After an appointment:

1. Find the client in today's list
2. Click "**Mark as Attended**" or "**Mark as No-Show**"
3. System automatically:
   - Updates the status
   - Sends no-show email if needed
   - Schedules re-engagement email

### Bulk Import

To import multiple clients from Excel or CSV:

1. Go to "**Clients**" → "**Import**"
2. Download the template file
3. Fill in your client information
4. Click "**Choose File**" and select your completed file
5. Review the preview
6. Click "**Import All**"

**CSV Format Required**:
```csv
first_name,last_name,email,phone,appointment_date,service_type
John,Doe,john@example.com,216-555-0123,2024-01-15 10:00,Counseling
Jane,Smith,jane@example.com,216-555-0124,2024-01-16 14:00,Legal Aid
```

---

## Email Templates

### Available Templates

1. **Welcome Email**
   - Sent: Immediately when client is added
   - Purpose: Confirm appointment, set expectations

2. **Reminder Email**
   - Sent: 48 hours before appointment
   - Purpose: Reduce no-shows

3. **No-Show Email**
   - Sent: 4 hours after missed appointment
   - Purpose: Check in, offer to reschedule

4. **Re-Engagement Email**
   - Sent: 7 days after no-show
   - Purpose: Re-connect, offer support

### Editing Templates

1. Go to "**Templates**"
2. Select the template to edit
3. Use the visual editor to make changes
4. Available merge tags:
   - `{{client_first_name}}` — Client's first name
   - `{{client_full_name}}` — Client's full name
   - `{{appointment_date}}` — Formatted appointment date
   - `{{appointment_time}}` — Formatted appointment time
   - `{{service_type}}` — Type of service
   - `{{center_phone}}` — Center's phone number
   - `{{center_email}}` — Center's email address
5. Preview your changes
6. Click "**Save Template**"

### Best Practices

- Keep emails brief (under 200 words)
- Use warm, welcoming tone
- Include clear call-to-action
- Provide contact information
- Respect client privacy
- Use inclusive language

### Example Welcome Email

```
Subject: Welcome to Cleveland LGBTQ Center - Appointment Confirmed

Hi {{client_first_name}},

Thank you for reaching out to the Cleveland LGBTQ Center. We're here to support you.

Your appointment is confirmed for:
📅 {{appointment_date}} at {{appointment_time}}
📍 Cleveland LGBTQ Center, 6600 Detroit Ave

What to expect:
• Check in at the front desk
• Your session will be private and confidential
• Please arrive 10 minutes early for paperwork

Have questions? Call us at {{center_phone}} or reply to this email.

We look forward to meeting you!

Warmly,
The Cleveland LGBTQ Center Team
```

---

## Automation Rules

### Default Schedule

- **Welcome**: Immediately upon adding client
- **Reminder**: 48 hours before appointment
- **No-Show**: 4 hours after missed appointment
- **Re-Engagement**: 7 days after no-show

### Customizing Timing

1. Go to "**Settings**" → "**Automation**"
2. Adjust timing for each email type
3. Options:
   - Hours or days before/after
   - Specific times (e.g., only between 9 AM - 5 PM)
   - Skip weekends
   - Skip holidays
4. Click "**Save Settings**"

### Pausing Automation

To temporarily stop all automated emails:

1. Go to "**Settings**" → "**Automation**"
2. Toggle "**Pause All Automation**"
3. Emails will queue but not send
4. Toggle back to resume

---

## Reports and Analytics

### Email Performance

View statistics on your email campaigns:

- **Open Rate**: Percentage who opened the email
- **Click Rate**: Percentage who clicked links
- **Response Rate**: Percentage who replied
- **Bounce Rate**: Emails that failed to deliver

### Client Statistics

- Total clients served
- Appointment attendance rate
- No-show rate by service type
- Re-engagement success rate

### Exporting Reports

1. Go to "**Reports**"
2. Select date range
3. Choose metrics to include
4. Click "**Export to CSV**" or "**Export to PDF**"

---

## Settings

### Email Configuration

- **SMTP Server**: Your email provider's server
- **Port**: Usually 587 (TLS) or 465 (SSL)
- **From Name**: How your emails appear (e.g., "Cleveland LGBTQ Center")
- **From Email**: Your sending address
- **Reply-To**: Where replies should go

### Notification Settings

- **Desktop Notifications**: Alert when emails are sent/received
- **Daily Summary Email**: Receive daily recap
- **Error Alerts**: Get notified of issues

### User Management (Web App Only)

Add team members:

1. Go to "**Settings**" → "**Users**"
2. Click "**Invite User**"
3. Enter their email
4. Set their role:
   - **Admin**: Full access, can manage users
   - **Staff**: Can manage clients and templates
   - **View Only**: Can view reports only
5. Click "**Send Invitation**"

---

## Data Management

### Backup

**Automatic Backups** (recommended):
1. Go to "**Settings**" → "**Backup**"
2. Enable "**Automatic Daily Backups**"
3. Choose backup location
4. Backups run at 2 AM daily

**Manual Backup**:
1. Go to "**Settings**" → "**Backup**"
2. Click "**Create Backup Now**"
3. Save the `.zip` file to a safe location

### Restore from Backup

1. Go to "**Settings**" → "**Backup**"
2. Click "**Restore from Backup**"
3. Select your backup file
4. Confirm the restoration
5. System will restart with restored data

### Data Export

Export all your data:

1. Go to "**Settings**" → "**Data Export**"
2. Select what to export:
   - Clients
   - Email history
   - Templates
   - Settings
3. Choose format (CSV, JSON, or Excel)
4. Click "**Export**"

### Data Privacy

- All client data stays on your computer/server
- No data is sent to external services (except emails via your SMTP)
- Delete old clients: "**Clients**" → Select → "**Delete**"
- Data retention settings: "**Settings**" → "**Privacy**"

---

## Keyboard Shortcuts

- **Ctrl + N**: Add new client
- **Ctrl + S**: Save changes
- **Ctrl + F**: Search clients
- **Ctrl + ,**: Open settings
- **Escape**: Close modal/dialog

---

## Mobile Access (Web App Only)

The web version is mobile-responsive:

1. Open your browser on phone/tablet
2. Navigate to `http://[your-server]:3000`
3. Add to home screen for app-like experience

**Limited Features on Mobile**:
- View clients and appointments
- Mark attendance
- Send manual emails
- No bulk operations

---

Need help with something not covered here? Check the [Troubleshooting Guide](TROUBLESHOOTING.md) or email [contact@alignment-ai.io](mailto:contact@alignment-ai.io).
