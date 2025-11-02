export interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'pending' | 'completed';
  cardId?: number;
  createdAt: Date;
  updatedAt: Date;
}
