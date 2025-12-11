import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Get the notes folder path based on the database configuration
 */
export function getNotesFolder(): string | null {
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
