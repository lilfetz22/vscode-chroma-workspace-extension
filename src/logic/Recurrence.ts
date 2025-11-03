import { Task } from '../models/Task';

export function getNextDueDate(task: Task): Date | null {
  if (!task.recurrence) {
    return null;
  }

  const now = new Date();
  let nextDueDate = new Date(task.dueDate);

  while (nextDueDate <= now) {
    switch (task.recurrence) {
      case 'daily':
        nextDueDate.setDate(nextDueDate.getDate() + 1);
        break;
      case 'weekly':
        nextDueDate.setDate(nextDueDate.getDate() + 7);
        break;
      case 'monthly':
        nextDueDate.setMonth(nextDueDate.getMonth() + 1);
        break;
      case 'yearly':
        nextDueDate.setFullYear(nextDueDate.getFullYear() + 1);
        break;
      default:
        return null;
    }
  }

  return nextDueDate;
}
