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
    created_at: string;
    updated_at: string;
}
export interface EmailSequence {
    id: string;
    client_id: string;
    template_type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
    scheduled_send_at: string;
    sent_at?: string;
    status: 'scheduled' | 'sent' | 'failed';
    error_message?: string;
}
export interface CenterSettings {
    center_name: string;
    center_address?: string;
    center_phone?: string;
    staff_name: string;
    staff_signature?: string;
    gmail_connected: boolean;
    gmail_email?: string;
}
export interface EmailTemplate {
    id: string;
    type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
    name: string;
    subject: string;
    body: string;
    is_default: boolean;
}
export interface DashboardStats {
    total_clients: number;
    appointments_this_week: number;
    pending_follow_ups: number;
    no_shows_this_month: number;
}
export declare const MERGE_FIELDS: readonly [{
    readonly key: "{{first_name}}";
    readonly label: "First Name";
    readonly example: "Alex";
}, {
    readonly key: "{{last_name}}";
    readonly label: "Last Name";
    readonly example: "Smith";
}, {
    readonly key: "{{appointment_date}}";
    readonly label: "Appointment Date";
    readonly example: "Monday, January 15";
}, {
    readonly key: "{{appointment_time}}";
    readonly label: "Appointment Time";
    readonly example: "2:00 PM";
}, {
    readonly key: "{{center_name}}";
    readonly label: "Center Name";
    readonly example: "Cleveland LGBTQ Center";
}, {
    readonly key: "{{center_address}}";
    readonly label: "Center Address";
    readonly example: "123 Main St";
}, {
    readonly key: "{{center_phone}}";
    readonly label: "Center Phone";
    readonly example: "(216) 555-0123";
}, {
    readonly key: "{{staff_name}}";
    readonly label: "Staff Name";
    readonly example: "Sarah";
}];
export declare const DEFAULT_TEMPLATES: EmailTemplate[];
//# sourceMappingURL=types.d.ts.map