# LGBTQ Center Client Automation - Backend API

A production-ready backend API for managing nonprofit client intake and automated email sequences.

## Features

- ✅ Complete CRUD operations for clients
- ✅ Automated 4-email sequence (welcome, reminder, no-show, re-engagement)
- ✅ Gmail OAuth integration for sending emails
- ✅ Dashboard statistics and today's tasks
- ✅ Email template management
- ✅ Zod input validation on all endpoints
- ✅ Proper error handling and logging
- ✅ Database indexing for performance
- ✅ CORS configured for frontend integration

## Tech Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js 4.18
- **Database**: PostgreSQL 14+
- **ORM**: Drizzle ORM
- **Validation**: Zod
- **Email**: Gmail API via Google APIs
- **Scheduling**: node-cron

## Required Endpoints (All Implemented)

### Clients
- `GET /api/clients` - List with pagination, search, filter
- `POST /api/clients` - Create client + auto-generate email sequences
- `GET /api/clients/:id` - Get single client
- `GET /api/clients/:id/emails` - Get email history for client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client + cancel pending emails

### Templates
- `GET /api/templates` - List email templates
- `GET /api/templates/:id` - Get single template
- `PUT /api/templates/:id` - Update template

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics (legacy)
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/today` - Get today's tasks

### Settings
- `GET /api/settings` - Get settings
- `PUT /api/settings` - Update settings

### Gmail
- `GET /api/gmail/auth` - Initiate Gmail OAuth flow
- `POST /api/gmail/auth` - Get Gmail OAuth URL (POST alternative)
- `GET /api/gmail/callback` - OAuth callback handler
- `POST /api/gmail/disconnect` - Disconnect Gmail
- `GET /api/gmail/status` - Check Gmail connection status

### Emails
- `GET /api/emails/pending` - Get all pending scheduled emails
- `GET /api/emails/client/:clientId` - Get email history for client
- `POST /api/emails/send` - Send email immediately
- `POST /api/emails/:id/cancel` - Cancel scheduled email

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required variables:
- `DATABASE_URL` - PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `GOOGLE_REDIRECT_URI` - Must match Google Cloud Console settings

### 3. Set Up Database

```bash
# Generate migration files
npm run db:generate

# Run migrations
npm run db:migrate

# (Optional) Open Drizzle Studio
npm run db:studio
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm start
```

## Database Schema

### Tables

**clients**
- `id` (UUID, PK)
- `first_name`, `last_name` (VARCHAR)
- `email` (VARCHAR, indexed)
- `phone` (VARCHAR)
- `intake_date`, `appointment_date` (TIMESTAMP)
- `status` (ENUM: intake, confirmed, reminded, no_show, rescheduled, completed)
- `notes` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**email_sequences**
- `id` (UUID, PK)
- `client_id` (UUID, FK → clients, CASCADE)
- `template_type` (ENUM: welcome, reminder, no_show, re_engagement)
- `scheduled_send_at`, `sent_at` (TIMESTAMP)
- `status` (ENUM: scheduled, sent, failed, cancelled)
- `error_message` (TEXT)
- `created_at`, `updated_at` (TIMESTAMP)

**email_templates**
- `id` (UUID, PK)
- `type` (ENUM: welcome, reminder, no_show, re_engagement)
- `name`, `subject` (VARCHAR)
- `body` (TEXT)
- `is_default` (BOOLEAN)
- `created_at`, `updated_at` (TIMESTAMP)

**settings**
- `id` (UUID, PK)
- `center_name`, `center_address`, `center_phone`
- `staff_name`, `staff_signature`
- `gmail_connected` (BOOLEAN)
- `gmail_email`, `gmail_refresh_token`
- `updated_at` (TIMESTAMP)

## Email Sequence Logic

When a client is created with an `appointment_date`, the system automatically schedules 4 emails:

1. **Welcome Email** - Sent immediately
2. **Reminder Email** - Sent 24 hours before appointment
3. **No-Show Check** - Sent 2 hours after appointment (if status is still "confirmed")
4. **Re-engagement** - Sent 7 days after a no-show

The cron job runs every 5 minutes to process scheduled emails.

## Gmail OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable the Gmail API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3001/api/gmail/callback`
6. Copy Client ID and Client Secret to `.env`

## API Documentation

Visit `GET /api` when the server is running for a complete endpoint listing.

## Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage
```

Note: Tests require a running PostgreSQL database. Tests will fail with 500 errors if DB is unavailable, which validates error handling.

## Production Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production database URL
- [ ] Set up Google OAuth with production redirect URI
- [ ] Configure CORS for production frontend URL
- [ ] Set up database backups
- [ ] Monitor cron job execution
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure logging aggregation

## License

MIT - For nonprofit use
