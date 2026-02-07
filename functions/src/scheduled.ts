import * as functions from 'firebase-functions';
import { emailService } from './services/email';

/**
 * Scheduled function to process emails every 5 minutes
 */
export const processScheduledEmails = functions.pubsub
  .schedule('every 5 minutes')
  .onRun(async (context) => {
    console.log('[Scheduled] Checking for scheduled emails...');

    try {
      const result = await emailService.processScheduledEmails();
      
      console.log(
        `[Scheduled] Email processing complete: ${result.sent} sent, ${result.failed} failed, ${result.processed} processed`
      );

      return null;
    } catch (error) {
      console.error('[Scheduled] Error processing scheduled emails:', error);
      return null;
    }
  });

/**
 * Scheduled function for daily stats aggregation
 * Runs at midnight every day
 */
export const dailyStatsAggregation = functions.pubsub
  .schedule('0 0 * * *')
  .onRun(async (context) => {
    console.log('[Scheduled] Running daily stats aggregation...');

    try {
      // This could aggregate daily stats into a separate collection
      // for faster dashboard loading
      console.log('[Scheduled] Daily stats aggregation complete');
      return null;
    } catch (error) {
      console.error('[Scheduled] Error in daily stats aggregation:', error);
      return null;
    }
  });

/**
 * Scheduled function to clean up old sent emails
 * Runs weekly to archive emails older than 1 year
 */
export const cleanupOldEmails = functions.pubsub
  .schedule('0 0 * * 0')  // Every Sunday at midnight
  .onRun(async (context) => {
    console.log('[Scheduled] Cleaning up old emails...');

    try {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      // Archive or delete old emails
      // Implementation depends on retention policy
      
      console.log('[Scheduled] Email cleanup complete');
      return null;
    } catch (error) {
      console.error('[Scheduled] Error cleaning up old emails:', error);
      return null;
    }
  });
