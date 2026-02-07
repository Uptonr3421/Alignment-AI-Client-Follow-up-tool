export interface Client {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  appointmentDate?: Date;
  status: 'active' | 'inactive' | 'no_show' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailTemplate {
  id: string;
  userId: string;
  type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
  subject: string;
  body: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailSequence {
  id: string;
  clientId: string;
  userId: string;
  templateType: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
  scheduledSendAt: Date;
  sentAt?: Date;
  status: 'scheduled' | 'sent' | 'failed' | 'cancelled';
  errorMessage?: string;
  createdAt: Date;
}

export interface SentEmail {
  id: string;
  clientId: string;
  userId: string;
  sequenceId?: string;
  to: string;
  subject: string;
  body: string;
  sentAt: Date;
  status: 'sent' | 'failed';
  errorMessage?: string;
}

export interface CenterSettings {
  id: string;
  userId: string;
  centerName: string;
  centerAddress?: string;
  centerPhone?: string;
  staffName?: string;
  staffSignature?: string;
  gmailConnected: boolean;
  gmailEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GmailTokens {
  userId: string;
  accessToken: string;
  refreshToken: string;
  expiryDate: number;
  email: string;
  updatedAt: Date;
}

export interface DashboardStats {
  totalClients: number;
  appointmentsThisWeek: number;
  pendingFollowUps: number;
  noShowsThisMonth: number;
  emailsSentToday: number;
  emailsScheduled: number;
}

export interface CreateClientRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  appointmentDate?: string;
  notes?: string;
}

export interface UpdateClientRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  appointmentDate?: string;
  status?: 'active' | 'inactive' | 'no_show' | 'completed';
  notes?: string;
}
