import * as vscode from 'vscode';
import { getDb, prepare, createCard, getAllBoards, getColumnsByBoardId, createBoard, createColumn, getTagsByTaskId, addTagToCard, copyTaskTagsToCard, reorderCardsOnInsert, getColumnById, saveDatabase } from '../database';
import { Task } from '../models/Task';
import { getNextDueDate } from './Recurrence';
import { getSettingsService } from './SettingsService';
import { Logger } from './Logger';
import { createCardFromTask } from '../Task';

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

  private async checkTasks() {
    getDb(); // Ensure DB is initialized
    const logger = Logger.getInstance();
    const tasks: Task[] = prepare('SELECT id, title, description, due_date as dueDate, recurrence, status, card_id as cardId, board_id as boardId, created_at as createdAt, updated_at as updatedAt FROM tasks WHERE status = ?').all('pending') as Task[];
    const now = new Date();
    let dueTodayCount = 0;
    let cardsCreated = false;

    // Check if vacation mode is enabled
    const settings = getSettingsService().getTaskSettings();
    if (settings.vacationMode) {
      // Build a set of board IDs to pause (supports IDs or exact board titles)
      const boards = getAllBoards();
      const entries = settings.vacationModeBoards || [];
      const boardIdsToPause = new Set<string>();

      if (entries.length === 0) {
        // Empty list means pause on all boards
        for (const b of boards) {
          if (b?.id) boardIdsToPause.add(b.id);
        }
      } else {
        for (const entry of entries) {
          for (const b of boards) {
            if (!b) continue;
            if (b.id === entry || b.title === entry) {
              if (b.id) boardIdsToPause.add(b.id);
            }
          }
        }
      }
      // In vacation mode: count due tasks but don't create cards
      for (const task of tasks) {
        const dueDate = new Date(task.dueDate);
        const shouldPauseForBoard = task.boardId ? boardIdsToPause.has(task.boardId) : entries.length === 0;

        if (shouldPauseForBoard) {
          if (this.isDueToday(dueDate)) {
            dueTodayCount++;
          }
        } else {
          // For boards not in vacation mode, process the task normally
          if (dueDate <= now) {
            try {
              const newCard = await createCardFromTask(task, false);
              
              if (newCard) {
                cardsCreated = true;

                if (this.shouldShowNotification(task.id)) {
                  vscode.window.showInformationMessage(`Task due: ${task.title} - Card created in To Do`);
                  this.recordNotification(task.id);
                }
              } else {
                logger.error(`Failed to create card for task ${task.id}`);
              }
            } catch (error) {
              logger.error('Failed to create card for task:', error);
            }

            if (task.recurrence) {
              // For recurring tasks, calculate the next due date and update the task
              const nextDueDate = getNextDueDate(task);
              if (nextDueDate) {
                prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(nextDueDate.toISOString(), task.id);
              } else {
                // If no next due date, log warning and delete the task
                logger.warn(`Recurring task "${task.title}" (ID: ${task.id}) has no next due date - deleting. This may indicate an invalid recurrence pattern.`);
                prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
              }
            } else {
              // For non-recurring tasks, log and delete the task after creating the card
              logger.debug(`Non-recurring task "${task.title}" (ID: ${task.id}) completed - deleting after card creation.`);
              prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
            }
          } else if (this.isDueToday(dueDate)) {
            dueTodayCount++;
          }
        }
      }
      this.updateTaskCount(dueTodayCount);
      
      // Refresh both task and kanban views if cards were created
      if (cardsCreated) {
        vscode.commands.executeCommand('chroma.refreshTasks');
        vscode.commands.executeCommand('chroma.refreshKanban');
      }
      return; // Exit early - vacation mode applies to selected/all boards
    }

    for (const task of tasks) {
      let dueDate = new Date(task.dueDate);
      if (dueDate <= now) {
        // Task is due - create a card using the reusable function
        try {
          const newCard = await createCardFromTask(task, false);
          
          if (newCard) {
            cardsCreated = true;

            if (this.shouldShowNotification(task.id)) {
              vscode.window.showInformationMessage(`Task due: ${task.title} - Card created in To Do`);
              this.recordNotification(task.id);
            }
          } else {
            logger.error(`Failed to create card for task ${task.id}`);
          }
        } catch (error) {
          logger.error('Failed to create card for task:', error);
        }

        if (task.recurrence) {
          // For recurring tasks, calculate the next due date and update the task
          const nextDueDate = getNextDueDate(task);
          if (nextDueDate) {
            prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(nextDueDate.toISOString(), task.id);
            // Update dueDate to reflect the new due date for "due today" count
            dueDate = nextDueDate;
          } else {
            // If no next due date, log warning and delete the task
            logger.warn(`Recurring task "${task.title}" (ID: ${task.id}) has no next due date - deleting. This may indicate an invalid recurrence pattern.`);
            prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
            continue;
          }
        } else {
          // For non-recurring tasks, log and delete the task after creating the card
          logger.debug(`Non-recurring task "${task.title}" (ID: ${task.id}) completed - deleting after card creation.`);
          prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
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

