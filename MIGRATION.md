# Migration Guide: Chroma Parse Notes to Chroma Workspace Extension

This guide explains how to migrate your data from the web-based Chroma Parse Notes (Supabase) to the local VS Code extension.

## Overview

The Chroma Workspace extension provides migration tools to import your existing data from Chroma Parse Notes. All data is imported into a local SQLite database (`.chroma/chroma.db`) within your workspace.

## Prerequisites

- Visual Studio Code (version 1.105.0 or higher)
- Chroma Workspace extension installed
  - **From source**: See [BUILD.md](BUILD.md) for complete build and installation instructions
  - **Quick install**: If you have the `.vsix` file, install via Extensions view > `...` > Install from VSIX
- A workspace folder open in VS Code
- Export file from Chroma Parse Notes (JSON format)

---

## Migration Process

### Step 1: Export Data from Chroma Parse Notes

If you're migrating from the web application:

1. Log into your Chroma Parse Notes account
2. Navigate to Settings or Account menu
3. Click "Export Data" or use the Supabase export functionality
4. Download the JSON export file

**Expected JSON Format:**
```json
{
  "notes": [
    {
      "id": "uuid",
      "title": "Note Title",
      "content": "Note content here",
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ],
  "boards": [
    {
      "id": "uuid",
      "title": "Board Name",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "columns": [
    {
      "id": "uuid",
      "board_id": "board-uuid",
      "title": "To Do",
      "position": 0,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "cards": [
    {
      "id": "uuid",
      "column_id": "column-uuid",
      "position": 0,
      "card_type": "simple",
      "title": "Card Title",
      "content": "Card description",
      "note_id": null,
      "summary": null,
      "priority": 0,
      "scheduled_at": null,
      "recurrence": null,
      "activated_at": null,
      "completed_at": null,
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "tags": [
    {
      "id": "uuid",
      "name": "Important",
      "color": "#FF0000",
      "created_at": "2025-01-01T00:00:00Z"
    }
  ],
  "card_tags": [
    {
      "card_id": "card-uuid",
      "tag_id": "tag-uuid"
    }
  ],
  "tasks": [
    {
      "id": "uuid",
      "title": "Task Title",
      "description": "Task description",
      "due_date": "2025-01-01T00:00:00Z",
      "recurrence": null,
      "status": "pending",
      "card_id": null,
      "created_at": "2025-01-01T00:00:00Z",
      "updated_at": "2025-01-01T00:00:00Z"
    }
  ]
}
```

### Step 2: Import Data to VS Code

1. **Open Command Palette**: Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)

2. **Run Import Command**: Type and select `Chroma: Import Data from JSON`

3. **Select Export File**: Browse to and select your exported JSON file

4. **Confirm Import**: Click "Import" in the confirmation dialog

5. **Monitor Progress**: A progress notification will appear showing:
   - Reading JSON file
   - Validating data structure
   - Importing notes, boards, columns, cards, tags, and tasks
   - Progress percentage

6. **Completion**: When complete, you'll see a success message with import statistics

### Step 3: Verify Import

After import completes:

1. **Check Kanban Boards**: Open the Kanban view in the sidebar to see your boards and cards
2. **Check Notes**: Navigate to `notes/` folder to see your imported `.notesnlh` files
3. **Check Tasks**: Open the Scheduled Tasks view to see your tasks
4. **Check Tags**: Open the Tags view to see your tag library

---

## Data Validation

The import process includes automatic validation to ensure data integrity:

### Required Fields

**Notes:**
- `id`: Unique identifier (string)
- `title`: Note title (string)

**Boards:**
- `id`: Unique identifier (string)
- `title`: Board name (string)

**Columns:**
- `id`: Unique identifier (string)
- `board_id`: Reference to parent board (string)
- `title`: Column name (string)
- `position`: Display order (number)

**Cards:**
- `id`: Unique identifier (string)
- `column_id`: Reference to parent column (string)
- `title`: Card title (string)
- `position`: Display order (number)
- `card_type`: Must be "simple" or "linked"

**Tags:**
- `id`: Unique identifier (string)
- `name`: Tag name (string)
- `color`: Hex color code (e.g., "#FF0000")

**Card Tags:**
- `card_id`: Reference to card (string)
- `tag_id`: Reference to tag (string)

**Tasks:**
- `id`: Unique identifier (string)
- `title`: Task title (string)
- `due_date`: Due date timestamp (ISO string)

### Validation Errors

If validation fails, you'll see an error message with details. Common issues:

- **Missing required fields**: Ensure all required fields are present
- **Invalid data types**: Check that strings are strings, numbers are numbers
- **Invalid references**: Ensure `board_id`, `column_id`, etc. reference existing items
- **Invalid enums**: `card_type` must be "simple" or "linked"
- **Invalid colors**: Tag colors should be in hex format (#RRGGBB)

To view detailed validation errors:
1. Click "Show Details" in the error notification
2. The Output panel will display all validation errors

---

## Export Current Data

You can also export your current data to JSON format for backup or migration:

1. **Open Command Palette**: Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. **Run Export Command**: Type and select `Chroma: Export Data to JSON`
3. **Choose Location**: Select where to save the export file
4. **Wait for Completion**: A progress notification will show export progress
5. **View Export**: Optionally click "Open File" to view the exported JSON

---

## Manual Migration (Advanced)

If you need to migrate data manually or from a different source:

### 1. Create JSON Export File

Create a JSON file matching the schema shown above in Step 1.

### 2. Required Data Structure

All top-level keys are optional, but if present must be arrays:
- `notes`: Array of note objects
- `boards`: Array of board objects
- `columns`: Array of column objects  
- `cards`: Array of card objects
- `tags`: Array of tag objects
- `card_tags`: Array of card-tag association objects
- `tasks`: Array of task objects

### 3. Foreign Key References

Ensure referential integrity:
- Column `board_id` must reference an existing board `id`
- Card `column_id` must reference an existing column `id`
- Card `note_id` (if provided) must reference an existing note `id`
- Card tag `card_id` must reference an existing card `id`
- Card tag `tag_id` must reference an existing tag `id`
- Task `card_id` (if provided) must reference an existing card `id`

### 4. File Creation

Note files are automatically created during import:
- Location: `workspace_root/notes/`
- Filename: Based on note title with special characters replaced by `_`
- Extension: `.notesnlh`
- Content: The note's `content` field

---

## Troubleshooting

### Import Fails with Validation Errors

**Solution**: Review the validation error details and ensure your JSON matches the required schema.

### Notes Don't Appear

**Problem**: Note files may not have been created.

**Solution**: 
1. Check the `notes/` folder in your workspace
2. Verify notes were included in the import JSON
3. Check file permissions on the workspace folder

### Cards Missing from Kanban Board

**Problem**: Cards may not be linked to valid columns.

**Solution**:
1. Verify columns exist in the Kanban view
2. Check that card `column_id` values reference existing columns
3. Re-import if necessary

### Tags Not Showing

**Problem**: Tags may not have been imported or associated with cards.

**Solution**:
1. Open the Tags view in the sidebar
2. Verify tags exist in your import JSON
3. Check that `card_tags` entries reference valid card and tag IDs

### Database Corruption

**Problem**: Import was interrupted or failed mid-process.

**Solution**:
The import process uses database transactions. If import fails, the database automatically rolls back to its previous state. Simply fix the validation errors and try importing again.

---

## Best Practices

1. **Backup First**: Before importing, backup your current `.chroma/` folder

2. **Test Import**: Try importing on a test workspace first to verify data integrity

3. **Clean Data**: Remove any invalid or test data from your export before importing

4. **Incremental Import**: For large datasets, consider splitting into smaller batches

5. **Verify After Import**: Check all views (Kanban, Tasks, Tags) to ensure data imported correctly

---

## Data Format Reference

### Dates

All timestamps should be in ISO 8601 format:
```
2025-01-01T00:00:00Z
2025-11-04T19:30:00.000Z
```

### Colors

Tag colors must be 6-digit hex codes:
```
Valid:   #FF0000, #00FF00, #0000FF
Invalid: red, rgb(255,0,0), #F00
```

### Card Types

Only two card types are supported:
- `simple`: Standalone card with content
- `linked`: Card linked to a note file

### Priority Levels

Cards support numeric priority (0 = normal):
- `0`: Normal priority
- `1`: High priority
- `-1`: Low priority

### Recurrence Patterns

Tasks and cards support these recurrence patterns:
- `daily`: Repeats every day
- `weekly`: Repeats every week
- `weekdays`: Repeats Monday-Friday
- `biweekly`: Repeats every 2 weeks
- `monthly`: Repeats every month
- Custom patterns (see Task Scheduler documentation)

---

## Migration Checklist

Before migration:
- [ ] Export data from Chroma Parse Notes
- [ ] Backup current workspace (if applicable)
- [ ] Open target workspace in VS Code
- [ ] Install Chroma Workspace extension

During migration:
- [ ] Run `Chroma: Import Data from JSON` command
- [ ] Select export file
- [ ] Confirm import
- [ ] Monitor progress notification

After migration:
- [ ] Verify boards appear in Kanban view
- [ ] Check notes in `notes/` folder
- [ ] Verify tasks in Scheduled Tasks view
- [ ] Check tags in Tags view
- [ ] Test Natural Language Highlighting on notes
- [ ] Verify card-tag associations
- [ ] Check recurring tasks

---

## FAQ

**Q: Can I import multiple times?**  
A: Yes, but duplicate IDs will cause conflicts. Each import should have unique IDs, or you should clear the database first.

**Q: Will import overwrite existing data?**  
A: Import does not delete existing data. If there are ID conflicts, the import will fail.

**Q: Can I export and import between workspaces?**  
A: Yes! Use `Chroma: Export Data to JSON` in one workspace, then `Chroma: Import Data from JSON` in another.

**Q: What happens if import fails midway?**  
A: The import uses transactions. If any error occurs, all changes are rolled back and your database remains unchanged.

**Q: Can I edit the JSON file before importing?**  
A: Yes! You can manually edit the JSON file to clean up data, remove items, or fix errors before importing.

**Q: Does import work offline?**  
A: Yes! The entire migration process works completely offline using local file system and database.

---

## Support

If you encounter issues during migration:

1. Check the VS Code Output panel (View → Output → Chroma Migration)
2. Review validation errors in the error notification
3. Verify your JSON matches the expected schema
4. Check file permissions on the workspace folder
5. Try exporting from a test workspace to see correct format

For additional help, file an issue on the GitHub repository with:
- VS Code version
- Extension version
- Sanitized sample of your export JSON
- Error messages from Output panel

---

**Last Updated**: November 4, 2025
**Extension Version**: 0.0.1