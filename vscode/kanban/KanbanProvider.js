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
            const item = new vscode.TreeItem(board.name, vscode.TreeItemCollapsibleState.Collapsed);
            item.contextValue = 'board';
            item.boardId = board.id;
            return item;
        });
    }

    getColumns(boardId) {
        const columns = getColumnsByBoardId(boardId);
        return columns.map(column => {
            const item = new vscode.TreeItem(column.name, vscode.TreeItemCollapsibleState.Collapsed);
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
            const label = tagString ? `${card.title} [${tagString}]` : card.title;
            const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.None);
            item.contextValue = 'card';
            item.cardId = card.id;
            item.columnId = columnId;
            const column = getColumnById(columnId);
            item.boardId = column.board_id;
            return item;
        });
    }
}

module.exports = {
    KanbanProvider
};
