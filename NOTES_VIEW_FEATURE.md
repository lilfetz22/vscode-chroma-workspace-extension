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

- **`vscode/Note.ts`**: Note management operations
  - `addNote()` function to create new note files
  - Validates note names and prevents duplicates
  - Auto-creates notes folder if needed
  - Opens newly created notes in the editor

### Files Modified
- **`package.json`**: 
  - Added Notes view to the `chroma-workspace` views container
  - Positioned after Kanban, Scheduled Tasks, and Tags
  - Added `chroma.addNote` command
  - Added "Add Note" button to Notes view title menu

- **`vscode/extension.js`**:
  - Imported `NotesProvider` from compiled TypeScript
  - Imported `addNote` from Note.ts
  - Added `notesProvider` variable declaration
  - Registered the Notes view with VS Code
  - Added `chroma.refreshNotes` command
  - Registered `chroma.addNote` command with refresh
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
1. **Add Note button**: Click the "+" button in the Notes view title to create a new note
   - Prompts for note name
   - Validates filename (no invalid characters, no duplicates)
   - Creates file with basic template (`# NoteName\n\n`)
   - Automatically opens the new note in the editor
2. **Automatic folder creation**: The notes folder is created automatically if it doesn't exist

## Usage
1. Open the Chroma Workspace panel in VS Code
2. Click on the "Notes" view (below Tags)
3. Click the "+" button in the Notes view title to create a new note
   - Enter a note name (without .notesnlh extension)
   - The note will be created and opened automatically
4. Alternatively, manually create `.notesnlh` files in the `.chroma/notes/` folder
5. Files will appear in the Notes view automatically
6. Click any note to open it

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
