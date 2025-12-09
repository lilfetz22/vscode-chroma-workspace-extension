const vscode = require('vscode');
const { createCard, updateCard, deleteCard: dbDeleteCard, getColumnsByBoardId, addTagToCard, removeTagFromCard, getTagsByCardId, getCardsByColumnId, reorderCardsOnInsert, reorderCardsOnRemove, getCardById, saveDatabase } = require('../../out/src/database');
const { selectOrCreateTags } = require('../../out/vscode/Tag');
const { getDebugLogger } = require('../../out/src/logic/DebugLogger');
const { getSettingsService } = require('../../out/src/logic/SettingsService');

/**
 * Prompt user to select position for a card in a column.
 * Shows "Top", "Bottom", top 10 cards, and "Load More" pagination.
 * @param {string} columnId - The column where the card will be placed
 * @param {string} columnTitle - The title of the column (for display)
 * @param {string} [excludeCardId] - Optional card ID to exclude from the list (useful when moving within the same column)
 * @param {number} [currentPosition] - Optional current position of the card being edited (shows "Current" option if provided)
 * @returns {Promise<number>} The selected position (1-based), or 1 if cancelled
 */
async function promptForCardPosition(columnId, columnTitle, excludeCardId, currentPosition) {
    const debugLog = getDebugLogger();
    debugLog.log(`=== Prompting for card position in column: ${columnTitle} ===`);
    
    // Get all cards in the column, ordered by position, optionally excluding the active card
    const cards = getCardsByColumnId(columnId).filter(c => c.id !== excludeCardId);
    debugLog.log(`Found ${cards.length} cards in column`);
    
    let offset = 0;
    const pageSize = 10;
    
    while (true) {
        const items = [];
        
        // Add "Current" option if editing (currentPosition is provided)
        if (currentPosition !== undefined) {
            items.push({
                label: '$(circle-large-filled) Current',
                description: 'Keep the card at its current position',
                position: currentPosition
            });
            items.push({ label: '', kind: vscode.QuickPickItemKind.Separator });
        }
        
        // Add "Top" option (position 1)
        items.push({
            label: '$(arrow-up) Top',
            description: 'Add to the top of the column',
            position: 1
        });
        
        // Add "Bottom" option (position = max + 1 after excluding the current card if applicable)
        const bottomPosition = cards.length + 1;
        items.push({
            label: '$(arrow-down) Bottom',
            description: 'Add to the bottom of the column',
            position: bottomPosition
        });
        
        // Add separator
        items.push({ label: '', kind: vscode.QuickPickItemKind.Separator });
        
        // Add paginated cards
        const pageCards = cards.slice(offset, offset + pageSize);
        for (let i = 0; i < pageCards.length; i++) {
            const card = pageCards[i];
            const actualPosition = offset + i + 1;
            items.push({
                label: `${actualPosition}. ${card.title}`,
                description: `Insert after this card (position ${actualPosition + 1})`,
                position: actualPosition + 1
            });
        }
        
        // Add "Load More" option if there are more cards
        if (offset + pageSize < cards.length) {
            items.push({ label: '', kind: vscode.QuickPickItemKind.Separator });
            items.push({
                label: '$(sync) Load More',
                description: `Show next ${Math.min(pageSize, cards.length - offset - pageSize)} cards`,
                isLoadMore: true
            });
        }
        
        const selected = await vscode.window.showQuickPick(items, {
            placeHolder: `Where should this card be ranked in "${columnTitle}"?`
        });
        
        if (!selected) {
            debugLog.log('Position selection cancelled, defaulting to top (position 1)');
            return 1;
        }
        
        if (selected.isLoadMore) {
            // Load next page
            offset += pageSize;
            debugLog.log(`Loading more cards, offset now: ${offset}`);
            continue;
        }
        
        debugLog.log(`User selected position: ${selected.position}`);
        return selected.position;
    }
}

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
    debugLog.log('Column title:', column.label);
    
    // Determine if this is a completion column
    const completionColumnName = getSettingsService().getKanbanSettings().completionColumn;
    const isCompletionColumn = column.label.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
    
    let position;
    if (isCompletionColumn) {
        // Completion columns: auto-assign to top (position 1)
        position = 1;
        debugLog.log('Completion column detected, auto-assigning position 1');
    } else {
        // Non-completion columns: prompt user for position
        position = await promptForCardPosition(column.columnId, column.label);
        debugLog.log('User selected position:', position);
        
        // Reorder existing cards to make space for the new card
        reorderCardsOnInsert(column.columnId, position);
    }
    
    const newCard = createCard({ title: cardTitle, content: content || '', column_id: column.columnId, position: position, card_type: 'simple', priority: 0 });
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
    
    // Save database after all operations
    saveDatabase();
    debugLog.log('Database saved after card creation');
}

async function editCard(card) {
    const debugLog = getDebugLogger();
    
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
    
    const updateData = { 
        id: card.cardId, 
        title: newCardTitle, 
        content: newContent !== undefined ? newContent : current?.content 
    };

    // Check if this is a completion column
    const { getColumnById } = require('../../out/src/database');
    const currentColumn = getColumnById(card.columnId);
    const completionColumnName = getSettingsService().getKanbanSettings().completionColumn;
    const isCompletionColumn = currentColumn.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
    
    debugLog.log('=== Editing card position ===');
    debugLog.log(`Current position: ${current?.position}`);
    debugLog.log(`Is completion column: ${isCompletionColumn}`);
    
    // Only allow position editing in non-completion columns
    if (!isCompletionColumn) {
        debugLog.log('Prompting user for new position...');
        const currentPos = current?.position || card.position;
        const newPosition = await promptForCardPosition(card.columnId, currentColumn.title, card.cardId, currentPos);
        debugLog.log(`User selected new position: ${newPosition}`);
        
        const currentPosition = current?.position || card.position;
        
        // Only reorder if position actually changed
        if (newPosition !== currentPosition) {
            debugLog.log(`Position changed from ${currentPosition} to ${newPosition}`);
            
            if (newPosition < currentPosition) {
                // Moving up: decrement cards between new and old position
                debugLog.log(`Moving up: decrementing cards from position ${newPosition} to ${currentPosition - 1}`);
                const cardsToUpdate = getCardsByColumnId(card.columnId).filter(
                    c => c.position >= newPosition && c.position < currentPosition && c.id !== card.cardId
                );
                debugLog.log(`Cards to decrement: ${cardsToUpdate.map(c => `${c.position}:${c.id}`).join(', ')}`);
                for (const c of cardsToUpdate) {
                    updateCard({ id: c.id, position: c.position + 1 });
                }
            } else if (newPosition > currentPosition) {
                // Moving down: increment cards between old and new position
                debugLog.log(`Moving down: incrementing cards from position ${currentPosition + 1} to ${newPosition}`);
                const cardsToUpdate = getCardsByColumnId(card.columnId).filter(
                    c => c.position > currentPosition && c.position <= newPosition && c.id !== card.cardId
                );
                debugLog.log(`Cards to increment: ${cardsToUpdate.map(c => `${c.position}:${c.id}`).join(', ')}`);
                for (const c of cardsToUpdate) {
                    updateCard({ id: c.id, position: c.position - 1 });
                }
            }
            
            updateData.position = newPosition;
            debugLog.log(`Updated card position to ${newPosition}`);
        }
    } else {
        debugLog.log('Skipping position edit for completion column');
    }
    
    updateCard(updateData);

    // Tag editing flow integrated into edit
    try {
        debugLog.log('=== Editing tags for card ===');
        const existingTags = getTagsByCardId(card.cardId);
        const existingTagIds = existingTags.map(t => t.id);
        debugLog.log('Existing tag IDs:', existingTagIds);

        // Call selectOrCreateTags with pre-selected current tags and no exclusions
        // This way user can toggle current tags on/off and see them already checked
        const selectedTagIds = await selectOrCreateTags(existingTagIds);
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
    
    // Save database after all operations
    saveDatabase();
    debugLog.log('Database saved after card edit');
}

async function deleteCard(card) {
    const debugLog = getDebugLogger();
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the card "${card.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        debugLog.log('Deleting card:', card.cardId);
        
        // Get the card's current position and column before deletion
        const currentCard = getCardById(card.cardId);
        const columnId = currentCard.column_id;
        const position = currentCard.position;
        
        debugLog.log(`Card position: ${position}, column: ${columnId}`);
        
        // Delete the card
        dbDeleteCard(card.cardId);
        
        // Reorder remaining cards in the column
        reorderCardsOnRemove(columnId, position);
        debugLog.log(`Reordered cards in column ${columnId} after deletion`);
        
        saveDatabase();
        debugLog.log('Database saved after card deletion');
    }
}

async function moveCard(card) {
    const debugLog = getDebugLogger();
    debugLog.log('\n==================== MOVE CARD START ====================');
    debugLog.log(`Moving card: "${card.label}"`);
    debugLog.log(`Current position: ${card.position}`);
    debugLog.log(`Current column ID: ${card.columnId}`);
    
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
            debugLog.log('User cancelled move due to vacation mode');
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
            
            debugLog.log(`Destination column: "${selectedColumn.title}" (ID: ${selectedColumn.id})`);
            debugLog.log(`Completion column setting: "${completionColumnName}"`);
            
            // Check if moving to or from completion column (case-insensitive and trimmed)
            const movingToCompletion = selectedColumn.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
            const movingFromCompletion = currentColumn.title.toLowerCase().trim() === completionColumnName.toLowerCase().trim();
            
            debugLog.log(`Moving to completion column: ${movingToCompletion}`);
            debugLog.log(`Moving from completion column: ${movingFromCompletion}`);
            
            // STEP 1: Decrement positions of all cards in SOURCE column that are positioned AFTER the current card
            // This effectively removes the card from the source column's position sequence
            debugLog.log('STEP 1: Adjusting positions in source column...');
            const sourceCards = getCardsByColumnId(card.columnId);
            debugLog.log(`Cards in source column before adjustment: ${sourceCards.map(c => `${c.position}:${c.id}`).join(', ')}`);
            
            // Get the current card's position from the database (in case it's changed)
            const currentCard = getCardById(card.cardId);
            const currentPosition = currentCard.position;
            debugLog.log(`Current card position from DB: ${currentPosition}`);
            
            // Decrement positions of cards positioned after the current card in the source column
            reorderCardsOnRemove(card.columnId, currentPosition);
            debugLog.log(`Decremented positions in source column`);
            
            const sourceCardsAfter = getCardsByColumnId(card.columnId);
            debugLog.log(`Cards in source column after adjustment: ${sourceCardsAfter.map(c => `${c.position}:${c.id}`).join(', ')}`);
            
            const updateData = { id: card.cardId, column_id: selectedColumn.id };
            
            // STEP 2: Determine position in destination column
            let position;
            if (movingToCompletion) {
                // Completion columns: auto-assign to top (position 1)
                position = 1;
                debugLog.log('STEP 2: Moving to completion column, auto-assigning position 1');
                updateData.completed_at = new Date().toISOString();
            } else {
                // Non-completion columns: prompt user for position
                debugLog.log('STEP 2: Prompting user for position in destination column...');
                const excludeCardId = selectedColumn.id === card.columnId ? card.cardId : undefined;
                position = await promptForCardPosition(selectedColumn.id, selectedColumn.title, excludeCardId);
                debugLog.log(`User selected position: ${position}`);
                
                if (movingFromCompletion) {
                    debugLog.log('Clearing completed_at since moving away from completion column');
                    updateData.completed_at = null;
                }
            }
            
            // STEP 3: Reorder existing cards in destination column to make space
            debugLog.log(`STEP 3: Reordering cards in destination column at position ${position}...`);
            const destCards = getCardsByColumnId(selectedColumn.id);
            debugLog.log(`Cards in destination column before reorder: ${destCards.map(c => `${c.position}:${c.id}`).join(', ')}`);
            
            reorderCardsOnInsert(selectedColumn.id, position);
            
            const destCardsAfter = getCardsByColumnId(selectedColumn.id);
            debugLog.log(`Cards in destination column after reorder: ${destCardsAfter.map(c => `${c.position}:${c.id}`).join(', ')}`);
            
            updateData.position = position;
            
            debugLog.log(`STEP 4: Updating card with new column (${selectedColumn.id}) and position (${position})`);
            // Update card with new column and position
            updateCard(updateData);
            
            // Save database after all position updates and column changes
            saveDatabase();
            debugLog.log('Database saved after card move');
            
            debugLog.log('==================== MOVE CARD COMPLETE ====================\n');
        }
    } else {
        debugLog.log('User cancelled column selection');
    }
}

module.exports = {
    addCard,
    editCard,
    deleteCard,
    moveCard
};
