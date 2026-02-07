-- Initial schema migration for LGBTQ Center Client Automation
-- Run this with: npm run db:migrate

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Client status enum
CREATE TYPE client_status AS ENUM ('intake', 'confirmed', 'reminded', 'no_show', 'rescheduled', 'completed');

-- Email status enum
CREATE TYPE email_status AS ENUM ('scheduled', 'sent', 'failed', 'cancelled');

-- Template type enum
CREATE TYPE template_type AS ENUM ('welcome', 'reminder', 'no_show', 're_engagement');

-- Clients table
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    intake_date TIMESTAMP NOT NULL DEFAULT NOW(),
    appointment_date TIMESTAMP,
    status client_status NOT NULL DEFAULT 'intake',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Email sequences table
CREATE TABLE email_sequences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    template_type template_type NOT NULL,
    scheduled_send_at TIMESTAMP NOT NULL,
    sent_at TIMESTAMP,
    status email_status NOT NULL DEFAULT 'scheduled',
    error_message TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    center_name VARCHAR(255) NOT NULL,
    center_address TEXT,
    center_phone VARCHAR(20),
    staff_name VARCHAR(100) NOT NULL,
    staff_signature TEXT,
    gmail_connected BOOLEAN NOT NULL DEFAULT FALSE,
    gmail_email VARCHAR(255),
    gmail_refresh_token TEXT,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Email templates table
CREATE TABLE email_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type template_type NOT NULL,
    name VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_appointment_date ON clients(appointment_date);
CREATE INDEX idx_clients_created_at ON clients(created_at);

CREATE INDEX idx_email_sequences_client_id ON email_sequences(client_id);
CREATE INDEX idx_email_sequences_status ON email_sequences(status);
CREATE INDEX idx_email_sequences_scheduled_send_at ON email_sequences(scheduled_send_at);
CREATE INDEX idx_email_sequences_template_type ON email_sequences(template_type);

CREATE INDEX idx_settings_gmail_connected ON settings(gmail_connected);

CREATE INDEX idx_email_templates_type ON email_templates(type);
CREATE INDEX idx_email_templates_is_default ON email_templates(is_default);

-- Insert default email templates
INSERT INTO email_templates (type, name, subject, body, is_default) VALUES
('welcome', 'Welcome Email', 'Welcome to {{centerName}}!', 
'<p>Hi {{firstName}},</p>
<p>Welcome to {{centerName}}! We''re excited to support you on your journey.</p>
<p>Your appointment is scheduled for {{appointmentDate}}.</p>
<p>If you have any questions, please don''t hesitate to reach out.</p>
<p>Best regards,<br>{{centerName}} Team</p>', 
TRUE),

('reminder', 'Appointment Reminder', 'Reminder: Your appointment at {{centerName}}', 
'<p>Hi {{firstName}},</p>
<p>This is a friendly reminder about your upcoming appointment at {{centerName}} tomorrow.</p>
<p><strong>Date/Time:</strong> {{appointmentDate}}</p>
<p>We look forward to seeing you!</p>
<p>Best regards,<br>{{centerName}} Team</p>', 
TRUE),

('no_show', 'We Missed You', 'We missed you at {{centerName}}', 
'<p>Hi {{firstName}},</p>
<p>We noticed you weren''t able to make it to your appointment today. We hope everything is okay!</p>
<p>If you''d like to reschedule, please reach out to us. We''re here to support you.</p>
<p>Best regards,<br>{{centerName}} Team</p>', 
TRUE),

('re_engagement', 'We''d Love to Hear from You', 'Checking in from {{centerName}}', 
'<p>Hi {{firstName}},</p>
<p>It''s been a week since your missed appointment, and we wanted to check in. We understand that life can be busy and unpredictable.</p>
<p>If you''re still interested in our services, we''d love to help you reschedule. Your well-being is important to us.</p>
<p>Please reply to this email or give us a call if you''d like to set up a new appointment.</p>
<p>Take care,<br>{{centerName}} Team</p>', 
TRUE);

-- Insert default settings
INSERT INTO settings (center_name, staff_name) VALUES 
('LGBTQ+ Center', 'Staff');
