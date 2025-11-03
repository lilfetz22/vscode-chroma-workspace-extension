const vscode = require('vscode');
const { createTag, getAllTags, updateTag, deleteTag, addTagToCard, removeTagFromCard, getTagsByCardId } = require('../out/database');

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
            addTagToCard(card.id, tag.id);
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

module.exports = {
    addTag,
    editTag,
    deleteTag: deleteTagWithConfirmation,
    assignTag,
    removeTag
};
