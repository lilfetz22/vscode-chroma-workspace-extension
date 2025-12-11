import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Get the notes folder path based on the database configuration
 */
function getNotesFolder(): string | null {
    const config = vscode.workspace.getConfiguration('chroma');
    const dbPath = config.get<string>('database.path', '.chroma/chroma.db');

    // Get the workspace folder
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders || workspaceFolders.length === 0) {
        return null;
    }

    const workspaceRoot = workspaceFolders[0].uri.fsPath;

    // Extract the directory from the database path
    let chromaFolder: string;
    
    if (path.isAbsolute(dbPath)) {
        // Absolute path - use the directory of the database file
        chromaFolder = path.dirname(dbPath);
    } else {
        // Relative path - resolve from workspace root
        const fullDbPath = path.join(workspaceRoot, dbPath);
        chromaFolder = path.dirname(fullDbPath);
    }

    // The notes folder is in the same directory as the database file
    return path.join(chromaFolder, 'notes');
}

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
