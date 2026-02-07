import * as functions from 'firebase-functions';
import { collections, generateId, timestampToDate } from './db';
import { gmailService } from './gmail';
import { Client, EmailSequence, EmailTemplate, SentEmail } from '../types';

class EmailService {
  /**
   * Calculate email schedule based on appointment date
   */
  calculateSchedule(appointmentDate: Date): {
    welcome: Date;
    reminder: Date;
    noShow: Date;
    reEngagement: Date;
  } {
    const appt = new Date(appointmentDate);
    
    return {
      // Welcome: Immediately
      welcome: new Date(),
      // Reminder: 24 hours before appointment
      reminder: new Date(appt.getTime() - 24 * 60 * 60 * 1000),
      // No-show: 24 hours after appointment
      noShow: new Date(appt.getTime() + 24 * 60 * 60 * 1000),
      // Re-engagement: 7 days after appointment
      reEngagement: new Date(appt.getTime() + 7 * 24 * 60 * 60 * 1000),
    };
  }

  /**
   * Render template with client data
   */
  renderTemplate(template: string, data: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      const value = data[key];
      if (value instanceof Date) {
        return value.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        });
      }
      return value !== undefined ? String(value) : match;
    });
  }

  /**
   * Create email sequences for a new client
   */
  async createSequences(userId: string, client: Client): Promise<void> {
    if (!client.appointmentDate) {
      console.log(`[EmailService] No appointment date for client ${client.id}, skipping sequences`);
      return;
    }

    const schedule = this.calculateSchedule(client.appointmentDate);
    const sequences = [
      { type: 'welcome' as const, scheduledAt: schedule.welcome },
      { type: 'reminder' as const, scheduledAt: schedule.reminder },
      { type: 'no_show' as const, scheduledAt: schedule.noShow },
      { type: 're_engagement' as const, scheduledAt: schedule.reEngagement },
    ];

    const batch = collections.emailSequences.firestore.batch();

    for (const seq of sequences) {
      const id = generateId();
      const ref = collections.emailSequences.doc(id);
      
      batch.set(ref, {
        id,
        clientId: client.id,
        userId,
        templateType: seq.type,
        scheduledSendAt: seq.scheduledAt,
        status: 'scheduled',
        createdAt: new Date(),
      });
    }

    await batch.commit();
    console.log(`[EmailService] Created ${sequences.length} email sequences for client ${client.id}`);
  }

  /**
   * Cancel pending sequences for a client
   */
  async cancelClientSequences(userId: string, clientId: string): Promise<void> {
    const snapshot = await collections.emailSequences
      .where('clientId', '==', clientId)
      .where('userId', '==', userId)
      .where('status', '==', 'scheduled')
      .get();

    const batch = collections.emailSequences.firestore.batch();
    
    snapshot.docs.forEach(doc => {
      batch.update(doc.ref, { status: 'cancelled', updatedAt: new Date() });
    });

    await batch.commit();
    console.log(`[EmailService] Cancelled ${snapshot.size} sequences for client ${clientId}`);
  }

  /**
   * Process scheduled emails that are due
   */
  async processScheduledEmails(): Promise<{
    processed: number;
    sent: number;
    failed: number;
  }> {
    const now = new Date();
    const result = { processed: 0, sent: 0, failed: 0 };

    // Get all scheduled emails that are due
    const snapshot = await collections.emailSequences
      .where('status', '==', 'scheduled')
      .where('scheduledSendAt', '<=', now)
      .limit(100)
      .get();

    console.log(`[EmailService] Found ${snapshot.size} emails to process`);

    for (const doc of snapshot.docs) {
      const sequence = doc.data() as EmailSequence;
      result.processed++;

      try {
        // Check if Gmail is connected
        const gmailStatus = await gmailService.isConnected(sequence.userId);
        if (!gmailStatus.connected) {
          console.log(`[EmailService] Gmail not connected for user ${sequence.userId}, skipping`);
          continue;
        }

        // Get client and template
        const [clientDoc, templateDoc] = await Promise.all([
          collections.clients.doc(sequence.clientId).get(),
          collections.templates
            .where('userId', '==', sequence.userId)
            .where('type', '==', sequence.templateType)
            .limit(1)
            .get(),
        ]);

        if (!clientDoc.exists) {
          throw new Error('Client not found');
        }

        const client = clientDoc.data() as Client;
        const template = templateDoc.docs[0]?.data() as EmailTemplate | undefined;

        if (!template) {
          throw new Error(`Template not found for type ${sequence.templateType}`);
        }

        // Get settings for center name
        const settingsDoc = await collections.settings.doc(sequence.userId).get();
        const settings = settingsDoc.data();
        const centerName = settings?.centerName || 'LGBTQ+ Center';

        // Render template
        const subject = this.renderTemplate(template.subject, {
          firstName: client.firstName,
          lastName: client.lastName,
          centerName,
        });

        const body = this.renderTemplate(template.body, {
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          appointmentDate: client.appointmentDate,
          centerName,
        });

        // Send email
        await gmailService.sendEmail(sequence.userId, {
          to: client.email,
          subject,
          body,
          isHtml: true,
        });

        // Update sequence status
        await doc.ref.update({
          status: 'sent',
          sentAt: new Date(),
          errorMessage: null,
        });

        // Log sent email
        await collections.sentEmails.add({
          id: generateId(),
          clientId: client.id,
          userId: sequence.userId,
          sequenceId: sequence.id,
          to: client.email,
          subject,
          body,
          sentAt: new Date(),
          status: 'sent',
        });

        result.sent++;
        console.log(`[EmailService] Sent ${sequence.templateType} email to ${client.email}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        await doc.ref.update({
          status: 'failed',
          errorMessage,
        });

        result.failed++;
        console.error(`[EmailService] Failed to send email for sequence ${sequence.id}:`, errorMessage);
      }
    }

    return result;
  }

  /**
   * Send email immediately
   */
  async sendEmail(userId: string, options: {
    to: string;
    subject: string;
    body: string;
    isHtml?: boolean;
    clientId?: string;
  }): Promise<{ messageId: string }> {
    const result = await gmailService.sendEmail(userId, options);

    // Log sent email
    await collections.sentEmails.add({
      id: generateId(),
      clientId: options.clientId || '',
      userId,
      to: options.to,
      subject: options.subject,
      body: options.body,
      sentAt: new Date(),
      status: 'sent',
    });

    return result;
  }

  /**
   * Get default templates
   */
  getDefaultTemplates(userId: string): EmailTemplate[] {
    const now = new Date();
    
    return [
      {
        id: generateId(),
        userId,
        type: 'welcome',
        subject: 'Welcome to {{centerName}}!',
        body: `<p>Hi {{firstName}},</p>
<p>Welcome to {{centerName}}! We're so glad you've chosen to connect with us.</p>
<p>Your appointment is scheduled for <strong>{{appointmentDate}}</strong>.</p>
<p>If you have any questions before your visit, please don't hesitate to reach out.</p>
<p>With care,<br>{{centerName}} Team</p>`,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId,
        type: 'reminder',
        subject: 'Reminder: Your appointment tomorrow at {{centerName}}',
        body: `<p>Hi {{firstName}},</p>
<p>This is a friendly reminder that you have an appointment scheduled for <strong>tomorrow, {{appointmentDate}}</strong>.</p>
<p>We look forward to seeing you!</p>
<p>If you need to reschedule, please contact us as soon as possible.</p>
<p>With care,<br>{{centerName}} Team</p>`,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId,
        type: 'no_show',
        subject: 'We missed you at {{centerName}}',
        body: `<p>Hi {{firstName}},</p>
<p>We noticed you weren't able to make it to your appointment on {{appointmentDate}}. We hope everything is okay.</p>
<p>If you'd like to reschedule, please reach out to us. We're here to support you.</p>
<p>With care,<br>{{centerName}} Team</p>`,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: generateId(),
        userId,
        type: 're_engagement',
        subject: 'We'd love to hear from you',
        body: `<p>Hi {{firstName}},</p>
<p>It's been a little while since we last connected. We wanted to reach out and see how you're doing.</p>
<p>If you need support or would like to schedule another appointment, we're here for you.</p>
<p>With care,<br>{{centerName}} Team</p>`,
        isDefault: true,
        createdAt: now,
        updatedAt: now,
      },
    ];
  }
}

export const emailService = new EmailService();
