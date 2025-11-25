const vscode = require('vscode');
const { getAllBoards, getColumnsByBoardId, getCardsByColumnId, getColumnById, getTagsByCardId } = require('../../out/src/database');

// Constants
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

/**
 * Format a date string to MM-DD-YY format
 * @param {string | Date} dateString ISO date string or Date object
 * @returns {string} Formatted date string (MM-DD-YY)
 */
function formatDate(dateString) {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
}

class KanbanProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    }

    refresh() {
        this._onDidChangeTreeData.fire();
    }

    getTreeItem(element) {
        return element;
    }

    async getChildren(element) {
        if (!element) {
            return this.getBoards();
        } else if (element.contextValue === 'board') {
            return this.getColumns(element.boardId);
        } else if (element.contextValue === 'column') {
            return this.getCards(element.columnId);
        }
        return [];
    }

    getBoards() {
        const boards = getAllBoards();
        return boards.map(board => {
            const item = new vscode.TreeItem(board.title, vscode.TreeItemCollapsibleState.Collapsed);
            item.contextValue = 'board';
            item.boardId = board.id;
            return item;
        });
    }

    getColumns(boardId) {
        const columns = getColumnsByBoardId(boardId);
        return columns.map(column => {
            const item = new vscode.TreeItem(column.title, vscode.TreeItemCollapsibleState.Collapsed);
            item.contextValue = 'column';
            item.columnId = column.id;
            item.boardId = boardId;
            return item;
        });
    }

    getCards(columnId) {
        const cards = getCardsByColumnId(columnId);
        return cards.map(card => {
            const tags = getTagsByCardId(card.id);
            const tagString = tags.length > 0 ? tags.map(t => `#${t.name}`).join(' ') : '';
            
            // Format completed date if present
            let completedDateString = '';
            if (card.completed_at) {
                completedDateString = ` [${formatDate(card.completed_at)}]`;
            }
            
            // Check if card was converted from task within the last 3 hours
            let newFlag = '';
            if (card.converted_from_task_at) {
                const convertedAt = new Date(card.converted_from_task_at).getTime();
                const now = new Date().getTime();
                // Use Math.abs to handle potential clock adjustments or timezone issues
                if (Math.abs(now - convertedAt) < THREE_HOURS_MS) {
                    newFlag = ' (New)';
                }
            }
            
            const label = tagString 
                ? `${card.title} ${tagString}${completedDateString}${newFlag}` 
                : `${card.title}${completedDateString}${newFlag}`;
            
            const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
            item.contextValue = 'card';
            item.cardId = card.id;
            item.label = label;
            item.columnId = columnId;
            const column = getColumnById(columnId);
            item.boardId = column.board_id;
            if (card?.content) {
                item.tooltip = `Content:\n${card.content}`;
            }
            return item;
        });
    }
}

module.exports = {
    KanbanProvider
};
