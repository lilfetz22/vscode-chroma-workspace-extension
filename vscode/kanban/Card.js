const vscode = require('vscode');
const { createCard, updateCard, deleteCard, getColumnsByBoardId } = require('../../out/database');

async function addCard(column) {
    const cardTitle = await vscode.window.showInputBox({ prompt: 'Enter a title for the new card' });
    if (cardTitle) {
        createCard({ title: cardTitle, column_id: column.columnId, order: 0, priority: 'medium' });
    }
}

async function editCard(card) {
    const newCardTitle = await vscode.window.showInputBox({ value: card.label });
    if (newCardTitle) {
        updateCard({ id: card.cardId, title: newCardTitle });
    }
}

async function deleteCard(card) {
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the card "${card.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        deleteCard(card.cardId);
    }
}

async function moveCard(card) {
    const columns = getColumnsByBoardId(card.boardId);
    const columnNames = columns.map(column => column.name);
    const selectedColumnName = await vscode.window.showQuickPick(columnNames, { placeHolder: 'Select a column to move the card to' });
    if (selectedColumnName) {
        const selectedColumn = columns.find(column => column.name === selectedColumnName);
        if (selectedColumn) {
            updateCard({ id: card.cardId, column_id: selectedColumn.id });
        }
    }
}

module.exports = {
    addCard,
    editCard,
    deleteCard,
    moveCard
};
