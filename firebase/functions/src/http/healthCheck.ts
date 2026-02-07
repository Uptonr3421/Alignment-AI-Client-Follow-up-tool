import * as functions from 'firebase-functions';
import { db } from '../config/firebase';

/**
 * HTTP endpoint for health checks
 * Used by monitoring systems to verify system status
 */
export const healthCheck = functions
  .region('us-central1')
  .https.onRequest(async (req, res) => {
    const checks = {
      firestore: false,
      functions: true,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };

    try {
      // Check Firestore connectivity
      await db.doc('_health/check').get();
      checks.firestore = true;
    } catch (e) {
      checks.firestore = false;
    }

    const allHealthy = checks.firestore && checks.functions;
    const status = allHealthy ? 200 : 503;

    res.status(status).json({
      status: allHealthy ? 'healthy' : 'unhealthy',
      checks,
    });
  });
