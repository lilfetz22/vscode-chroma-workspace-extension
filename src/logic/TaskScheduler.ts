import * as vscode from 'vscode';
import { getDb } from '../database';
import { Task } from '../models/Task';
import { getNextDueDate } from './Recurrence';
import { getSettingsService } from './SettingsService';

export class TaskScheduler {
  private static instance: TaskScheduler;
  private timer: NodeJS.Timeout | undefined;
  private taskCountStatusBarItem: vscode.StatusBarItem;
  private notifiedTasks: Set<string> = new Set(); // Track tasks we've already notified about
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
    this.notifiedTasks.add(taskId);
    this.lastNotificationTime.set(taskId, Date.now());
  }

  private async checkTasks() {
    const db = getDb();
    const tasks: Task[] = db.prepare('SELECT * FROM tasks WHERE status = ?').all('pending') as Task[];
    const now = new Date();
    let dueTodayCount = 0;

    for (const task of tasks) {
      let dueDate = new Date(task.dueDate);
      if (dueDate <= now) {
        if (task.recurrence) {
          const nextDueDate = getNextDueDate(task);
          if (nextDueDate) {
            // Update the due date BEFORE showing notification to prevent duplicate notifications
            db.prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(nextDueDate.toISOString(), task.id);
            
            if (this.shouldShowNotification(task.id)) {
              vscode.window.showInformationMessage(`Task due: ${task.title}`);
              this.recordNotification(task.id);
            }
            
            // Update dueDate to reflect the new due date for "due today" count
            dueDate = nextDueDate;
          }
        } else {
          // For non-recurring tasks, show notification then mark as completed
          if (this.shouldShowNotification(task.id)) {
            vscode.window.showInformationMessage(`Task due: ${task.title}`);
            this.recordNotification(task.id);
          }
          
          db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('completed', task.id);
          // Completed tasks should not be counted as "due today"
          continue;
        }
      }

      if (this.isDueToday(dueDate)) {
        dueTodayCount++;
      }
    }
    this.updateTaskCount(dueTodayCount);
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
    this.notifiedTasks.clear();
    this.lastNotificationTime.clear();
  }
}
