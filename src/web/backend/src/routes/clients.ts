import { Router, Request, Response } from 'express';
import { eq, desc, sql, and, or, ilike } from 'drizzle-orm';
import { db } from '../db/index';
import { clients, email_sequences } from '../db/schema';
import { emailService } from '../services/email';
import {
  createClientSchema,
  updateClientSchema,
  clientListQuerySchema,
  uuidParamSchema,
} from '../shared/validation';

const router = Router();

// GET /api/clients - List all clients with pagination, search, and filter
router.get('/', async (req: Request, res: Response) => {
  try {
    // Validate and parse query parameters
    const parseResult = clientListQuerySchema.safeParse(req.query);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: parseResult.error.errors,
      });
      return;
    }

    const { page, limit, search, status, sort_by, sort_order } = parseResult.data;
    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (status) {
      whereConditions.push(eq(clients.status, status));
    }

    if (search) {
      const searchTerm = `%${search}%`;
      whereConditions.push(
        or(
          ilike(clients.first_name, searchTerm),
          ilike(clients.last_name, searchTerm),
          ilike(clients.email, searchTerm),
          ilike(clients.phone, searchTerm)
        )
      );
    }

    // Build order by
    let orderBy;
    switch (sort_by) {
      case 'first_name':
        orderBy = sort_order === 'asc' ? clients.first_name : desc(clients.first_name);
        break;
      case 'last_name':
        orderBy = sort_order === 'asc' ? clients.last_name : desc(clients.last_name);
        break;
      case 'appointment_date':
        orderBy = sort_order === 'asc' ? clients.appointment_date : desc(clients.appointment_date);
        break;
      default:
        orderBy = sort_order === 'asc' ? clients.created_at : desc(clients.created_at);
    }

    // Execute query with filters
    let clientsList;
    if (whereConditions.length > 0) {
      clientsList = await db
        .select()
        .from(clients)
        .where(and(...whereConditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
    } else {
      clientsList = await db
        .select()
        .from(clients)
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset);
    }

    // Get total count with same filters
    let totalResult;
    if (whereConditions.length > 0) {
      totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(clients)
        .where(and(...whereConditions));
    } else {
      totalResult = await db
        .select({ count: sql<number>`count(*)` })
        .from(clients);
    }
    const total = totalResult[0]?.count || 0;

    res.json({
      data: clientsList,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
      filters: {
        search: search || null,
        status: status || null,
      },
      sort: {
        by: sort_by,
        order: sort_order,
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

// GET /api/clients/:id - Get single client with their email sequences
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const parseResult = uuidParamSchema.safeParse({ id });
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid client ID format' });
      return;
    }

    const clientResult = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (clientResult.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const emailSequences = await db
      .select()
      .from(email_sequences)
      .where(eq(email_sequences.client_id, id))
      .orderBy(email_sequences.scheduled_send_at);

    res.json({
      ...clientResult[0],
      email_sequences: emailSequences,
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

// GET /api/clients/:id/emails - Get email history for a client
router.get('/:id/emails', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const parseResult = uuidParamSchema.safeParse({ id });
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid client ID format' });
      return;
    }

    // Check if client exists
    const clientResult = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (clientResult.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Get email sequences
    const emailSequencesList = await db
      .select()
      .from(email_sequences)
      .where(eq(email_sequences.client_id, id))
      .orderBy(desc(email_sequences.scheduled_send_at));

    res.json({
      client_id: id,
      client_name: `${clientResult[0].first_name} ${clientResult[0].last_name}`,
      client_email: clientResult[0].email,
      emails: emailSequencesList,
    });
  } catch (error) {
    console.error('Error fetching client emails:', error);
    res.status(500).json({ error: 'Failed to fetch email history' });
  }
});

// POST /api/clients - Create new client (auto-creates email sequences)
router.post('/', async (req: Request, res: Response) => {
  try {
    // Validate input
    const parseResult = createClientSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.errors,
      });
      return;
    }

    const data = parseResult.data;

    // Create client
    const newClient = await db
      .insert(clients)
      .values({
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone || null,
        intake_date: data.intake_date ? new Date(data.intake_date) : new Date(),
        appointment_date: data.appointment_date ? new Date(data.appointment_date) : null,
        status: data.status || 'intake',
        notes: data.notes || null,
      })
      .returning();

    const client = newClient[0];

    // Auto-create email sequences if appointment_date is provided
    if (data.appointment_date) {
      try {
        await emailService.createEmailSequences({
          clientId: client.id,
          appointmentDate: new Date(data.appointment_date),
        });
      } catch (sequenceError) {
        console.error('Error creating email sequences:', sequenceError);
        // Don't fail the client creation if sequences fail
      }
    }

    res.status(201).json(client);
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

// PUT /api/clients/:id - Update client
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const idParseResult = uuidParamSchema.safeParse({ id });
    if (!idParseResult.success) {
      res.status(400).json({ error: 'Invalid client ID format' });
      return;
    }

    // Validate input
    const parseResult = updateClientSchema.safeParse(req.body);
    if (!parseResult.success) {
      res.status(400).json({
        error: 'Invalid input',
        details: parseResult.error.errors,
      });
      return;
    }

    const data = parseResult.data;

    // Check if client exists
    const existingClient = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (existingClient.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    const oldAppointmentDate = existingClient[0].appointment_date;

    // Build update object
    const updates: Record<string, unknown> = {
      updated_at: new Date(),
    };

    if (data.first_name !== undefined) updates.first_name = data.first_name;
    if (data.last_name !== undefined) updates.last_name = data.last_name;
    if (data.email !== undefined) updates.email = data.email;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.intake_date !== undefined) updates.intake_date = new Date(data.intake_date);
    if (data.appointment_date !== undefined) {
      updates.appointment_date = data.appointment_date ? new Date(data.appointment_date) : null;
    }
    if (data.status !== undefined) updates.status = data.status;
    if (data.notes !== undefined) updates.notes = data.notes;

    const updatedClient = await db
      .update(clients)
      .set(updates)
      .where(eq(clients.id, id))
      .returning();

    // If appointment date changed, reschedule emails
    if (data.appointment_date !== undefined) {
      const newAppointmentDate = data.appointment_date ? new Date(data.appointment_date) : null;
      const oldDateStr = oldAppointmentDate?.toISOString();
      const newDateStr = newAppointmentDate?.toISOString();

      if (newDateStr !== oldDateStr && newAppointmentDate) {
        try {
          await emailService.rescheduleClientSequences(id, newAppointmentDate);
        } catch (rescheduleError) {
          console.error('Error rescheduling email sequences:', rescheduleError);
        }
      }
    }

    res.json(updatedClient[0]);
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

// DELETE /api/clients/:id - Delete client and cancel pending emails
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate UUID
    const parseResult = uuidParamSchema.safeParse({ id });
    if (!parseResult.success) {
      res.status(400).json({ error: 'Invalid client ID format' });
      return;
    }

    // Check if client exists
    const existingClient = await db
      .select()
      .from(clients)
      .where(eq(clients.id, id))
      .limit(1);

    if (existingClient.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }

    // Cancel pending emails before deleting client
    try {
      await emailService.cancelClientSequences(id);
    } catch (cancelError) {
      console.error('Error cancelling pending emails:', cancelError);
      // Continue with deletion even if cancel fails
    }

    // Delete client (cascade will handle any remaining email_sequences due to foreign key)
    await db.delete(clients).where(eq(clients.id, id));

    res.json({
      message: 'Client deleted successfully',
      cancelled_pending_emails: true,
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

export { router as clientRoutes };
