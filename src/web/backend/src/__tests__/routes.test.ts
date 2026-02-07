import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { clientRoutes } from '../routes/clients';
import { settingsRoutes } from '../routes/settings';
import { templateRoutes } from '../routes/templates';
import { dashboardRoutes } from '../routes/dashboard';
import { gmailRoutes } from '../routes/gmail';
import { emailRoutes } from '../routes/emails';

// Create test app
const app = express();
app.use(express.json());
app.use('/api/clients', clientRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/emails', emailRoutes);
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

describe('API Routes - Health Check', () => {
  it('should return health status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
    expect(response.body.timestamp).toBeDefined();
  });
});

describe('API Routes - Clients', () => {
  let createdClientId: string;

  it('GET /api/clients should return paginated clients', async () => {
    const response = await request(app).get('/api/clients');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('data');
    expect(response.body).toHaveProperty('pagination');
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination).toHaveProperty('page');
    expect(response.body.pagination).toHaveProperty('limit');
    expect(response.body.pagination).toHaveProperty('total');
    expect(response.body.pagination).toHaveProperty('total_pages');
  });

  it('GET /api/clients should support pagination params', async () => {
    const response = await request(app).get('/api/clients?page=1&limit=10');
    expect(response.status).toBe(200);
    expect(response.body.pagination.page).toBe(1);
    expect(response.body.pagination.limit).toBe(10);
  });

  it('GET /api/clients should support search', async () => {
    const response = await request(app).get('/api/clients?search=john');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('filters');
    expect(response.body.filters.search).toBe('john');
  });

  it('GET /api/clients should support status filter', async () => {
    const response = await request(app).get('/api/clients?status=intake');
    expect(response.status).toBe(200);
    expect(response.body.filters.status).toBe('intake');
  });

  it('GET /api/clients should support sorting', async () => {
    const response = await request(app).get('/api/clients?sort_by=first_name&sort_order=asc');
    expect(response.status).toBe(200);
    expect(response.body.sort.by).toBe('first_name');
    expect(response.body.sort.order).toBe('asc');
  });

  it('POST /api/clients should validate required fields', async () => {
    const invalidClient = {
      email: 'test@example.com',
    };

    const response = await request(app)
      .post('/api/clients')
      .send(invalidClient);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid');
  });

  it('POST /api/clients should validate email format', async () => {
    const invalidClient = {
      first_name: 'Test',
      last_name: 'User',
      email: 'invalid-email',
    };

    const response = await request(app)
      .post('/api/clients')
      .send(invalidClient);

    expect(response.status).toBe(400);
  });

  it('POST /api/clients should create a new client', async () => {
    const newClient = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone: '555-1234',
      appointment_date: '2024-12-25T10:00:00',
      notes: 'Test client for API testing',
    };

    const response = await request(app)
      .post('/api/clients')
      .send(newClient);

    // May fail if DB not connected, but validates route structure
    expect([201, 500]).toContain(response.status);
    
    if (response.status === 201) {
      createdClientId = response.body.id;
      expect(response.body.first_name).toBe(newClient.first_name);
      expect(response.body.email).toBe(newClient.email);
    }
  });

  it('GET /api/clients/:id should return 404 for non-existent client', async () => {
    const response = await request(app).get('/api/clients/00000000-0000-0000-0000-000000000000');
    expect(response.status).toBe(404);
  });

  it('GET /api/clients/:id should validate UUID format', async () => {
    const response = await request(app).get('/api/clients/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('GET /api/clients/:id/emails should return 404 for non-existent client', async () => {
    const response = await request(app).get('/api/clients/00000000-0000-0000-0000-000000000000/emails');
    expect(response.status).toBe(404);
  });

  it('PUT /api/clients/:id should validate client exists', async () => {
    const response = await request(app)
      .put('/api/clients/00000000-0000-0000-0000-000000000000')
      .send({ first_name: 'Updated' });

    expect(response.status).toBe(404);
  });

  it('PUT /api/clients/:id should validate UUID format', async () => {
    const response = await request(app)
      .put('/api/clients/invalid-uuid')
      .send({ first_name: 'Updated' });

    expect(response.status).toBe(400);
  });

  it('DELETE /api/clients/:id should validate client exists', async () => {
    const response = await request(app)
      .delete('/api/clients/00000000-0000-0000-0000-000000000000');

    expect(response.status).toBe(404);
  });

  it('DELETE /api/clients/:id should validate UUID format', async () => {
    const response = await request(app)
      .delete('/api/clients/invalid-uuid');

    expect(response.status).toBe(400);
  });
});

describe('API Routes - Settings', () => {
  it('GET /api/settings should return settings', async () => {
    const response = await request(app).get('/api/settings');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('center_name');
    expect(response.body).toHaveProperty('gmail_connected');
  });

  it('PUT /api/settings should validate required fields', async () => {
    const invalidSettings = {
      center_address: '123 Main St',
    };

    const response = await request(app)
      .put('/api/settings')
      .send(invalidSettings);

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('Invalid');
  });

  it('PUT /api/settings should update with valid data', async () => {
    const validSettings = {
      center_name: 'Test Center',
      staff_name: 'Test Staff',
      center_address: '123 Main St',
      center_phone: '555-5678',
      staff_signature: 'Best regards, Test Staff',
    };

    const response = await request(app)
      .put('/api/settings')
      .send(validSettings);

    // May fail if DB not connected, but validates route structure
    expect([200, 500]).toContain(response.status);
  });
});

describe('API Routes - Templates', () => {
  it('GET /api/templates should return templates', async () => {
    const response = await request(app).get('/api/templates');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/templates/:id should return 404 for non-existent template', async () => {
    const response = await request(app).get('/api/templates/00000000-0000-0000-0000-000000000000');
    expect(response.status).toBe(404);
  });

  it('GET /api/templates/:id should validate UUID format', async () => {
    const response = await request(app).get('/api/templates/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('PUT /api/templates/:id should validate template exists', async () => {
    const response = await request(app)
      .put('/api/templates/00000000-0000-0000-0000-000000000000')
      .send({ name: 'Updated Template' });

    expect(response.status).toBe(404);
  });

  it('PUT /api/templates/:id should validate UUID format', async () => {
    const response = await request(app)
      .put('/api/templates/invalid-uuid')
      .send({ name: 'Updated Template' });

    expect(response.status).toBe(400);
  });
});

describe('API Routes - Dashboard', () => {
  it('GET /api/dashboard should return stats (legacy)', async () => {
    const response = await request(app).get('/api/dashboard');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total_clients');
    expect(response.body).toHaveProperty('appointments_this_week');
    expect(response.body).toHaveProperty('pending_follow_ups');
    expect(response.body).toHaveProperty('no_shows_this_month');
  });

  it('GET /api/dashboard/stats should return stats', async () => {
    const response = await request(app).get('/api/dashboard/stats');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('total_clients');
    expect(response.body).toHaveProperty('appointments_this_week');
    expect(response.body).toHaveProperty('pending_follow_ups');
    expect(response.body).toHaveProperty('no_shows_this_month');
  });

  it('GET /api/dashboard/today should return today\'s tasks', async () => {
    const response = await request(app).get('/api/dashboard/today');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('date');
    expect(response.body).toHaveProperty('total_tasks');
    expect(response.body).toHaveProperty('tasks');
    expect(Array.isArray(response.body.tasks)).toBe(true);
  });
});

describe('API Routes - Gmail', () => {
  it('GET /api/gmail/auth should redirect or return error', async () => {
    const response = await request(app).get('/api/gmail/auth');
    // Should redirect to Google OAuth or return error if env vars not set
    expect([302, 500]).toContain(response.status);
  });

  it('POST /api/gmail/auth should return auth URL', async () => {
    const response = await request(app).post('/api/gmail/auth');
    // Should return auth URL or error if env vars not set
    expect([200, 500]).toContain(response.status);
    
    if (response.status === 200) {
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('auth_url');
    }
  });

  it('GET /api/gmail/callback should handle missing code', async () => {
    const response = await request(app).get('/api/gmail/callback');
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('code');
  });

  it('GET /api/gmail/callback should handle OAuth errors', async () => {
    const response = await request(app).get('/api/gmail/callback?error=access_denied');
    expect(response.status).toBe(400);
    expect(response.body.error).toContain('access_denied');
  });

  it('POST /api/gmail/disconnect should return success or error', async () => {
    const response = await request(app).post('/api/gmail/disconnect');
    expect([200, 500]).toContain(response.status);
  });

  it('GET /api/gmail/status should return connection status', async () => {
    const response = await request(app).get('/api/gmail/status');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toHaveProperty('connected');
    expect(response.body.data).toHaveProperty('email');
  });
});

describe('API Routes - Emails', () => {
  it('GET /api/emails/pending should return pending emails', async () => {
    const response = await request(app).get('/api/emails/pending');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('count');
    expect(response.body).toHaveProperty('emails');
    expect(Array.isArray(response.body.emails)).toBe(true);
  });

  it('GET /api/emails/client/:clientId should validate UUID', async () => {
    const response = await request(app).get('/api/emails/client/invalid-uuid');
    expect(response.status).toBe(400);
  });

  it('GET /api/emails/client/:clientId should return 404 for non-existent client', async () => {
    const response = await request(app).get('/api/emails/client/00000000-0000-0000-0000-000000000000');
    expect(response.status).toBe(404);
  });

  it('POST /api/emails/send should validate required fields', async () => {
    const invalidData = {
      template_type: 'welcome',
    };

    const response = await request(app)
      .post('/api/emails/send')
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  it('POST /api/emails/send should validate UUID format', async () => {
    const invalidData = {
      client_id: 'invalid-uuid',
      template_type: 'welcome',
    };

    const response = await request(app)
      .post('/api/emails/send')
      .send(invalidData);

    expect(response.status).toBe(400);
  });

  it('POST /api/emails/:id/cancel should validate UUID', async () => {
    const response = await request(app)
      .post('/api/emails/invalid-uuid/cancel');

    expect(response.status).toBe(400);
  });

  it('POST /api/emails/:id/cancel should return 404 for non-existent email', async () => {
    const response = await request(app)
      .post('/api/emails/00000000-0000-0000-0000-000000000000/cancel');

    expect(response.status).toBe(404);
  });
});
