import { pgTable, uuid, varchar, text, timestamp, boolean, pgEnum, index } from 'drizzle-orm/pg-core';

export const clientStatusEnum = pgEnum('client_status', [
  'intake',
  'confirmed',
  'reminded',
  'no_show',
  'rescheduled',
  'completed',
]);

export const emailStatusEnum = pgEnum('email_status', [
  'scheduled',
  'sent',
  'failed',
  'cancelled',
]);

export const templateTypeEnum = pgEnum('template_type', [
  'welcome',
  'reminder',
  'no_show',
  're_engagement',
]);

export const clients = pgTable('clients', {
  id: uuid('id').primaryKey().defaultRandom(),
  first_name: varchar('first_name', { length: 100 }).notNull(),
  last_name: varchar('last_name', { length: 100 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  intake_date: timestamp('intake_date').notNull().defaultNow(),
  appointment_date: timestamp('appointment_date'),
  status: clientStatusEnum('status').notNull().default('intake'),
  notes: text('notes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  emailIdx: index('clients_email_idx').on(table.email),
  statusIdx: index('clients_status_idx').on(table.status),
  appointmentDateIdx: index('clients_appointment_date_idx').on(table.appointment_date),
  createdAtIdx: index('clients_created_at_idx').on(table.created_at),
}));

export const email_sequences = pgTable('email_sequences', {
  id: uuid('id').primaryKey().defaultRandom(),
  client_id: uuid('client_id').references(() => clients.id, { onDelete: 'cascade' }).notNull(),
  template_type: templateTypeEnum('template_type').notNull(),
  scheduled_send_at: timestamp('scheduled_send_at').notNull(),
  sent_at: timestamp('sent_at'),
  status: emailStatusEnum('status').notNull().default('scheduled'),
  error_message: text('error_message'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  clientIdIdx: index('email_sequences_client_id_idx').on(table.client_id),
  statusIdx: index('email_sequences_status_idx').on(table.status),
  scheduledSendAtIdx: index('email_sequences_scheduled_send_at_idx').on(table.scheduled_send_at),
  templateTypeIdx: index('email_sequences_template_type_idx').on(table.template_type),
}));

export const settings = pgTable('settings', {
  id: uuid('id').primaryKey().defaultRandom(),
  center_name: varchar('center_name', { length: 255 }).notNull(),
  center_address: text('center_address'),
  center_phone: varchar('center_phone', { length: 20 }),
  staff_name: varchar('staff_name', { length: 100 }).notNull(),
  staff_signature: text('staff_signature'),
  gmail_connected: boolean('gmail_connected').notNull().default(false),
  gmail_email: varchar('gmail_email', { length: 255 }),
  gmail_refresh_token: text('gmail_refresh_token'),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  gmailConnectedIdx: index('settings_gmail_connected_idx').on(table.gmail_connected),
}));

export const email_templates = pgTable('email_templates', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: templateTypeEnum('type').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  subject: varchar('subject', { length: 255 }).notNull(),
  body: text('body').notNull(),
  is_default: boolean('is_default').notNull().default(false),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  typeIdx: index('email_templates_type_idx').on(table.type),
  isDefaultIdx: index('email_templates_is_default_idx').on(table.is_default),
}));
