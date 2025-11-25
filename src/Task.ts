import * as vscode from 'vscode';
import { getDb, addTagToTask, getTagsByCardId, getAllBoards } from './database';
import { v4 as uuidv4 } from 'uuid';
import { selectOrCreateTags } from '../vscode/Tag';

type Card = any;
type Task = any;

function pad2(n: number) {
    return n < 10 ? `0${n}` : `${n}`;
}

function formatYMD(date: Date) {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

async function pickTime(defaultTime: string = '00:00'): Promise<string | undefined> {
    const timeInput = await vscode.window.showInputBox({
        prompt: 'Enter time (HH:MM in 24-hour format)',
        value: defaultTime,
        ignoreFocusOut: true,
        validateInput: text => {
            if (!/^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(text)) {
                return 'Invalid time format. Use HH:MM (e.g., 09:30, 14:00, 00:00)';
            }
            return null;
        }
    });
    return timeInput;
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
            
            if (!confirmed) {
                resolve(undefined);
                return;
            }
            
            // Extract time from initialDate if available and date matches, else default to midnight
            let defaultTime = '00:00';
            if (initialDate && formatYMD(initialDate) === confirmed) {
                defaultTime = `${pad2(initialDate.getHours())}:${pad2(initialDate.getMinutes())}`;
            }
            
            // Now ask for time
            const time = await pickTime(defaultTime);
            if (!time) {
                resolve(undefined);
                return;
            }
            
            // Combine date and time into ISO datetime string
            // Parse as local time to avoid timezone issues
            const dateTimeStr = `${confirmed}T${time}:00`;
            resolve(dateTimeStr);
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

    const recurrence = await vscode.window.showQuickPick(['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'], {
        placeHolder: 'Select recurrence',
    });

    // Convert 'Once' to null, and lowercase other options
    const recurrenceValue = recurrence === 'Once' ? null : recurrence?.toLowerCase() || null;

    try {
        const db = getDb();
        const id = uuidv4();
        db.prepare('INSERT INTO tasks (id, title, description, due_date, recurrence, card_id) VALUES (?, ?, ?, ?, ?, ?)')
          .run(id, title, card.content, dueDate, recurrenceValue, card.id);
        
        // Copy tags from the card to the task
        const cardTagIds = getTagsByCardId(card.id || card.cardId).map(t => t.id);
        for (const tagId of cardTagIds) {
            try {
                addTagToTask(id, tagId);
            } catch (err: any) {
                console.error(`Failed to copy tag ${tagId} from card to task:`, err);
            }
        }
        
        // Ask if user wants to add more tags
        const addMoreTags = await vscode.window.showQuickPick(['Yes', 'No'], {
            placeHolder: cardTagIds.length > 0 
                ? `${cardTagIds.length} tag(s) copied from card. Add more tags?`
                : 'Add tags to this task?'
        });
        
        if (addMoreTags === 'Yes') {
            const additionalTagIds = await selectOrCreateTags();
            if (additionalTagIds && additionalTagIds.length > 0) {
                for (const tagId of additionalTagIds) {
                    // Only add if not already added from card
                    if (!cardTagIds.includes(tagId)) {
                        try {
                            addTagToTask(id, tagId);
                        } catch (err: any) {
                            console.error(`Failed to add tag ${tagId} to task ${id}:`, err);
                        }
                    }
                }
            }
        }
        
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

    const description = await vscode.window.showInputBox({
        prompt: 'Optional: Enter content/context for this task'
    });

    const dueDate = await pickDueDate();

    if (!dueDate) {
        return;
    }

    const recurrence = await vscode.window.showQuickPick(['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'], {
        placeHolder: 'Select recurrence',
    });

    // Convert 'Once' to null, and lowercase other options
    const recurrenceValue = recurrence === 'Once' ? null : recurrence?.toLowerCase() || null;

    // Check if there are multiple boards and prompt for board selection
    let boardId: string | null = null;
    const boards = getAllBoards();
    
    if (boards.length > 1) {
        const boardItems = boards.map(board => ({
            label: board.title,
            description: board.id,
            boardId: board.id
        }));
        
        const selectedBoard = await vscode.window.showQuickPick(boardItems, {
            placeHolder: 'Select which board this task should be sent to'
        });
        
        if (!selectedBoard) {
            return; // User cancelled board selection
        }
        
        boardId = selectedBoard.boardId;
    } else if (boards.length === 1) {
        // Only one board exists, use it automatically
        boardId = boards[0].id;
    }
    // If no boards exist, boardId remains null

    try {
        const db = getDb();
        const id = uuidv4();
        db.prepare('INSERT INTO tasks (id, title, description, due_date, recurrence, board_id) VALUES (?, ?, ?, ?, ?, ?)')
            .run(id, title, description || null, dueDate, recurrenceValue, boardId);
        
        // Prompt for tags
        const tagIds = await selectOrCreateTags();
        if (tagIds && tagIds.length > 0) {
            for (const tagId of tagIds) {
                try {
                    addTagToTask(id, tagId);
                } catch (err: any) {
                    console.error(`Failed to add tag ${tagId} to task ${id}:`, err);
                }
            }
        }
        
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

    const recurrence = await vscode.window.showQuickPick(['Once', 'Daily', 'Weekly', 'Monthly', 'Yearly'], {
        placeHolder: 'Select recurrence',
    });

    // Convert 'Once' to null, and lowercase other options
    const recurrenceValue = recurrence === 'Once' ? null : recurrence?.toLowerCase() || null;

    const description = await vscode.window.showInputBox({
        prompt: 'Optional: Edit content/context for this task',
        value: task.description || ''
    });

    // Check if there are multiple boards and prompt for board selection
    let boardId: string | null = task.boardId || null;
    const boards = getAllBoards();
    
    if (boards.length > 1) {
        const boardItems = boards.map(board => ({
            label: board.title,
            description: board.id,
            boardId: board.id,
            picked: board.id === task.boardId
        }));
        
        const selectedBoard = await vscode.window.showQuickPick(boardItems, {
            placeHolder: 'Select which board this task should be sent to'
        });
        
        if (!selectedBoard) {
            return; // User cancelled board selection
        }
        
        boardId = selectedBoard.boardId;
    } else if (boards.length === 1) {
        // Only one board exists, use it automatically
        boardId = boards[0].id;
    }
    // If no boards exist, boardId remains null or task's existing value

    try {
        const db = getDb();
        db.prepare('UPDATE tasks SET title = ?, description = ?, due_date = ?, recurrence = ?, board_id = ? WHERE id = ?')
          .run(title, description !== undefined ? description : task.description || null, dueDate, recurrenceValue, boardId, task.id);
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
