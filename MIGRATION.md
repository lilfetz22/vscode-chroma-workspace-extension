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


I attempted to inspect your project's database to determine the best way to export the Chroma Notes data, but I don't have permission to list tables or extensions from your project because organization-level data sharing (Bedrock) is disabled.

I can still help — below are multiple approaches you can use to export your Chroma Notes data as JSON depending on your setup. Choose the one that fits your environment and I’ll provide exact SQL or scripts as needed.

Options to export data as JSON
Export from Supabase SQL (recommended if your data is in Postgres)
Use SQL to produce JSON directly:
For a whole table: SELECT json_agg(t) FROM your_table t;
For individual rows or filtered data: SELECT json_agg(row_to_json(t)) FROM (SELECT * FROM your_table WHERE ...) t;
Then download the query result in the Supabase SQL editor (Run query → Download results as JSON/CSV).
If you want a file saved server-side, I can provide a SQL + psql command to output to a file if you have direct DB access.*
Export using the Supabase dashboard (UI)
In the Table editor:
Open the table, run any filter if needed.
Click the three-dot menu or the “Download” button to export as CSV or JSON (JSON option is available in most tables view).
Repeat per table as needed.
Export via psql or pg_dump (CLI)
To export a table as JSON (psql): psql "postgres://user:pass@host:port/db" -c "COPY (SELECT json_agg(t) FROM your_table t) TO STDOUT;" > table.json
To export entire DB as plain SQL + data: pg_dump --format=custom --file=db.dump "postgres://user:pass@host:port/db" (pg_dump doesn’t output JSON natively — use psql + SELECT json_agg per table)
Export using a script (Node/Python) — useful if Chroma Notes stores vectors or nested structures
Node (example brief approach):
Use @supabase/supabase-js with SERVICE_ROLE_KEY to fetch rows (paginate) and write them to a .json file.
Python:
Use requests to call the REST or RPC endpoints, or use psycopg2 to run SELECT json_agg(...) and write to file.
If Chroma Notes uses a vector DB or files (e.g., Supabase Storage + metadata in Postgres)
Export metadata from the Postgres tables as JSON (see options above).
Download actual file blobs from Storage via the Storage API or dashboard.
If vectors are stored in a separate index (like pgvector), export the table rows containing vectors as JSON; note that vector types may serialize to arrays.
Next steps — pick one
Tell me which environment you prefer and what access you have:

I have Dashboard access and prefer the UI → I’ll give step-by-step UI instructions.
I can run SQL in Supabase SQL editor → I’ll run/generate the exact SQL to export and show how to download.
I have the DB URL and can run psql → I’ll give the psql command to produce a JSON file.
I want a Node/Python script using the Supabase API → I’ll provide a ready-to-run script (you must supply SERVICE_ROLE_KEY or set it in env).
Because I couldn't inspect your schema automatically, if you choose a SQL or script route please paste the table name(s) you want exported (or confirm “export all tables”) and whether you want a single combined JSON file or one file per table. I'll then provide exact commands or code.

-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

public.card_tags
public.cards 
CREATE TABLE public.columns (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  board_id uuid NOT NULL,
  title text NOT NULL,
  position integer NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT columns_pkey PRIMARY KEY (id),
  CONSTRAINT columns_board_id_fkey FOREIGN KEY (board_id) REFERENCES public.boards(id)
);
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Note'::text,
  content text NOT NULL DEFAULT ''::text,
  nlh_enabled boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  project_id uuid,
  CONSTRAINT notes_pkey PRIMARY KEY (id),
  CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.projects (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  description text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT projects_pkey PRIMARY KEY (id)
);
CREATE TABLE public.scheduled_tasks (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  project_id uuid NOT NULL,
  title text NOT NULL,
  summary text,
  target_column_id uuid NOT NULL,
  recurrence_type text NOT NULL CHECK (recurrence_type = ANY (ARRAY['once'::text, 'daily'::text, 'weekdays'::text, 'weekly'::text, 'bi-weekly'::text, 'monthly'::text, 'custom_weekly'::text])),
  days_of_week ARRAY CHECK (days_of_week IS NULL OR array_length(days_of_week, 1) >= 1 AND array_length(days_of_week, 1) <= 7 AND days_of_week <@ ARRAY[0, 1, 2, 3, 4, 5, 6]),
  next_occurrence_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  priority integer NOT NULL DEFAULT 0,
  tag_ids ARRAY,
  scheduled_timestamp timestamp with time zone,
  CONSTRAINT scheduled_tasks_pkey PRIMARY KEY (id)
);
CREATE TABLE public.tags (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  color text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT tags_pkey PRIMARY KEY (id),
  CONSTRAINT tags_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.user_settings (
  user_id uuid NOT NULL,
  nlh_global_enabled boolean NOT NULL DEFAULT true,
  nlh_highlight_noun boolean NOT NULL DEFAULT true,
  nlh_highlight_verb boolean NOT NULL DEFAULT true,
  nlh_highlight_adverb boolean NOT NULL DEFAULT true,
  nlh_highlight_adjective boolean NOT NULL DEFAULT true,
  nlh_highlight_number boolean NOT NULL DEFAULT true,
  nlh_highlight_proper_noun boolean NOT NULL DEFAULT true,
  nlh_color_noun text NOT NULL DEFAULT '#28a745'::text,
  nlh_color_verb text NOT NULL DEFAULT '#ffc107'::text,
  nlh_color_adverb text NOT NULL DEFAULT '#fd7e14'::text,
  nlh_color_adjective text NOT NULL DEFAULT '#007bff'::text,
  nlh_color_number text NOT NULL DEFAULT '#dc3545'::text,
  nlh_color_proper_noun text NOT NULL DEFAULT '#6f42c1'::text,
  is_on_vacation boolean NOT NULL DEFAULT false,
  CONSTRAINT user_settings_pkey PRIMARY KEY (user_id),
  CONSTRAINT user_settings_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

