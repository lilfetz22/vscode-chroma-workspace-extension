import * as vscode from 'vscode';
import { getAllBoards, getColumnsByBoardId, getCardsByColumnId, getAllTags, getTagsByCardId, getDb, prepare } from '../database';
import { Task } from '../models/Task';

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
        const column = vscode.ViewColumn.One;

        // If we already have a panel, show it
        if (DashboardProvider.currentPanel) {
            DashboardProvider.currentPanel.reveal(column);
            return;
        }

        // Create a new panel
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

        DashboardProvider.currentPanel = panel;

        // Set the webview's initial html content
        panel.webview.html = DashboardProvider.getWebviewContent(panel.webview, context);

        // Handle messages from the webview
        panel.webview.onDidReceiveMessage(
            async message => {
                await DashboardProvider.handleMessage(message);
            },
            undefined,
            context.subscriptions
        );

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
    private static async handleMessage(message: any): Promise<void> {
        switch (message.type) {
            case 'getData':
                await DashboardProvider.sendData();
                break;
            case 'openNote':
                if (message.path) {
                    const uri = vscode.Uri.file(message.path);
                    await vscode.window.showTextDocument(uri);
                }
                break;
            case 'executeCommand':
                if (message.command) {
                    await vscode.commands.executeCommand(message.command, message.args);
                }
                break;
        }
    }

    /**
     * Sends all workspace data to the webview
     */
    private static async sendData(): Promise<void> {
        if (!DashboardProvider.currentPanel) {
            return;
        }

        try {
            // Get all workspace data
            const boards = getAllBoards();
            const db = getDb();
            const tasks: Task[] = prepare('SELECT id, title, description, due_date as dueDate, recurrence, status, card_id as cardId, created_at as createdAt, updated_at as updatedAt FROM tasks WHERE status = ? ORDER BY due_date ASC').all('pending') as Task[];
            const tags = getAllTags();

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
            DashboardProvider.currentPanel.webview.postMessage({
                type: 'data',
                boards: enrichedBoards,
                tasks: tasks,
                tags: tags
            });
        } catch (error) {
            vscode.window.showErrorMessage(`Failed to load dashboard data: ${error}`);
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
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'nonce-${nonce}'; script-src ${webview.cspSource};">
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
        .task-list, .tag-list {
            list-style: none;
            padding: 0;
        }
        .task-item, .tag-item {
            padding: 8px;
            margin-bottom: 5px;
            background-color: var(--vscode-list-inactiveSelectionBackground);
            border-radius: 3px;
        }
        .task-item:hover, .tag-item:hover {
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
        <div class="tab" data-tab="tags">Tags</div>
    </div>
    
    <div id="content">
        <div class="loading">Loading workspace data...</div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentTab = 'kanban';
        let workspaceData = null;

        // Request data on load
        window.addEventListener('load', () => {
            vscode.postMessage({ type: 'getData' });
        });

        // Handle messages from extension
        window.addEventListener('message', event => {
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

        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
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
                case 'tags':
                    content.innerHTML = renderTags();
                    break;
            }
        }

        function renderKanban() {
            const { boards } = workspaceData;
            
            if (!boards || boards.length === 0) {
                return '<div class="empty-state">No Kanban boards found. Create one from the sidebar!</div>';
            }

            let html = '';
            boards.forEach(board => {
                html += '<div class="board">';
                html += '<h3>' + escapeHtml(board.name) + '</h3>';
                
                if (!board.columns || board.columns.length === 0) {
                    html += '<div class="empty-state">No columns in this board</div>';
                } else {
                    html += '<div class="columns">';
                    board.columns.forEach(column => {
                        html += '<div class="column">';
                        html += '<h4>' + escapeHtml(column.name) + '</h4>';
                        
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
                                        html += '<span class="tag" style="background-color: ' + tag.color + '">' + escapeHtml(tag.name) + '</span>';
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
                html += '<span class="tag" style="background-color: ' + tag.color + '">' + escapeHtml(tag.name) + '</span>';
                html += '</li>';
            });
            html += '</ul></div>';
            
            return html;
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
    }
}
