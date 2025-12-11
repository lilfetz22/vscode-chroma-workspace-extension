import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Represents a note file in the Notes view
 */
export interface NoteFile {
    name: string;
    path: string;
}

/**
 * Provider for the Notes tree view that displays .notesnlh files from the notes folder
 */
export class NotesProvider implements vscode.TreeDataProvider<NoteFile> {
    private _onDidChangeTreeData: vscode.EventEmitter<NoteFile | undefined | null | void> = new vscode.EventEmitter<NoteFile | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<NoteFile | undefined | null | void> = this._onDidChangeTreeData.event;

    /**
     * Refresh the notes view
     */
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    /**
     * Get the tree item representation of a note file
     */
    getTreeItem(element: NoteFile): vscode.TreeItem {
        const treeItem = new vscode.TreeItem(element.name, vscode.TreeItemCollapsibleState.None);
        treeItem.contextValue = 'note';
        treeItem.tooltip = element.path;
        treeItem.command = {
            command: 'vscode.open',
            title: 'Open Note',
            arguments: [vscode.Uri.file(element.path)]
        };
        // Use a document icon for note files
        treeItem.iconPath = new vscode.ThemeIcon('file-text');
        return treeItem;
    }

    /**
     * Get the children (note files) for the tree view
     */
    getChildren(element?: NoteFile): Thenable<NoteFile[]> {
        if (element) {
            // Notes are leaf nodes, no children
            return Promise.resolve([]);
        } else {
            return Promise.resolve(this.getNotes());
        }
    }

    /**
     * Get all .notesnlh files from the notes folder
     */
    private getNotes(): NoteFile[] {
        const notesFolder = this.getNotesFolder();
        
        if (!notesFolder) {
            return [];
        }

        // Check if the notes folder exists
        if (!fs.existsSync(notesFolder)) {
            // Create the notes folder if it doesn't exist
            try {
                fs.mkdirSync(notesFolder, { recursive: true });
            } catch (error) {
                console.error('Failed to create notes folder:', error);
                return [];
            }
        }

        try {
            // Read all files in the notes folder
            const files = fs.readdirSync(notesFolder);
            
            // Filter for .notesnlh files and create NoteFile objects
            const noteFiles: NoteFile[] = files
                .filter(file => file.endsWith('.notesnlh'))
                .map(file => ({
                    name: file,
                    path: path.join(notesFolder, file)
                }))
                .sort((a, b) => a.name.localeCompare(b.name));

            return noteFiles;
        } catch (error) {
            console.error('Error reading notes folder:', error);
            return [];
        }
    }

    /**
     * Get the path to the notes folder based on the database path setting
     */
    private getNotesFolder(): string | null {
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
}
