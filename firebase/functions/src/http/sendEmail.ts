import * as functions from 'firebase-functions';
import { db } from '../config/firebase';
import { createGmailClient, sendEmail as sendGmailEmail } from '../services/gmail';
import { buildTemplateVariables } from '../services/templates';

/**
 * HTTP Callable function to send an email
 * Triggered manually by staff or automatically by scheduler
 */
export const sendEmail = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { centerId, sequenceId } = data;

    // Verify user is staff of this center
    const userDoc = await db
      .doc(`centers/${centerId}/users/${context.auth.uid}`)
      .get();

    if (!userDoc.exists || !userDoc.data()?.isActive) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Not authorized for this center'
      );
    }

    try {
      // Get sequence data
      const sequenceDoc = await db
        .doc(`centers/${centerId}/emailSequences/${sequenceId}`)
        .get();

      if (!sequenceDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Sequence not found');
      }

      const sequence = sequenceDoc.data();

      // Update status to sending
      await sequenceDoc.ref.update({
        status: 'sending',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Get user's Gmail token
      const userData = userDoc.data();
      
      if (!userData?.gmailToken) {
        throw new functions.https.HttpsError(
          'failed-precondition',
          'Gmail not connected'
        );
      }

      // Initialize Gmail API
      const gmail = await createGmailClient(userData.gmailToken);

      // Get center settings
      const [centerDoc, settingsDoc, clientDoc] = await Promise.all([
        db.doc(`centers/${centerId}`).get(),
        db.doc(`centers/${centerId}/settings/default`).get(),
        db.doc(`centers/${centerId}/clients/${sequence.clientId}`).get(),
      ]);

      const center = centerDoc.data();
      const settings = settingsDoc.data();
      const client = clientDoc.data();

      // Build template variables
      const variables = buildTemplateVariables(
        client,
        center,
        settings,
        sequence.scheduledSendAt?.toDate()
      );

      // Send email
      await sendGmailEmail(gmail, {
        to: sequence.clientEmail,
        from: userData.email,
        fromName: settings?.emailSettings?.fromName || center.name,
        replyTo: settings?.emailSettings?.replyTo || center.email,
        subject: sequence.subject,
        body: sequence.body,
        signature: settings?.emailSettings?.signature,
      });

      // Update sequence status
      await sequenceDoc.ref.update({
        status: 'sent',
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        sentBy: context.auth.uid,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Log activity
      await db.collection(`centers/${centerId}/activityLogs`).add({
        action: 'email.sent',
        userId: context.auth.uid,
        userEmail: userData.email,
        targetType: 'email',
        targetId: sequenceId,
        details: {
          clientId: sequence.clientId,
          templateType: sequence.templateType,
          clientEmail: sequence.clientEmail,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return {
        success: true,
        message: 'Email sent successfully',
      };
    } catch (error) {
      console.error('Error sending email:', error);

      // Update sequence with error
      await db
        .doc(`centers/${centerId}/emailSequences/${sequenceId}`)
        .update({
          status: 'failed',
          errorMessage: error.message,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      throw new functions.https.HttpsError(
        'internal',
        error.message || 'Failed to send email'
      );
    }
  });

// Need to import admin for FieldValue
import * as admin from 'firebase-admin';
