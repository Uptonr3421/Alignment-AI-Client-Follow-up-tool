import { Router, Request, Response } from 'express';
import { collections, generateId } from '../services/db';
import { emailService } from '../services/email';
import { EmailTemplate } from '../types';

const router = Router();

// Middleware to verify authentication
const verifyAuth = async (req: Request, res: Response, next: Function) => {
  const userId = req.headers['x-user-id'] as string || 'default-user';
  (req as any).userId = userId;
  next();
};

router.use(verifyAuth);

/**
 * GET /templates - List all templates
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const snapshot = await collections.templates
      .where('userId', '==', userId)
      .orderBy('type', 'asc')
      .get();

    let templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EmailTemplate));

    // If no templates exist, create defaults
    if (templates.length === 0) {
      const defaults = emailService.getDefaultTemplates(userId);
      
      // Save defaults to Firestore
      const batch = collections.templates.firestore.batch();
      for (const template of defaults) {
        const ref = collections.templates.doc(template.id);
        batch.set(ref, template);
      }
      await batch.commit();

      templates = defaults;
    }

    res.json({
      success: true,
      data: { templates },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

/**
 * GET /templates/:id - Get single template
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const doc = await collections.templates.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = { id: doc.id, ...doc.data() } as EmailTemplate;

    if (template.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({
      success: true,
      data: { template },
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

/**
 * PUT /templates/:id - Update template
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const { subject, body } = req.body;

    const doc = await collections.templates.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const template = { id: doc.id, ...doc.data() } as EmailTemplate;

    if (template.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates: Partial<EmailTemplate> = {
      updatedAt: new Date(),
    };

    if (subject !== undefined) updates.subject = subject;
    if (body !== undefined) updates.body = body;

    await collections.templates.doc(id).update(updates);

    res.json({
      success: true,
      data: { template: { ...template, ...updates } },
    });
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

/**
 * PUT /templates - Bulk update templates
 */
router.put('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { templates } = req.body;

    if (!Array.isArray(templates)) {
      return res.status(400).json({ error: 'Templates must be an array' });
    }

    const batch = collections.templates.firestore.batch();
    const now = new Date();

    for (const template of templates) {
      if (!template.id) continue;

      const ref = collections.templates.doc(template.id);
      const doc = await ref.get();

      if (doc.exists) {
        const existing = doc.data() as EmailTemplate;
        if (existing.userId === userId) {
          batch.update(ref, {
            subject: template.subject,
            body: template.body,
            updatedAt: now,
          });
        }
      }
    }

    await batch.commit();

    res.json({
      success: true,
      message: 'Templates updated successfully',
    });
  } catch (error) {
    console.error('Error updating templates:', error);
    res.status(500).json({ error: 'Failed to update templates' });
  }
});

export { router as templateRoutes };
