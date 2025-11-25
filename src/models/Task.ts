export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  recurrence?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  status: 'pending' | 'completed';
  cardId?: number;
  boardId?: string;
  createdAt: Date;
  updatedAt: Date;
}
