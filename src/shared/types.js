"use strict";
// Shared types for web and desktop versions
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_TEMPLATES = exports.MERGE_FIELDS = void 0;
// Merge fields available in email templates
exports.MERGE_FIELDS = [
    { key: '{{first_name}}', label: 'First Name', example: 'Alex' },
    { key: '{{last_name}}', label: 'Last Name', example: 'Smith' },
    { key: '{{appointment_date}}', label: 'Appointment Date', example: 'Monday, January 15' },
    { key: '{{appointment_time}}', label: 'Appointment Time', example: '2:00 PM' },
    { key: '{{center_name}}', label: 'Center Name', example: 'Cleveland LGBTQ Center' },
    { key: '{{center_address}}', label: 'Center Address', example: '123 Main St' },
    { key: '{{center_phone}}', label: 'Center Phone', example: '(216) 555-0123' },
    { key: '{{staff_name}}', label: 'Staff Name', example: 'Sarah' },
];
// Default email templates
exports.DEFAULT_TEMPLATES = [
    {
        id: 'default-welcome',
        type: 'welcome',
        name: 'Welcome & Confirmation',
        is_default: true,
        subject: 'Welcome to {{center_name}} — Your appointment is confirmed',
        body: `Hi {{first_name}},

Thank you for reaching out to {{center_name}}. We've scheduled your appointment:

Date: {{appointment_date}}
Time: {{appointment_time}}
Location: {{center_address}}

If you need to reschedule, reply to this email or call us at {{center_phone}}.

We're here to support you.

{{staff_name}}
{{center_name}}`,
    },
    {
        id: 'default-reminder',
        type: 'reminder',
        name: 'Appointment Reminder',
        is_default: true,
        subject: 'Reminder: Your appointment tomorrow',
        body: `Hi {{first_name}},

Just a friendly reminder about your appointment tomorrow:

{{appointment_date}} at {{appointment_time}}
{{center_address}}

We're looking forward to meeting you.

{{staff_name}}`,
    },
    {
        id: 'default-no-show',
        type: 'no_show',
        name: 'No-Show Follow-up',
        is_default: true,
        subject: "We missed you — Let's reschedule",
        body: `Hi {{first_name}},

We missed you at your appointment today. We understand things come up.

Would you like to reschedule? Just reply to this email or call {{center_phone}}.

We're here when you're ready.

{{staff_name}}`,
    },
    {
        id: 'default-reengagement',
        type: 're_engagement',
        name: 'Re-engagement',
        is_default: true,
        subject: "We'd love to connect with you",
        body: `Hi {{first_name}},

We noticed you weren't able to make your recent appointment. No worries — life happens.

We're still here if you need support. Would you like to schedule a new appointment?

Just reply to this email or call {{center_phone}}.

Take care,

{{staff_name}}`,
    },
];
//# sourceMappingURL=types.js.map