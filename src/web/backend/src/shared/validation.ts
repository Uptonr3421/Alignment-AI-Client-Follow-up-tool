/**
 * Zod validation schemas for all API endpoints
 */

import { z } from 'zod';

// Client schemas
export const createClientSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(100),
  last_name: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address').max(255),
  phone: z.string().max(20).optional().nullable(),
  intake_date: z.string().datetime().optional(),
  appointment_date: z.string().datetime().optional().nullable(),
  status: z.enum(['intake', 'confirmed', 'reminded', 'no_show', 'rescheduled', 'completed']).optional(),
  notes: z.string().optional().nullable(),
});

export const updateClientSchema = z.object({
  first_name: z.string().min(1).max(100).optional(),
  last_name: z.string().min(1).max(100).optional(),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(20).optional().nullable(),
  intake_date: z.string().datetime().optional(),
  appointment_date: z.string().datetime().optional().nullable(),
  status: z.enum(['intake', 'confirmed', 'reminded', 'no_show', 'rescheduled', 'completed']).optional(),
  notes: z.string().optional().nullable(),
});

export const clientListQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).default('1'),
  limit: z.string().regex(/^\d+$/).transform(Number).default('20'),
  search: z.string().optional(),
  status: z.enum(['intake', 'confirmed', 'reminded', 'no_show', 'rescheduled', 'completed']).optional(),
  sort_by: z.enum(['created_at', 'first_name', 'last_name', 'appointment_date']).default('created_at'),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// Settings schemas
export const updateSettingsSchema = z.object({
  center_name: z.string().min(1, 'Center name is required').max(255),
  center_address: z.string().optional().nullable(),
  center_phone: z.string().max(20).optional().nullable(),
  staff_name: z.string().min(1, 'Staff name is required').max(100),
  staff_signature: z.string().optional().nullable(),
});

// Template schemas
export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  subject: z.string().min(1).max(255).optional(),
  body: z.string().min(1).optional(),
  is_default: z.boolean().optional(),
});

// Email schemas
export const sendEmailSchema = z.object({
  client_id: z.string().uuid(),
  template_type: z.enum(['welcome', 'reminder', 'no_show', 're_engagement']),
  custom_subject: z.string().optional(),
  custom_body: z.string().optional(),
});

export const cancelEmailSchema = z.object({
  reason: z.string().optional(),
});

// Gmail OAuth schema
export const gmailAuthSchema = z.object({
  code: z.string(),
});

// UUID param schema
export const uuidParamSchema = z.object({
  id: z.string().uuid('Invalid UUID format'),
});

// Export types
export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientInput = z.infer<typeof updateClientSchema>;
export type ClientListQuery = z.infer<typeof clientListQuerySchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
export type SendEmailInput = z.infer<typeof sendEmailSchema>;
export type CancelEmailInput = z.infer<typeof cancelEmailSchema>;
