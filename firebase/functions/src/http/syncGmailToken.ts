import * as functions from 'firebase-functions';
import { db } from '../config/firebase';
import { encryptToken } from '../services/encryption';

/**
 * HTTP Callable function to sync Gmail OAuth token
 * Called after user signs in with Google
 */
export const syncGmailToken = functions
  .region('us-central1')
  .https.onCall(async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated',
        'User must be authenticated'
      );
    }

    const { centerId, accessToken, refreshToken, expiryDate, scope } = data;

    // Verify user is staff
    const userDoc = await db
      .doc(`centers/${centerId}/users/${context.auth.uid}`)
      .get();

    if (!userDoc.exists) {
      throw new functions.https.HttpsError(
        'permission-denied',
        'Not authorized'
      );
    }

    try {
      // Encrypt tokens before storing
      const encryptedToken = await encryptToken({
        accessToken,
        refreshToken,
        expiryDate,
        scope,
      });

      // Store in Firestore
      await db
        .doc(`centers/${centerId}/users/${context.auth.uid}`)
        .update({
          gmailToken: encryptedToken,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

      // Log activity
      await db.collection(`centers/${centerId}/activityLogs`).add({
        action: 'user.gmail_connected',
        userId: context.auth.uid,
        userEmail: context.auth.token.email,
        targetType: 'user',
        targetId: context.auth.uid,
        details: { scope },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error('Error storing Gmail token:', error);
      throw new functions.https.HttpsError(
        'internal',
        'Failed to store token'
      );
    }
  });

import * as admin from 'firebase-admin';
