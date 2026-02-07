# API Reference

REST API documentation for the LGBTQ Center Client Automation system.

## Base URL

```
Web: https://your-domain.com/api
Desktop: http://localhost:3001/api
```

## Authentication

All endpoints require a valid session token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Clients

#### List Clients
```http
GET /clients
```

Query parameters:
- `page` (number): Page number
- `limit` (number): Items per page
- `search` (string): Search by name or email
- `status` (string): Filter by status

Response:
```json
{
  "clients": [...],
  "total": 100,
  "page": 1,
  "limit": 20
}
```

#### Create Client
```http
POST /clients
```

Body:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "216-555-1234",
  "intakeDate": "2026-02-06",
  "appointmentDate": "2026-02-10T14:00:00Z"
}
```

#### Get Client
```http
GET /clients/:id
```

#### Update Client
```http
PUT /clients/:id
```

#### Delete Client
```http
DELETE /clients/:id
```

### Email Sequences

#### Get Client Emails
```http
GET /clients/:id/emails
```

#### Cancel Pending Email
```http
POST /emails/:id/cancel
```

### Templates

#### List Templates
```http
GET /templates
```

#### Update Template
```http
PUT /templates/:id
```

Body:
```json
{
  "subject": "Welcome to Cleveland LGBTQ Center",
  "body": "Hi {{firstName}}, welcome..."
}
```

### Dashboard

#### Get Stats
```http
GET /dashboard/stats
```

Response:
```json
{
  "totalClients": 150,
  "activeClients": 45,
  "emailsSentToday": 12,
  "pendingEmails": 8,
  "upcomingAppointments": 5
}
```

#### Get Today's Tasks
```http
GET /dashboard/today
```

### Settings

#### Get Settings
```http
GET /settings
```

#### Update Settings
```http
PUT /settings
```

## Error Responses

```json
{
  "error": "ValidationError",
  "message": "Email is required",
  "details": [...]
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `500` - Server Error
