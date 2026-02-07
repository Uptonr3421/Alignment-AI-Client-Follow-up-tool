import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { collections } from './services/db';
import { emailService } from './services/email';

/**
 * Trigger when a new user is created
 * Initialize default settings and templates
 */
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  console.log(`[Trigger] New user created: ${user.uid}`);

  try {
    const now = new Date();

    // Create default settings
    await collections.settings.doc(user.uid).set({
      id: user.uid,
      userId: user.uid,
      centerName: '',
      centerAddress: '',
      centerPhone: '',
      staffName: user.displayName || '',
      staffSignature: '',
      gmailConnected: false,
      createdAt: now,
      updatedAt: now,
    });

    // Create default email templates
    const defaults = emailService.getDefaultTemplates(user.uid);
    const batch = collections.templates.firestore.batch();

    for (const template of defaults) {
      const ref = collections.templates.doc(template.id);
      batch.set(ref, template);
    }

    await batch.commit();

    console.log(`[Trigger] Initialized user ${user.uid} with defaults`);
  } catch (error) {
    console.error(`[Trigger] Error initializing user ${user.uid}:`, error);
  }
});

/**
 * Trigger when a client is deleted
 * Clean up associated sequences and emails
 */
export const onClientDeleted = functions.firestore
  .document('clients/{clientId}')
  .onDelete(async (snap, context) => {
    const clientId = context.params.clientId;
    const client = snap.data();

    console.log(`[Trigger] Client deleted: ${clientId}`);

    try {
      // Cancel pending sequences
      await emailService.cancelClientSequences(client.userId, clientId);

      // Delete sent emails (optional - could keep for records)
      const sentEmailsSnapshot = await collections.sentEmails
        .where('clientId', '==', clientId)
        .get();

      const batch = collections.sentEmails.firestore.batch();
      sentEmailsSnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });

      await batch.commit();

      console.log(`[Trigger] Cleaned up data for client ${clientId}`);
    } catch (error) {
      console.error(`[Trigger] Error cleaning up client ${clientId}:`, error);
    }
  });
