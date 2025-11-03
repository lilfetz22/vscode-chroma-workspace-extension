export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'pending' | 'completed';
  cardId?: number;
  createdAt: Date;
  updatedAt: Date;
}
