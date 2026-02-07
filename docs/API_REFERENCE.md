# API Reference

Technical documentation for developers integrating with or extending the Cleveland LGBTQ Center Client Follow-Up Automation System.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Endpoints](#endpoints)
4. [Data Models](#data-models)
5. [Webhooks](#webhooks)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Examples](#examples)

---

## Overview

### Base URL

**Web App**: `http://localhost:3000/api/v1`  
**Production**: `https://your-domain.com/api/v1`

### Response Format

All responses are in JSON format:

```json
{
  "success": true,
  "data": { },
  "message": "Operation completed successfully"
}
```

### Authentication

API uses JWT (JSON Web Tokens) for authentication.

---

## Authentication

### Login

Obtain an access token:

**Endpoint**: `POST /auth/login`

**Request**:
```json
{
  "email": "user@example.com",
  "password": "your-password"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "usr_123",
      "email": "user@example.com",
      "name": "John Doe",
      "role": "admin"
    }
  }
}
```

### Using the Token

Include the token in the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Expiration

- Access tokens expire after 24 hours
- Refresh using `/auth/refresh` endpoint

---

## Endpoints

### Clients

#### List Clients

`GET /clients`

**Query Parameters**:
- `page` (number, default: 1)
- `limit` (number, default: 50, max: 100)
- `status` (string: "scheduled", "attended", "no-show", "cancelled")
- `search` (string: search by name or email)

**Response**:
```json
{
  "success": true,
  "data": {
    "clients": [
      {
        "id": "cli_123",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "phone": "216-555-0123",
        "appointmentDate": "2024-01-15T10:00:00Z",
        "status": "scheduled",
        "serviceType": "Counseling",
        "createdAt": "2024-01-01T12:00:00Z",
        "updatedAt": "2024-01-01T12:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 150,
      "pages": 3
    }
  }
}
```

#### Get Single Client

`GET /clients/:id`

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cli_123",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "216-555-0123",
    "appointmentDate": "2024-01-15T10:00:00Z",
    "status": "scheduled",
    "serviceType": "Counseling",
    "notes": "Client prefers morning appointments",
    "emailHistory": [
      {
        "type": "welcome",
        "sentAt": "2024-01-01T12:00:00Z",
        "status": "delivered"
      }
    ],
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:00:00Z"
  }
}
```

#### Create Client

`POST /clients`

**Request**:
```json
{
  "firstName": "Jane",
  "lastName": "Smith",
  "email": "jane@example.com",
  "phone": "216-555-0124",
  "appointmentDate": "2024-01-20T14:00:00Z",
  "serviceType": "Legal Aid",
  "notes": "Referred by social worker"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "cli_124",
    "firstName": "Jane",
    "lastName": "Smith",
    // ... full client object
  },
  "message": "Client created successfully. Welcome email queued."
}
```

#### Update Client

`PATCH /clients/:id`

**Request** (partial update supported):
```json
{
  "appointmentDate": "2024-01-21T14:00:00Z",
  "notes": "Rescheduled by client"
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    // ... updated client object
  },
  "message": "Client updated successfully"
}
```

#### Delete Client

`DELETE /clients/:id`

**Response**:
```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

#### Mark Attendance

`POST /clients/:id/attendance`

**Request**:
```json
{
  "attended": true
}
```

**Response**:
```json
{
  "success": true,
  "data": {
    // ... updated client with status "attended" or "no-show"
  }
}
```

### Email Templates

#### List Templates

`GET /templates`

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "tpl_welcome",
      "name": "Welcome Email",
      "subject": "Welcome to Cleveland LGBTQ Center",
      "body": "Hi {{client_first_name}},\n\nThank you for...",
      "type": "welcome",
      "updatedAt": "2024-01-01T12:00:00Z"
    }
  ]
}
```

#### Get Template

`GET /templates/:id`

#### Update Template

`PATCH /templates/:id`

**Request**:
```json
{
  "subject": "Updated subject line",
  "body": "Updated email body with {{client_first_name}}"
}
```

### Email Queue

#### Get Queue Status

`GET /emails/queue`

**Response**:
```json
{
  "success": true,
  "data": {
    "pending": 5,
    "processing": 2,
    "completed": 150,
    "failed": 3,
    "queue": [
      {
        "id": "eml_123",
        "clientId": "cli_123",
        "type": "reminder",
        "scheduledFor": "2024-01-13T10:00:00Z",
        "status": "pending"
      }
    ]
  }
}
```

#### Send Manual Email

`POST /emails/send`

**Request**:
```json
{
  "clientId": "cli_123",
  "templateId": "tpl_welcome",
  "sendImmediately": true
}
```

### Reports

#### Get Dashboard Stats

`GET /reports/dashboard`

**Query Parameters**:
- `startDate` (ISO 8601 date)
- `endDate` (ISO 8601 date)

**Response**:
```json
{
  "success": true,
  "data": {
    "totalClients": 150,
    "scheduledToday": 5,
    "emailsSentToday": 12,
    "attendanceRate": 0.85,
    "noShowRate": 0.15,
    "emailOpenRate": 0.72
  }
}
```

#### Export Data

`POST /reports/export`

**Request**:
```json
{
  "type": "clients",
  "format": "csv",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31"
}
```

**Response**: CSV or JSON file download

---

## Data Models

### Client

```typescript
interface Client {
  id: string;                    // Unique identifier
  firstName: string;             // Required
  lastName: string;              // Required
  email: string;                 // Required, must be valid email
  phone?: string;                // Optional, format: 216-555-0123
  appointmentDate: Date;         // Required, ISO 8601
  status: ClientStatus;          // Enum
  serviceType: string;           // Dropdown value
  notes?: string;                // Optional, private notes
  emailHistory: EmailLog[];      // Array of sent emails
  createdAt: Date;              
  updatedAt: Date;              
}

enum ClientStatus {
  SCHEDULED = "scheduled",
  REMINDED = "reminded",
  ATTENDED = "attended",
  NO_SHOW = "no-show",
  CANCELLED = "cancelled",
  RE_ENGAGED = "re-engaged"
}
```

### Email Template

```typescript
interface EmailTemplate {
  id: string;
  name: string;
  type: EmailType;
  subject: string;
  body: string;                  // Supports merge tags
  updatedAt: Date;
}

enum EmailType {
  WELCOME = "welcome",
  REMINDER = "reminder",
  NO_SHOW = "no-show",
  RE_ENGAGEMENT = "re-engagement"
}
```

### Email Log

```typescript
interface EmailLog {
  id: string;
  clientId: string;
  templateId: string;
  type: EmailType;
  subject: string;
  sentAt: Date;
  status: EmailStatus;
  openedAt?: Date;
  clickedAt?: Date;
  error?: string;
}

enum EmailStatus {
  QUEUED = "queued",
  SENDING = "sending",
  DELIVERED = "delivered",
  FAILED = "failed",
  BOUNCED = "bounced"
}
```

---

## Webhooks

### Configuration

`POST /webhooks`

**Request**:
```json
{
  "url": "https://your-app.com/webhook",
  "events": ["client.created", "email.sent", "client.no_show"],
  "secret": "your-webhook-secret"
}
```

### Events

Available webhook events:

- `client.created`
- `client.updated`
- `client.deleted`
- `email.sent`
- `email.delivered`
- `email.failed`
- `client.attended`
- `client.no_show`

### Webhook Payload

```json
{
  "event": "client.created",
  "timestamp": "2024-01-15T10:00:00Z",
  "data": {
    // Event-specific data
  }
}
```

### Signature Verification

Webhooks include an `X-Webhook-Signature` header:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return hash === signature;
}
```

---

## Error Handling

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_INPUT",
    "message": "Email address is required",
    "field": "email"
  }
}
```

### Common Error Codes

- `UNAUTHORIZED` (401): Invalid or missing token
- `FORBIDDEN` (403): Insufficient permissions
- `NOT_FOUND` (404): Resource not found
- `INVALID_INPUT` (400): Validation error
- `RATE_LIMITED` (429): Too many requests
- `SERVER_ERROR` (500): Internal server error

---

## Rate Limiting

- **Default**: 100 requests per minute per IP
- **Burst**: 200 requests per minute for short bursts
- **Headers**:
  - `X-RateLimit-Limit`: Total requests allowed
  - `X-RateLimit-Remaining`: Requests remaining
  - `X-RateLimit-Reset`: Unix timestamp when limit resets

When rate limited:

```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMITED",
    "message": "Too many requests. Please try again in 60 seconds."
  }
}
```

---

## Examples

### Create Client and Send Welcome Email

```javascript
const axios = require('axios');

async function createClient() {
  const response = await axios.post(
    'http://localhost:3000/api/v1/clients',
    {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '216-555-0123',
      appointmentDate: '2024-01-20T10:00:00Z',
      serviceType: 'Counseling'
    },
    {
      headers: {
        'Authorization': 'Bearer YOUR_TOKEN',
        'Content-Type': 'application/json'
      }
    }
  );
  
  console.log('Client created:', response.data.data);
}
```

### Bulk Import Clients

```javascript
async function importClients(clients) {
  const promises = clients.map(client =>
    axios.post('http://localhost:3000/api/v1/clients', client, {
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    })
  );
  
  const results = await Promise.allSettled(promises);
  
  const successful = results.filter(r => r.status === 'fulfilled').length;
  const failed = results.filter(r => r.status === 'rejected').length;
  
  console.log(`Imported: ${successful} successful, ${failed} failed`);
}
```

### Get Daily Report

```javascript
async function getDailyReport() {
  const today = new Date().toISOString().split('T')[0];
  
  const response = await axios.get(
    'http://localhost:3000/api/v1/reports/dashboard',
    {
      params: {
        startDate: today,
        endDate: today
      },
      headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
    }
  );
  
  console.log('Today\'s stats:', response.data.data);
}
```

---

## SDK Libraries

Currently, the API can be accessed using any HTTP client. Official SDKs coming soon:

- [ ] JavaScript/TypeScript SDK
- [ ] Python SDK
- [ ] Ruby SDK

---

## Support

For API questions or issues:

📧 **Email**: [contact@alignment-ai.io](mailto:contact@alignment-ai.io)  
📚 **Documentation**: [GitHub Wiki](https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool/wiki)  
💬 **Discussion**: [GitHub Discussions](https://github.com/Uptonr3421/Alignment-AI-Client-Follow-up-tool/discussions)

---

## Changelog

### v1.0.0 (Initial Release)
- Client management endpoints
- Email template management
- Email queue and automation
- Basic reporting
- Webhook support
