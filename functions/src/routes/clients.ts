import { Router, Request, Response } from 'express';
import { collections, generateId } from '../services/db';
import { emailService } from '../services/email';
import { Client, CreateClientRequest, UpdateClientRequest } from '../types';

const router = Router();

// Middleware to verify authentication
const verifyAuth = async (req: Request, res: Response, next: Function) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // In production, verify Firebase Auth token here
  // For now, extract userId from a custom header or use a default
  const userId = req.headers['x-user-id'] as string || 'default-user';
  (req as any).userId = userId;
  next();
};

router.use(verifyAuth);

/**
 * GET /clients - List all clients
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { status, search, limit = '50', offset = '0' } = req.query;

    let query = collections.clients.where('userId', '==', userId);

    if (status) {
      query = query.where('status', '==', status);
    }

    const snapshot = await query
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit as string))
      .get();

    let clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));

    // Simple search filter (client-side for now)
    if (search) {
      const searchLower = (search as string).toLowerCase();
      clients = clients.filter(c => 
        c.firstName.toLowerCase().includes(searchLower) ||
        c.lastName.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower)
      );
    }

    res.json({
      success: true,
      data: {
        clients,
        total: clients.length,
      },
    });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ error: 'Failed to fetch clients' });
  }
});

/**
 * POST /clients - Create new client
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const data: CreateClientRequest = req.body;

    // Validation
    if (!data.firstName || !data.lastName || !data.email) {
      return res.status(400).json({
        error: 'Missing required fields: firstName, lastName, email',
      });
    }

    const id = generateId();
    const now = new Date();

    const client: Client = {
      id,
      userId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      appointmentDate: data.appointmentDate ? new Date(data.appointmentDate) : undefined,
      status: 'active',
      notes: data.notes,
      createdAt: now,
      updatedAt: now,
    };

    await collections.clients.doc(id).set(client);

    // Create email sequences if appointment date is set
    if (client.appointmentDate) {
      await emailService.createSequences(userId, client);
    }

    res.status(201).json({
      success: true,
      data: { client },
    });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: 'Failed to create client' });
  }
});

/**
 * GET /clients/:id - Get single client
 */
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const doc = await collections.clients.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client = { id: doc.id, ...doc.data() } as Client;

    // Verify ownership
    if (client.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get email sequences for this client
    const sequencesSnapshot = await collections.emailSequences
      .where('clientId', '==', id)
      .orderBy('scheduledSendAt', 'asc')
      .get();

    const sequences = sequencesSnapshot.docs.map(d => d.data());

    res.json({
      success: true,
      data: { client, sequences },
    });
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ error: 'Failed to fetch client' });
  }
});

/**
 * PUT /clients/:id - Update client
 */
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;
    const data: UpdateClientRequest = req.body;

    const doc = await collections.clients.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const existing = { id: doc.id, ...doc.data() } as Client;

    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updates: Partial<Client> = {
      updatedAt: new Date(),
    };

    if (data.firstName !== undefined) updates.firstName = data.firstName;
    if (data.lastName !== undefined) updates.lastName = data.lastName;
    if (data.email !== undefined) updates.email = data.email;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.status !== undefined) updates.status = data.status;
    if (data.notes !== undefined) updates.notes = data.notes;

    // Handle appointment date change
    const oldApptDate = existing.appointmentDate;
    const newApptDate = data.appointmentDate ? new Date(data.appointmentDate) : undefined;
    
    if (newApptDate && (!oldApptDate || oldApptDate.getTime() !== newApptDate.getTime())) {
      updates.appointmentDate = newApptDate;
      
      // Cancel old sequences and create new ones
      await emailService.cancelClientSequences(userId, id);
      await emailService.createSequences(userId, { ...existing, ...updates } as Client);
    }

    await collections.clients.doc(id).update(updates);

    res.json({
      success: true,
      data: { client: { ...existing, ...updates } },
    });
  } catch (error) {
    console.error('Error updating client:', error);
    res.status(500).json({ error: 'Failed to update client' });
  }
});

/**
 * DELETE /clients/:id - Delete client
 */
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const doc = await collections.clients.doc(id).get();

    if (!doc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client = { id: doc.id, ...doc.data() } as Client;

    if (client.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Cancel pending emails
    await emailService.cancelClientSequences(userId, id);

    // Delete client
    await collections.clients.doc(id).delete();

    res.json({
      success: true,
      message: 'Client deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Failed to delete client' });
  }
});

/**
 * GET /clients/:id/emails - Get email history for client
 */
router.get('/:id/emails', async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { id } = req.params;

    const clientDoc = await collections.clients.doc(id).get();

    if (!clientDoc.exists) {
      return res.status(404).json({ error: 'Client not found' });
    }

    const client = { id: clientDoc.id, ...clientDoc.data() } as Client;

    if (client.userId !== userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    const snapshot = await collections.sentEmails
      .where('clientId', '==', id)
      .where('userId', '==', userId)
      .orderBy('sentAt', 'desc')
      .get();

    const emails = snapshot.docs.map(d => d.data());

    res.json({
      success: true,
      data: { emails },
    });
  } catch (error) {
    console.error('Error fetching client emails:', error);
    res.status(500).json({ error: 'Failed to fetch emails' });
  }
});

export { router as clientRoutes };
