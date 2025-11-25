import * as vscode from 'vscode';
import { Task } from '../models/Task';
import { getDb, getTagsByTaskId } from '../database';

export class TaskProvider implements vscode.TreeDataProvider<Task | TaskGroup> {
  private _onDidChangeTreeData: vscode.EventEmitter<Task | TaskGroup | undefined | null | void> = new vscode.EventEmitter<Task | TaskGroup | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<Task | TaskGroup | undefined | null | void> = this._onDidChangeTreeData.event;

  constructor() {}

  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: Task | TaskGroup): vscode.TreeItem {
    if (isTaskGroup(element)) {
        return new TaskGroupItem(element.label, element.tasks.length);
    } else {
        return new TaskItem(element);
    }
  }

  getChildren(element?: Task | TaskGroup): Thenable<(Task | TaskGroup)[]> {
    if (element) {
        if (isTaskGroup(element)) {
            return Promise.resolve(element.tasks);
        } else {
            return Promise.resolve([]);
        }
    } else {
      return Promise.resolve(this.getGroupedTasks());
    }
  }

  private async getGroupedTasks(): Promise<TaskGroup[]> {
    const db = getDb();
    const tasks: Task[] = db.prepare('SELECT id, title, description, due_date as dueDate, recurrence, status, card_id as cardId, created_at as createdAt, updated_at as updatedAt FROM tasks WHERE status = ? ORDER BY due_date ASC').all('pending') as Task[];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

    const overdue: Task[] = [];
    const todayTasks: Task[] = [];
    const thisWeekTasks: Task[] = [];
    const futureTasks: Task[] = [];

    for (const task of tasks) {
      const dueDate = new Date(task.dueDate);
      if (dueDate < today) {
        overdue.push(task);
      } else if (dueDate >= today && dueDate < tomorrow) {
        todayTasks.push(task);
      } else if (dueDate > today && dueDate <= endOfWeek) {
        thisWeekTasks.push(task);
      } else {
        futureTasks.push(task);
      }
    }

    const groups: TaskGroup[] = [];
    if (overdue.length > 0) {
      groups.push({ label: 'Overdue', tasks: overdue });
    }
    if (todayTasks.length > 0) {
      groups.push({ label: 'Today', tasks: todayTasks });
    }
    if (thisWeekTasks.length > 0) {
      groups.push({ label: 'This Week', tasks: thisWeekTasks });
    }
    if (futureTasks.length > 0) {
      groups.push({ label: 'Future', tasks: futureTasks });
    }

    return groups;
  }
}

interface TaskGroup {
    label: string;
    tasks: Task[];
}

function isTaskGroup(item: any): item is TaskGroup {
    return item && item.label && Array.isArray(item.tasks);
}


class TaskItem extends vscode.TreeItem {
    constructor(public readonly task: Task) {
        // Get tags for this task
        const tags = getTagsByTaskId(task.id);
        const tagString = tags.length > 0 ? tags.map(t => `#${t.name}`).join(' ') : '';
        
        // Construct label with tags
        const label = tagString ? `${task.title} ${tagString}` : task.title;
        
        super(label, vscode.TreeItemCollapsibleState.None);
        this.contextValue = "task";
        this.description = new Date(task.dueDate).toLocaleDateString();
    const parts: string[] = [`Due: ${new Date(task.dueDate).toLocaleString()}`];
    if (task.recurrence) {
      const recurrenceLabel = task.recurrence.charAt(0).toUpperCase() + task.recurrence.slice(1);
      parts.push(`Recurrence: ${recurrenceLabel}`);
    }
    if (task.description && task.description.trim().length > 0) {
      parts.push('', 'Content:', task.description);
    }
    this.tooltip = parts.join('\n');
    }
}

class TaskGroupItem extends vscode.TreeItem {
    constructor(public readonly label: string, private count: number) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
        this.description = `(${count})`;
    }
}
