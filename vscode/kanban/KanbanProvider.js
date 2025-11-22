const vscode = require('vscode');
const { getAllBoards, getColumnsByBoardId, getCardsByColumnId, getColumnById, getTagsByCardId } = require('../../out/database');

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
            const tagString = tags.map(t => t.name).join(', ');
            
            // Format completed date if present
            let completedDateString = '';
            if (card.completed_at) {
                const date = new Date(card.completed_at);
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const year = String(date.getFullYear()).slice(-2);
                completedDateString = ` [${month}-${day}-${year}]`;
            }
            
            const label = tagString 
                ? `${card.title} [${tagString}]${completedDateString}` 
                : `${card.title}${completedDateString}`;
            
            const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
            item.contextValue = 'card';
            item.cardId = card.id;
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
