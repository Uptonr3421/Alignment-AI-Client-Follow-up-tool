# LGBTQ Center Backend API Documentation

## Overview

Backend API for the Cleveland LGBTQ Center Client Automation System.

**Base URL:** `http://localhost:3001/api`

## Endpoints

### Health Check

#### GET /health
Returns server health status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### Clients

#### GET /api/clients
List all clients with pagination.

**Query Parameters:**
- `page` (number, optional): Page number (default: 1)
- `limit` (number, optional): Items per page (default: 20)

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john@example.com",
      "phone": "555-1234",
      "intake_date": "2024-01-01T00:00:00Z",
      "appointment_date": "2024-01-15T10:00:00Z",
      "status": "intake",
      "notes": "",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "total_pages": 5
  }
}
```

#### GET /api/clients/:id
Get a single client with their email sequences.

**Response:**
```json
{
  "id": "uuid",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "intake_date": "2024-01-01T00:00:00Z",
  "appointment_date": "2024-01-15T10:00:00Z",
  "status": "intake",
  "notes": "",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z",
  "email_sequences": [
    {
      "id": "uuid",
      "template_type": "welcome",
      "scheduled_send_at": "2024-01-01T00:00:00Z",
      "sent_at": null,
      "status": "scheduled",
      "error_message": null
    }
  ]
}
```

#### POST /api/clients
Create a new client. Auto-creates email sequences if appointment_date is provided.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "intake_date": "2024-01-01T00:00:00Z",
  "appointment_date": "2024-01-15T10:00:00Z",
  "status": "intake",
  "notes": ""
}
```

**Required Fields:** `first_name`, `last_name`, `email`

**Response:**
```json
{
  "id": "uuid",
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "phone": "555-1234",
  "intake_date": "2024-01-01T00:00:00Z",
  "appointment_date": "2024-01-15T10:00:00Z",
  "status": "intake",
  "notes": "",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

#### PUT /api/clients/:id
Update a client.

**Request Body:** (any of the following)
```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "email": "jane@example.com",
  "phone": "555-5678",
  "intake_date": "2024-01-01T00:00:00Z",
  "appointment_date": "2024-01-20T10:00:00Z",
  "status": "confirmed",
  "notes": "Updated notes"
}
```

#### DELETE /api/clients/:id
Delete a client (cascades to email sequences).

**Response:**
```json
{
  "message": "Client deleted successfully"
}
```

---

### Settings

#### GET /api/settings
Get center settings.

**Response:**
```json
{
  "center_name": "Cleveland LGBTQ Center",
  "center_address": "123 Main St, Cleveland, OH",
  "center_phone": "555-0000",
  "staff_name": "Staff Member",
  "staff_signature": "Best regards,\nStaff Member",
  "gmail_connected": true,
  "gmail_email": "staff@center.org"
}
```

#### PUT /api/settings
Update center settings.

**Request Body:**
```json
{
  "center_name": "Cleveland LGBTQ Center",
  "center_address": "123 Main St, Cleveland, OH",
  "center_phone": "555-0000",
  "staff_name": "Staff Member",
  "staff_signature": "Best regards,\nStaff Member"
}
```

**Required Fields:** `center_name`, `staff_name`

---

### Email Templates

#### GET /api/templates
Get all email templates.

**Response:**
```json
[
  {
    "id": "uuid",
    "type": "welcome",
    "name": "Welcome Email",
    "subject": "Welcome to {{centerName}}",
    "body": "Dear {{firstName}}, welcome to our center...",
    "is_default": true
  }
]
```

#### GET /api/templates/:id
Get a single template.

#### PUT /api/templates/:id
Update a template.

**Request Body:**
```json
{
  "name": "Updated Template Name",
  "subject": "Updated Subject",
  "body": "Updated body with {{firstName}} placeholder",
  "is_default": true
}
```

---

### Dashboard

#### GET /api/dashboard
Get dashboard statistics.

**Response:**
```json
{
  "total_clients": 150,
  "appointments_this_week": 12,
  "pending_follow_ups": 8,
  "no_shows_this_month": 3
}
```

---

### Gmail Integration

#### GET /api/gmail/auth
Initiate Google OAuth flow. Redirects to Google's consent screen.

#### GET /api/gmail/callback
OAuth callback endpoint (handled by Google redirect).

#### GET /api/gmail/status
Check Gmail connection status.

**Response:**
```json
{
  "success": true,
  "data": {
    "connected": true,
    "email": "staff@center.org"
  }
}
```

#### POST /api/gmail/disconnect
Disconnect Gmail and clear stored tokens.

**Response:**
```json
{
  "success": true,
  "message": "Gmail disconnected successfully"
}
```

---

## Email Sequence Logic

When a client is created with an `appointment_date`, the following email sequences are automatically generated:

1. **Welcome Email**: Sent immediately upon creation
2. **Reminder Email**: Sent 24 hours before the appointment
3. **No-Show Check**: Sent 2 hours after the appointment (for status tracking)
4. **Re-engagement**: Sent 7 days after a missed appointment

## Template Variables

Email templates support the following placeholders:

- `{{firstName}}` - Client's first name
- `{{lastName}}` - Client's last name
- `{{email}}` - Client's email address
- `{{appointmentDate}}` - Formatted appointment date
- `{{centerName}}` - Center name from settings

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message description"
}
```

**Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `404` - Not Found
- `500` - Internal Server Error

## Database Schema

### clients
- `id` (uuid, primary key)
- `first_name` (varchar, required)
- `last_name` (varchar, required)
- `email` (varchar, required)
- `phone` (varchar)
- `intake_date` (timestamp)
- `appointment_date` (timestamp)
- `status` (enum: intake, confirmed, reminded, no_show, rescheduled, completed)
- `notes` (text)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### email_sequences
- `id` (uuid, primary key)
- `client_id` (uuid, foreign key)
- `template_type` (enum: welcome, reminder, no_show, re_engagement)
- `scheduled_send_at` (timestamp)
- `sent_at` (timestamp)
- `status` (enum: scheduled, sent, failed)
- `error_message` (text)

### settings
- `id` (uuid, primary key)
- `center_name` (varchar, required)
- `center_address` (text)
- `center_phone` (varchar)
- `staff_name` (varchar, required)
- `staff_signature` (text)
- `gmail_connected` (boolean)
- `gmail_email` (varchar)
- `gmail_refresh_token` (text)
- `updated_at` (timestamp)

### email_templates
- `id` (uuid, primary key)
- `type` (enum: welcome, reminder, no_show, re_engagement)
- `name` (varchar, required)
- `subject` (varchar, required)
- `body` (text, required)
- `is_default` (boolean)
