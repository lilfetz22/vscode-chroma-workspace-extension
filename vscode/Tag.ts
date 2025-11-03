import * as vscode from 'vscode';
import { createTag, getAllTags, updateTag, deleteTag, addTagToCard, removeTagFromCard, getTagsByCardId } from '../database';

async function addTag() {
    const name = await vscode.window.showInputBox({ prompt: 'Enter tag name' });
    if (!name) {
        return;
    }
    const color = await vscode.window.showInputBox({ prompt: 'Enter tag color (e.g., #ff0000)' });
    if (!color) {
        return;
    }
    createTag({ name, color });
}

async function editTag(tag) {
    const newName = await vscode.window.showInputBox({ value: tag.name, prompt: 'Enter new tag name' });
    if (!newName) {
        return;
    }
    const newColor = await vscode.window.showInputBox({ value: tag.color, prompt: 'Enter new tag color' });
    if (!newColor) {
        return;
    }
    updateTag({ id: tag.id, name: newName, color: newColor });
}

async function deleteTagWithConfirmation(tag) {
    const confirm = await vscode.window.showQuickPick(['Yes', 'No'], { placeHolder: `Are you sure you want to delete the tag "${tag.name}"?` });
    if (confirm === 'Yes') {
        deleteTag(tag.id);
    }
}

async function assignTag(card) {
    const tags = getAllTags();
    const tagNames = tags.map(t => t.name);
    const tagName = await vscode.window.showQuickPick(tagNames, { placeHolder: 'Select a tag to assign' });
    if (tagName) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
            // Check if tag is already assigned
            const assignedTags = getTagsByCardId(card.id);
            const alreadyAssigned = assignedTags.some(t => t.id === tag.id);
            if (alreadyAssigned) {
                vscode.window.showInformationMessage(`Tag "${tag.name}" is already assigned to this card.`);
                return;
            }
            try {
                addTagToCard(card.id, tag.id);
            } catch (err) {
                vscode.window.showErrorMessage(`Failed to assign tag: ${err.message || err}`);
            }
        }
    }
}

async function removeTag(card) {
    const tags = getTagsByCardId(card.id);
    const tagNames = tags.map(t => t.name);
    const tagName = await vscode.window.showQuickPick(tagNames, { placeHolder: 'Select a tag to remove' });
    if (tagName) {
        const tag = tags.find(t => t.name === tagName);
        if (tag) {
            removeTagFromCard(card.id, tag.id);
        }
    }
}

export { addTag, editTag, deleteTagWithConfirmation as deleteTag, assignTag, removeTag };
