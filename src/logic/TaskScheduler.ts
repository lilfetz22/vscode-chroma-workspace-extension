import * as vscode from 'vscode';
import { getDb } from '../database';
import { Task } from '../models/Task';
import { getNextDueDate } from './Recurrence';

export class TaskScheduler {
  private static instance: TaskScheduler;
  private timer: NodeJS.Timeout | undefined;
  private taskCountStatusBarItem: vscode.StatusBarItem;

  private constructor() {
    this.taskCountStatusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    this.taskCountStatusBarItem.show();
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

  private async checkTasks() {
    const db = getDb();
    const tasks: Task[] = db.prepare('SELECT * FROM tasks WHERE status = ?').all('pending') as Task[];
    const now = new Date();
    let dueTodayCount = 0;

    for (const task of tasks) {
      const dueDate = new Date(task.dueDate);
      if (dueDate <= now) {
        vscode.window.showInformationMessage(`Task due: ${task.title}`);
        if (task.recurrence) {
          const nextDueDate = getNextDueDate(task);
          if (nextDueDate) {
            db.prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(nextDueDate.toISOString(), task.id);
          }
        } else {
          db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('completed', task.id);
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
  }
}
