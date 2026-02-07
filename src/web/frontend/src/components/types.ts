// Shared types for the nonprofit client follow-up automation system

export interface Client {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  intake_date: string;
  appointment_date?: string;
  status: 'intake' | 'confirmed' | 'reminded' | 'no_show' | 'rescheduled' | 'completed';
  notes?: string;
}

export interface DashboardStats {
  total_clients: number;
  appointments_this_week: number;
  pending_follow_ups: number;
  no_shows_this_month: number;
}

export interface CenterInfo {
  center_name: string;
  center_address: string;
  center_phone: string;
  staff_name: string;
  staff_signature: string;
}

// Alias for backward compatibility
export type CenterSettings = CenterInfo & {
  gmail_connected?: boolean;
};

export interface ScheduledEmail {
  id: string;
  client_name: string;
  client_email: string;
  scheduled_time: string;
  template_name: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
  subject: string;
  body: string;
  description: string;
  when_sent: string;
}

export type NavItem = {
  label: string;
  href: string;
  icon: string;
};
