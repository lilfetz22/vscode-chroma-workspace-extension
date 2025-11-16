const vscode = require('vscode');
const { createCard, updateCard, deleteCard: dbDeleteCard, getColumnsByBoardId } = require('../../out/database');

async function addCard(column) {
    const cardTitle = await vscode.window.showInputBox({ prompt: 'Enter a title for the new card' });
    if (!cardTitle) {
        return;
    }
    const content = await vscode.window.showInputBox({ prompt: 'Optional: Enter content/context for this card' });
    createCard({ title: cardTitle, content: content || '', column_id: column.columnId, order: 0, priority: 'medium' });
}

async function editCard(card) {
    // Fetch current card to prefill content if available
    let current;
    try {
        const { getCardById } = require('../../out/database');
        current = getCardById(card.cardId);
    } catch (e) {
        current = undefined;
    }

    const newCardTitle = await vscode.window.showInputBox({ value: card.label, prompt: 'Edit card title' });
    if (!newCardTitle) {
        return;
    }
    const newContent = await vscode.window.showInputBox({
        value: current?.content || '',
        prompt: 'Optional: Edit content/context for this card'
    });
    updateCard({ id: card.cardId, title: newCardTitle, content: newContent !== undefined ? newContent : current?.content });
}

async function deleteCard(card) {
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the card "${card.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        dbDeleteCard(card.cardId);
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
