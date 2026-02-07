import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export const db = admin.firestore();
export const auth = admin.auth();
export const storage = admin.storage();

// Configure Firestore settings
db.settings({
  ignoreUndefinedProperties: true,
});

export default admin;
