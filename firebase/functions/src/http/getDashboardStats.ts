import * as functions from 'firebase-functions';
import { db } from '../config/firebase';

/**
 * HTTP Callable function to get dashboard statistics
 */
export const getDashboardStats = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { centerId } = data;

    // Verify user is staff
    const userDoc = await db
      .doc(`centers/${centerId}/users/${context.auth.uid}`)
      .get();

    if (!userDoc.exists || !userDoc.data()?.isActive) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Not authorized'
      );
    }

    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get counts in parallel
      const [
        totalClientsSnap,
        newClientsTodaySnap,
        todaysAppointmentsSnap,
        pendingEmailsSnap,
        sentEmailsTodaySnap,
      ] = await Promise.all([
        // Total active clients
        db
          .collection(`centers/${centerId}/clients`)
          .where('status', 'in', ['intake', 'scheduled', 'confirmed'])
          .count()
          .get(),
        
        // New clients today
        db
          .collection(`centers/${centerId}/clients`)
          .where('createdAt', '>=', admin.firestore.Timestamp.fromDate(today))
          .where('createdAt', '<', admin.firestore.Timestamp.fromDate(tomorrow))
          .count()
          .get(),
        
        // Today's appointments
        db
          .collection(`centers/${centerId}/clients`)
          .where('appointmentDate', '>=', admin.firestore.Timestamp.fromDate(today))
          .where('appointmentDate', '<', admin.firestore.Timestamp.fromDate(tomorrow))
          .count()
          .get(),
        
        // Pending emails
        db
          .collection(`centers/${centerId}/emailSequences`)
          .where('status', '==', 'scheduled')
          .count()
          .get(),
        
        // Sent emails today
        db
          .collection(`centers/${centerId}/emailSequences`)
          .where('status', '==', 'sent')
          .where('sentAt', '>=', admin.firestore.Timestamp.fromDate(today))
          .where('sentAt', '<', admin.firestore.Timestamp.fromDate(tomorrow))
          .count()
          .get(),
      ]);

      // Get recent activity
      const recentActivitySnap = await db
        .collection(`centers/${centerId}/activityLogs`)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();

      const recentActivity = recentActivitySnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        success: true,
        stats: {
          totalClients: totalClientsSnap.data().count,
          newClientsToday: newClientsTodaySnap.data().count,
          todaysAppointments: todaysAppointmentsSnap.data().count,
          pendingEmails: pendingEmailsSnap.data().count,
          sentEmailsToday: sentEmailsTodaySnap.data().count,
        },
        recentActivity,
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to get stats'
      );
    }
  });

import * as admin from 'firebase-admin';
