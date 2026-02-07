import * as functions from 'firebase-functions';
import { db } from '../config/firebase';
import { getFunctions } from 'firebase-admin/functions';

/**
 * Scheduled function: Runs every 5 minutes to process scheduled emails
 * Queues emails that are due to be sent
 */
export const processScheduledEmails = functions
  .region('us-central1')
  .pubsub.schedule('every 5 minutes')
  .onRun(async (context) => {
    console.log('Processing scheduled emails...');
    
    const now = admin.firestore.Timestamp.now();
    let totalProcessed = 0;

    try {
      // Find all centers
      const centersSnapshot = await db.collection('centers').get();
      console.log(`Checking ${centersSnapshot.size} centers`);

      for (const centerDoc of centersSnapshot.docs) {
        const centerId = centerDoc.id;

        try {
          // Find scheduled emails that are due
          const sequencesSnapshot = await db
            .collection(`centers/${centerId}/emailSequences`)
            .where('status', '==', 'scheduled')
            .where('scheduledSendAt', '<=', now)
            .limit(100)
            .get();

          if (sequencesSnapshot.empty) {
            continue;
          }

          console.log(
            `Found ${sequencesSnapshot.size} emails to send for center ${centerId}`
          );

          for (const sequenceDoc of sequencesSnapshot.docs) {
            const sequence = sequenceDoc.data();

            try {
              // Update status to sending
              await sequenceDoc.ref.update({
                status: 'sending',
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });

              // Get the user who created this sequence (for Gmail token)
              const userDoc = await db
                .doc(`centers/${centerId}/users/${sequence.createdBy}`)
                .get();

              if (!userDoc.exists) {
                throw new Error('User not found');
              }

              const userData = userDoc.data();

              // Check if Gmail is connected
              if (!userData?.gmailToken) {
                throw new Error('Gmail not connected for user');
              }

              // Enqueue email send task
              const queue = getFunctions().taskQueue('sendEmailTask');
              await queue.enqueue({
                centerId,
                sequenceId: sequenceDoc.id,
                clientId: sequence.clientId,
                userId: sequence.createdBy,
              });

              totalProcessed++;
            } catch (error) {
              console.error(
                `Error processing sequence ${sequenceDoc.id}:`,
                error
              );
              
              await sequenceDoc.ref.update({
                status: 'failed',
                errorMessage: error.message,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              });
            }
          }
        } catch (error) {
          console.error(`Error processing center ${centerId}:`, error);
        }
      }

      console.log(`Total emails queued: ${totalProcessed}`);
    } catch (error) {
      console.error('Error in processScheduledEmails:', error);
    }

    return null;
  });

import * as admin from 'firebase-admin';
