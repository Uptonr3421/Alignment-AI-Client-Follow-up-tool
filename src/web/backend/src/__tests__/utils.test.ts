import { describe, it, expect } from 'vitest';
import { renderTemplate, calculateEmailSchedule } from '../shared/utils';

describe('Utils - renderTemplate', () => {
  it('should replace simple placeholders', () => {
    const template = 'Hello {{firstName}} {{lastName}}!';
    const result = renderTemplate(template, {
      firstName: 'John',
      lastName: 'Doe',
    });
    expect(result).toBe('Hello John Doe!');
  });

  it('should keep placeholders for missing data', () => {
    const template = 'Hello {{firstName}} {{missing}}!';
    const result = renderTemplate(template, {
      firstName: 'John',
    });
    expect(result).toBe('Hello John {{missing}}!');
  });

  it('should format dates correctly', () => {
    const template = 'Your appointment is on {{appointmentDate}}';
    const date = new Date('2024-03-15T10:00:00');
    const result = renderTemplate(template, {
      appointmentDate: date,
    });
    expect(result).toContain('March');
    expect(result).toContain('2024');
  });

  it('should handle center name placeholder', () => {
    const template = 'Welcome to {{centerName}}';
    const result = renderTemplate(template, {
      centerName: 'Cleveland LGBTQ Center',
    });
    expect(result).toBe('Welcome to Cleveland LGBTQ Center');
  });

  it('should handle empty template', () => {
    const result = renderTemplate('', { firstName: 'John' });
    expect(result).toBe('');
  });

  it('should handle template with no placeholders', () => {
    const template = 'Hello World';
    const result = renderTemplate(template, { firstName: 'John' });
    expect(result).toBe('Hello World');
  });
});

describe('Utils - calculateEmailSchedule', () => {
  it('should calculate welcome email for now', () => {
    const appointmentDate = new Date('2024-03-15T10:00:00');
    const beforeTest = new Date();
    const schedule = calculateEmailSchedule(appointmentDate);
    const afterTest = new Date();

    expect(schedule.welcome.getTime()).toBeGreaterThanOrEqual(beforeTest.getTime());
    expect(schedule.welcome.getTime()).toBeLessThanOrEqual(afterTest.getTime());
  });

  it('should calculate reminder 24 hours before appointment', () => {
    const appointmentDate = new Date('2024-03-15T10:00:00');
    const schedule = calculateEmailSchedule(appointmentDate);
    
    const expectedReminder = new Date('2024-03-14T10:00:00');
    expect(schedule.reminder.getTime()).toBe(expectedReminder.getTime());
  });

  it('should calculate no-show check 2 hours after appointment', () => {
    const appointmentDate = new Date('2024-03-15T10:00:00');
    const schedule = calculateEmailSchedule(appointmentDate);
    
    const expectedNoShow = new Date('2024-03-15T12:00:00');
    expect(schedule.noShow.getTime()).toBe(expectedNoShow.getTime());
  });

  it('should calculate re-engagement 7 days after appointment', () => {
    const appointmentDate = new Date('2024-03-15T10:00:00');
    const schedule = calculateEmailSchedule(appointmentDate);
    
    const expectedReEngage = new Date('2024-03-22T10:00:00');
    expect(schedule.reEngagement.getTime()).toBe(expectedReEngage.getTime());
  });

  it('should handle appointments at midnight', () => {
    const appointmentDate = new Date('2024-03-15T00:00:00');
    const schedule = calculateEmailSchedule(appointmentDate);
    
    expect(schedule.reminder.getDate()).toBe(14);
    expect(schedule.noShow.getDate()).toBe(15);
    expect(schedule.noShow.getHours()).toBe(2);
  });
});
