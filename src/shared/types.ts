/**
 * Shared TypeScript types for the LGBTQ Center Automation System
 */

export interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  intakeDate: string;
  appointmentDate?: string;
  status: 'active' | 'inactive' | 'completed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  type: 'welcome' | 'reminder' | 'noshow' | 'reengagement';
  isActive: boolean;
}

export interface EmailSequence {
  id: string;
  clientId: string;
  templateId: string;
  scheduledAt: string;
  sentAt?: string;
  status: 'pending' | 'sent' | 'failed';
  type: 'welcome' | 'reminder' | 'noshow' | 'reengagement';
}

export interface DashboardStats {
  totalClients: number;
  activeClients: number;
  emailsSentToday: number;
  pendingEmails: number;
  upcomingAppointments: number;
}

export interface Settings {
  id: string;
  centerName: string;
  senderEmail: string;
  senderName: string;
  gmailConnected: boolean;
}
