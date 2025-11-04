import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../database';

export interface CompletedTask {
    id: string;
    title: string;
    description: string | null;
    due_date: string;
    recurrence: string | null;
    completed_at: string;
    created_at: string;
}

export interface GroupedTask {
    title: string;
    description: string | null;
    recurrence: string | null;
    count: number;
    firstCompleted: string;
    lastCompleted: string;
}

export interface DateRange {
    startDate: Date;
    endDate: Date;
    label: string;
}

/**
 * Get predefined date ranges for quick selection
 */
export function getDateRangeOptions(): { label: string; value: string }[] {
    return [
        { label: 'Last 3 Months', value: '3months' },
        { label: 'Last 6 Months', value: '6months' },
        { label: 'Last 12 Months', value: '12months' },
        { label: 'Custom Range', value: 'custom' }
    ];
}

/**
 * Calculate date range based on option selected
 */
export function calculateDateRange(option: string): DateRange | null {
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);
    let startDate: Date;

    switch (option) {
        case '3months':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 3);
            startDate.setHours(0, 0, 0, 0);
            return { startDate, endDate, label: 'Last 3 Months' };
        case '6months':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 6);
            startDate.setHours(0, 0, 0, 0);
            return { startDate, endDate, label: 'Last 6 Months' };
        case '12months':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 12);
            startDate.setHours(0, 0, 0, 0);
            return { startDate, endDate, label: 'Last 12 Months' };
        case 'custom':
            return null; // Will prompt user for custom dates
        default:
            return null;
    }
}

/**
 * Prompt user for custom date range
 */
export async function promptCustomDateRange(): Promise<DateRange | null> {
    const startDateStr = await vscode.window.showInputBox({
        prompt: 'Enter start date (YYYY-MM-DD)',
        placeHolder: '2024-01-01',
        validateInput: (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return 'Invalid date format. Use YYYY-MM-DD';
            }
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            return null;
        }
    });

    if (!startDateStr) {
        return null;
    }

    const endDateStr = await vscode.window.showInputBox({
        prompt: 'Enter end date (YYYY-MM-DD)',
        placeHolder: new Date().toISOString().split('T')[0],
        validateInput: (value) => {
            if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                return 'Invalid date format. Use YYYY-MM-DD';
            }
            const date = new Date(value);
            if (isNaN(date.getTime())) {
                return 'Invalid date';
            }
            const startDate = new Date(startDateStr);
            if (date < startDate) {
                return 'End date must be after start date';
            }
            return null;
        }
    });

    if (!endDateStr) {
        return null;
    }

    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    return {
        startDate,
        endDate,
        label: `${startDateStr} to ${endDateStr}`
    };
}

/**
 * Fetch completed tasks within a date range
 */
export function getCompletedTasks(startDate: Date, endDate: Date, dbInstance?: any): CompletedTask[] {
    const db = dbInstance || getDb();
    
    const query = `
        SELECT 
            id,
            title,
            description,
            due_date,
            recurrence,
            updated_at as completed_at,
            created_at
        FROM tasks
        WHERE status = 'completed'
        AND updated_at >= ?
        AND updated_at <= ?
        ORDER BY updated_at DESC
    `;
    
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    
    const tasks = db.prepare(query).all(startDateStr, endDateStr) as CompletedTask[];
    return tasks;
}

/**
 * Group recurring tasks together for cleaner export
 */
export function groupRecurringTasks(tasks: CompletedTask[]): (CompletedTask | GroupedTask)[] {
    const recurringGroups = new Map<string, CompletedTask[]>();
    const nonRecurringTasks: CompletedTask[] = [];

    // Separate recurring and non-recurring tasks
    for (const task of tasks) {
        if (task.recurrence) {
            // Use title + recurrence as the group key
            const key = `${task.title}|${task.recurrence}`;
            if (!recurringGroups.has(key)) {
                recurringGroups.set(key, []);
            }
            recurringGroups.get(key)!.push(task);
        } else {
            nonRecurringTasks.push(task);
        }
    }

    // Create grouped results
    const result: (CompletedTask | GroupedTask)[] = [];

    // Add grouped recurring tasks
    for (const [, group] of recurringGroups) {
        if (group.length > 1) {
            // Group multiple completions
            const sortedGroup = [...group].sort((a, b) => 
                new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
            );
            
            result.push({
                title: group[0].title,
                description: group[0].description,
                recurrence: group[0].recurrence,
                count: group.length,
                firstCompleted: sortedGroup[0].completed_at,
                lastCompleted: sortedGroup[sortedGroup.length - 1].completed_at
            });
        } else {
            // Single completion, treat as regular task
            result.push(group[0]);
        }
    }

    // Add non-recurring tasks
    result.push(...nonRecurringTasks);

    return result;
}

/**
 * Check if item is a grouped task
 */
export function isGroupedTask(item: CompletedTask | GroupedTask): item is GroupedTask {
    return 'count' in item;
}

/**
 * Convert tasks to CSV format
 */
export function convertToCSV(tasks: (CompletedTask | GroupedTask)[]): string {
    const headers = ['Title', 'Description', 'Recurrence', 'Count', 'Completed Date', 'Date Range'];
    const rows: string[][] = [headers];

    for (const task of tasks) {
        if (isGroupedTask(task)) {
            rows.push([
                escapeCSV(task.title),
                escapeCSV(task.description || ''),
                escapeCSV(task.recurrence || ''),
                task.count.toString(),
                formatDate(task.lastCompleted),
                `${formatDate(task.firstCompleted)} - ${formatDate(task.lastCompleted)}`
            ]);
        } else {
            rows.push([
                escapeCSV(task.title),
                escapeCSV(task.description || ''),
                escapeCSV(task.recurrence || ''),
                '1',
                formatDate(task.completed_at),
                formatDate(task.completed_at)
            ]);
        }
    }

    return rows.map(row => row.join(',')).join('\n');
}

/**
 * Escape special characters in CSV values
 */
function escapeCSV(value: string): string {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}

/**
 * Format date for display
 */
function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * Main export function
 */
export async function exportAccomplishments(): Promise<void> {
    try {
        // Step 1: Select date range
        const dateRangeOptions = getDateRangeOptions();
        const selected = await vscode.window.showQuickPick(
            dateRangeOptions,
            {
                placeHolder: 'Select date range for accomplishments export'
            }
        );

        if (!selected) {
            return; // User cancelled
        }

        let dateRange: DateRange | null = null;

        if (selected.value === 'custom') {
            dateRange = await promptCustomDateRange();
            if (!dateRange) {
                return; // User cancelled custom date selection
            }
        } else {
            dateRange = calculateDateRange(selected.value);
            if (!dateRange) {
                vscode.window.showErrorMessage('Invalid date range selected');
                return;
            }
        }

        // Step 2: Fetch completed tasks
        const completedTasks = getCompletedTasks(dateRange.startDate, dateRange.endDate);

        if (completedTasks.length === 0) {
            vscode.window.showInformationMessage(
                `No completed tasks found for ${dateRange.label}`
            );
            return;
        }

        // Step 3: Group recurring tasks
        const groupedTasks = groupRecurringTasks(completedTasks);

        // Step 4: Convert to CSV
        const csvContent = convertToCSV(groupedTasks);

        // Step 5: Prompt for save location
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(
                path.join(
                    vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || process.cwd(),
                    `accomplishments_${dateRange.startDate.toISOString().split('T')[0]}_to_${dateRange.endDate.toISOString().split('T')[0]}.csv`
                )
            ),
            filters: {
                'CSV Files': ['csv'],
                'All Files': ['*']
            }
        });

        if (!saveUri) {
            return; // User cancelled save dialog
        }

        // Step 6: Write file
        fs.writeFileSync(saveUri.fsPath, csvContent, 'utf8');

        // Step 7: Success notification with action to open file
        const action = await vscode.window.showInformationMessage(
            `Successfully exported ${completedTasks.length} task${completedTasks.length !== 1 ? 's' : ''} (${groupedTasks.length} row${groupedTasks.length !== 1 ? 's' : ''}) to ${path.basename(saveUri.fsPath)}`,
            'Open File'
        );

        if (action === 'Open File') {
            const doc = await vscode.workspace.openTextDocument(saveUri);
            await vscode.window.showTextDocument(doc);
        }

    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to export accomplishments: ${error.message}`);
        console.error('Export accomplishments error:', error);
    }
}
