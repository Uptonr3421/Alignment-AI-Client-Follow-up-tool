/**
 * Replace merge fields in a template with actual values
 */
export declare function renderTemplate(template: string, data: Record<string, string | undefined>): string;
/**
 * Format date for display
 */
export declare function formatDate(dateString: string): string;
/**
 * Format time for display
 */
export declare function formatTime(dateString: string): string;
/**
 * Generate UUID v4
 */
export declare function generateId(): string;
/**
 * Calculate scheduled email dates based on appointment date
 */
export declare function calculateEmailSchedule(appointmentDate: string): Array<{
    type: 'welcome' | 'reminder' | 'no_show' | 're_engagement';
    sendAt: string;
}>;
/**
 * Validate email format
 */
export declare function isValidEmail(email: string): boolean;
/**
 * Sanitize string for database storage
 */
export declare function sanitizeString(str: string | undefined): string;
//# sourceMappingURL=utils.d.ts.map