import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getAllBoards, getColumnsByBoardId, getCardsByColumnId, getAllTags, getTagsByCardId, prepare } from '../database';
import { Task } from '../models/Task';
import { getNotesFolder } from '../utils/notesFolder';

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
                    'chroma.refreshNotes'
                ];
                
                if (message.command && allowedCommands.includes(message.command)) {
                    await vscode.commands.executeCommand(message.command, message.args);
                } else if (message.command) {
                    console.warn(`Dashboard: Attempted to execute non-whitelisted command: ${message.command}`);
                }
                break;
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
            if (boards.length > 0) {
                const boardIds = boards.map(board => board.id);

                // Fetch all columns for all boards in a single query
                const boardPlaceholders = boardIds.map(() => '?').join(',');
                const allColumns: any[] = prepare(
                    `SELECT * FROM columns WHERE board_id IN (${boardPlaceholders})`
                ).all(...boardIds);

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
            DashboardProvider.currentPanel.webview.postMessage({
                type: 'data',
                boards: enrichedBoards,
                tasks: tasks,
                tags: tags,
                notes: notes
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
            background-color: var(--vscode-editor-inactiveSelectionBackground);
            border-radius: 5px;
        }
        .board {
            margin-bottom: 20px;
            padding: 10px;
            background-color: var(--vscode-input-background);
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
        .column h4 {
            margin: 0 0 10px 0;
            color: var(--vscode-foreground);
            font-size: 14px;
            font-weight: bold;
        }
        .card {
            padding: 8px;
            margin-bottom: 8px;
            background-color: var(--vscode-list-inactiveSelectionBackground);
            border-left: 3px solid var(--vscode-textLink-foreground);
            border-radius: 3px;
            cursor: pointer;
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
            background-color: var(--vscode-list-inactiveSelectionBackground);
            border-radius: 3px;
            cursor: pointer;
        }
        .task-item:hover, .tag-item:hover, .note-item:hover {
            background-color: var(--vscode-list-hoverBackground);
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

        window.addEventListener('load', function() {
            vscode.postMessage({ type: 'getData' });
        });

        window.addEventListener('message', function(event) {
            const message = event.data;
            switch (message.type) {
                case 'data':
                    workspaceData = message;
                    renderContent();
                    break;
                case 'refresh':
                    vscode.postMessage({ type: 'getData' });
                    break;
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

        function renderContent() {
            if (!workspaceData) return;

            const content = document.getElementById('content');
            
            switch (currentTab) {
                case 'kanban':
                    content.innerHTML = renderKanban();
                    break;
                case 'tasks':
                    content.innerHTML = renderTasks();
                    break;
                case 'notes':
                    content.innerHTML = renderNotes();
                    break;
                case 'tags':
                    content.innerHTML = renderTags();
                    break;
            }
        }

        function isValidHexColor(color) {
            return /^#[0-9A-F]{6}$/i.test(color);
        }

        function sanitizeColor(color) {
            return isValidHexColor(color) ? color : '#808080';
        }

        function renderKanban() {
            const { boards } = workspaceData;
            
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
                        html += '<div class="column">';
                        html += '<h4>' + escapeHtml(column.title || column.name) + '</h4>';
                        
                        if (!column.cards || column.cards.length === 0) {
                            html += '<div class="empty-state">No cards</div>';
                        } else {
                            column.cards.forEach(card => {
                                html += '<div class="card">';
                                html += '<div class="card-title">' + escapeHtml(card.title) + '</div>';
                                if (card.description) {
                                    html += '<div class="card-description">' + escapeHtml(card.description) + '</div>';
                                }
                                if (card.tags && card.tags.length > 0) {
                                    html += '<div class="card-tags">';
                                    card.tags.forEach(tag => {
                                        html += '<span class="tag" style="background-color: ' + sanitizeColor(tag.color) + '">' + escapeHtml(tag.name) + '</span>';
                                    });
                                    html += '</div>';
                                }
                                html += '</div>';
                            });
                        }
                        
                        html += '</div>';
                    });
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
                html += '<li class="note-item" data-path="' + safePath + '" onclick="handleNoteClick(this)">';
                html += '<div><strong>' + escapeHtml(note.name) + '</strong></div>';
                html += '</li>';
            });
            html += '</ul></div>';
            
            return html;
        }

        function handleNoteClick(element) {
            const path = element.getAttribute('data-path');
            if (path) {
                openNote(path);
            }
        }

        function escapeAttribute(value) {
            if (!value) return '';
            return value.replace(/"/g, '&quot;');
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
    </script>
</body>
</html>`;
        console.log('getWebviewContent: HTML generated, length:', html.length);
        return html;
    }
}
