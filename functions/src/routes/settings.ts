import { Router, Request, Response } from 'express';
import { collections, generateId } from '../services/db';
import { CenterSettings } from '../types';

const router = Router();

// Middleware to verify authentication
const verifyAuth = async (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'] as string || 'default-user';
  (req as any).userId = userId;
  next();
};

router.use(verifyAuth);

/**
 * GET /settings - Get user settings
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const doc = await collections.settings.doc(userId).get();

    if (!doc.exists) {
      // Return default settings
      return res.json({
        success: true,
        data: {
          centerName: '',
          centerAddress: '',
          centerPhone: '',
          staffName: '',
          staffSignature: '',
          gmailConnected: false,
        },
      });
    }

    const settings = doc.data() as CenterSettings;

    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * PUT /settings - Update settings
 */
router.put('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const data = req.body;

    const doc = await collections.settings.doc(userId).get();
    const now = new Date();

    if (!doc.exists) {
      // Create new settings
      const settings: CenterSettings = {
        id: userId,
        userId,
        centerName: data.centerName || '',
        centerAddress: data.centerAddress || '',
        centerPhone: data.centerPhone || '',
        staffName: data.staffName || '',
        staffSignature: data.staffSignature || '',
        gmailConnected: data.gmailConnected || false,
        gmailEmail: data.gmailEmail || null,
        createdAt: now,
        updatedAt: now,
      };

      await collections.settings.doc(userId).set(settings);

      return res.json({
        success: true,
        data: settings,
      });
    }

    // Update existing settings
    const updates: Partial<CenterSettings> = {
      updatedAt: now,
    };

    if (data.centerName !== undefined) updates.centerName = data.centerName;
    if (data.centerAddress !== undefined) updates.centerAddress = data.centerAddress;
    if (data.centerPhone !== undefined) updates.centerPhone = data.centerPhone;
    if (data.staffName !== undefined) updates.staffName = data.staffName;
    if (data.staffSignature !== undefined) updates.staffSignature = data.staffSignature;
    if (data.gmailConnected !== undefined) updates.gmailConnected = data.gmailConnected;
    if (data.gmailEmail !== undefined) updates.gmailEmail = data.gmailEmail;

    await collections.settings.doc(userId).update(updates);

    const existing = doc.data() as CenterSettings;

    res.json({
      success: true,
      data: { ...existing, ...updates },
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export { router as settingsRoutes };
