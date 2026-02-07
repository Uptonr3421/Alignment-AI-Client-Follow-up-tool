/**
 * Template rendering service
 * Replaces variables in email templates with actual values
 */

interface TemplateVariables {
  [key: string]: string | number | undefined;
}

/**
 * Render a template by replacing variables with values
 * Variables are in the format {{variableName}}
 */
export function renderTemplate(template: string, variables: TemplateVariables): string {
  let rendered = template;
  
  for (const [key, value] of Object.entries(variables)) {
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    rendered = rendered.replace(placeholder, String(value ?? ''));
  }
  
  // Clean up any remaining placeholders
  rendered = rendered.replace(/{{[a-zA-Z]+}}/g, '');
  
  return rendered;
}

/**
 * Extract variables from a template string
 * Returns array of variable names found in the template
 */
export function extractVariables(template: string): string[] {
  const regex = /{{([a-zA-Z]+)}}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(template)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }
  
  return variables;
}

/**
 * Format date for email display
 */
export function formatDate(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format time for email display
 */
export function formatTime(date: Date | string | number): string {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

/**
 * Build complete template variables from client and center data
 */
export function buildTemplateVariables(
  client: any,
  center: any,
  settings: any,
  appointmentDate?: Date
): TemplateVariables {
  return {
    // Client variables
    clientFirstName: client.firstName,
    clientLastName: client.lastName,
    clientFullName: `${client.firstName} ${client.lastName}`,
    clientEmail: client.email,
    clientPhone: client.phone || '',
    
    // Center variables
    centerName: center.name,
    centerAddress: center.address,
    centerPhone: center.phone,
    centerEmail: center.email,
    centerWebsite: center.website || '',
    
    // Appointment variables
    appointmentDate: appointmentDate ? formatDate(appointmentDate) : '',
    appointmentTime: appointmentDate ? formatTime(appointmentDate) : '',
    
    // Staff signature
    staffSignature: settings?.emailSettings?.signature || `Best regards,\n${center.name}`
  };
}
