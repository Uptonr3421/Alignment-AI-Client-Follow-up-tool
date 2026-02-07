import * as functions from 'firebase-functions';
import * as express from 'express';
import * as cors from 'cors';
import { clientRoutes } from './routes/clients';
import { settingsRoutes } from './routes/settings';
import { templateRoutes } from './routes/templates';
import { dashboardRoutes } from './routes/dashboard';
import { gmailRoutes } from './routes/gmail';
import { emailRoutes } from './routes/emails';

const app = express();

// CORS configuration
const corsOptions: cors.CorsOptions = {
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200,
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/clients', clientRoutes);
app.use('/settings', settingsRoutes);
app.use('/templates', templateRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/gmail', gmailRoutes);
app.use('/emails', emailRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production',
  });
});

// API documentation
app.get('/', (_req, res) => {
  res.json({
    name: 'LGBTQ Center Client Automation API',
    version: '1.0.0',
    endpoints: {
      clients: {
        'GET /clients': 'List clients with pagination, search, filter',
        'POST /clients': 'Create new client + auto-generate email sequences',
        'GET /clients/:id': 'Get single client with email sequences',
        'GET /clients/:id/emails': 'Get email history for client',
        'PUT /clients/:id': 'Update client',
        'DELETE /clients/:id': 'Delete client + cancel pending emails',
      },
      templates: {
        'GET /templates': 'List all email templates',
        'GET /templates/:id': 'Get single template',
        'PUT /templates/:id': 'Update template',
      },
      dashboard: {
        'GET /dashboard': 'Get dashboard statistics',
        'GET /dashboard/stats': 'Get dashboard statistics',
        'GET /dashboard/today': 'Get today\'s tasks',
      },
      settings: {
        'GET /settings': 'Get settings',
        'PUT /settings': 'Update settings',
      },
      gmail: {
        'GET /gmail/auth': 'Initiate Gmail OAuth flow',
        'POST /gmail/auth': 'Get Gmail OAuth URL (POST alternative)',
        'GET /gmail/callback': 'OAuth callback handler',
        'POST /gmail/disconnect': 'Disconnect Gmail',
        'GET /gmail/status': 'Check Gmail connection status',
      },
      emails: {
        'GET /emails/pending': 'Get all pending scheduled emails',
        'GET /emails/client/:clientId': 'Get email history for client',
        'POST /emails/send': 'Send email immediately',
        'POST /emails/:id/cancel': 'Cancel scheduled email',
      },
    },
  });
});

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource does not exist',
  });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred',
  });
});

// Export as Firebase Function
export const api = functions.https.onRequest(app);
