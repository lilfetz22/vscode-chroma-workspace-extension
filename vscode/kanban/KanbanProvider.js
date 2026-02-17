const vscode = require('vscode');
const { getAllBoards, getColumnsByBoardId, getCardsByColumnId, getColumnById, getTagsByCardId } = require('../../out/src/database');
const { generateTagCompositeIcon } = require('../../out/src/utils/tagIcons');
const { splitLongText } = require('../../out/src/utils/treeItemHelpers');

// Constants
const THREE_HOURS_MS = 3 * 60 * 60 * 1000;

/**
 * Format a date string to MM-DD-YYYY format
 * @param {string | Date} dateString ISO date string or Date object
 * @returns {string} Formatted date string (MM-DD-YYYY)
 */
function formatDate(dateString) {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear());
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
        } else if (element.contextValue === 'card') {
            // Return tags as child items
            const tags = getTagsByCardId(element.cardId) || [];
            return tags.map(tag => {
                const item = new vscode.TreeItem(`#${tag.name}`, vscode.TreeItemCollapsibleState.None);
                item.contextValue = 'card-tag';
                try {
                    const icon = generateTagCompositeIcon([tag.color]);
                    if (icon) item.iconPath = icon;
                } catch {}
                return item;
            });
        }
        return [];
    }

    getBoards() {
        const boards = getAllBoards();
        return boards.map(board => {
            const { label, description } = splitLongText(board.title);
            const item = new vscode.TreeItem(label, vscode.TreeItemCollapsibleState.Collapsed);
            item.contextValue = 'board';
            item.boardId = board.id;
            item.tooltip = `ID: ${board.id}`;
            if (description) {
                item.description = description;
            }
            return item;
        });
    }

    getColumns(boardId) {
        const columns = getColumnsByBoardId(boardId, true); // Include hidden columns
        return columns.map(column => {
            const isHidden = column.hidden === 1;
            const titleWithPrefix = isHidden ? `[Hidden] ${column.title}` : column.title;
            const { label, description } = splitLongText(titleWithPrefix);
            const collapsibleState = isHidden
                ? vscode.TreeItemCollapsibleState.None
                : vscode.TreeItemCollapsibleState.Collapsed;
            const item = new vscode.TreeItem(label, collapsibleState);
            item.contextValue = isHidden ? 'hiddenColumn' : 'column';
            item.columnId = column.id;
            item.boardId = boardId;
            if (description) {
                item.description = description;
            }
            return item;
        });
    }

    getCards(columnId) {
        const cards = getCardsByColumnId(columnId);
        const column = getColumnById(columnId);
        const { getSettingsService } = require('../../out/src/logic/SettingsService');
        const completionColumnName = getSettingsService().getKanbanSettings().completionColumn;
        const isCompletionColumn = column.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
        
        return cards.map(card => {
            const tags = getTagsByCardId(card.id);
            
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
            
            // Add position number to label only for non-completion columns (1-based position)
            let fullText;
            if (isCompletionColumn) {
                fullText = `${card.title}${completedDateString}${newFlag}`;
            } else {
                fullText = `${card.position}. ${card.title}${completedDateString}${newFlag}`;
            }
            
            const { label, description } = splitLongText(fullText);
            const item = new vscode.TreeItem(label, tags.length > 0 ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None);
            // Set contextValue to 'completedCard' for cards in completion columns, 'card' otherwise
            item.contextValue = isCompletionColumn ? 'completedCard' : 'card';
            item.cardId = card.id;
            item.label = label;
            item.columnId = columnId;
            item.boardId = column.board_id;
            if (description) {
                item.description = description;
            }
            // Build tooltip: always show title when there's content, or show full title if it was split
            if (card?.content) {
                item.tooltip = `Title: ${fullText}\n\nContent:\n${card.content}`;
            } else if (description) {
                // No content but title was split, show full title
                item.tooltip = fullText;
            }
            // Do not place icons on the card title line; icons appear on tag child items only
            return item;
        });
    }
}

module.exports = {
    KanbanProvider
};
