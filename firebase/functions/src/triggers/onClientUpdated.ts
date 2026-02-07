import * as functions from 'firebase-functions';
import { db } from '../config/firebase';

/**
 * Firestore trigger: When a client is updated,
 * handle status changes (e.g., cancel no-show email if client attended)
 */
export const onClientUpdated = functions
  .region('us-central1')
  .firestore.document('centers/{centerId}/clients/{clientId}')
  .onUpdate(async (change, context) => {
    const { centerId, clientId } = context.params;
    const before = change.before.data();
    const after = change.after.data();

    // Check if status changed to 'completed' or 'showed'
    const wasNoShow = before.status === 'scheduled' || before.status === 'confirmed';
    const isCompleted = after.status === 'completed';
    const isNoShow = after.status === 'no-show';

    try {
      if (isCompleted && wasNoShow) {
        // Client attended - cancel pending no-show email
        const noShowEmails = await db
          .collection(`centers/${centerId}/emailSequences`)
          .where('clientId', '==', clientId)
          .where('templateType', '==', 'noShow')
          .where('status', '==', 'scheduled')
          .get();

        const batch = db.batch();
        noShowEmails.docs.forEach((doc) => {
          batch.update(doc.ref, {
            status: 'cancelled',
            cancelledAt: admin.firestore.FieldValue.serverTimestamp(),
            cancelReason: 'Client attended appointment',
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        });

        await batch.commit();
        console.log(`Cancelled ${noShowEmails.size} no-show emails for client ${clientId}`);
      }

      if (isNoShow) {
        // Client no-showed - ensure no-show email is scheduled
        // (It should already be scheduled from onCreate, but verify)
        const existingNoShow = await db
          .collection(`centers/${centerId}/emailSequences`)
          .where('clientId', '==', clientId)
          .where('templateType', '==', 'noShow')
          .get();

        if (existingNoShow.empty) {
          // Create no-show email if not exists
          const settingsDoc = await db
            .doc(`centers/${centerId}/settings/default`)
            .get();
          const settings = settingsDoc.data();
          const sequenceSettings = settings?.sequenceSettings || {};

          const templatesSnapshot = await db
            .collection(`centers/${centerId}/templates`)
            .where('type', '==', 'noShow')
            .where('isDefault', '==', true)
            .limit(1)
            .get();

          if (!templatesSnapshot.empty) {
            const template = templatesSnapshot.docs[0];
            const noShowDelay = (sequenceSettings.noShowDelay || 3600) * 1000;
            const noShowTime = Date.now() + noShowDelay;

            await db.collection(`centers/${centerId}/emailSequences`).add({
              clientId,
              clientEmail: after.email,
              clientName: `${after.firstName} ${after.lastName}`,
              templateType: 'noShow',
              templateId: template.id,
              subject: template.data().subject,
              body: template.data().body,
              scheduledSendAt: admin.firestore.Timestamp.fromMillis(noShowTime),
              status: 'scheduled',
              createdBy: after.updatedBy,
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            });

            console.log(`Created no-show email for client ${clientId}`);
          }
        }
      }

      // Log activity
      await db.collection(`centers/${centerId}/activityLogs`).add({
        action: 'client.updated',
        userId: after.updatedBy,
        userEmail: '',
        targetType: 'client',
        targetId: clientId,
        details: {
          clientName: `${after.firstName} ${after.lastName}`,
          changes: getChanges(before, after),
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error handling client update:', error);
    }
  });

/**
 * Get changed fields between before and after
 */
function getChanges(before: any, after: any): Record<string, { from: any; to: any }> {
  const changes: Record<string, { from: any; to: any }> = {};
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
      changes[key] = { from: before[key], to: after[key] };
    }
  }

  return changes;
}

import * as admin from 'firebase-admin';
