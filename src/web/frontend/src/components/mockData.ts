import { Client, DashboardStats, CenterInfo, ScheduledEmail } from './types';

export const mockClients: Client[] = [
  {
    id: '1',
    first_name: 'Maria',
    last_name: 'Garcia',
    email: 'maria.garcia@email.com',
    phone: '(555) 123-4567',
    intake_date: '2024-02-01',
    appointment_date: '2024-02-15',
    status: 'confirmed',
    notes: 'First-time client, needs childcare assistance'
  },
  {
    id: '2',
    first_name: 'James',
    last_name: 'Wilson',
    email: 'j.wilson@email.com',
    phone: '(555) 987-6543',
    intake_date: '2024-02-05',
    appointment_date: '2024-02-20',
    status: 'reminded',
    notes: 'Follow-up appointment for housing application'
  },
  {
    id: '3',
    first_name: 'Sarah',
    last_name: 'Chen',
    email: 'sarah.chen@email.com',
    phone: '(555) 456-7890',
    intake_date: '2024-02-08',
    appointment_date: '2024-02-10',
    status: 'no_show',
    notes: 'Missed appointment, left voicemail'
  },
  {
    id: '4',
    first_name: 'Robert',
    last_name: 'Johnson',
    email: 'r.johnson@email.com',
    phone: '(555) 234-5678',
    intake_date: '2024-02-10',
    appointment_date: '2024-02-25',
    status: 'intake',
    notes: 'New intake, needs food assistance program'
  },
  {
    id: '5',
    first_name: 'Emily',
    last_name: 'Rodriguez',
    email: 'emily.r@email.com',
    phone: '(555) 876-5432',
    intake_date: '2024-01-20',
    appointment_date: '2024-01-30',
    status: 'completed',
    notes: 'Successfully enrolled in benefits program'
  },
  {
    id: '6',
    first_name: 'Michael',
    last_name: 'Brown',
    email: 'mbrown@email.com',
    phone: '(555) 345-6789',
    intake_date: '2024-02-12',
    appointment_date: '2024-02-28',
    status: 'rescheduled',
    notes: 'Rescheduled from Feb 20 due to conflict'
  }
];

export const mockDashboardStats: DashboardStats = {
  total_clients: 156,
  appointments_this_week: 12,
  pending_follow_ups: 8,
  no_shows_this_month: 3
};

export const mockCenterInfo: CenterInfo = {
  center_name: 'Hope Community Center',
  center_address: '123 Main Street, City, ST 12345',
  center_phone: '(555) 123-4567',
  staff_name: 'Amanda Thompson',
  staff_signature: 'Best regards,\nAmanda Thompson\nCase Manager\nHope Community Center'
};

export const mockScheduledEmails: ScheduledEmail[] = [
  {
    id: '1',
    client_name: 'Maria Garcia',
    client_email: 'maria.garcia@email.com',
    scheduled_time: '2024-02-14T09:00:00',
    template_name: 'Appointment Reminder'
  },
  {
    id: '2',
    client_name: 'James Wilson',
    client_email: 'j.wilson@email.com',
    scheduled_time: '2024-02-19T10:00:00',
    template_name: '24-Hour Reminder'
  },
  {
    id: '3',
    client_name: 'Robert Johnson',
    client_email: 'r.johnson@email.com',
    scheduled_time: '2024-02-24T14:00:00',
    template_name: 'Appointment Reminder'
  }
];
