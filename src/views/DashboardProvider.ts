import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getAllBoards, getColumnsByBoardId, getCardsByColumnId, getAllTags, getTagsByCardId, prepare } from '../database';
import { Task } from '../models/Task';
import { getNotesFolder } from '../utils/notesFolder';
import { getSettingsService } from '../logic/SettingsService';

/**
 * Message types that can be sent from the webview
 */
interface WebviewMessage {
    type: 'getData' | 'openNote' | 'executeCommand';
    path?: string;
    command?: string;
    args?: any;
}

/**
 * Represents a note file
 */
interface NoteFile {
    name: string;
    path: string;
}

/**
 * Provider for the Dashboard webview panel
 * Displays all workspace data (Kanban, Tasks, Notes, Tags) in a standalone view
 */
export class DashboardProvider {
    private static currentPanel: vscode.WebviewPanel | undefined;
    private static readonly viewType = 'chromaDashboard';

    /**
     * Opens or focuses the dashboard panel
     */
    public static show(context: vscode.ExtensionContext): void {
        console.log('DashboardProvider.show() called');
        const column = vscode.ViewColumn.One;

        // If we already have a panel, show it
        if (DashboardProvider.currentPanel) {
            console.log('Dashboard panel already exists, revealing it');
            DashboardProvider.currentPanel.reveal(column);
            return;
        }

        // Create a new panel
        console.log('Creating new dashboard panel');
        const panel = vscode.window.createWebviewPanel(
            DashboardProvider.viewType,
            'Chroma Workspace Dashboard',
            column,
            {
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'media')]
            }
        );
        console.log('Dashboard panel created successfully');

        DashboardProvider.currentPanel = panel;

        // Set the webview's initial html content
        console.log('Setting webview HTML content');
        panel.webview.html = DashboardProvider.getWebviewContent(panel.webview, context);
        console.log('Webview HTML content set');

        // Handle messages from the webview
        console.log('Setting up message handler');
        panel.webview.onDidReceiveMessage(
            async message => {
                console.log('Dashboard received message from webview:', message.type);
                await DashboardProvider.handleMessage(message);
            },
            undefined,
            context.subscriptions
        );
        console.log('Message handler set up');

        // Reset when the panel is closed
        panel.onDidDispose(
            () => {
                DashboardProvider.currentPanel = undefined;
            },
            null,
            context.subscriptions
        );
    }

    /**
     * Refreshes the dashboard content
     */
    public static refresh(): void {
        if (DashboardProvider.currentPanel) {
            DashboardProvider.currentPanel.webview.postMessage({ type: 'refresh' });
        }
    }

    /**
     * Handles messages from the webview
     */
    private static async handleMessage(message: WebviewMessage): Promise<void> {
        console.log('handleMessage called with type:', message.type);
        try {
            switch (message.type) {
                case 'getData':
                    console.log('getData message received, calling sendData()');
                    await DashboardProvider.sendData();
                    console.log('sendData() completed');
                    break;
                case 'openNote':
                    console.log('openNote message received for path:', message.path);
                    if (message.path) {
                        const uri = vscode.Uri.file(message.path);
                        await vscode.window.showTextDocument(uri);
                    }
                    break;
                case 'executeCommand':
                    console.log('executeCommand message received for command:', message.command);
                    // Whitelist of allowed commands for security
                    const allowedCommands = [
                        'chroma.addBoard',
                        'chroma.addTask',
                        'chroma.addTag',
                        'chroma.addNote',
                        'chroma.refreshKanban',
                        'chroma.refreshTasks',
                        'chroma.refreshTags',
                        'chroma.refreshNotes',
                        'chroma.addColumn',
                        'chroma.editColumn',
                        'chroma.deleteColumn',
                        'chroma.hideColumn',
                        'chroma.showColumn',
                        'chroma.addCard',
                        'chroma.editCard',
                        'chroma.deleteCard',
                        'chroma.moveCard',
                        'chroma.convertCardToTask',
                        'chroma.editCardCompletedDate',
                        'chroma.convertTaskToCard',
                        'chroma.editTask',
                        'chroma.deleteTask'
                    ];
                    
                    if (message.command && allowedCommands.includes(message.command)) {
                        await vscode.commands.executeCommand(message.command, message.args);
                        // Refresh the dashboard after command execution
                        DashboardProvider.refresh();
                    } else if (message.command) {
                        console.warn(`Dashboard: Attempted to execute non-whitelisted command: ${message.command}`);
                    }
                    break;
            }
        } catch (error) {
            console.error('Error in handleMessage():', error);
            vscode.window.showErrorMessage(`Dashboard error: ${error}`);
        }
    }

    /**
     * Sends all workspace data to the webview
     */
    private static async sendData(): Promise<void> {
        console.log('sendData() called');
        if (!DashboardProvider.currentPanel) {
            console.error('sendData(): currentPanel is null, cannot send data');
            return;
        }

        console.log('sendData(): currentPanel exists, fetching workspace data');
        try {
            // Get settings
            const completionColumn = getSettingsService().getKanbanSettings().completionColumn;
            
            // Get all workspace data
            console.log('Fetching boards...');
            const boards = getAllBoards();
            console.log(`Fetched ${boards.length} boards`);
            
            console.log('Fetching tasks...');
            const tasks: Task[] = prepare('SELECT id, title, description, due_date as dueDate, recurrence, status, card_id as cardId, created_at as createdAt, updated_at as updatedAt FROM tasks WHERE status = ? ORDER BY due_date ASC').all('pending') as Task[];
            console.log(`Fetched ${tasks.length} tasks`);
            
            console.log('Fetching tags...');
            const tags = getAllTags();
            console.log(`Fetched ${tags.length} tags`);
            
            console.log('Fetching notes...');
            const notes = DashboardProvider.getNotes();
            console.log(`Fetched ${notes.length} notes`);

            // If there are no boards, we can skip enrichment
            let enrichedBoards: any[] = [];
            let hiddenColumnsByBoard: Map<string, any[]> = new Map();
            if (boards.length > 0) {
                const boardIds = boards.map(board => board.id);

                // Fetch all columns for all boards in a single query (excluding hidden columns)
                const boardPlaceholders = boardIds.map(() => '?').join(',');
                const allColumns: any[] = prepare(
                    `SELECT * FROM columns WHERE board_id IN (${boardPlaceholders}) AND (hidden = 0 OR hidden IS NULL)`
                ).all(...boardIds);

                // Also fetch hidden columns separately
                const hiddenColumns: any[] = prepare(
                    `SELECT * FROM columns WHERE board_id IN (${boardPlaceholders}) AND hidden = 1`
                ).all(...boardIds);

                // Group hidden columns by board ID
                for (const column of hiddenColumns) {
                    const list = hiddenColumnsByBoard.get(column.board_id) ?? [];
                    list.push(column);
                    hiddenColumnsByBoard.set(column.board_id, list);
                }

                const columnsByBoardId = new Map<any, any[]>();
                for (const column of allColumns) {
                    const list = columnsByBoardId.get(column.board_id) ?? [];
                    list.push(column);
                    columnsByBoardId.set(column.board_id, list);
                }

                // Fetch all cards for all columns in a single query
                const columnIds = allColumns.map(column => column.id);
                let allCards: any[] = [];
                const cardsByColumnId = new Map<any, any[]>();

                if (columnIds.length > 0) {
                    const columnPlaceholders = columnIds.map(() => '?').join(',');
                    allCards = prepare(
                        `SELECT * FROM cards WHERE column_id IN (${columnPlaceholders})`
                    ).all(...columnIds);

                    for (const card of allCards) {
                        const list = cardsByColumnId.get(card.column_id) ?? [];
                        list.push(card);
                        cardsByColumnId.set(card.column_id, list);
                    }
                }

                // Fetch all tags per card in a single query
                const cardIds = allCards.map(card => card.id);
                const tagsByCardId = new Map<any, any[]>();

                if (cardIds.length > 0) {
                    const cardPlaceholders = cardIds.map(() => '?').join(',');
                    const cardTagRows: any[] = prepare(
                        `SELECT ct.card_id as card_id, t.* 
                         FROM card_tags ct 
                         JOIN tags t ON t.id = ct.tag_id 
                         WHERE ct.card_id IN (${cardPlaceholders})`
                    ).all(...cardIds);

                    for (const row of cardTagRows) {
                        const list = tagsByCardId.get(row.card_id) ?? [];
                        list.push(row);
                        tagsByCardId.set(row.card_id, list);
                    }
                }

                // Rebuild the enriched boards structure using the grouped data
                enrichedBoards = boards.map(board => {
                    const columnsForBoard = columnsByBoardId.get(board.id) ?? [];
                    const enrichedColumns = columnsForBoard.map(column => {
                        const cardsForColumn = cardsByColumnId.get(column.id) ?? [];
                        const enrichedCards = cardsForColumn.map(card => {
                            const cardTags = tagsByCardId.get(card.id) ?? [];
                            return { ...card, tags: cardTags };
                        });
                        return { ...column, cards: enrichedCards };
                    });
                    return { ...board, columns: enrichedColumns };
                });
            }

            // Send data to webview
            console.log('Sending data to webview:', {
                boardsCount: enrichedBoards.length,
                tasksCount: tasks.length,
                tagsCount: tags.length,
                notesCount: notes.length
            });
            
            // Convert hiddenColumnsByBoard Map to object for JSON serialization
            const hiddenColumnsObj: {[key: string]: any[]} = {};
            hiddenColumnsByBoard.forEach((columns, boardId) => {
                hiddenColumnsObj[boardId] = columns;
            });
            
            DashboardProvider.currentPanel.webview.postMessage({
                type: 'data',
                boards: enrichedBoards,
                tasks: tasks,
                tags: tags,
                notes: notes,
                hiddenColumns: hiddenColumnsObj,
                settings: {
                    completionColumn: completionColumn
                }
            });
            console.log('Data sent to webview successfully');
        } catch (error) {
            console.error('Error in sendData():', error);
            vscode.window.showErrorMessage(`Failed to load dashboard data: ${error}`);
        }
    }

    /**
     * Get all .notesnlh files from the notes folder
     */
    private static getNotes(): NoteFile[] {
        const notesFolder = getNotesFolder();
        
        if (!notesFolder) {
            return [];
        }

        // Check if the notes folder exists
        if (!fs.existsSync(notesFolder)) {
            return [];
        }

        try {
            // Read all files in the notes folder
            const files = fs.readdirSync(notesFolder);
            
            // Filter for .notesnlh files and create NoteFile objects
            const noteFiles: NoteFile[] = files
                .filter(file => file.endsWith('.notesnlh'))
                .map(file => ({
                    name: file,
                    path: path.join(notesFolder, file)
                }));

            // Sort by last modified date (newest first)
            return noteFiles.sort((a, b) => {
                try {
                    const statA = fs.statSync(a.path);
                    const statB = fs.statSync(b.path);
                    return statB.mtime.getTime() - statA.mtime.getTime();
                } catch (error) {
                    return a.name.localeCompare(b.name);
                }
            });
        } catch (error) {
            console.error('Error reading notes folder:', error);
            return [];
        }
    }

    private static getNonce(): string {
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let nonce = '';
        for (let i = 0; i < 16; i++) {
            nonce += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return nonce;
    }

    /**
     * Gets the HTML content for the webview
     */
    private static getWebviewContent(webview: vscode.Webview, context: vscode.ExtensionContext): string {
        const nonce = DashboardProvider.getNonce();
        console.log('getWebviewContent: nonce generated:', nonce);
        console.log('getWebviewContent: cspSource:', webview.cspSource);
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}' 'unsafe-inline'; script-src ${webview.cspSource} 'nonce-${nonce}';">
    <title>Chroma Workspace Dashboard</title>
    <style nonce="${nonce}">
        body {
            padding: 20px;
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
        }
        h1, h2, h3 {
            color: var(--vscode-foreground);
            margin-top: 20px;
            margin-bottom: 10px;
        }
        .section {
            margin-bottom: 30px;
            padding: 15px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
        }
        .board {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 5px;
        }
        .columns {
            display: flex;
            gap: 15px;
            overflow-x: auto;
            margin-top: 10px;
        }
        .column {
            min-width: 250px;
            padding: 10px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 3px;
        }
        .column-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        .column h4 {
            margin: 0;
            color: var(--vscode-foreground);
            font-size: 14px;
            font-weight: bold;
            flex-grow: 1;
        }
        .column-actions {
            display: flex;
            gap: 4px;
        }
        .btn {
            padding: 4px 8px;
            border: 1px solid var(--vscode-button-border);
            background-color: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            cursor: pointer;
            border-radius: 2px;
            font-size: 11px;
            white-space: nowrap;
        }
        .btn:hover {
            background-color: var(--vscode-button-hoverBackground);
        }
        .btn-sm {
            padding: 2px 6px;
            font-size: 10px;
        }
        .btn-danger {
            background-color: var(--vscode-errorForeground);
            color: white;
        }
        .btn-danger:hover {
            opacity: 0.9;
        }
        .card {
            padding: 8px;
            margin-bottom: 8px;
            border: 1px solid var(--vscode-panel-border);
            border-left: 3px solid var(--vscode-textLink-foreground);
            border-radius: 3px;
        }
        .card:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .card-title {
            font-weight: 600;
            margin-bottom: 4px;
        }
        .card-description {
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
            margin-bottom: 4px;
        }
        .card-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 8px;
        }
        .card-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            margin-top: 6px;
        }
        .tag {
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 11px;
            color: white;
        }
        .task-list, .tag-list, .note-list {
            list-style: none;
            padding: 0;
        }
        .task-item, .tag-item, .note-item {
            padding: 8px;
            margin-bottom: 5px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 3px;
            cursor: pointer;
        }
        .task-item:hover, .tag-item:hover, .note-item:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .note-name {
            color: var(--vscode-textLink-foreground);
            text-decoration: none;
            cursor: pointer;
        }
        .note-name:hover {
            text-decoration: underline;
        }
        .empty-state {
            color: var(--vscode-descriptionForeground);
            font-style: italic;
            padding: 10px;
        }
        .loading {
            text-align: center;
            padding: 40px;
            color: var(--vscode-descriptionForeground);
        }
        .tab-container {
            display: flex;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 20px;
        }
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            border-bottom: 2px solid transparent;
            color: var(--vscode-foreground);
        }
        .tab:hover {
            background-color: var(--vscode-list-hoverBackground);
        }
        .tab.active {
            border-bottom-color: var(--vscode-textLink-foreground);
            font-weight: bold;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        .hidden-columns-section {
            margin-top: 20px;
            padding: 10px;
            background-color: var(--vscode-editorWidget-background);
            border: 1px dashed var(--vscode-panel-border);
            border-radius: 3px;
        }
        .hidden-columns-section h4 {
            margin: 0 0 10px 0;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }
        .hidden-columns-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        .hidden-column-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 4px 8px;
            background-color: var(--vscode-editor-background);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 3px;
        }
        .hidden-column-name {
            font-size: 11px;
            color: var(--vscode-descriptionForeground);
        }
    </style>
</head>
<body>
    <h1>Chroma Workspace Dashboard</h1>
    <div class="tab-container">
        <div class="tab active" data-tab="kanban">Kanban</div>
        <div class="tab" data-tab="tasks">Tasks</div>
        <div class="tab" data-tab="notes">Notes</div>
        <div class="tab" data-tab="tags">Tags</div>
    </div>
    
    <div id="content">
        <div class="loading">Loading workspace data...</div>
    </div>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        let currentTab = 'kanban';
        let workspaceData = null;

        console.log('[Webview] Script loaded');

        window.addEventListener('load', function() {
            console.log('[Webview] Load event fired, requesting data...');
            vscode.postMessage({ type: 'getData' });
        });

        window.addEventListener('message', function(event) {
            const message = event.data;
            console.log('[Webview] Received message:', message.type);
            switch (message.type) {
                case 'data':
                    console.log('[Webview] Received data, boards:', message.boards?.length, 'tasks:', message.tasks?.length);
                    workspaceData = message;
                    renderContent();
                    break;
                case 'refresh':
                    console.log('[Webview] Refresh requested');
                    vscode.postMessage({ type: 'getData' });
                    break;
                default:
                    console.log('[Webview] Unknown message type:', message.type);
            }
        });

        document.querySelectorAll('.tab').forEach(function(tab) {
            tab.addEventListener('click', function() {
                document.querySelectorAll('.tab').forEach(function(t) {
                    t.classList.remove('active');
                });
                tab.classList.add('active');
                currentTab = tab.dataset.tab;
                renderContent();
            });
        });

        function attachKanbanHandlers() {
            // Column action buttons
            document.querySelectorAll('.column-action-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const command = btn.getAttribute('data-command');
                    const columnId = btn.getAttribute('data-column-id');
                    const boardId = btn.getAttribute('data-board-id');
                    const label = btn.getAttribute('data-label');
                    executeColumnCommand(command, columnId, boardId, label);
                });
            });
            
            // Card action buttons
            document.querySelectorAll('.card-action-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const command = btn.getAttribute('data-command');
                    const cardId = btn.getAttribute('data-card-id');
                    const columnId = btn.getAttribute('data-column-id');
                    const boardId = btn.getAttribute('data-board-id');
                    const label = btn.getAttribute('data-label');
                    executeCardCommand(command, cardId, columnId, boardId, label);
                });
            });
        }

        function attachTaskHandlers() {
            // Task action buttons
            document.querySelectorAll('.task-action-btn').forEach(function(btn) {
                btn.addEventListener('click', function() {
                    const command = btn.getAttribute('data-command');
                    const taskId = btn.getAttribute('data-task-id');
                    const label = btn.getAttribute('data-label');
                    executeTaskCommand(command, taskId, label);
                });
            });
        }

        function renderContent() {
            if (!workspaceData) return;

            const content = document.getElementById('content');
            
            switch (currentTab) {
                case 'kanban':
                    content.innerHTML = renderKanban();
                    attachKanbanHandlers();
                    break;
                case 'tasks':
                    content.innerHTML = renderTasks();
                    attachTaskHandlers();
                    break;
                case 'notes':
                    content.innerHTML = renderNotes();
                    attachNoteClickHandlers();
                    break;
                case 'tags':
                    content.innerHTML = renderTags();
                    break;
            }
        }

        function attachNoteClickHandlers() {
            const noteItems = document.querySelectorAll('.note-item');
            noteItems.forEach(function(item) {
                item.addEventListener('click', function() {
                    const path = item.getAttribute('data-path');
                    if (path) {
                        openNote(path);
                    }
                });
            });
        }

        function isValidHexColor(color) {
            return /^#[0-9A-F]{6}$/i.test(color);
        }

        function sanitizeColor(color) {
            return isValidHexColor(color) ? color : '#808080';
        }

        function renderKanban() {
            const { boards, settings } = workspaceData;
            const completionColumnName = (settings && settings.completionColumn) ? settings.completionColumn.toLowerCase().trim() : 'done';
            
            if (!boards || boards.length === 0) {
                return '<div class="empty-state">No Kanban boards found. Create one from the sidebar!</div>';
            }

            let html = '';
            boards.forEach(board => {
                html += '<div class="board">';
                html += '<h3>' + escapeHtml(board.title || board.name) + '</h3>';
                
                if (!board.columns || board.columns.length === 0) {
                    html += '<div class="empty-state">No columns in this board</div>';
                } else {
                    html += '<div class="columns">';
                    board.columns.forEach(column => {
                        html += '<div class="column" data-column-id="' + column.id + '" data-board-id="' + board.id + '">';
                        html += '<div class="column-header">';
                        html += '<h4>' + escapeHtml(column.title || column.name) + '</h4>';
                        html += '<div class="column-actions">';
                        html += '<button class="btn btn-sm column-action-btn" data-command="chroma.hideColumn" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(column.title) + '" title="Hide column">👁️‍🗨️ Hide</button>';
                        html += '<button class="btn btn-sm column-action-btn" data-command="chroma.addCard" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(column.title) + '">Add Card</button>';
                        html += '<button class="btn btn-sm column-action-btn" data-command="chroma.editColumn" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(column.title) + '">Edit</button>';
                        html += '<button class="btn btn-sm btn-danger column-action-btn" data-command="chroma.deleteColumn" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(column.title) + '">Delete</button>';
                        html += '</div></div>';
                        
                        if (!column.cards || column.cards.length === 0) {
                            html += '<div class="empty-state">No cards</div>';
                        } else {
                            const isCompletionColumn = (column.title || column.name).toLowerCase().trim() === completionColumnName;
                            
                            column.cards.forEach(card => {
                                html += '<div class="card" data-card-id="' + card.id + '" data-column-id="' + column.id + '" data-board-id="' + board.id + '">';
                                html += '<div class="card-title">' + escapeHtml(card.title) + '</div>';
                                if (card.content) {
                                    html += '<div class="card-description">' + escapeHtml(card.content) + '</div>';
                                }
                                if (card.tags && card.tags.length > 0) {
                                    html += '<div class="card-tags">';
                                    card.tags.forEach(tag => {
                                        html += '<span class="tag" style="background-color: ' + sanitizeColor(tag.color) + '">' + escapeHtml(tag.name) + '</span>';
                                    });
                                    html += '</div>';
                                }
                                
                                // Card actions
                                html += '<div class="card-actions">';
                                html += '<button class="btn btn-sm card-action-btn" data-command="chroma.convertCardToTask" data-card-id="' + card.id + '" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(card.title) + '">Convert to Task</button>';
                                html += '<button class="btn btn-sm card-action-btn" data-command="chroma.editCard" data-card-id="' + card.id + '" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(card.title) + '">Edit</button>';
                                html += '<button class="btn btn-sm card-action-btn" data-command="chroma.moveCard" data-card-id="' + card.id + '" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(card.title) + '">Move</button>';
                                
                                // Add "Edit Completed Date" button only for completion columns
                                if (isCompletionColumn) {
                                    html += '<button class="btn btn-sm card-action-btn" data-command="chroma.editCardCompletedDate" data-card-id="' + card.id + '" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(card.title) + '">Edit Completed Date</button>';
                                }
                                
                                html += '<button class="btn btn-sm btn-danger card-action-btn" data-command="chroma.deleteCard" data-card-id="' + card.id + '" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(card.title) + '">Delete</button>';
                                html += '</div>';
                                html += '</div>';
                            });
                        }
                        
                        html += '</div>';
                    });
                    html += '</div>';
                }
                
                // Show hidden columns section if there are any
                const hiddenCols = workspaceData.hiddenColumns && workspaceData.hiddenColumns[board.id];
                if (hiddenCols && hiddenCols.length > 0) {
                    html += '<div class="hidden-columns-section">';
                    html += '<h4>Hidden Columns</h4>';
                    html += '<div class="hidden-columns-list">';
                    hiddenCols.forEach(column => {
                        html += '<div class="hidden-column-item">';
                        html += '<span class="hidden-column-name">' + escapeHtml(column.title || column.name) + '</span>';
                        html += '<button class="btn btn-sm column-action-btn" data-command="chroma.showColumn" data-column-id="' + column.id + '" data-board-id="' + board.id + '" data-label="' + escapeAttribute(column.title) + '" title="Show column">👁️ Show</button>';
                        html += '</div>';
                    });
                    html += '</div>';
                    html += '</div>';
                }
                
                html += '</div>';
            });
            
            return html;
        }

        function renderTasks() {
            const { tasks } = workspaceData;
            
            if (!tasks || tasks.length === 0) {
                return '<div class="empty-state">No scheduled tasks found. Create one from the sidebar!</div>';
            }

            let html = '<div class="section"><ul class="task-list">';
            tasks.forEach(task => {
                html += '<li class="task-item">';
                html += '<div><strong>' + escapeHtml(task.title) + '</strong></div>';
                if (task.description) {
                    html += '<div style="font-size: 12px; color: var(--vscode-descriptionForeground);">' + escapeHtml(task.description) + '</div>';
                }
                if (task.dueDate) {
                    html += '<div style="font-size: 11px; margin-top: 4px;">Due: ' + formatDate(task.dueDate) + '</div>';
                }
                
                // Task actions
                html += '<div class="card-actions">';
                html += '<button class="btn btn-sm task-action-btn" data-command="chroma.convertTaskToCard" data-task-id="' + task.id + '" data-label="' + escapeAttribute(task.title) + '">Convert to Card</button>';
                html += '<button class="btn btn-sm task-action-btn" data-command="chroma.editTask" data-task-id="' + task.id + '" data-label="' + escapeAttribute(task.title) + '">Edit</button>';
                html += '<button class="btn btn-sm btn-danger task-action-btn" data-command="chroma.deleteTask" data-task-id="' + task.id + '" data-label="' + escapeAttribute(task.title) + '">Delete</button>';
                html += '</div>';
                
                html += '</li>';
            });
            html += '</ul></div>';
            
            return html;
        }

        function renderTags() {
            const { tags } = workspaceData;
            
            if (!tags || tags.length === 0) {
                return '<div class="empty-state">No tags found. Create one from the sidebar!</div>';
            }

            let html = '<div class="section"><ul class="tag-list">';
            tags.forEach(tag => {
                html += '<li class="tag-item">';
                html += '<span class="tag" style="background-color: ' + sanitizeColor(tag.color) + '">' + escapeHtml(tag.name) + '</span>';
                html += '</li>';
            });
            html += '</ul></div>';
            
            return html;
        }

        function renderNotes() {
            const { notes } = workspaceData;
            
            if (!notes || notes.length === 0) {
                return '<div class="empty-state">No notes found. Create one from the sidebar!</div>';
            }

            let html = '<div class="section"><ul class="note-list">';
            notes.forEach(note => {
                const safePath = escapeAttribute(note.path);
                html += '<li class="note-item" data-path="' + safePath + '">';
                html += '<div><strong class="note-name">' + escapeHtml(note.name) + '</strong></div>';
                html += '</li>';
            });
            html += '</ul></div>';
            
            return html;
        }

        function openNote(notePath) {
            vscode.postMessage({ type: 'openNote', path: notePath });
        }

        function formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        }

        function escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        function escapeAttribute(value) {
            if (!value) return '';
            return String(value).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        }

        function executeColumnCommand(command, columnId, boardId, columnTitle) {
            const args = {
                columnId: columnId,
                boardId: boardId,
                label: columnTitle
            };
            vscode.postMessage({ type: 'executeCommand', command: command, args: args });
        }

        function executeCardCommand(command, cardId, columnId, boardId, cardTitle) {
            const args = {
                cardId: cardId,
                columnId: columnId,
                boardId: boardId,
                label: cardTitle
            };
            vscode.postMessage({ type: 'executeCommand', command: command, args: args });
        }

        function executeTaskCommand(command, taskId, taskTitle) {
            const args = {
                id: taskId,
                title: taskTitle
            };
            vscode.postMessage({ type: 'executeCommand', command: command, args: args });
        }
    </script>
</body>
</html>`;
        console.log('getWebviewContent: HTML generated, length:', html.length);
        return html;
    }
}
