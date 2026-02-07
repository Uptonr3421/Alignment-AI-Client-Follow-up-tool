import * as admin from 'firebase-admin';

// Firestore database reference
export const db = admin.firestore();

// Collection references
export const collections = {
  users: db.collection('users'),
  clients: db.collection('clients'),
  settings: db.collection('settings'),
  templates: db.collection('templates'),
  emailSequences: db.collection('emailSequences'),
  sentEmails: db.collection('sentEmails'),
  gmailTokens: db.collection('gmailTokens'),
};

// Helper function to convert Firestore timestamp to Date
export const timestampToDate = (timestamp: admin.firestore.Timestamp | Date | undefined): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Date) return timestamp;
  return timestamp.toDate();
};

// Helper function to convert Date to Firestore timestamp
export const dateToTimestamp = (date: Date | string | undefined): admin.firestore.Timestamp | null => {
  if (!date) return null;
  if (typeof date === 'string') {
    return admin.firestore.Timestamp.fromDate(new Date(date));
  }
  return admin.firestore.Timestamp.fromDate(date);
};

// Generate unique ID
export const generateId = (): string => {
  return db.collection('_').doc().id;
};
