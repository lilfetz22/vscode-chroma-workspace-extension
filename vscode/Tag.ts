import * as vscode from 'vscode';
import { createTag, getAllTags, updateTag, deleteTag, addTagToCard, removeTagFromCard, getTagsByCardId, getCardById, getDb } from '../src/database';
import { getDebugLogger } from '../src/logic/DebugLogger';
import { CSS_COLOR_MAP, CLASSIC_COLORS, normalizeHex as utilNormalizeHex } from '../src/utils/colors';

function normalizeHex(input: string): string | undefined {
    // Try the utility normalizeHex first (handles named colors and hex)
    const normalized = utilNormalizeHex(input);
    if (normalized) return normalized;
    
    // Handle 3-digit hex shorthand (e.g., #abc -> #aabbcc)
    const v = input.trim().replace(/^#/,'');
    if (/^[0-9a-fA-F]{3}$/.test(v)) {
        const r = v[0]; const g = v[1]; const b = v[2];
        return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
    }
    return undefined;
}

function nameToHex(name: string): string | undefined {
    const key = name.trim().toLowerCase();
    return CSS_COLOR_MAP[key];
}

function getRandomColor(): string {
    const colors = CLASSIC_COLORS;
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex].hex;
}

async function promptForCustomColor(initial?: string): Promise<string | undefined> {
    const value = await vscode.window.showInputBox({
        prompt: 'Enter color name or hex (e.g., blue or #ff0000)',
        value: initial,
        validateInput: (text: string) => {
            if (normalizeHex(text) || nameToHex(text)) return undefined;
            return 'Enter a valid CSS color name or #RRGGBB';
        }
    });
    if (!value) return undefined;
    return normalizeHex(value) || nameToHex(value);
}

async function pickColor(initial?: string): Promise<string | undefined> {
    interface ColorPickItem extends vscode.QuickPickItem {
        hex?: string;
        colorType: 'classic' | 'custom' | 'random';
    }
    
    const items: ColorPickItem[] = [
        { label: '🎲 Random color', description: 'Choose a random color', colorType: 'random' as const },
        ...CLASSIC_COLORS.map(c => ({ label: c.name, description: c.hex, hex: c.hex, colorType: 'classic' as const })),
        { label: 'Custom color…', description: 'Type a color name or hex', colorType: 'custom' as const }
    ];

    const pick = await vscode.window.showQuickPick(items, { placeHolder: 'Pick a color or choose Custom' });
    if (!pick) return undefined;
    if (pick.colorType === 'random') return getRandomColor();
    if (pick.colorType === 'classic' && pick.hex) return pick.hex;
    return promptForCustomColor(initial);
}

async function addTag() {
    const name = await vscode.window.showInputBox({ prompt: 'Enter tag name' });
    if (!name) {
        return;
    }
    const color = await pickColor();
    if (!color) {
        return;
    }
    createTag({ name, color });
}

async function editTag(tag: any) {
    const newName = await vscode.window.showInputBox({ value: tag.name, prompt: 'Enter new tag name' });
    if (!newName) {
        return;
    }
    const newColor = await pickColor(tag.color);
    if (!newColor) {
        return;
    }
    updateTag({ id: tag.id, name: newName, color: newColor });
}

async function deleteTagWithConfirmation(tag: any) {
    const debugLog = getDebugLogger();
    debugLog.log('=== deleteTagWithConfirmation called ===');
    debugLog.log('Tag object:', tag);
    
    // Extract tag ID and name - handle both Tag objects and TreeItem objects
    const tagId = tag?.id;
    const tagName = tag?.name || tag?.label;
    
    debugLog.log('Extracted tagId:', tagId);
    debugLog.log('Extracted tagName:', tagName);
    
    if (!tagId) {
        vscode.window.showErrorMessage('Unable to delete tag: Missing tag id.');
        return;
    }
    
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `Are you sure you want to delete the tag "${tagName}"?` });
    if (confirm === 'Yes') {
        try {
            debugLog.log(`Deleting tag ${tagId}...`);
            deleteTag(tagId);
            debugLog.log(`Tag ${tagId} deleted successfully`);
            vscode.window.showInformationMessage(`Tag "${tagName}" deleted successfully.`);
        } catch (err: any) {
            debugLog.log(`ERROR deleting tag: ${err.message || err}`);
            vscode.window.showErrorMessage(`Failed to delete tag: ${err.message || err}`);
            throw err; // Re-throw so the command handler can see the error
        }
    }
}

async function assignTag(card: any) {
    const debugLog = getDebugLogger();
    debugLog.log('=== assignTag called ===');
    debugLog.log('Card object:', card);
    const cardId = card?.id || card?.cardId;
    debugLog.log('Extracted cardId:', cardId);
    
    if (!cardId) {
        vscode.window.showErrorMessage('Unable to assign tag: Missing card id.');
        return;
    }
    
    const tags = getAllTags();
    if (tags.length === 0) {
        vscode.window.showInformationMessage('No tags available. Please create a tag first.');
        return;
    }
    const tagNames = tags.map(t => t.name);
    const tagName = await vscode.window.showQuickPick(tagNames, { placeHolder: 'Select a tag to assign' });
    if (tagName) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
            // Check if tag is already assigned
            const assignedTags = getTagsByCardId(cardId);
            const alreadyAssigned = assignedTags.some(t => t.id === tag.id);
            if (alreadyAssigned) {
                vscode.window.showInformationMessage(`Tag "${tag.name}" is already assigned to this card.`);
                return;
            }
            try {
                debugLog.log(`Attempting to add tag ${tag.id} to card ${cardId}`);
                addTagToCard(cardId, tag.id);
                debugLog.log(`Successfully added tag ${tag.id} to card ${cardId}`);
                vscode.window.showInformationMessage(`Tag "${tag.name}" assigned successfully.`);
            } catch (err: any) {
                debugLog.log(`ERROR: Failed to add tag ${tag.id} to card ${cardId}:`, err);
                vscode.window.showErrorMessage(`Failed to assign tag: ${err.message || err}`);
            }
        }
    }
}

async function removeTag(card: any) {
    const cardId = card?.id || card?.cardId;
    if (!cardId) {
        vscode.window.showErrorMessage('Unable to remove tag: Missing card id.');
        return;
    }
    const tags = getTagsByCardId(cardId);
    const tagNames = tags.map(t => t.name);
    if (tags.length === 0) {
        vscode.window.showInformationMessage('This card has no tags to remove.');
        return;
    }
    const tagName = await vscode.window.showQuickPick(tagNames, { placeHolder: 'Select a tag to remove' });
    if (tagName) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
            removeTagFromCard(cardId, tag.id);
        }
    }
}

/**
 * Prompts user to select existing tag(s) or create new ones.
 * Returns array of tag IDs that were selected/created.
 * @param preselectedTagIds - Optional array of tag IDs to pre-select (e.g., current tags on edit)
 * @param excludeTagIds - Optional array of tag IDs to exclude from available options (e.g., already-assigned tags)
 */
async function selectOrCreateTags(preselectedTagIds?: string[], excludeTagIds?: string[]): Promise<string[] | undefined> {
    const existingTags = getAllTags();
    const exclude = new Set(excludeTagIds || []);
    const preselected = new Set(preselectedTagIds || []);
    
    // Helper to update label with checkmark indicator
    const getLabelWithIndicator = (tagName: string, isSelected: boolean): string => {
        return isSelected ? `$(check) ${tagName}` : tagName;
    };
    
    // Filter out excluded tags and build quick pick items
    const availableTags = existingTags.filter(t => !exclude.has(t.id));
    const items: (vscode.QuickPickItem & { tagId?: string; action?: 'create' | 'done' })[] = [
        { label: '$(add) Create new tag…', action: 'create' as const },
        { label: '$(check) Done selecting tags', action: 'done' as const },
        ...availableTags.map(t => ({ 
            label: getLabelWithIndicator(t.name, preselected.has(t.id)), 
            description: t.color,
            tagId: t.id
        }))
    ];

    const selectedTagIds: string[] = Array.from(preselected);
    let continueSelecting = true;

    while (continueSelecting) {
        const pick = await vscode.window.showQuickPick(items, { 
            placeHolder: selectedTagIds.length === 0 
                ? 'Select existing tags or create new ones (optional)' 
                : `${selectedTagIds.length} tag(s) selected. Select more or choose Done`,
            canPickMany: false
        });
        
        if (!pick) {
            // User cancelled
            return undefined;
        }

        if (pick.action === 'done') {
            continueSelecting = false;
        } else if (pick.action === 'create') {
            // Create new tag
            const name = await vscode.window.showInputBox({ prompt: 'Enter tag name' });
            if (!name) continue;
            
            const color = await pickColor();
            if (!color) continue;
            
            const newTag = createTag({ name, color });
            selectedTagIds.push(newTag.id);
            
            // Add the new tag to items list (after the action items at the top) with checkmark
            items.push({ 
                label: getLabelWithIndicator(newTag.name, true), 
                description: newTag.color,
                tagId: newTag.id
            });
        } else if (pick.tagId) {
            // Toggle tag selection
            const idx = selectedTagIds.indexOf(pick.tagId);
            if (idx >= 0) {
                selectedTagIds.splice(idx, 1);
                // Remove the checkmark from label
                pick.label = getLabelWithIndicator(pick.label.replace(/^\$\(check\)\s+/, ''), false);
            } else {
                selectedTagIds.push(pick.tagId);
                // Add checkmark to label
                pick.label = getLabelWithIndicator(pick.label.replace(/^\$\(check\)\s+/, ''), true);
            }
        }
    }

    return selectedTagIds;
}

export { addTag, editTag, deleteTagWithConfirmation as deleteTag, assignTag, removeTag, selectOrCreateTags };
