import * as vscode from 'vscode';
import { getDb, prepare, addTagToTask, removeTagFromTask, getTagsByTaskId, getTagsByCardId, getAllBoards, saveDatabase, createCard, getColumnsByBoardId, createBoard, createColumn, addTagToCard, copyTaskTagsToCard, reorderCardsOnInsert, getColumnById, getCardById } from './database';
import { v4 as uuidv4 } from 'uuid';
import { selectOrCreateTags } from '../vscode/Tag';
import { getSettingsService } from './logic/SettingsService';
import { getNextDueDate } from './logic/Recurrence';
import { Logger } from './logic/Logger';

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

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function pickDaysOfWeek(preselectedDays?: number[]): Promise<number[] | undefined> {
    const items: vscode.QuickPickItem[] = DAY_NAMES.map((day, index) => ({
        label: day,
        picked: preselectedDays?.includes(index) || false
    }));

    const selected = await vscode.window.showQuickPick(items, {
        canPickMany: true,
        placeHolder: 'Select days of the week (at least one required)',
        ignoreFocusOut: true
    });

    if (!selected || selected.length === 0) {
        return undefined;
    }

    return selected.map(item => DAY_NAMES.indexOf(item.label));
}

interface RecurrenceResult {
    value: string | null;
    label: string;
}

async function pickRecurrence(currentRecurrence?: string | null): Promise<RecurrenceResult | undefined> {
    // Parse current recurrence to preselect in UI
    let currentType = currentRecurrence;
    let currentDays: number[] | undefined;
    
    if (currentRecurrence?.startsWith('custom_weekly:')) {
        currentType = 'custom_weekly';
        currentDays = currentRecurrence.split(':')[1].split(',').map(Number);
    }

    const recurrenceOptions: vscode.QuickPickItem[] = [
        { label: 'Once', description: 'No recurrence' },
        { label: 'Daily', description: 'Every day' },
        { label: 'Weekdays', description: 'Monday through Friday' },
        { label: 'Weekly', description: 'Same day each week' },
        { label: 'Bi-weekly', description: 'Every two weeks' },
        { label: 'Custom Weekly', description: 'Choose specific days' },
        { label: 'Monthly', description: 'Same date each month' },
        { label: 'Yearly', description: 'Same date each year' }
    ];

    const selected = await vscode.window.showQuickPick(recurrenceOptions, {
        placeHolder: 'Select recurrence pattern',
        ignoreFocusOut: true
    });

    if (!selected) {
        return undefined;
    }

    switch (selected.label) {
        case 'Once':
            return { value: null, label: 'Once' };
        case 'Daily':
            return { value: 'daily', label: 'Daily' };
        case 'Weekdays':
            return { value: 'weekdays', label: 'Weekdays' };
        case 'Weekly':
            return { value: 'weekly', label: 'Weekly' };
        case 'Bi-weekly':
            return { value: 'bi-weekly', label: 'Bi-weekly' };
        case 'Monthly':
            return { value: 'monthly', label: 'Monthly' };
        case 'Yearly':
            return { value: 'yearly', label: 'Yearly' };
        case 'Custom Weekly': {
            const days = await pickDaysOfWeek(currentDays);
            if (!days || days.length === 0) {
                vscode.window.showWarningMessage('Custom weekly requires at least one day selected.');
                return undefined;
            }
            const dayNames = days.map(d => DAY_NAMES[d].substring(0, 3)).join(', ');
            return { value: `custom_weekly:${days.join(',')}`, label: `Custom Weekly (${dayNames})` };
        }
        default:
            return undefined;
    }
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

    // Normalize card ID (handle both Card objects and TreeItem objects)
    const cardId = card.id || (card as any).cardId;
    if (!cardId) {
        vscode.window.showErrorMessage('Invalid card: missing ID.');
        return;
    }

    // Fetch the full card so we have canonical title/content/board information (TreeItems omit these)
    const sourceCard = getCardById(cardId);
    if (!sourceCard) {
        vscode.window.showErrorMessage('Card not found in database.');
        return;
    }

    const defaultTitle = sourceCard.title || (card as any).title || (card as any).label || '';
    const description = sourceCard.content ?? (card as any).content ?? null;
    const boardId = (card as any).boardId || getColumnById(sourceCard.column_id)?.board_id || null;

    const title = await vscode.window.showInputBox({
        prompt: 'Enter task title',
        value: defaultTitle,
    });

    if (!title) {
        return;
    }

    const dueDate = await pickDueDate();

    if (!dueDate) {
        return;
    }

    const recurrence = await pickRecurrence();
    if (recurrence === undefined) {
        return;
    }

    try {
        const db = getDb();
        const id = uuidv4();
        prepare('INSERT INTO tasks (id, title, description, due_date, recurrence, card_id, board_id) VALUES (?, ?, ?, ?, ?, ?, ?)')
            .run(id, title, description, dueDate, recurrence.value, cardId, boardId);
        
        // Copy tags from the card to the task
        const cardTagIds = getTagsByCardId(cardId).map(t => t.id);
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
        saveDatabase();
    } catch (err: any) {
        const message = err?.message ?? String(err);
        vscode.window.showErrorMessage('Failed to convert card to task: ' + message);
        Logger.getInstance().error('Error converting card to task:', err);
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

    const recurrence = await pickRecurrence();
    if (recurrence === undefined) {
        return;
    }

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
        prepare('INSERT INTO tasks (id, title, description, due_date, recurrence, board_id) VALUES (?, ?, ?, ?, ?, ?)')
            .run(id, title, description || null, dueDate, recurrence.value, boardId);
        
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
        saveDatabase();
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

    const recurrence = await pickRecurrence(task.recurrence);
    if (recurrence === undefined) {
        return;
    }

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
        prepare('UPDATE tasks SET title = ?, description = ?, due_date = ?, recurrence = ?, board_id = ? WHERE id = ?')
          .run(title, description !== undefined ? description : task.description || null, dueDate, recurrence.value, boardId, task.id);
        // Integrated tag editing flow
        const existingTags = getTagsByTaskId(task.id);
        const existingTagIds = existingTags.map(t => t.id);
        const selectedTagIds = await selectOrCreateTags();
        if (selectedTagIds !== undefined) {
            const toAdd = selectedTagIds.filter(id => !existingTagIds.includes(id));
            const toRemove = existingTagIds.filter(id => !selectedTagIds.includes(id));
            for (const tagId of toAdd) {
                try { addTagToTask(task.id, tagId); } catch (err: any) { console.error(`Failed to add tag ${tagId} to task ${task.id}:`, err); }
            }
            for (const tagId of toRemove) {
                try { removeTagFromTask(task.id, tagId); } catch (err: any) { console.error(`Failed to remove tag ${tagId} from task ${task.id}:`, err); }
            }
        }
        vscode.window.showInformationMessage('Task updated.');
        saveDatabase();
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to update task: ' + err.message);
    }
}

/**
 * Internal helper to create a card from a task
 * This is called both from manual conversion and automatic scheduling
 * Returns the created card or null if creation failed
 */
export async function createCardFromTask(task: Task, isManualConversion: boolean = false): Promise<any> {
    try {
        const logger = Logger.getInstance();
        const settings = getSettingsService().getKanbanSettings();
        
        // Determine the target column
        const boards = getAllBoards();
        let targetColumnId: string | null = null;
        
        if (boards.length === 0) {
            // No boards exist, create a default one
            const newBoard = createBoard({ title: 'My Board' });
            const column = createColumn({ title: settings.taskCreationColumn, board_id: newBoard.id, position: 0 });
            targetColumnId = column.id;
        } else {
            // Use the specified board_id if provided, otherwise use the first board
            let targetBoard = task.boardId ? boards.find((b: any) => b.id === task.boardId) : undefined;
            if (!targetBoard) {
                targetBoard = boards[0];
            }
            
            const columns = getColumnsByBoardId(targetBoard.id);
            
            // Look for the task creation column
            const todoColumn = columns.find((col: any) => col.title.toLowerCase() === settings.taskCreationColumn.toLowerCase());
            if (todoColumn) {
                targetColumnId = todoColumn.id;
            } else {
                // If the configured column doesn't exist, create one at the beginning
                const column = createColumn({ title: settings.taskCreationColumn, board_id: targetBoard.id, position: 0 });
                targetColumnId = column.id;
            }
        }
        
        if (!targetColumnId) {
            logger.error(`Failed to determine target column for task ${task.id}`);
            return null;
        }
        
        // Get the column to check if it's a completion column
        const targetColumn = getColumnById(targetColumnId);
        const completionColumnName = settings.completionColumn;
        const isCompletionColumn = targetColumn.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
        
        // For non-completion columns, reorder existing cards to make space at position 1
        if (!isCompletionColumn) {
            reorderCardsOnInsert(targetColumnId, 1);
        }
        
        // Create the card at position 1 (top of column)
        const newCard = createCard({ 
            title: task.title, 
            content: task.description || '', 
            column_id: targetColumnId, 
            position: 1, 
            card_type: 'simple', 
            priority: 0,
            converted_from_task_at: new Date().toISOString()
        });
        
        // Copy tags from task to card (bulk insert, fallback to per-tag on failure/zero rows)
        let copiedTags = 0;
        try {
            copiedTags = copyTaskTagsToCard(task.id, newCard.id);
        } catch (tagCopyError: any) {
            logger.warn(`Failed bulk tag copy for task ${task.id} -> card ${newCard.id}, falling back`, tagCopyError);
        }
        
        if (copiedTags === 0) {
            const taskTags = getTagsByTaskId(task.id);
            for (const tag of taskTags) {
                try {
                    addTagToCard(newCard.id, tag.id);
                } catch (tagError: any) {
                    logger.warn(`Failed to copy tag ${tag.id} from task ${task.id} to card ${newCard.id}`, tagError);
                }
            }
        }
        
        saveDatabase();
        return newCard;
    } catch (error) {
        Logger.getInstance().error(`Failed to create card from task ${task.id}:`, error);
        return null;
    }
}

export async function completeTask(task: Task) {
    if (!task) {
        vscode.window.showErrorMessage('No task selected.');
        return;
    }

    try {
        const db = getDb();
        prepare('UPDATE tasks SET status = ? WHERE id = ?').run('completed', task.id);
        saveDatabase();
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
        prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
        saveDatabase();
        vscode.window.showInformationMessage('Task deleted.');
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to delete task: ' + err.message);
    }
}

export async function convertTaskToCard(task: Task) {
    if (!task) {
        vscode.window.showErrorMessage('No task selected.');
        return;
    }

    try {
        const logger = Logger.getInstance();
        const newCard = await createCardFromTask(task, true);
        
        if (!newCard) {
            vscode.window.showErrorMessage('Failed to convert task to card.');
            return;
        }
        
        // For recurring tasks, calculate the next due date and update the task
        if (task.recurrence) {
            const nextDueDate = getNextDueDate(task);
            if (nextDueDate) {
                prepare('UPDATE tasks SET due_date = ? WHERE id = ?').run(nextDueDate.toISOString(), task.id);
                logger.info(`Recurring task "${task.title}" (ID: ${task.id}) converted to card. Next occurrence scheduled for ${nextDueDate.toISOString()}`);
            } else {
                // If no next due date, log warning and delete the task
                logger.warn(`Recurring task "${task.title}" (ID: ${task.id}) has no next due date after manual conversion - deleting. This may indicate an invalid recurrence pattern.`);
                prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
            }
        } else {
            // For non-recurring tasks, delete after conversion
            logger.debug(`Non-recurring task "${task.title}" (ID: ${task.id}) converted to card and deleted.`);
            prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
        }
        
        saveDatabase();
        vscode.window.showInformationMessage(`Task "${task.title}" converted to card.`);
    } catch (err: any) {
        vscode.window.showErrorMessage('Failed to convert task to card: ' + err.message);
        Logger.getInstance().error(`Error converting task ${task.id} to card:`, err);
    }
}



