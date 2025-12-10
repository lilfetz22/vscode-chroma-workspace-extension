import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { getDb, getAllBoards, prepare, getTagsByCardId } from '../database';
import { getSettingsService } from './SettingsService';
import { Card } from '../models/Card';
import { Board } from '../models/Board';
import { Column } from '../models/Column';

export interface CompletedCard {
    id: string;
    title: string;
    content: string | null;
    recurrence: string | null;
    tags: string[];
    completed_at: string;
    created_at: string;
}

export interface GroupedCard {
    title: string;
    content: string | null;
    recurrence: string | null;
    tags: string[];
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
    const settings = getSettingsService().getExportSettings();
    const defaultMonths = settings.defaultDateRangeMonths;
    
    return [
        { label: 'Last 3 Months', value: '3months' },
        { label: 'Last 6 Months', value: '6months' },
        { label: 'Last 12 Months', value: '12months' },
        { label: `Last ${defaultMonths} Months (Default)`, value: 'default' },
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

    const settings = getSettingsService().getExportSettings();

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
        case 'default':
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - settings.defaultDateRangeMonths);
            startDate.setHours(0, 0, 0, 0);
            return { startDate, endDate, label: `Last ${settings.defaultDateRangeMonths} Months` };
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
 * Fetch completed cards from a specific board's completion column within a date range
 */
export function getCompletedCards(boardId: string, startDate: Date, endDate: Date): CompletedCard[] {
    // Get the completion column name from settings
    const settings = getSettingsService().getKanbanSettings();
    const completionColumnName = settings.completionColumn;
    
    // Find the completion column for this board
    const columnsQuery = 'SELECT * FROM columns WHERE board_id = ? ORDER BY position';
    const columns = prepare(columnsQuery).all(boardId);
    const completionColumn = columns.find((col: any) => 
        col.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim()
    );
    
    if (!completionColumn) {
        return [];
    }
    
    // Query cards from the completion column with date filtering
    // Return all individual completions, not pre-grouped
    const query = `
        SELECT 
            id,
            title,
            content,
            recurrence,
            completed_at,
            created_at
        FROM cards
        WHERE column_id = ?
        AND completed_at IS NOT NULL
        AND completed_at >= ?
        AND completed_at <= ?
        ORDER BY completed_at DESC
    `;
    
    const startDateStr = startDate.toISOString();
    const endDateStr = endDate.toISOString();
    
    const cards = prepare(query).all(completionColumn.id, startDateStr, endDateStr) as CompletedCard[];

    // Attach tags for each card
    return cards.map((card) => ({
        ...card,
        tags: (getTagsByCardId(card.id) || []).map(t => t.name)
    }));
}

/**
 * Group recurring cards together by title, content, and recurrence
 * Groups cards with the same title, description, and recurrence pattern
 * and returns aggregated data (count, min/max dates, merged tags)
 */
export function groupRecurringCards(cards: CompletedCard[]): (CompletedCard | GroupedCard)[] {
    const settings = getSettingsService().getExportSettings();
    
    // If grouping is disabled, return cards as-is
    if (!settings.groupRecurringTasks) {
        return cards;
    }
    
    // Group by title + content + recurrence
    const groups = new Map<string, CompletedCard[]>();
    
    for (const card of cards) {
        // Create a unique key based on title, content, and recurrence
        const key = `${card.title}|${card.content || ''}|${card.recurrence || ''}`;
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key)!.push(card);
    }
    
    // Convert groups to result, grouping if count > 1
    const result: (CompletedCard | GroupedCard)[] = [];
    
    for (const group of groups.values()) {
        if (group.length > 1) {
            // Multiple completions - aggregate them
            const sortedGroup = [...group].sort((a, b) => 
                new Date(a.completed_at).getTime() - new Date(b.completed_at).getTime()
            );
            
            // Merge unique tags from all cards in group
            const uniqueTags = Array.from(
                new Set(group.flatMap(g => g.tags || []))
            ).sort();
            
            result.push({
                title: group[0].title,
                content: group[0].content,
                recurrence: group[0].recurrence,
                tags: uniqueTags,
                count: group.length,
                firstCompleted: sortedGroup[0].completed_at,
                lastCompleted: sortedGroup[sortedGroup.length - 1].completed_at
            });
        } else {
            // Single completion - keep as individual card
            result.push(group[0]);
        }
    }

    return result;
}

/**
 * Check if item is a grouped card
 */
export function isGroupedCard(item: CompletedCard | GroupedCard): item is GroupedCard {
    return 'count' in item;
}

/**
 * Convert cards to CSV format
 */
export function convertToCSV(cards: (CompletedCard | GroupedCard)[]): string {
    const settings = getSettingsService().getExportSettings();
    const includeDescriptions = settings.includeDescriptions;
    
    const headers = includeDescriptions 
        ? ['Title', 'Description', 'Tags', 'Recurrence', 'Count', 'Completed Date', 'Date Range']
        : ['Title', 'Tags', 'Recurrence', 'Count', 'Completed Date', 'Date Range'];
    const rows: string[][] = [headers];

    for (const card of cards) {
        if (isGroupedCard(card)) {
            const row = [
                escapeCSV(card.title),
            ];
            if (includeDescriptions) {
                row.push(escapeCSV(card.content || ''));
            }
            row.push(escapeCSV((card.tags || []).join('; ')));
            row.push(
                escapeCSV(card.recurrence || ''),
                card.count.toString(),
                formatDate(card.lastCompleted),
                `${formatDate(card.firstCompleted)} - ${formatDate(card.lastCompleted)}`
            );
            rows.push(row);
        } else {
            const row = [
                escapeCSV(card.title),
            ];
            if (includeDescriptions) {
                row.push(escapeCSV(card.content || ''));
            }
            row.push(escapeCSV((card.tags || []).join('; ')));
            row.push(
                escapeCSV(card.recurrence || ''),
                '1',
                formatDate(card.completed_at),
                formatDate(card.completed_at)
            );
            rows.push(row);
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
        // Step 1: Get all boards
        const boards = getAllBoards();
        
        if (boards.length === 0) {
            vscode.window.showInformationMessage('No boards found. Please create a board first.');
            return;
        }

        // Step 2: If multiple boards, let user select one
        let selectedBoard: Board;
        if (boards.length === 1) {
            selectedBoard = boards[0];
        } else {
            const boardItems = boards.map(board => ({
                label: board.title,
                description: `Board ID: ${board.id}`,
                board: board
            }));

            const selectedItem = await vscode.window.showQuickPick(
                boardItems,
                {
                    placeHolder: 'Select a board to export accomplishments from'
                }
            );

            if (!selectedItem) {
                return; // User cancelled
            }

            selectedBoard = selectedItem.board;
        }

        // Step 3: Select date range
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

        // Step 4: Fetch completed cards from the selected board
        const completedCards = getCompletedCards(selectedBoard.id, dateRange.startDate, dateRange.endDate);

        if (completedCards.length === 0) {
            const settings = getSettingsService().getKanbanSettings();
            vscode.window.showInformationMessage(
                `No completed cards found in "${settings.completionColumn}" column for ${dateRange.label}`
            );
            return;
        }

        // Step 5: Group recurring cards
        const groupedCards = groupRecurringCards(completedCards);

        // Step 6: Convert to CSV
        const csvContent = convertToCSV(groupedCards);

        // Step 7: Prompt for save location
        // Use workspace folder if available, otherwise use user's Documents folder
        const defaultFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || 
                             path.join(os.homedir(), 'Documents');
        
        const boardNameSafe = selectedBoard.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'board';
        const defaultFilename = `${boardNameSafe}_accomplishments_${dateRange.startDate.toISOString().split('T')[0]}_to_${dateRange.endDate.toISOString().split('T')[0]}.csv`;
        
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri: vscode.Uri.file(path.join(defaultFolder, defaultFilename)),
            filters: {
                'CSV Files': ['csv'],
                'All Files': ['*']
            }
        });

        if (!saveUri) {
            return; // User cancelled save dialog
        }

        // Step 8: Write file
        fs.writeFileSync(saveUri.fsPath, csvContent, 'utf8');

        // Step 9: Success notification with action to open file
        const action = await vscode.window.showInformationMessage(
            `Successfully exported ${completedCards.length} card${completedCards.length !== 1 ? 's' : ''} (${groupedCards.length} row${groupedCards.length !== 1 ? 's' : ''}) from "${selectedBoard.title}" to ${path.basename(saveUri.fsPath)}`,
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
