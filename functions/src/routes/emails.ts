import { Router, Request, Response } from 'express';
import { collections } from '../services/db';
import { emailService } from '../services/email';

const router = Router();

// Middleware to verify authentication
const verifyAuth = async (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'] as string || 'default-user';
  (req as any).userId = userId;
  next();
};

router.use(verifyAuth);

/**
 * GET /emails/pending - Get all pending scheduled emails
 */
router.get('/pending', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const snapshot = await collections.emailSequences
      .where('userId', '==', userId)
      .where('status', '==', 'scheduled')
      .orderBy('scheduledSendAt', 'asc')
      .get();

    const emails = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: { emails },
    });
  } catch (error) {
    console.error('Error fetching pending emails:', error);
    res.status(500).json({ error: 'Failed to fetch pending emails' });
  }
});

/**
 * GET /emails/client/:clientId - Get email history for client
 */
router.get('/client/:clientId', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { clientId } = req.params;

    const snapshot = await collections.sentEmails
      .where('clientId', '==', clientId)
      .where('userId', '==', userId)
      .orderBy('sentAt', 'desc')
      .get();

    const emails = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.json({
      success: true,
      data: { emails },
    });
  } catch (error) {
    console.error('Error fetching client emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

/**
 * POST /emails/send - Send email immediately
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { to, subject, body, clientId } = req.body;

    if (!to || !subject || !body) {
      return res.status(400).json({
        error: 'Missing required fields: to, subject, body',
      });
    }

    const result = await emailService.sendEmail(userId, {
      to,
      subject,
      body,
      isHtml: true,
      clientId,
    });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

/**
 * POST /emails/:id/cancel - Cancel scheduled email
 */
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const doc = await collections.emailSequences.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const sequence = doc.data();

    if (sequence?.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await doc.ref.update({
      status: 'cancelled',
      updatedAt: new Date(),
    });

    res.json({
      success: true,
      message: 'Email cancelled successfully',
    });
  } catch (error) {
    console.error('Error cancelling email:', error);
    res.status(500).json({ error: 'Failed to cancel email' });
  }
});

export { router as emailRoutes };
