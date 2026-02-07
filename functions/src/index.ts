import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { gmailService } from './services/gmail';
import { emailService } from './services/email';

// Initialize Firebase Admin
admin.initializeApp();

// Export all functions
export { api } from './api';
export * from './triggers';
export * from './scheduled';

// Health check function (HTTP)
export const health = functions.https.onRequest(async (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    environment: 'production'
  });
});

// Test Gmail connection
export const testGmail = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  try {
    const status = await gmailService.isConnected(context.auth.uid);
    return { success: true, data: status };
  } catch (error) {
    console.error('Error checking Gmail status:', error);
    throw new functions.https.HttpsError('internal', 'Failed to check Gmail status');
  }
});

// Send test email
export const sendTestEmail = functions.https.onCall(async (data, context) => {
  // Check authentication
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
  }

  const { to, subject, body } = data;
  
  if (!to || !subject || !body) {
    throw new functions.https.HttpsError('invalid-argument', 'Missing required fields');
  }

  try {
    const result = await emailService.sendEmail(context.auth.uid, {
      to,
      subject,
      body,
      isHtml: true
    });
    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending test email:', error);
    throw new functions.https.HttpsError('internal', 'Failed to send email');
  }
});
