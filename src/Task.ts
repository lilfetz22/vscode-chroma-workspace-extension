import * as vscode from 'vscode';
import { getDb } from './database';
import { v4 as uuidv4 } from 'uuid';

type Card = any;
type Task = any;

export async function convertCardToTask(card: Card) {
    if (!card) {
        vscode.window.showErrorMessage('No card selected.');
        return;
    }

    const title = await vscode.window.showInputBox({
        prompt: 'Enter task title',
        value: card.title,
    });

    if (!title) {
        return;
    }

    const dueDate = await vscode.window.showInputBox({
        prompt: 'Enter due date (YYYY-MM-DD)',
        validateInput: text => {
            return /^\d{4}-\d{2}-\d{2}$/.test(text) ? null : 'Invalid date format';
        }
    });

    if (!dueDate) {
        return;
    }

    const recurrence = await vscode.window.showQuickPick(['daily', 'weekly', 'monthly', 'yearly'], {
        placeHolder: 'Select recurrence (optional)',
    });

    try {
        const db = getDb();
        const id = uuidv4();
        db.prepare('INSERT INTO tasks (id, title, description, due_date, recurrence, card_id) VALUES (?, ?, ?, ?, ?, ?)')
          .run(id, title, card.content, dueDate, recurrence || null, card.id);
        vscode.window.showInformationMessage('Card converted to task.');
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to convert card to task: ' + err.message);
    }
}

export async function addTask() {
    const title = await vscode.window.showInputBox({
        prompt: 'Enter task title',
    });

    if (!title) {
        return;
    }

    const dueDate = await vscode.window.showInputBox({
        prompt: 'Enter due date (YYYY-MM-DD)',
        validateInput: text => {
            return /^\d{4}-\d{2}-\d{2}$/.test(text) ? null : 'Invalid date format';
        }
    });

    if (!dueDate) {
        return;
    }

    const recurrence = await vscode.window.showQuickPick(['daily', 'weekly', 'monthly', 'yearly'], {
        placeHolder: 'Select recurrence (optional)',
    });

    try {
        const db = getDb();
        const id = uuidv4();
        db.prepare('INSERT INTO tasks (id, title, due_date, recurrence) VALUES (?, ?, ?, ?)')
          .run(id, title, dueDate, recurrence || null);
        vscode.window.showInformationMessage('Task added.');
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to add task: ' + err.message);
    }
}

export async function editTask(task: Task) {
    if (!task) {
        vscode.window.showErrorMessage('No task selected.');
        return;
    }

    const title = await vscode.window.showInputBox({
        prompt: 'Enter task title',
        value: task.title,
    });

    if (!title) {
        return;
    }

    const dueDate = await vscode.window.showInputBox({
        prompt: 'Enter due date (YYYY-MM-DD)',
        value: new Date(task.dueDate).toISOString().split('T')[0],
        validateInput: text => {
            return /^\d{4}-\d{2}-\d{2}$/.test(text) ? null : 'Invalid date format';
        }
    });

    if (!dueDate) {
        return;
    }

    const recurrence = await vscode.window.showQuickPick(['daily', 'weekly', 'monthly', 'yearly'], {
        placeHolder: 'Select recurrence (optional)',
    });

    try {
        const db = getDb();
        db.prepare('UPDATE tasks SET title = ?, due_date = ?, recurrence = ? WHERE id = ?')
          .run(title, dueDate, recurrence || null, task.id);
        vscode.window.showInformationMessage('Task updated.');
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to update task: ' + err.message);
    }
}

export async function completeTask(task: Task) {
    if (!task) {
        vscode.window.showErrorMessage('No task selected.');
        return;
    }

    try {
        const db = getDb();
        db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('completed', task.id);
        vscode.window.showInformationMessage('Task completed.');
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to complete task: ' + err.message);
    }
}

export async function deleteTask(task: Task) {
    if (!task) {
        vscode.window.showErrorMessage('No task selected.');
        return;
    }

    try {
        const db = getDb();
        db.prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
        vscode.window.showInformationMessage('Task deleted.');
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to delete task: ' + err.message);
    }
}
