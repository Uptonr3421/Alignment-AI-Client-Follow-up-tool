import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cron from 'node-cron';

import { clientRoutes } from './routes/clients';
import { settingsRoutes } from './routes/settings';
import { templateRoutes } from './routes/templates';
import { dashboardRoutes } from './routes/dashboard';
import { gmailRoutes } from './routes/gmail';
import { emailRoutes } from './routes/emails';
import { emailService } from './services/email';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req: Request, _res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    next();
  });
}

// Routes
app.use('/api/clients', clientRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/gmail', gmailRoutes);
app.use('/api/emails', emailRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
  });
});

// API documentation endpoint
app.get('/api', (_req: Request, res: Response) => {
  res.json({
    name: 'LGBTQ Center Client Automation API',
    version: '1.0.0',
    endpoints: {
      clients: {
        'GET /api/clients': 'List clients with pagination, search, filter',
        'POST /api/clients': 'Create new client + auto-generate email sequences',
        'GET /api/clients/:id': 'Get single client with email sequences',
        'GET /api/clients/:id/emails': 'Get email history for client',
        'PUT /api/clients/:id': 'Update client',
        'DELETE /api/clients/:id': 'Delete client + cancel pending emails',
      },
      templates: {
        'GET /api/templates': 'List all email templates',
        'GET /api/templates/:id': 'Get single template',
        'PUT /api/templates/:id': 'Update template',
      },
      dashboard: {
        'GET /api/dashboard': 'Get dashboard statistics (legacy)',
        'GET /api/dashboard/stats': 'Get dashboard statistics',
        'GET /api/dashboard/today': 'Get today\'s tasks',
      },
      settings: {
        'GET /api/settings': 'Get settings',
        'PUT /api/settings': 'Update settings',
      },
      gmail: {
        'GET /api/gmail/auth': 'Initiate Gmail OAuth flow',
        'POST /api/gmail/auth': 'Get Gmail OAuth URL (POST alternative)',
        'GET /api/gmail/callback': 'OAuth callback handler',
        'POST /api/gmail/disconnect': 'Disconnect Gmail',
        'GET /api/gmail/status': 'Check Gmail connection status',
      },
      emails: {
        'GET /api/emails/pending': 'Get all pending scheduled emails',
        'GET /api/emails/client/:clientId': 'Get email history for client',
        'POST /api/emails/send': 'Send email immediately',
        'POST /api/emails/:id/cancel': 'Cancel scheduled email',
      },
    },
  });
});

// 404 handler for undefined routes
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
  });
});

// Cron job: Check for emails to send every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('[Cron] Checking for scheduled emails...');
  try {
    const result = await emailService.processScheduledEmails();
    console.log(`[Cron] Email processing complete: ${result.sent} sent, ${result.failed} failed, ${result.processed} processed`);
  } catch (error) {
    console.error('[Cron] Error processing scheduled emails:', error);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`📧 Gmail OAuth: ${process.env.GOOGLE_CLIENT_ID ? 'Configured' : 'Not configured'}`);
});

export default app;
