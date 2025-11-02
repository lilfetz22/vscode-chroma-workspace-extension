import * as vscode from 'vscode';
import { Task } from '../models/Task';
import { getDb } from '../database';

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
    const tasks: Task[] = db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY dueDate ASC').all('pending') as Task[];
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
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
      } else if (dueDate >= today && dueDate < new Date(today.getTime() + 24 * 60 * 60 * 1000)) {
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
        super(task.title, vscode.TreeItemCollapsibleState.None);
        this.description = new Date(task.dueDate).toLocaleDateString();
        this.tooltip = `Due: ${new Date(task.dueDate).toLocaleString()}`;
    }
}

class TaskGroupItem extends vscode.TreeItem {
    constructor(public readonly label: string, private count: number) {
        super(label, vscode.TreeItemCollapsibleState.Expanded);
        this.description = `(${count})`;
    }
}
