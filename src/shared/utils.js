"use strict";
// Shared utilities
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderTemplate = renderTemplate;
exports.formatDate = formatDate;
exports.formatTime = formatTime;
exports.generateId = generateId;
exports.calculateEmailSchedule = calculateEmailSchedule;
exports.isValidEmail = isValidEmail;
exports.sanitizeString = sanitizeString;
const types_1 = require("./types");
/**
 * Replace merge fields in a template with actual values
 */
function renderTemplate(template, data) {
    let result = template;
    types_1.MERGE_FIELDS.forEach(({ key }) => {
        const fieldName = key.replace(/{{|}}/g, '');
        const value = data[fieldName] || '';
        result = result.replace(new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value);
    });
    return result;
}
/**
 * Format date for display
 */
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}
/**
 * Format time for display
 */
function formatTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
    });
}
/**
 * Generate UUID v4
 */
function generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
/**
 * Calculate scheduled email dates based on appointment date
 */
function calculateEmailSchedule(appointmentDate) {
    const appt = new Date(appointmentDate);
    const schedules = [];
    // Welcome email: immediately
    schedules.push({
        type: 'welcome',
        sendAt: new Date().toISOString(),
    });
    // Reminder: day before at 9am
    const reminder = new Date(appt);
    reminder.setDate(reminder.getDate() - 1);
    reminder.setHours(9, 0, 0, 0);
    schedules.push({
        type: 'reminder',
        sendAt: reminder.toISOString(),
    });
    // No-show check: 2 hours after appointment
    const noShowCheck = new Date(appt);
    noShowCheck.setHours(noShowCheck.getHours() + 2);
    schedules.push({
        type: 'no_show',
        sendAt: noShowCheck.toISOString(),
    });
    // Re-engagement: 7 days after missed appointment
    const reEngage = new Date(appt);
    reEngage.setDate(reEngage.getDate() + 7);
    reEngage.setHours(10, 0, 0, 0);
    schedules.push({
        type: 're_engagement',
        sendAt: reEngage.toISOString(),
    });
    return schedules;
}
/**
 * Validate email format
 */
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
/**
 * Sanitize string for database storage
 */
function sanitizeString(str) {
    if (!str)
        return '';
    return str.trim().replace(/[<>]/g, '');
}
//# sourceMappingURL=utils.js.map