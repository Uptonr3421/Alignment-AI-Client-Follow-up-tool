import { Router, Request, Response } from 'express';
import { eq, and, desc } from 'drizzle-orm';
import { db } from '../db/index';
import { email_sequences, email_templates, clients, settings } from '../db/schema';
import { gmailService } from '../services/gmail';
import { renderTemplate } from '../shared/utils';
import { sendEmailSchema, cancelEmailSchema, uuidParamSchema } from '../shared/validation';

const router = Router();

/**
 * GET /api/emails/client/:clientId
 * Get email history for a specific client
 */
router.get('/client/:clientId', async (req: Request, res: Response) => {
  try {
    const { clientId } = req.params;

    // Validate UUID
    const parseResult = uuidParamSchema.safeParse({ id: clientId });
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid client ID format' });
      return;
    }

    // Check if client exists
    const clientResult = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (clientResult.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Get email sequences with template details
    const emails = await db
      .select({
        id: email_sequences.id,
        template_type: email_sequences.template_type,
        scheduled_send_at: email_sequences.scheduled_send_at,
        sent_at: email_sequences.sent_at,
        status: email_sequences.status,
        error_message: email_sequences.error_message,
        template_name: email_templates.name,
        template_subject: email_templates.subject,
      })
      .from(email_sequences)
      .leftJoin(email_templates, eq(email_sequences.template_type, email_templates.type))
      .where(eq(email_sequences.client_id, clientId))
      .orderBy(desc(email_sequences.scheduled_send_at));

    res.json({
      client_id: clientId,
      client_name: `${clientResult[0].first_name} ${clientResult[0].last_name}`,
      emails: emails,
    });
  } catch (error) {
    console.error('Error fetching client emails:', error);
    res.status(500).json({ error: 'Failed to fetch email history' });
  }
});

/**
 * POST /api/emails/send
 * Send an email immediately to a client
 */
router.post('/send', async (req: Request, res: Response) => {
  try {
    // Validate input
    const parseResult = sendEmailSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.errors,
      });
      return;
    }

    const { client_id, template_type, custom_subject, custom_body } = parseResult.data;

    // Check if Gmail is connected
    const connectionStatus = await gmailService.isConnected();
    if (!connectionStatus.connected) {
      res.status(400).json({
        error: 'Gmail not connected',
        message: 'Please connect your Gmail account in settings before sending emails.',
      });
      return;
    }

    // Get client details
    const [client] = await db
      .select()
      .from(clients)
      .where(eq(clients.id, client_id))
      .limit(1);

    if (!client) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Get template
    const [template] = await db
      .select()
      .from(email_templates)
      .where(eq(email_templates.type, template_type))
      .limit(1);

    if (!template && !custom_body) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    // Get settings for email rendering
    const [setting] = await db.select().from(settings).limit(1);
    const centerName = setting?.center_name || 'LGBTQ+ Center';

    // Render email content
    const templateData = {
      firstName: client.first_name,
      lastName: client.last_name,
      email: client.email,
      appointmentDate: client.appointment_date,
      centerName: centerName,
    };

    const subject = custom_subject || (template ? renderTemplate(template.subject, templateData) : '');
    const body = custom_body || (template ? renderTemplate(template.body, templateData) : '');

    // Get access token
    const refreshToken = await gmailService.getStoredRefreshToken();
    if (!refreshToken) {
      res.status(500).json({ error: 'No refresh token found' });
      return;
    }

    const accessToken = await gmailService.refreshAccessToken(refreshToken);

    // Send email via Gmail API
    const result = await gmailService.sendEmail({
      to: client.email,
      subject,
      body,
      accessToken,
    });

    // Record the sent email in sequences
    const [sequence] = await db
      .insert(email_sequences)
      .values({
        client_id: client_id,
        template_type: template_type,
        scheduled_send_at: new Date(),
        sent_at: new Date(),
        status: 'sent',
      })
      .returning();

    res.json({
      success: true,
      message: 'Email sent successfully',
      data: {
        email_id: result.id,
        sequence_id: sequence.id,
        recipient: client.email,
        subject,
        sent_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({
      error: 'Failed to send email',
      message: errorMessage,
    });
  }
});

/**
 * POST /api/emails/:id/cancel
 * Cancel a scheduled email
 */
router.post('/:id/cancel', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const parseResult = uuidParamSchema.safeParse({ id });
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid email ID format' });
      return;
    }

    // Validate body if provided
    const bodyResult = cancelEmailSchema.safeParse(req.body);
    if (!bodyResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: bodyResult.error.errors,
      });
      return;
    }

    // Find the email sequence
    const [sequence] = await db
      .select()
      .from(email_sequences)
      .where(eq(email_sequences.id, id))
      .limit(1);

    if (!sequence) {
      res.status(404).json({ error: 'Email not found' });
      return;
    }

    // Check if email is already sent or failed
    if (sequence.status !== 'scheduled') {
      res.status(400).json({
        error: 'Cannot cancel email',
        message: `Email is already ${sequence.status}`,
        status: sequence.status,
      });
      return;
    }

    // Delete the scheduled email
    await db.delete(email_sequences).where(eq(email_sequences.id, id));

    res.json({
      success: true,
      message: 'Email cancelled successfully',
      data: {
        cancelled_email_id: id,
        template_type: sequence.template_type,
        was_scheduled_for: sequence.scheduled_send_at,
      },
    });
  } catch (error) {
    console.error('Error cancelling email:', error);
    res.status(500).json({ error: 'Failed to cancel email' });
  }
});

/**
 * GET /api/emails/pending
 * Get all pending (scheduled) emails
 */
router.get('/pending', async (_req: Request, res: Response) => {
  try {
    const pendingEmails = await db
      .select({
        id: email_sequences.id,
        client_id: email_sequences.client_id,
        template_type: email_sequences.template_type,
        scheduled_send_at: email_sequences.scheduled_send_at,
        client_first_name: clients.first_name,
        client_last_name: clients.last_name,
        client_email: clients.email,
      })
      .from(email_sequences)
      .innerJoin(clients, eq(email_sequences.client_id, clients.id))
      .where(
        and(
          eq(email_sequences.status, 'scheduled'),
          eq(email_sequences.scheduled_send_at, email_sequences.scheduled_send_at)
        )
      )
      .orderBy(email_sequences.scheduled_send_at);

    res.json({
      count: pendingEmails.length,
      emails: pendingEmails,
    });
  } catch (error) {
    console.error('Error fetching pending emails:', error);
    res.status(500).json({ error: 'Failed to fetch pending emails' });
  }
});

export { router as emailRoutes };
