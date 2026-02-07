import { Router, Request, Response } from 'express';
import { eq, asc } from 'drizzle-orm';
import { db } from '../db/index';
import { email_templates } from '../db/schema';
import { updateTemplateSchema, uuidParamSchema } from '../shared/validation';

interface EmailTemplate {
  id: string;
  type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
  name: string;
  subject: string;
  body: string;
  is_default: boolean;
}

const router = Router();

// GET /api/templates - Get all email templates
router.get('/', async (_req: Request, res: Response) => {
  try {
    const templates = await db
      .select()
      .from(email_templates)
      .orderBy(asc(email_templates.type), asc(email_templates.name));

    res.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ error: 'Failed to fetch templates' });
  }
});

// GET /api/templates/:id - Get single template
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const parseResult = uuidParamSchema.safeParse({ id });
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid template ID format' });
      return;
    }

    const template = await db
      .select()
      .from(email_templates)
      .where(eq(email_templates.id, id))
      .limit(1);

    if (template.length === 0) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    res.json(template[0]);
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ error: 'Failed to fetch template' });
  }
});

// PUT /api/templates/:id - Update template
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const idParseResult = uuidParamSchema.safeParse({ id });
    if (!idParseResult.success) {
      res.status(400).json({ error: 'Invalid template ID format' });
      return;
    }

    // Validate input
    const parseResult = updateTemplateSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.errors,
      });
      return;
    }

    const data = parseResult.data;

    // Check if template exists
    const existingTemplate = await db
      .select()
      .from(email_templates)
      .where(eq(email_templates.id, id))
      .limit(1);

    if (existingTemplate.length === 0) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    // Build update object
    const updates: Partial<EmailTemplate> = {};

    if (data.name !== undefined) updates.name = data.name;
    if (data.subject !== undefined) updates.subject = data.subject;
    if (data.body !== undefined) updates.body = data.body;
    if (data.is_default !== undefined) updates.is_default = data.is_default;

    // If setting as default, unset other defaults of same type
    if (data.is_default && existingTemplate[0].type) {
      await db
        .update(email_templates)
        .set({ is_default: false })
        .where(eq(email_templates.type, existingTemplate[0].type));
    }

    const updatedTemplate = await db
      .update(email_templates)
      .set(updates)
      .where(eq(email_templates.id, id))
      .returning();

    res.json(updatedTemplate[0]);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(500).json({ error: 'Failed to update template' });
  }
});

export { router as templateRoutes };
