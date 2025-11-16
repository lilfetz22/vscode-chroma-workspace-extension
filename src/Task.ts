import * as vscode from 'vscode';
import { getDb } from './database';
import { v4 as uuidv4 } from 'uuid';

type Card = any;
type Task = any;

function pad2(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

function formatYMD(date: Date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

async function pickDueDate(initialDate?: Date): Promise<string | undefined> {
    const qp = vscode.window.createQuickPick();
    qp.matchOnDescription = true;
    qp.ignoreFocusOut = true;
    qp.title = 'Pick due date';
    qp.placeholder = 'Choose a quick option, then confirm/edit';

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
    const nextWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);

    const items: vscode.QuickPickItem[] = [
        { label: 'Today', description: formatYMD(today) },
        { label: 'Tomorrow', description: formatYMD(tomorrow) },
        { label: 'Next Week', description: formatYMD(nextWeek) },
        { label: 'Manual entry…', description: 'Type a date (YYYY-MM-DD)' }
    ];
    qp.items = items;

    // Preselect Today
    qp.activeItems = [items[0]];

    return await new Promise<string | undefined>((resolve) => {
        let accepted = false;
        const acceptSub = qp.onDidAccept(async () => {
            accepted = true;
            const sel = qp.selectedItems[0];
            let prefill: string;
            if (sel?.label.startsWith('Manual')) {
                prefill = initialDate ? formatYMD(initialDate) : formatYMD(today);
            } else {
                prefill = sel?.description || formatYMD(today);
            }
            // Avoid racing with onDidHide resolution; dispose after input

            const confirmed = await vscode.window.showInputBox({
                prompt: 'Confirm due date (YYYY-MM-DD)',
                value: prefill,
                ignoreFocusOut: true,
                validateInput: text => (/^\d{4}-\d{2}-\d{2}$/.test(text) ? null : 'Invalid date format')
            });
            qp.dispose();
            resolve(confirmed || undefined);
        });

        const hideSub = qp.onDidHide(() => {
            acceptSub.dispose();
            hideSub.dispose();
            qp.dispose();
            if (!accepted) {
                resolve(undefined);
            }
        });

        qp.show();
    });
}

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

    const dueDate = await pickDueDate();

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

    const dueDate = await pickDueDate();

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

    const initial = new Date(task.dueDate);
    const dueDate = await pickDueDate(initial);

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
