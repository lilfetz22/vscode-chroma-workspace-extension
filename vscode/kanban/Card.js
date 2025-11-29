const vscode = require('vscode');
const { createCard, updateCard, deleteCard: dbDeleteCard, getColumnsByBoardId, addTagToCard, removeTagFromCard, getTagsByCardId } = require('../../out/src/database');
const { selectOrCreateTags } = require('../../out/vscode/Tag');
const { getDebugLogger } = require('../../out/src/logic/DebugLogger');
const { getSettingsService } = require('../../out/src/logic/SettingsService');

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
    // Check if vacation mode is enabled and warn user
    const settings = getSettingsService().getTaskSettings();
    if (settings.vacationMode) {
        const proceed = await vscode.window.showWarningMessage(
            'Vacation Mode is currently enabled. Scheduled tasks are not being converted to cards. Are you sure you want to edit this card?',
            { modal: true },
            'Yes, Edit Card',
            'Cancel'
        );
        if (proceed !== 'Yes, Edit Card') {
            return;
        }
    }

    // Fetch current card to prefill content if available
    let current;
    try {
        const { getCardById } = require('../../out/src/database');
        current = getCardById(card.cardId);
    } catch (e) {
        // Log error and distinguish between different error types
        console.error('Failed to fetch card for editing:', e);
        
        // If card truly doesn't exist, show error and return
        if (e.message && e.message.includes('does not exist')) {
            vscode.window.showErrorMessage(`Card not found: ${card.label}`);
            return;
        }
        
        // For other errors, log but allow user to continue with current card data
        console.warn('Continuing with fallback card data due to fetch error');
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

    // Tag editing flow integrated into edit
    try {
        const debugLog = getDebugLogger();
        debugLog.log('=== Editing tags for card ===');
        const existingTags = getTagsByCardId(card.cardId);
        const existingTagIds = existingTags.map(t => t.id);
        debugLog.log('Existing tag IDs:', existingTagIds);

        const selectedTagIds = await selectOrCreateTags();
        if (selectedTagIds === undefined) {
            debugLog.log('Tag selection cancelled, retaining existing tags');
            return; // user cancelled tag selection
        }

        // Determine additions and removals
        const toAdd = selectedTagIds.filter(id => !existingTagIds.includes(id));
        const toRemove = existingTagIds.filter(id => !selectedTagIds.includes(id));
        debugLog.log('Tags to add:', toAdd);
        debugLog.log('Tags to remove:', toRemove);

        for (const tagId of toAdd) {
            try {
                addTagToCard(card.cardId, tagId);
                debugLog.log(`Added tag ${tagId} to card ${card.cardId}`);
            } catch (err) {
                debugLog.log(`ERROR adding tag ${tagId} to card ${card.cardId}:`, err);
            }
        }
        for (const tagId of toRemove) {
            try {
                removeTagFromCard(card.cardId, tagId);
                debugLog.log(`Removed tag ${tagId} from card ${card.cardId}`);
            } catch (err) {
                debugLog.log(`ERROR removing tag ${tagId} from card ${card.cardId}:`, err);
            }
        }
    } catch (e) {
        console.error('Failed during tag edit flow:', e);
    }
}

async function deleteCard(card) {
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the card "${card.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        dbDeleteCard(card.cardId);
    }
}

async function moveCard(card) {
    // Check if vacation mode is enabled and warn user
    const settings = getSettingsService().getTaskSettings();
    if (settings.vacationMode) {
        const proceed = await vscode.window.showWarningMessage(
            'Vacation Mode is currently enabled. Scheduled tasks are not being converted to cards. Are you sure you want to move this card?',
            { modal: true },
            'Yes, Move Card',
            'Cancel'
        );
        if (proceed !== 'Yes, Move Card') {
            return;
        }
    }

    const columns = getColumnsByBoardId(card.boardId);
    const columnNames = columns.map(column => column.title);
    const selectedColumnName = await vscode.window.showQuickPick(columnNames, { placeHolder: 'Select a column to move the card to' });
    if (selectedColumnName) {
        const selectedColumn = columns.find(column => column.title === selectedColumnName);
        if (selectedColumn) {
            // Get configured completion column name (default "Done")
            const { getColumnById } = require('../../out/src/database');
            const currentColumn = getColumnById(card.columnId);
            const completionColumnName = getSettingsService().getKanbanSettings().completionColumn;
            
            // Check if moving to or from completion column (case-insensitive and trimmed)
            const movingToCompletion = selectedColumn.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
            const movingFromCompletion = currentColumn.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
            
            const updateData = { id: card.cardId, column_id: selectedColumn.id };
            
            if (movingToCompletion) {
                // Set completed_at to current datetime
                updateData.completed_at = new Date().toISOString();
            } else if (movingFromCompletion) {
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
