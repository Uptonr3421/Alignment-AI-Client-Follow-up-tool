import { Router, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { db } from '../db/index';
import { settings } from '../db/schema';
import { updateSettingsSchema } from '../shared/validation';

const router = Router();

// GET /api/settings - Get center settings
router.get('/', async (_req: Request, res: Response) => {
  try {
    const settingsList = await db.select().from(settings).limit(1);

    if (settingsList.length === 0) {
      // Return default settings if none exist
      res.json({
        center_name: '',
        center_address: '',
        center_phone: '',
        staff_name: '',
        staff_signature: '',
        gmail_connected: false,
        gmail_email: '',
      });
      return;
    }

    // Don't expose sensitive tokens
    const setting = settingsList[0];
    res.json({
      center_name: setting.center_name,
      center_address: setting.center_address,
      center_phone: setting.center_phone,
      staff_name: setting.staff_name,
      staff_signature: setting.staff_signature,
      gmail_connected: setting.gmail_connected,
      gmail_email: setting.gmail_email,
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// PUT /api/settings - Update settings
router.put('/', async (req: Request, res: Response) => {
  try {
    // Validate input
    const parseResult = updateSettingsSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.errors,
      });
      return;
    }

    const data = parseResult.data;

    // Check if settings exist
    const existingSettings = await db.select().from(settings).limit(1);

    let result;
    if (existingSettings.length === 0) {
      // Create new settings
      result = await db
        .insert(settings)
        .values({
          center_name: data.center_name,
          center_address: data.center_address || null,
          center_phone: data.center_phone || null,
          staff_name: data.staff_name,
          staff_signature: data.staff_signature || null,
          gmail_connected: false,
          updated_at: new Date(),
        })
        .returning();
    } else {
      // Update existing settings
      result = await db
        .update(settings)
        .set({
          center_name: data.center_name,
          center_address: data.center_address || null,
          center_phone: data.center_phone || null,
          staff_name: data.staff_name,
          staff_signature: data.staff_signature || null,
          updated_at: new Date(),
        })
        .where(eq(settings.id, existingSettings[0].id))
        .returning();
    }

    const setting = result[0];
    res.json({
      center_name: setting.center_name,
      center_address: setting.center_address,
      center_phone: setting.center_phone,
      staff_name: setting.staff_name,
      staff_signature: setting.staff_signature,
      gmail_connected: setting.gmail_connected,
      gmail_email: setting.gmail_email,
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export { router as settingsRoutes };
