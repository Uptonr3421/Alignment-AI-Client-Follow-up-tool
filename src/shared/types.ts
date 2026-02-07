/**
 * Shared TypeScript types and interfaces for the Cleveland LGBTQ Center Automation System
 * 
 * These types are used across desktop, web frontend, and backend to ensure type safety
 * and consistency throughout the application.
 */

// ============================================================================
// Client Types
// ============================================================================

export enum ClientStatus {
  SCHEDULED = 'scheduled',
  REMINDED = 'reminded',
  ATTENDED = 'attended',
  NO_SHOW = 'no-show',
  CANCELLED = 'cancelled',
  RE_ENGAGED = 're-engaged',
}

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  appointmentDate: Date;
  status: ClientStatus;
  serviceType: string;
  notes?: string;
  emailHistory: EmailLog[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClientInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  appointmentDate: Date;
  serviceType: string;
  notes?: string;
}

export interface UpdateClientInput {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  appointmentDate?: Date;
  status?: ClientStatus;
  serviceType?: string;
  notes?: string;
}

// ============================================================================
// Email Types
// ============================================================================

export enum EmailType {
  WELCOME = 'welcome',
  REMINDER = 'reminder',
  NO_SHOW = 'no-show',
  RE_ENGAGEMENT = 're-engagement',
}

export enum EmailStatus {
  QUEUED = 'queued',
  SENDING = 'sending',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  BOUNCED = 'bounced',
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: EmailType;
  subject: string;
  body: string;
  updatedAt: Date;
}

export interface EmailLog {
  id: string;
  clientId: string;
  templateId: string;
  type: EmailType;
  subject: string;
  sentAt: Date;
  status: EmailStatus;
  openedAt?: Date;
  clickedAt?: Date;
  error?: string;
}

export interface SendEmailInput {
  clientId: string;
  templateId: string;
  sendImmediately?: boolean;
}

// ============================================================================
// Authentication Types
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  STAFF = 'staff',
  VIEW_ONLY = 'view-only',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// ============================================================================
// Settings Types
// ============================================================================

export interface SmtpSettings {
  host: string;
  port: number;
  secure: boolean;
  username: string;
  password: string;
  fromName: string;
  fromEmail: string;
  replyTo: string;
}

export interface AutomationSettings {
  welcomeEmailEnabled: boolean;
  reminderEmailEnabled: boolean;
  reminderHoursBefore: number;
  noShowEmailEnabled: boolean;
  noShowHoursAfter: number;
  reEngagementEmailEnabled: boolean;
  reEngagementDaysAfter: number;
  skipWeekends: boolean;
  skipHolidays: boolean;
  sendTimeStart: string; // HH:mm format
  sendTimeEnd: string; // HH:mm format
  paused: boolean;
}

export interface AppSettings {
  smtp: SmtpSettings;
  automation: AutomationSettings;
  branding: BrandingSettings;
}

export interface BrandingSettings {
  centerName: string;
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
}

// ============================================================================
// Report Types
// ============================================================================

export interface DashboardStats {
  totalClients: number;
  scheduledToday: number;
  emailsSentToday: number;
  attendanceRate: number;
  noShowRate: number;
  emailOpenRate: number;
}

export interface EmailMetrics {
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  bounced: number;
  failed: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: ApiError;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================================================
// Webhook Types
// ============================================================================

export enum WebhookEvent {
  CLIENT_CREATED = 'client.created',
  CLIENT_UPDATED = 'client.updated',
  CLIENT_DELETED = 'client.deleted',
  EMAIL_SENT = 'email.sent',
  EMAIL_DELIVERED = 'email.delivered',
  EMAIL_FAILED = 'email.failed',
  CLIENT_ATTENDED = 'client.attended',
  CLIENT_NO_SHOW = 'client.no_show',
}

export interface Webhook {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  enabled: boolean;
  createdAt: Date;
}

export interface WebhookPayload<T = unknown> {
  event: WebhookEvent;
  timestamp: Date;
  data: T;
}

// ============================================================================
// Validation Helpers
// ============================================================================

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(phone);
};
