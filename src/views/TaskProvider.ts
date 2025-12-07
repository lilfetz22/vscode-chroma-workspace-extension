import * as vscode from 'vscode';
import { Task } from '../models/Task';
import { getDb, prepare, getTagsByTaskId } from '../database';
import { ensureSingleColorIcon } from '../utils/tagIcons';
import { generateTagCompositeIcon } from '../utils/tagIcons';
import { getRecurrenceLabel } from '../logic/Recurrence';
import { splitLongText } from '../utils/treeItemHelpers';

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
        // element is a Task: return tags as children
        const tags = getTagsByTaskId((element as Task).id) || [];
        const items = tags.map(tag => {
          const item = new vscode.TreeItem(`#${tag.name}`, vscode.TreeItemCollapsibleState.None);
          item.contextValue = 'task-tag';
          try {
            item.iconPath = ensureSingleColorIcon(tag.color);
          } catch {}
          return item;
        });
        return Promise.resolve(items as any);
        }
    } else {
      return Promise.resolve(this.getGroupedTasks());
    }
  }

  private async getGroupedTasks(): Promise<TaskGroup[]> {
    const db = getDb();
    const tasks: Task[] = prepare('SELECT id, title, description, due_date as dueDate, recurrence, status, card_id as cardId, created_at as createdAt, updated_at as updatedAt FROM tasks WHERE status = ? ORDER BY due_date ASC').all('pending') as Task[];
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
        const { label, description: overflowText } = splitLongText(task.title);
        
        super(label, vscode.TreeItemCollapsibleState.None);
        this.contextValue = "task";
        
        // Combine overflow text and date in description
        const datePart = new Date(task.dueDate).toLocaleDateString();
        if (overflowText) {
            this.description = `${overflowText} (${datePart})`;
        } else {
            this.description = datePart;
        }
        
        // No composite icon; tags will be children with colored icons
        const parts: string[] = [];
        if (overflowText) {
            parts.push(`Title: ${task.title}`);
            parts.push('');
        }
        parts.push(`Due: ${new Date(task.dueDate).toLocaleString()}`);
        if (task.recurrence) {
            parts.push(`Recurrence: ${getRecurrenceLabel(task.recurrence)}`);
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

