export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'pending' | 'completed';
  notified: boolean;
  cardId?: number;
  createdAt: Date;
  updatedAt: Date;
}
