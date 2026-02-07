/**
 * Cloud Functions for Cleveland LGBTQ Center Client Automation
 * 
 * This module exports all Firebase Cloud Functions for the application.
 * Functions are organized by type: HTTP, Firestore triggers, and scheduled jobs.
 */

// HTTP Callable Functions
export { sendEmail } from './http/sendEmail';
export { syncGmailToken } from './http/syncGmailToken';
export { getDashboardStats } from './http/getDashboardStats';
export { healthCheck } from './http/healthCheck';

// Firestore Trigger Functions
export { onClientCreated } from './triggers/onClientCreated';
export { onClientUpdated } from './triggers/onClientUpdated';

// Scheduled Functions
export { processScheduledEmails } from './scheduled/processScheduledEmails';
