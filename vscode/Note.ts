import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getNotesFolder } from '../src/utils/notesFolder';
import { NoteFile } from '../out/src/views/NotesProvider';

/**
 * Create a new note file in the notes folder
 */
export async function addNote(): Promise<void> {
    const notesFolder = getNotesFolder();
    
    if (!notesFolder) {
        vscode.window.showErrorMessage('No workspace folder found. Please open a workspace to create notes.');
        return;
    }

    // Ensure the notes folder exists
    if (!fs.existsSync(notesFolder)) {
        try {
            fs.mkdirSync(notesFolder, { recursive: true });
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to create notes folder: ${error.message || error}`);
            return;
        }
    }

    // Prompt for note name
    const noteName = await vscode.window.showInputBox({
        prompt: 'Enter note name (without extension)',
        placeHolder: 'my-note',
        validateInput: (text: string) => {
            if (!text || text.trim().length === 0) {
                return 'Note name cannot be empty';
            }
            // Check for invalid filename characters
            if (/[<>:"/\\|?*]/.test(text)) {
                return 'Note name contains invalid characters';
            }
            // Check if file already exists
            const filePath = path.join(notesFolder!, `${text.trim()}.notesnlh`);
            if (fs.existsSync(filePath)) {
                return 'A note with this name already exists';
            }
            return undefined;
        }
    });

    if (!noteName || noteName.trim().length === 0) {
        return;
    }

    // Create the note file
    const fileName = `${noteName.trim()}.notesnlh`;
    const filePath = path.join(notesFolder, fileName);

    try {
        // Create an empty note file with a basic template
        const initialContent = `# ${noteName.trim()}\n\n`;
        fs.writeFileSync(filePath, initialContent, 'utf8');

        // Open the newly created note in the editor
        const document = await vscode.workspace.openTextDocument(filePath);
        await vscode.window.showTextDocument(document);

        vscode.window.showInformationMessage(`Note "${fileName}" created successfully.`);
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to create note: ${error.message || error}`);
    }
}

/**
 * Edit an existing note with a multi-step flow:
 * 1. Edit the note name
 * 2. Ask if user wants to delete the note (default: No)
 * 3. If yes, ask for confirmation again (default: No)
 */
export async function editNote(noteFile: NoteFile): Promise<void> {
    const notesFolder = getNotesFolder();
    
    if (!notesFolder) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }

    // Track the current file path throughout the flow (handles optional rename)
    let currentPath = noteFile.path;

    // Step 1: Edit note name
    const currentName = noteFile.name.replace(/\.notesnlh$/, '');
    const newName = await vscode.window.showInputBox({
        prompt: 'Edit note name (without extension)',
        value: currentName,
        validateInput: (text: string) => {
            if (!text || text.trim().length === 0) {
                return 'Note name cannot be empty';
            }
            // Check for invalid filename characters
            if (/[<>:"/\\|?*]/.test(text)) {
                return 'Note name contains invalid characters';
            }
            // Check if file already exists (but allow same name)
            if (text.trim() !== currentName) {
                const filePath = path.join(notesFolder!, `${text.trim()}.notesnlh`);
                if (fs.existsSync(filePath)) {
                    return 'A note with this name already exists';
                }
            }
            return undefined;
        }
    });

    // User cancelled the edit
    if (newName === undefined) {
        return;
    }

    // If name was actually changed, rename the file
    if (newName.trim() !== currentName) {
        try {
            const oldPath = currentPath;
            const newPath = path.join(notesFolder, `${newName.trim()}.notesnlh`);
            
            // Rename the file
            fs.renameSync(oldPath, newPath);
            currentPath = newPath;
            
            // Update the file content to reflect new name in the header
            const content = fs.readFileSync(newPath, 'utf8');
            // Use a robust pattern to match header, and add header if missing
            const headerRegex = /^(# .*)?(\n|$)/;
            let updatedContent;
            if (headerRegex.test(content)) {
                updatedContent = content.replace(headerRegex, `# ${newName.trim()}\n`);
            } else {
                updatedContent = `# ${newName.trim()}\n${content}`;
            }
            fs.writeFileSync(newPath, updatedContent, 'utf8');
            
            vscode.window.showInformationMessage(`Note renamed to "${newName.trim()}".`);
        } catch (error: any) {
            vscode.window.showErrorMessage(`Failed to rename note: ${error.message || error}`);
            return;
        }
    }

    // Step 2: Ask if user wants to delete the note (default: No)
    const deleteChoice = await vscode.window.showQuickPick(
        [
            { label: 'No', picked: true }, // Default to No
            { label: 'Yes' }
        ],
        {
            placeHolder: 'Delete note?',
            canPickMany: false
        }
    );

    if (!deleteChoice || deleteChoice.label === 'No') {
        return;
    }

    // Step 3: If yes, ask for confirmation again (default: No)
    const confirmDelete = await vscode.window.showQuickPick(
        [
            { label: 'No', picked: true }, // Default to No
            { label: 'Yes' }
        ],
        {
            placeHolder: 'Are you sure you want to delete this note? This cannot be undone.',
            canPickMany: false
        }
    );

    if (!confirmDelete || confirmDelete.label === 'No') {
        vscode.window.showInformationMessage('Delete cancelled.');
        return;
    }

    // Delete the note file (use tracked currentPath which accounts for rename/no-rename)
    try {
        fs.unlinkSync(currentPath);
        vscode.window.showInformationMessage('Note deleted successfully.');
    } catch (error: any) {
        vscode.window.showErrorMessage(`Failed to delete note: ${error.message || error}`);
    }
}
