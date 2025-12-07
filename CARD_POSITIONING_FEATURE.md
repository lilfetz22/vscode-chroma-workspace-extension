# Card Positioning Feature Implementation

## Overview
This document describes the user-selectable card positioning feature that allows users to control where cards are placed within Kanban columns during creation and movement.

## Feature Summary

### Key Capabilities
1. **Position Selection During Card Creation**: When creating a new card, users can choose where it should be ranked in the target column
2. **Position Selection During Card Movement**: When moving a card to a different column, users can select its new position
3. **Smart Completion Column Handling**: Cards moved to the "Done" column (or configured completion column) are automatically placed at the top without prompting
4. **Paginated Position UI**: Shows top 10 cards with "Load More" pagination for columns with many cards
5. **Sequential Position Numbering**: Uses 1-based sequential positions (1, 2, 3...) for simple, intuitive ordering

## Implementation Details

### Database Migration (v12)
- **File**: `src/migrations.ts`
- **Purpose**: Assigns sequential positions to all existing cards in each column
- **Logic**: 
  - Iterates through all columns in the database
  - Skips completion columns (cards already sorted by `completed_at`)
  - Assigns positions 1, 2, 3... to cards based on current position, then created_at
  - Runs automatically on extension activation

### Core Functions

#### 1. `reorderCardsOnInsert(columnId, insertPosition)`
- **File**: `src/database.ts`
- **Purpose**: Makes space for a new card by shifting existing cards
- **Logic**: Increments position by 1 for all cards at or above the insertion position
- **Example**: Inserting at position 3 shifts positions 3→4, 4→5, 5→6, etc.

#### 2. `promptForCardPosition(columnId, columnTitle)`
- **File**: `vscode/kanban/Card.js`
- **Purpose**: Interactive UI for selecting card position
- **Returns**: The selected position (1-based integer)
- **UI Elements**:
  - **Top** - Places card at position 1 (pushes all cards down)
  - **Bottom** - Places card at the end (last position + 1)
  - **Card List** - Shows current cards with their positions (e.g., "3. Task Name")
  - **Load More** - Loads next 10 cards (pagination)

#### 3. Enhanced `addCard(column)`
- **File**: `vscode/kanban/Card.js`
- **Changes**:
  1. Checks if target column is completion column
  2. If completion column: auto-assigns position 1
  3. If non-completion column: prompts user for position
  4. Calls `reorderCardsOnInsert()` to make space
  5. Creates card with selected position

#### 4. Enhanced `moveCard(card)`
- **File**: `vscode/kanban/Card.js`
- **Changes**:
  1. Prompts for destination column (existing behavior)
  2. Checks if destination is completion column
  3. If completion column: auto-assigns position 1, sets `completed_at`
  4. If non-completion column: prompts user for position
  5. Calls `reorderCardsOnInsert()` to make space
  6. Updates card with new column and position

## User Experience Flow

### Creating a New Card (Non-Completion Column)
```
1. User: "Chroma: Add Card to Column"
2. Prompt: "Enter a title for the new card"
3. Prompt: "Optional: Enter content/context for this card"
4. Prompt: "Where should this card be ranked in 'To Do'?"
   Options:
   ↑ Top (Add to the top of the column)
   ↓ Bottom (Add to the bottom of the column)
   ─────────────────────────────────────────
   1. Existing Card Title A (Insert after this card - position 2)
   2. Existing Card Title B (Insert after this card - position 3)
   3. Existing Card Title C (Insert after this card - position 4)
   ...
   ⟳ Load More (Show next 10 cards)
5. Prompt: "Select tags for this card" (existing behavior)
6. Card created at selected position
```

### Creating a New Card (Completion Column)
```
1. User: "Chroma: Add Card to Column" (Done column selected)
2. Prompt: "Enter a title for the new card"
3. Prompt: "Optional: Enter content/context for this card"
4. [Position selection SKIPPED - auto-assigned to position 1]
5. Prompt: "Select tags for this card"
6. Card created at top of Done column
```

### Moving a Card (To Non-Completion Column)
```
1. User: "Chroma: Move Card"
2. Prompt: "Select a column to move the card to"
3. Prompt: "Where should this card be ranked in 'In Progress'?"
   [Same options as card creation]
4. Card moved to selected position
```

### Moving a Card (To Completion Column)
```
1. User: "Chroma: Move Card"
2. Prompt: "Select a column to move the card to" (Done selected)
3. [Position selection SKIPPED - auto-assigned to position 1]
4. Card moved to top of Done column, completed_at timestamp set
```

## Configuration

### Completion Column Setting
- **Setting**: `chroma.kanban.completionColumn`
- **Default**: `"Done"`
- **Purpose**: Determines which column uses `completed_at` sorting instead of position
- **Comparison**: Case-insensitive and trimmed (e.g., "done", " Done ", "DONE" all match)

## Technical Considerations

### Position Numbering Strategy
- **Approach**: Sequential integers (1, 2, 3, 4...)
- **Pros**: Simple, intuitive, human-readable
- **Cons**: Requires reordering siblings on every insert
- **Justification**: With `reorderCardsOnInsert()`, reordering is fast and automatic

### Performance Optimization
- **Pagination**: Only loads 10 cards at a time in QuickPick
- **Indexed Queries**: `idx_cards_column` index ensures fast position-based sorting
- **Batch Updates**: Single SQL UPDATE statement reorders all affected cards

### Edge Cases Handled
1. **Empty Column**: Bottom position = 1 (same as top)
2. **User Cancels**: Defaults to position 1 (top)
3. **Completion Column**: Skips position prompt entirely
4. **Vacation Mode**: Still respects vacation mode warnings in move flow

## Database Schema

### Cards Table (Relevant Fields)
```sql
CREATE TABLE cards (
    id TEXT PRIMARY KEY,
    column_id TEXT NOT NULL,
    position INTEGER NOT NULL,  -- 1-based sequential position
    completed_at DATETIME,       -- Set when moved to completion column
    -- ... other fields
);

CREATE INDEX idx_cards_column ON cards(column_id, position);
CREATE INDEX idx_cards_completed ON cards(completed_at);
```

### Sorting Logic
- **Non-Completion Columns**: `ORDER BY position`
- **Completion Columns**: `ORDER BY completed_at DESC, position` (most recent first)

## Testing Checklist

- [x] Migration v12 runs successfully
- [x] TypeScript compilation passes
- [x] All existing tests pass (121 tests)
- [ ] Manual test: Create card with position selection
- [ ] Manual test: Move card with position selection
- [ ] Manual test: Move card to Done column (auto-position)
- [ ] Manual test: Load More pagination with >10 cards
- [ ] Manual test: Existing cards have sequential positions after migration

## Files Modified

1. **src/migrations.ts** - Added migration v12
2. **src/database.ts** - Added `reorderCardsOnInsert()` function
3. **vscode/kanban/Card.js** - Added `promptForCardPosition()`, updated `addCard()` and `moveCard()`

## Future Enhancements

1. **Drag-and-Drop Reordering**: Visual reordering in tree view
2. **Bulk Reordering**: "Reorder All Cards" command
3. **Position Gaps**: Switch to gap-based system (0, 100, 200) to reduce reordering frequency
4. **Quick Position Shortcuts**: Hotkeys for "Move to Top/Bottom"
5. **Position Indicator**: Show card position in tree view label

## Rollback Strategy

If issues arise, you can:
1. Revert migrations.ts to version 11
2. Run `DELETE FROM schema_migrations WHERE version = 12;` in SQLite
3. Rebuild with `npm run build`

The old behavior (all positions = 0) will resume.
