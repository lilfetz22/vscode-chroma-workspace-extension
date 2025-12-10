# Notes View Feature

## Overview
Added a new "Notes" view to the Chroma Workspace extension panel that displays `.notesnlh` files from a dedicated notes folder.

## Implementation Details

### Files Created
- **`src/views/NotesProvider.ts`**: TreeDataProvider implementation for the Notes view
  - Reads `.notesnlh` files from the `notes` folder within the `.chroma` directory
  - Automatically creates the notes folder if it doesn't exist
  - Supports both relative and absolute database paths
  - Each note file appears as a clickable item that opens the file in VS Code

### Files Modified
- **`package.json`**: 
  - Added Notes view to the `chroma-workspace` views container
  - Positioned after Kanban, Scheduled Tasks, and Tags

- **`vscode/extension.js`**:
  - Imported `NotesProvider` from compiled TypeScript
  - Added `notesProvider` variable declaration
  - Registered the Notes view with VS Code
  - Added `chroma.refreshNotes` command
  - Integrated notesProvider refresh in:
    - Database reload events
    - File system watcher for `.notesnlh` files (create, change, delete)

## Folder Structure
The notes folder location is determined by the `chroma.database.path` setting:
- **Default**: `.chroma/notes/` (relative to workspace root)
- **Custom path**: `<directory-of-database>/notes/`

For example:
- If `database.path` is `.chroma/chroma.db`, notes folder is `.chroma/notes/`
- If `database.path` is `C:\shared\chroma.db`, notes folder is `C:\shared\notes\`

## Features
1. **Automatic folder creation**: The notes folder is created automatically if it doesn't exist
2. **Live updates**: The view refreshes when `.notesnlh` files are created, modified, or deleted
3. **One-click access**: Clicking a note name opens the file in VS Code
4. **Sorted display**: Notes are displayed alphabetically by filename
5. **Icon**: Each note displays with a document icon (file-text theme icon)

## Usage
1. Open the Chroma Workspace panel in VS Code
2. Click on the "Notes" view (below Tags)
3. Create `.notesnlh` files in the `.chroma/notes/` folder
4. Files will appear in the Notes view automatically
5. Click any note to open it

## Testing
To test the feature:
1. Press F5 to launch the Extension Development Host
2. Open a workspace with Chroma Workspace enabled
3. Navigate to the Chroma Workspace panel
4. Verify the "Notes" view appears
5. Create a test note file: `.chroma/notes/test.notesnlh`
6. Confirm the note appears in the Notes view
7. Click the note to verify it opens correctly

## Future Enhancements (Optional)
- Add context menu commands to create new notes from the view
- Add rename/delete commands via context menu
- Add note categorization or folders
- Display note metadata (size, date modified)
