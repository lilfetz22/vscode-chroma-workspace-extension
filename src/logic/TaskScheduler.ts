import * as vscode from 'vscode';
import { getDb, createCard, getAllBoards, getColumnsByBoardId, createBoard, createColumn, getTagsByTaskId, addTagToCard } from '../database';
import { Task } from '../models/Task';
import { getNextDueDate } from './Recurrence';
import { getSettingsService } from './SettingsService';

export class TaskScheduler {
  private static instance: TaskScheduler;
  private timer: NodeJS.Timeout | undefined;
  private taskCountStatusBarItem: vscode.StatusBarItem;
  private lastNotificationTime: Map<string, number> = new Map(); // Track when we last notified for each task

  private constructor() {
    this.taskCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.updateStatusBarVisibility();
  }

  public static getInstance(): TaskScheduler {
    if (!TaskScheduler.instance) {
      TaskScheduler.instance = new TaskScheduler();
    }
    return TaskScheduler.instance;
  }

  public start() {
    this.stop();
    this.timer = setInterval(() => this.checkTasks(), 60000); // Check every minute
    this.checkTasks();
  }

  public stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  private updateStatusBarVisibility() {
    const settings = getSettingsService().getTaskSettings();
    if (settings.showInStatusBar) {
      this.taskCountStatusBarItem.show();
    } else {
      this.taskCountStatusBarItem.hide();
    }
  }

  private shouldShowNotification(taskId: string): boolean {
    const settings = getSettingsService().getTaskSettings();
    
    if (!settings.enableNotifications) {
      return false;
    }

    const now = Date.now();
    const lastNotification = this.lastNotificationTime.get(taskId);

    if (!lastNotification) {
      return true;
    }

    const hourInMs = 60 * 60 * 1000;
    const dayInMs = 24 * hourInMs;

    switch (settings.notificationFrequency) {
      case 'once':
        return false; // Already notified once
      case 'hourly':
        return now - lastNotification >= hourInMs;
      case 'daily':
        return now - lastNotification >= dayInMs;
      default:
        return false;
    }
  }

  private recordNotification(taskId: string) {
    this.lastNotificationTime.set(taskId, Date.now());
  }

  private getOrCreateToDoColumn(boardId?: string): string | null {
    try {
      const db = getDb();
      const boards = getAllBoards();
      
      // If no boards exist, create a default one
      if (boards.length === 0) {
        const newBoard = createBoard({ title: 'My Board' });
        const column = createColumn({ title: 'To Do', board_id: newBoard.id, position: 0 });
        return column.id;
      }

      // Use the specified board_id if provided, otherwise use the first board
      let targetBoard = boardId ? boards.find(b => b.id === boardId) : undefined;
      if (!targetBoard) {
        targetBoard = boards[0];
      }

      const columns = getColumnsByBoardId(targetBoard.id);
      
      // Look for a "To Do" column
      const todoColumn = columns.find(col => col.title.toLowerCase() === 'to do');
      if (todoColumn) {
        return todoColumn.id;
      }

      // If no "To Do" column exists, create one at the beginning
      const column = createColumn({ title: 'To Do', board_id: targetBoard.id, position: 0 });
      return column.id;
    } catch (error) {
      console.error('Failed to get/create To Do column:', error);
      return null;
    }
  }

  private async checkTasks() {
    const db = getDb();
    const tasks: Task[] = db.prepare('SELECT id, title, description, due_date as dueDate, recurrence, status, card_id as cardId, board_id as boardId, created_at as createdAt, updated_at as updatedAt FROM tasks WHERE status = ?').all('pending') as Task[];
    const now = new Date();
    let dueTodayCount = 0;
    let cardsCreated = false;

    for (const task of tasks) {
      let dueDate = new Date(task.dueDate);
      if (dueDate <= now) {
        // Task is due - create a card in the "To Do" column of the task's specified board
        const todoColumnId = this.getOrCreateToDoColumn(task.boardId);
        
        if (todoColumnId) {
          try {
            // Create the card
            const cardTitle = task.title;
            const cardContent = task.description || '';
            const newCard = createCard({ 
              title: cardTitle, 
              content: cardContent, 
              column_id: todoColumnId, 
              position: 0, 
              card_type: 'simple', 
              priority: 0,
              converted_from_task_at: new Date().toISOString()
            });

            // Copy tags from task to card
            const taskTags = getTagsByTaskId(task.id);
            for (const tag of taskTags) {
              addTagToCard(newCard.id, tag.id);
            }

            cardsCreated = true;

            if (this.shouldShowNotification(task.id)) {
              vscode.window.showInformationMessage(`Task due: ${task.title} - Card created in To Do`);
              this.recordNotification(task.id);
            }
          } catch (error) {
            console.error('Failed to create card for task:', error);
          }
        }

        if (task.recurrence) {
          // For recurring tasks, calculate the next due date and update the task
          const nextDueDate = getNextDueDate(task);
          if (nextDueDate) {
            db.prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(nextDueDate.toISOString(), task.id);
            // Update dueDate to reflect the new due date for "due today" count
            dueDate = nextDueDate;
          } else {
            // If no next due date, delete the task
            db.prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
            continue;
          }
        } else {
          // For non-recurring tasks, delete the task after creating the card
          db.prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
          continue;
        }
      }

      if (this.isDueToday(dueDate)) {
        dueTodayCount++;
      }
    }
    this.updateTaskCount(dueTodayCount);
    
    // Refresh both task and kanban views if cards were created
    if (cardsCreated) {
      vscode.commands.executeCommand('chroma.refreshTasks');
      vscode.commands.executeCommand('chroma.refreshKanban');
    }
  }

  private isDueToday(date: Date): boolean {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate();
  }

  public updateTaskCount(count: number) {
    this.taskCountStatusBarItem.text = `$(checklist) ${count} Tasks Due Today`;
    this.updateStatusBarVisibility();
  }

  /**
   * Reset notification tracking (useful for testing or manual reset)
   */
  public resetNotifications() {
    this.lastNotificationTime.clear();
  }
}
