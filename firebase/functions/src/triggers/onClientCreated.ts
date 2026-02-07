import * as functions from 'firebase-functions';
import { db } from '../config/firebase';

/**
 * Firestore trigger: When a new client is created,
 * automatically schedule the 4-email sequence
 */
export const onClientCreated = functions
  .region('us-central1')
  .firestore.document('centers/{centerId}/clients/{clientId}')
  .onCreate(async (snap, context) => {
    const { centerId, clientId } = context.params;
    const client = snap.data();

    console.log(`Creating email sequences for client ${clientId} in center ${centerId}`);

    try {
      // Get center settings
      const settingsDoc = await db
        .doc(`centers/${centerId}/settings/default`)
        .get();
      const settings = settingsDoc.data();
      const sequenceSettings = settings?.sequenceSettings || {};

      // Get default templates
      const templatesSnapshot = await db
        .collection(`centers/${centerId}/templates`)
        .where('isDefault', '==', true)
        .get();

      const templates: Record<string, any> = {};
      templatesSnapshot.forEach((doc) => {
        templates[doc.data().type] = { id: doc.id, ...doc.data() };
      });

      const batch = db.batch();
      const now = admin.firestore.Timestamp.now();

      // 1. Welcome Email (immediate or with small delay)
      if (templates.welcome) {
        const welcomeRef = db
          .collection(`centers/${centerId}/emailSequences`)
          .doc();
        const welcomeDelay = sequenceSettings.welcomeDelay || 60; // 1 minute default
        
        batch.set(welcomeRef, {
          clientId,
          clientEmail: client.email,
          clientName: `${client.firstName} ${client.lastName}`,
          templateType: 'welcome',
          templateId: templates.welcome.id,
          subject: templates.welcome.subject,
          body: templates.welcome.body,
          scheduledSendAt: new admin.firestore.Timestamp(
            now.seconds + welcomeDelay,
            now.nanoseconds
          ),
          status: 'scheduled',
          createdBy: client.createdBy,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`Scheduled welcome email for ${client.email}`);
      }

      // 2. Reminder Email (24 hours before appointment)
      if (templates.reminder && client.appointmentDate) {
        const appointmentTime = client.appointmentDate.toMillis();
        const reminderDelay = (sequenceSettings.reminderDelay || 86400) * 1000; // Convert to ms
        const reminderTime = appointmentTime - reminderDelay;

        if (reminderTime > now.toMillis()) {
          const reminderRef = db
            .collection(`centers/${centerId}/emailSequences`)
            .doc();
          batch.set(reminderRef, {
            clientId,
            clientEmail: client.email,
            clientName: `${client.firstName} ${client.lastName}`,
            templateType: 'reminder',
            templateId: templates.reminder.id,
            subject: templates.reminder.subject,
            body: templates.reminder.body,
            scheduledSendAt: admin.firestore.Timestamp.fromMillis(reminderTime),
            status: 'scheduled',
            createdBy: client.createdBy,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
          
          console.log(`Scheduled reminder email for ${client.email}`);
        }
      }

      // 3. No-Show Email (1 hour after appointment)
      if (templates.noShow && client.appointmentDate) {
        const appointmentTime = client.appointmentDate.toMillis();
        const noShowDelay = (sequenceSettings.noShowDelay || 3600) * 1000;
        const noShowTime = appointmentTime + noShowDelay;

        const noShowRef = db
          .collection(`centers/${centerId}/emailSequences`)
          .doc();
        batch.set(noShowRef, {
          clientId,
          clientEmail: client.email,
          clientName: `${client.firstName} ${client.lastName}`,
          templateType: 'noShow',
          templateId: templates.noShow.id,
          subject: templates.noShow.subject,
          body: templates.noShow.body,
          scheduledSendAt: admin.firestore.Timestamp.fromMillis(noShowTime),
          status: 'scheduled',
          createdBy: client.createdBy,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`Scheduled no-show email for ${client.email}`);
      }

      // 4. Re-engagement Email (7 days after appointment)
      if (templates.reEngagement && client.appointmentDate) {
        const appointmentTime = client.appointmentDate.toMillis();
        const reEngagementDelay = (sequenceSettings.reEngagementDelay || 604800) * 1000;
        const reEngagementTime = appointmentTime + reEngagementDelay;

        const reEngagementRef = db
          .collection(`centers/${centerId}/emailSequences`)
          .doc();
        batch.set(reEngagementRef, {
          clientId,
          clientEmail: client.email,
          clientName: `${client.firstName} ${client.lastName}`,
          templateType: 'reEngagement',
          templateId: templates.reEngagement.id,
          subject: templates.reEngagement.subject,
          body: templates.reEngagement.body,
          scheduledSendAt: admin.firestore.Timestamp.fromMillis(reEngagementTime),
          status: 'scheduled',
          createdBy: client.createdBy,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        
        console.log(`Scheduled re-engagement email for ${client.email}`);
      }

      await batch.commit();
      console.log(`Successfully created email sequences for client ${clientId}`);

      // Log activity
      await db.collection(`centers/${centerId}/activityLogs`).add({
        action: 'client.created',
        userId: client.createdBy,
        userEmail: '', // Will be populated by client
        targetType: 'client',
        targetId: clientId,
        details: {
          clientName: `${client.firstName} ${client.lastName}`,
          clientEmail: client.email,
          sequencesCreated: Object.keys(templates).length,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } catch (error) {
      console.error('Error creating email sequences:', error);
      // Don't throw - we don't want to block client creation
    }
  });

import * as admin from 'firebase-admin';
