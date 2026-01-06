# Refresh Column Priority Feature

## Overview
This feature adds a "Refresh Column" button to each KANBAN board column, allowing users to normalize and fix the priority ordering of cards within a column.

## UI Changes
A new inline button appears next to each column in the KANBAN view, alongside the existing "Edit Column", "Delete Column", and "Add Card" buttons.

### Button Location
```
KANBAN View
└── Board
    └── Column [Edit] [Delete] [Refresh] [Add Card]  <-- New "Refresh" button here
        ├── Card 1
        ├── Card 2
        └── Card 3
```

## Functionality

### What the Refresh Button Does
When clicked, the "Refresh Column" button:
1. Retrieves all cards in the selected column
2. Re-sequences their position values to be consecutive (1, 2, 3, ...)
3. Maintains the existing order of cards
4. Fixes any gaps or inconsistencies in position numbering
5. Saves the changes to the database
6. Displays a success message to the user

### Use Cases
- **Fix Position Gaps**: When cards have non-consecutive positions (e.g., 1, 5, 10) after deletions or moves
- **Resolve Ordering Issues**: If there are bugs causing incorrect card positions
- **Manual Realignment**: Quick way to ensure consistent ordering when needed

## Implementation Details

### Database Function
The core logic is in `refreshColumnPriority(columnId)` which:
- Queries cards ordered by their current position
- Iterates through cards and assigns new sequential positions
- Only updates cards whose positions actually changed (optimization)

### Code Changes
1. **src/database.ts**: Added `refreshColumnPriority()` function
2. **src/test-database.ts**: Added test version of the function
3. **vscode/kanban/Board.js**: Added `refreshColumn()` UI handler
4. **vscode/extension.js**: Registered `chroma.refreshColumn` command
5. **package.json**: Added command definition and menu item
6. **test/refresh-column.test.ts**: Added comprehensive test suite

## Testing
All tests pass successfully:
- ✓ Re-sequences card positions to be consecutive
- ✓ Maintains order when positions are already consecutive
- ✓ Handles empty columns gracefully
- ✓ Preserves card order when positions have large gaps

## User Experience
1. User navigates to KANBAN view
2. User sees a column with cards
3. User clicks the "Refresh Column" button (inline with column name)
4. Success message appears: "Column '[Name]' priority ordering refreshed successfully."
5. Column view refreshes to show cards with normalized positions

## Error Handling
If an error occurs during the refresh:
- Error is caught and displayed to the user
- Database transaction is safe (changes only saved on success)
- No data loss occurs
