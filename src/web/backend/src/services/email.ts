import { db } from '../db';
import {
  email_sequences,
  email_templates,
  clients,
  settings,
  emailStatusEnum,
  templateTypeEnum,
} from '../db/schema';
import { eq, and, lte } from 'drizzle-orm';
import { gmailService } from './gmail';

// Import from shared utils (assumed to exist)
import { renderTemplate, calculateEmailSchedule } from '../shared/utils';

export interface CreateEmailSequencesOptions {
  clientId: string;
  appointmentDate: Date;
}

export class EmailService {
  /**
   * Process scheduled emails that are due to be sent
   * Called by cron job every 5 minutes
   */
  async processScheduledEmails(): Promise<{
    processed: number;
    sent: number;
    failed: number;
  }> {
    console.log('[EmailService] Processing scheduled emails...');

    const result = {
      processed: 0,
      sent: 0,
      failed: 0,
    };

    try {
      // Find all scheduled emails that are due
      const dueEmails = await db
        .select({
          sequence: email_sequences,
          client: clients,
          template: email_templates,
        })
        .from(email_sequences)
        .innerJoin(clients, eq(email_sequences.client_id, clients.id))
        .innerJoin(
          email_templates,
          eq(email_sequences.template_type, email_templates.type)
        )
        .where(
          and(
            eq(email_sequences.status, 'scheduled'),
            lte(email_sequences.scheduled_send_at, new Date())
          )
        );

      console.log(`[EmailService] Found ${dueEmails.length} emails to send`);

      if (dueEmails.length === 0) {
        return result;
      }

      // Check if Gmail is connected
      const connectionStatus = await gmailService.isConnected();
      if (!connectionStatus.connected) {
        console.error('[EmailService] Gmail not connected, skipping email sends');
        return result;
      }

      // Get refresh token and access token
      const refreshToken = await gmailService.getStoredRefreshToken();
      if (!refreshToken) {
        console.error('[EmailService] No refresh token found');
        return result;
      }

      let accessToken: string;
      try {
        accessToken = await gmailService.refreshAccessToken(refreshToken);
      } catch (error) {
        console.error('[EmailService] Failed to refresh access token:', error);
        return result;
      }

      // Get settings for email rendering
      const [setting] = await db.select().from(settings).limit(1);
      const centerName = setting?.center_name || 'LGBTQ+ Center';

      // Process each email
      for (const { sequence, client, template } of dueEmails) {
        result.processed++;

        try {
          // Render template with client data
          const renderedBody = renderTemplate(template.body, {
            firstName: client.first_name,
            lastName: client.last_name,
            email: client.email,
            appointmentDate: client.appointment_date,
            centerName: centerName,
          });

          const renderedSubject = renderTemplate(template.subject, {
            firstName: client.first_name,
            lastName: client.last_name,
            centerName: centerName,
          });

          // Send email via Gmail API
          await gmailService.sendEmail({
            to: client.email,
            subject: renderedSubject,
            body: renderedBody,
            accessToken,
          });

          // Update status to sent
          await db
            .update(email_sequences)
            .set({
              status: 'sent',
              sent_at: new Date(),
              error_message: null,
            })
            .where(eq(email_sequences.id, sequence.id));

          console.log(`[EmailService] Email sent to ${client.email} (sequence: ${sequence.id})`);
          result.sent++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);

          console.error(`[EmailService] Failed to send email to ${client.email}:`, errorMessage);

          // Update status to failed
          await db
            .update(email_sequences)
            .set({
              status: 'failed',
              error_message: errorMessage,
            })
            .where(eq(email_sequences.id, sequence.id));

          result.failed++;
        }
      }

      console.log(
        `[EmailService] Processing complete: ${result.sent} sent, ${result.failed} failed`
      );

      return result;
    } catch (error) {
      console.error('[EmailService] Error processing scheduled emails:', error);
      throw error;
    }
  }

  /**
   * Create email sequences for a new client
   * Generates 4 emails: welcome, reminder, no_show, re_engagement
   */
  async createEmailSequences(options: CreateEmailSequencesOptions): Promise<void> {
    const { clientId, appointmentDate } = options;

    console.log(`[EmailService] Creating email sequences for client: ${clientId}`);

    try {
      // Get client details
      const [client] = await db
        .select()
        .from(clients)
        .where(eq(clients.id, clientId))
        .limit(1);

      if (!client) {
        throw new Error(`Client not found: ${clientId}`);
      }

      // Calculate schedule dates
      const schedule = calculateEmailSchedule(appointmentDate);

      // Create email sequences
      const sequences = [
        {
          client_id: clientId,
          template_type: 'welcome' as const,
          scheduled_send_at: schedule.welcome,
        },
        {
          client_id: clientId,
          template_type: 'reminder' as const,
          scheduled_send_at: schedule.reminder,
        },
        {
          client_id: clientId,
          template_type: 'no_show' as const,
          scheduled_send_at: schedule.noShow,
        },
        {
          client_id: clientId,
          template_type: 're_engagement' as const,
          scheduled_send_at: schedule.reEngagement,
        },
      ];

      for (const sequence of sequences) {
        await db.insert(email_sequences).values({
          client_id: sequence.client_id,
          template_type: sequence.template_type,
          scheduled_send_at: sequence.scheduled_send_at,
          status: 'scheduled',
        });

        console.log(
          `[EmailService] Created ${sequence.template_type} sequence for ${clientId} at ${sequence.scheduled_send_at}`
        );
      }

      console.log(`[EmailService] Email sequences created successfully for client: ${clientId}`);
    } catch (error) {
      console.error(`[EmailService] Error creating email sequences for client ${clientId}:`, error);
      throw error;
    }
  }

  /**
   * Get pending email sequences for a client
   */
  async getClientSequences(clientId: string) {
    return db
      .select({
        id: email_sequences.id,
        template_type: email_sequences.template_type,
        scheduled_send_at: email_sequences.scheduled_send_at,
        sent_at: email_sequences.sent_at,
        status: email_sequences.status,
        error_message: email_sequences.error_message,
      })
      .from(email_sequences)
      .where(eq(email_sequences.client_id, clientId))
      .orderBy(email_sequences.scheduled_send_at);
  }

  /**
   * Cancel pending emails for a client
   */
  async cancelClientSequences(clientId: string): Promise<void> {
    console.log(`[EmailService] Canceling pending sequences for client: ${clientId}`);

    await db
      .delete(email_sequences)
      .where(
        and(
          eq(email_sequences.client_id, clientId),
          eq(email_sequences.status, 'scheduled')
        )
      );

    console.log(`[EmailService] Pending sequences canceled for client: ${clientId}`);
  }

  /**
   * Reschedule emails for a client (e.g., when appointment date changes)
   */
  async rescheduleClientSequences(clientId: string, newAppointmentDate: Date): Promise<void> {
    console.log(`[EmailService] Rescheduling sequences for client: ${clientId}`);

    // Cancel existing pending emails
    await this.cancelClientSequences(clientId);

    // Create new sequences with updated dates
    await this.createEmailSequences({
      clientId,
      appointmentDate: newAppointmentDate,
    });

    console.log(`[EmailService] Sequences rescheduled for client: ${clientId}`);
  }
}

export const emailService = new EmailService();
