/**
 * Shared utility functions
 * Stubs for template rendering and email scheduling
 */

export interface TemplateData {
  firstName?: string;
  lastName?: string;
  email?: string;
  appointmentDate?: Date | null;
  centerName?: string;
  [key: string]: string | Date | null | undefined;
}

export interface EmailSchedule {
  welcome: Date;
  reminder: Date;
  noShow: Date;
  reEngagement: Date;
}

/**
 * Render a template string with placeholder substitution
 * Replaces {{variableName}} with actual values from data
 */
export function renderTemplate(template: string, data: TemplateData): string {
  let result = template;

  // Replace placeholders like {{firstName}}, {{lastName}}, etc.
  result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const value = data[key];
    if (value === null || value === undefined) {
      return match; // Keep placeholder if not found
    }
    if (value instanceof Date) {
      return value.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return String(value);
  });

  return result;
}

/**
 * Calculate email schedule dates based on appointment date
 * - Welcome: Immediately (now)
 * - Reminder: 24 hours before appointment
 * - No-show: 2 hours after appointment
 * - Re-engagement: 7 days after appointment
 */
export function calculateEmailSchedule(appointmentDate: Date): EmailSchedule {
  const now = new Date();
  const appointment = new Date(appointmentDate);

  return {
    welcome: now,
    reminder: new Date(appointment.getTime() - 24 * 60 * 60 * 1000), // 24 hours before
    noShow: new Date(appointment.getTime() + 2 * 60 * 60 * 1000), // 2 hours after
    reEngagement: new Date(appointment.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days after
  };
}
