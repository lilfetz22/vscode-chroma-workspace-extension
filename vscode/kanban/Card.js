const vscode = require('vscode');
const { createCard, updateCard, deleteCard: dbDeleteCard, getColumnsByBoardId, addTagToCard } = require('../../out/src/database');
const { selectOrCreateTags } = require('../../out/vscode/Tag');
const { getDebugLogger } = require('../../out/src/logic/DebugLogger');

async function addCard(column) {
    const debugLog = getDebugLogger();
    const cardTitle = await vscode.window.showInputBox({ prompt: 'Enter a title for the new card' });
    if (!cardTitle) {
        return;
    }
    const content = await vscode.window.showInputBox({ prompt: 'Optional: Enter content/context for this card' });
    
    debugLog.log('=== Creating new card ===');
    debugLog.log('Column ID:', column.columnId);
    debugLog.log('Card title:', cardTitle);
    
    const newCard = createCard({ title: cardTitle, content: content || '', column_id: column.columnId, position: 0, card_type: 'simple', priority: 0 });
    debugLog.log('createCard returned:', newCard);
    
    // Verify card was created and has an ID
    if (!newCard || !newCard.id) {
        debugLog.log('ERROR: No card or ID returned from createCard');
        vscode.window.showErrorMessage('Failed to create card - no ID returned');
        return;
    }
    
    debugLog.log('Card created successfully with ID:', newCard.id);
    
    // Prompt for tags
    const tagIds = await selectOrCreateTags();
    if (tagIds && tagIds.length > 0) {
        debugLog.log('Selected tag IDs:', tagIds);
        
        for (const tagId of tagIds) {
            try {
                debugLog.log(`Adding tag ${tagId} to card ${newCard.id}`);
                addTagToCard(newCard.id, tagId);
                debugLog.log(`Successfully added tag ${tagId}`);
            } catch (err) {
                debugLog.log(`ERROR adding tag: ${err.message || err}`);
                vscode.window.showErrorMessage(`Failed to add tag: ${err.message || err}`);
            }
        }
    }
}

async function editCard(card) {
    // Fetch current card to prefill content if available
    let current;
    try {
        const { getCardById } = require('../../out/src/database');
        current = getCardById(card.cardId);
    } catch (e) {
        current = undefined;
    }

    const newCardTitle = await vscode.window.showInputBox({ value: current?.title || card.label, prompt: 'Edit card title' });
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
    const columnNames = columns.map(column => column.title);
    const selectedColumnName = await vscode.window.showQuickPick(columnNames, { placeHolder: 'Select a column to move the card to' });
    if (selectedColumnName) {
        const selectedColumn = columns.find(column => column.title === selectedColumnName);
        if (selectedColumn) {
            // Check if moving to or from "Done" column
            const { getColumnById } = require('../../out/src/database');
            const currentColumn = getColumnById(card.columnId);
            
            const movingToDone = selectedColumn.title === 'Done';
            const movingFromDone = currentColumn.title === 'Done';
            
            const updateData = { id: card.cardId, column_id: selectedColumn.id };
            
            if (movingToDone) {
                // Set completed_at to current datetime
                updateData.completed_at = new Date().toISOString();
            } else if (movingFromDone) {
                // Clear completed_at
                updateData.completed_at = null;
            }
            
            updateCard(updateData);
        }
    }
}

module.exports = {
    addCard,
    editCard,
    deleteCard,
    moveCard
};
