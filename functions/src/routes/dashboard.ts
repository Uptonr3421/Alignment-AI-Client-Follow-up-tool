import { Router, Request, Response } from 'express';
import { collections } from '../services/db';
import { DashboardStats } from '../types';

const router = Router();

// Middleware to verify authentication
const verifyAuth = async (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'] as string || 'default-user';
  (req as any).userId = userId;
  next();
};

router.use(verifyAuth);

/**
 * GET /dashboard - Get dashboard statistics
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    // Get total clients
    const clientsSnapshot = await collections.clients
      .where('userId', '==', userId)
      .get();
    const totalClients = clientsSnapshot.size;

    // Get appointments this week
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);

    const appointmentsSnapshot = await collections.clients
      .where('userId', '==', userId)
      .where('appointmentDate', '>=', startOfWeek)
      .where('appointmentDate', '<', endOfWeek)
      .get();
    const appointmentsThisWeek = appointmentsSnapshot.size;

    // Get pending follow-ups (scheduled emails)
    const pendingSnapshot = await collections.emailSequences
      .where('userId', '==', userId)
      .where('status', '==', 'scheduled')
      .get();
    const pendingFollowUps = pendingSnapshot.size;

    // Get no-shows this month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const noShowsSnapshot = await collections.clients
      .where('userId', '==', userId)
      .where('status', '==', 'no_show')
      .where('updatedAt', '>=', startOfMonth)
      .get();
    const noShowsThisMonth = noShowsSnapshot.size;

    // Get emails sent today
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const emailsSentSnapshot = await collections.sentEmails
      .where('userId', '==', userId)
      .where('sentAt', '>=', startOfDay)
      .get();
    const emailsSentToday = emailsSentSnapshot.size;

    const stats: DashboardStats = {
      totalClients,
      appointmentsThisWeek,
      pendingFollowUps,
      noShowsThisMonth,
      emailsSentToday,
      emailsScheduled: pendingFollowUps,
    };

    res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
});

/**
 * GET /dashboard/stats - Get dashboard statistics (alias)
 */
router.get('/stats', async (req: Request, res: Response) => {
  // Forward to main dashboard handler
  return router.handle(req, res, () => {});
});

/**
 * GET /dashboard/today - Get today's tasks
 */
router.get('/today', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    // Get appointments today
    const appointmentsSnapshot = await collections.clients
      .where('userId', '==', userId)
      .where('appointmentDate', '>=', startOfDay)
      .where('appointmentDate', '<=', endOfDay)
      .get();

    const appointments = appointmentsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get emails scheduled for today
    const emailsSnapshot = await collections.emailSequences
      .where('userId', '==', userId)
      .where('scheduledSendAt', '>=', startOfDay)
      .where('scheduledSendAt', '<=', endOfDay)
      .where('status', '==', 'scheduled')
      .get();

    const emails = emailsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: {
        appointments,
        emails,
        date: now.toISOString().split('T')[0],
      },
    });
  } catch (error) {
    console.error('Error fetching today\'s tasks:', error);
    res.status(500).json({ error: 'Failed to fetch today\'s tasks' });
  }
});

export { router as dashboardRoutes };
