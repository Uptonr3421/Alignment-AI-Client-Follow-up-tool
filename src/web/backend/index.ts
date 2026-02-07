import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT || '100'),
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Cleveland LGBTQ Center Automation API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes (to be implemented)
app.get('/api/v1', (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to Cleveland LGBTQ Center Automation API v1',
    endpoints: {
      clients: '/api/v1/clients',
      templates: '/api/v1/templates',
      emails: '/api/v1/emails',
      reports: '/api/v1/reports',
      auth: '/api/v1/auth',
    },
  });
});

// TODO: Import and use route handlers
// import authRoutes from './routes/auth';
// import clientRoutes from './routes/clients';
// import emailRoutes from './routes/emails';
// import templateRoutes from './routes/templates';
// import reportRoutes from './routes/reports';
//
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/clients', clientRoutes);
// app.use('/api/v1/emails', emailRoutes);
// app.use('/api/v1/templates', templateRoutes);
// app.use('/api/v1/reports', reportRoutes);

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  res.status(500).json({
    success: false,
    error: {
      code: 'SERVER_ERROR',
      message: process.env.NODE_ENV === 'production' 
        ? 'An internal server error occurred' 
        : err.message,
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'The requested resource was not found',
    },
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║  Cleveland LGBTQ Center Client Follow-Up Automation API       ║
║                                                                ║
║  Status:   🟢 Running                                          ║
║  Port:     ${PORT}                                                 ║
║  Env:      ${process.env.NODE_ENV || 'development'}                                       ║
║                                                                ║
║  Built with ❤️  by Alignment AI                                ║
╚════════════════════════════════════════════════════════════════╝
  `);
});

export default app;
