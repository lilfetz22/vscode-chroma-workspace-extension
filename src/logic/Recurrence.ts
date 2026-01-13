import { Task } from '../models/Task';

/**
 * Parse a recurrence string and extract the type and days (for custom_weekly)
 */
function parseRecurrence(recurrence: string): { type: string; days?: number[] } {
  if (recurrence.startsWith('custom_weekly:')) {
    const daysStr = recurrence.split(':')[1];
    const days = daysStr.split(',').map(Number);
    return { type: 'custom_weekly', days };
  }
  return { type: recurrence };
}

/**
 * Get the next occurrence for weekdays (Mon-Fri) pattern
 */
function getNextWeekday(fromDate: Date): Date {
  const next = new Date(fromDate);
  next.setDate(next.getDate() + 1);
  
  // Skip weekends
  while (next.getDay() === 0 || next.getDay() === 6) {
    next.setDate(next.getDate() + 1);
  }
  
  return next;
}

/**
 * Get the next occurrence for custom_weekly pattern
 * @param fromDate - The current due date
 * @param days - Array of day numbers (0=Sunday, 1=Monday, ..., 6=Saturday)
 */
function getNextCustomWeekly(fromDate: Date, days: number[]): Date {
  if (!days || days.length === 0) {
    return new Date(fromDate);
  }
  
  // Sort days for easier processing
  const sortedDays = [...days].sort((a, b) => a - b);
  
  const next = new Date(fromDate);
  next.setDate(next.getDate() + 1);
  
  // Find the next day that matches one of the selected days
  // Limit to 7 iterations to avoid infinite loop
  for (let i = 0; i < 7; i++) {
    if (sortedDays.includes(next.getDay())) {
      return next;
    }
    next.setDate(next.getDate() + 1);
  }
  
  // Fallback: return next week's first matching day
  return next;
}

/**
 * Calculate the next due date for a recurring task.
 *
 * @param task - The task with recurrence information.
 * @param forceNext - If true, always advance to the next occurrence even if the current due date hasn't passed yet.
 * @returns The next due date, or null if the task has no recurrence or an invalid recurrence type.
 */
export function getNextDueDate(task: Task, forceNext: boolean = false): Date | null {
  if (!task.recurrence) {
    return null;
  }

  const { type, days } = parseRecurrence(task.recurrence);
  const now = new Date();
  let nextDueDate = new Date(task.dueDate);

  // Helper function to advance the date by one occurrence
  // Returns false if the recurrence type is invalid
  const advanceDate = (): boolean => {
    switch (type) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        return true;
      case 'weekdays':
        nextDueDate = getNextWeekday(nextDueDate);
        return true;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        return true;
      case 'bi-weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 14);
        return true;
      case 'custom_weekly':
        nextDueDate = getNextCustomWeekly(nextDueDate, days || []);
        return true;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        return true;
      case 'yearly':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        return true;
      default:
        return false;
    }
  };

  // If forceNext is true, always advance at least once
  if (forceNext) {
    if (!advanceDate()) {
      return null;
    }
  }

  // Continue advancing until we're past now
  while (nextDueDate <= now) {
    if (!advanceDate()) {
      return null;
    }
  }

  return nextDueDate;
}

/**
 * Get a human-readable label for a recurrence pattern
 */
export function getRecurrenceLabel(recurrence: string | null): string {
  if (!recurrence) {
    return 'Once';
  }
  
  const { type, days } = parseRecurrence(recurrence);
  
  switch (type) {
    case 'daily':
      return 'Daily';
    case 'weekdays':
      return 'Weekdays';
    case 'weekly':
      return 'Weekly';
    case 'bi-weekly':
      return 'Bi-weekly';
    case 'custom_weekly': {
      if (days && days.length > 0) {
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const dayLabels = days.map(d => dayNames[d]).join(', ');
        return `Weekly (${dayLabels})`;
      }
      return 'Custom Weekly';
    }
    case 'monthly':
      return 'Monthly';
    case 'yearly':
      return 'Yearly';
    default:
      return recurrence.charAt(0).toUpperCase() + recurrence.slice(1);
  }
}
