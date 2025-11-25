# Chroma Workspace - User Guide

Welcome to Chroma Workspace! This comprehensive guide will help you get the most out of your VS Code workspace management extension.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Natural Language Highlighting](#natural-language-highlighting)
3. [Kanban Boards](#kanban-boards)
4. [Task Scheduling](#task-scheduling)
5. [Tagging System](#tagging-system)
6. [Global Search](#global-search)
7. [Accomplishments Export](#accomplishments-export)
8. [Settings & Configuration](#settings--configuration)
9. [Troubleshooting](#troubleshooting)
10. [Performance Tips](#performance-tips)

---

## Getting Started

### Installation & Setup

1. **Install the Extension**: 
   - **Pre-built VSIX**: Extensions view > `...` > Install from VSIX > select `chroma-workspace-0.0.1.vsix`
   - **Build from source**: See [BUILD.md](BUILD.md) for comprehensive build instructions
   - **VS Code Marketplace**: Coming soon
2. **Open a Workspace**: The extension requires a workspace folder to be open
3. **Automatic Setup**: The extension automatically creates a `.chroma` directory with a local SQLite database

### First Steps

1. **Create Your First Note**:
   - Open Command Palette (`Ctrl+Shift+P` on Windows/Linux, `Cmd+Shift+P` on Mac)
   - Type "Chroma: New Note"
   - Enter a title for your note
   - Start writing with Natural Language Highlighting

2. **View the Sidebar**:
   - Click the Chroma Workspace icon in the Activity Bar
   - You'll see three views: Kanban, Scheduled Tasks, and Tags

---

## Natural Language Highlighting

### What is NLH?

Natural Language Highlighting uses NLP (Natural Language Processing) to colorize text based on parts of speech, making notes easier to read and understand.

### Supported Parts of Speech

- **Nouns** (default: Blue `#569CD6`) - Entities, objects, types
- **Verbs** (default: Teal `#4EC9B0`) - Actions, functions
- **Adjectives** (default: Purple `#C586C0`) - Descriptive words
- **Adverbs** (default: Yellow `#DCDCAA`) - Modifiers
- **Numbers** (default: Green `#B5CEA8`) - Numeric values
- **Proper Nouns** (default: Light Blue `#4FC1FF`) - Names, places

### Using NLH

1. **Create a `.notesnlh` File**:
   ```
   Chroma: New Note
   ```

2. **Toggle NLH** for a specific note:
   - Right-click the note in the sidebar
   - Select "Toggle Natural Language Highlighting"

3. **Customize Colors**:
   - Open Settings (`Ctrl+,`)
   - Search for "Chroma NLH"
   - Modify color values (hex format, e.g., `#FF5733`)

### Tips for Better NLH

- **Write naturally**: The highlighting works best with complete sentences
- **Use proper grammar**: This helps the NLP engine correctly identify parts of speech
- **Mix formatting**: NLH works alongside markdown formatting

---

## Kanban Boards

### Creating a Board

1. Open the Kanban view in the sidebar
2. Click the "+" icon or use command: `Chroma: Create Board`
3. Enter a board name (e.g., "Project Alpha", "Personal Tasks")

### Managing Columns

1. **Add Column**: Right-click on a board → "Add Column"
2. **Reorder Columns**: Click and drag columns
3. **Delete Column**: Right-click column → "Delete Column" (moves cards to first column)

Common column setups:
- **Agile**: To Do → In Progress → Review → Done
- **GTD**: Inbox → Next Actions → Waiting → Someday/Maybe → Done
- **Simple**: To Do → Doing → Done

### Working with Cards

#### Creating Cards

**Simple Card** (standalone task):
```
Command: Chroma: Add Card
1. Select target column
2. Enter card title
3. Add description (optional)
4. Set priority (Low/Medium/High)
```

**Linked Card** (connected to a note):
```
1. Create or open a .notesnlh file
2. Command: Chroma: Link Note to Card
3. Select board and column
4. Card automatically uses note's title and content
```

#### Card Operations

- **Move Card Up/Down**: `Chroma: Move Card Up` or `Down`
- **Move to Different Column**: Right-click card → "Move to Column"
- **Edit Card**: Click on card to open details
- **Delete Card**: Right-click → "Delete Card"
- **Convert to Task**: Right-click → "Convert to Scheduled Task"

#### Priority Levels

- **Low** (🔵): Nice-to-have items
- **Medium** (🟡): Normal priority tasks
- **High** (🔴): Urgent or important items

---

## Task Scheduling

### Creating Scheduled Tasks

1. Command: `Chroma: Add Task`
2. Enter task title
3. Set due date (YYYY-MM-DD format)
4. Choose recurrence pattern:
   - **None**: One-time task
   - **Daily**: Repeats every day
   - **Weekdays**: Monday through Friday
   - **Weekly**: Same day each week
   - **Bi-weekly**: Every two weeks
   - **Monthly**: Same date each month
   - **Custom**: Define your own pattern

5. Choose a board (if applicable):
   - If you have **multiple boards**, a board picker will be shown so you can select which board the scheduled task should be sent to when it becomes due.
   - If you have **one board**, the board is selected automatically and you won't be prompted.
   - If you have **no boards**, the scheduler will create a default board and column when the task activates.

### Editing Scheduled Tasks

You can edit a scheduled task to change its title, due date, recurrence, description, and board assignment.
1. Right-click a task → "Edit Scheduled Task" (or use the command palette)
2. Update required fields and choose a board if multiple boards exist
3. Save to update the scheduled task

### Viewing Scheduled Tasks

The Scheduled Tasks view organizes tasks into categories:

- **⚠️ Overdue**: Tasks past their due date
- **📅 Today**: Tasks due today
- **📆 This Week**: Tasks due within 7 days
- **📋 All Tasks**: Complete list of scheduled tasks

### Task Notifications

Configure notification behavior in settings:

```json
{
  "chroma.tasks.enableNotifications": true,
  "chroma.tasks.notificationFrequency": "once"  // "once", "hourly", or "daily"
}
```

### Recurrence Patterns

**Example Recurrence Use Cases**:

- **Daily Standup**: `daily` at 9:00 AM
- **Weekly Review**: `weekly` on Friday
- **Monthly Report**: `monthly` on the 1st
- **Gym Days**: `custom` (Mon/Wed/Fri)

### Completing Tasks

1. Right-click task → "Mark Complete"
2. For recurring tasks, a new instance is automatically created for the next due date
3. Completed tasks are tracked for the Accomplishments Export

### Board Assignment & Behavior

- **Single Board:** If your workspace only has one board, newly created scheduled tasks are automatically assigned to that board.
- **Multiple Boards:** When there are multiple boards, you will be prompted to select a board during task creation or editing.
- **No Boards:** If no boards exist, the scheduler will create a default board and "To Do" column when the task becomes due, and the card will be added there.
- **Existing Tasks (no board_id):** Tasks created before this feature was added (no `board_id`) will still work and will fall back to the first available board.

---

## Tagging System

### Creating Tags

1. Command: `Chroma: Create Tag`
2. Enter tag name (e.g., "urgent", "bug", "feature")
3. Choose a color to visually identify the tag

### Using Tags

**Add Tag to Card**:
```
Right-click card → "Add Tag" → Select tag
```

**Remove Tag**:
```
Right-click card → "Remove Tag" → Select tag
```

**Filter by Tag**:
```
Click on a tag in the Tags view to see all cards with that tag
```

### Tag Organization Tips

**Common Tag Categories**:

- **Priority**: `urgent`, `important`, `nice-to-have`
- **Type**: `bug`, `feature`, `enhancement`, `documentation`
- **Status**: `blocked`, `in-review`, `needs-testing`
- **Context**: `frontend`, `backend`, `design`, `meeting`

---

## Global Search

### Searching Your Workspace

1. **Keyboard Shortcut**: `Ctrl+Shift+F` (Windows/Linux) or `Cmd+Shift+F` (Mac)
2. **Command**: `Chroma: Search Workspace`
3. Enter your search query
4. Results show matching notes and cards with context

### Search Features

- **Full-Text Search**: Searches note content and card titles/descriptions
- **Relevance Ranking**: Most relevant results appear first
- **Quick Navigation**: Click result to jump directly to the item
- **Real-time Index**: Updates automatically as you create/edit content

### Search Tips

- Use specific keywords for better results
- Search works across all notes and cards
- Search is case-insensitive
- Partial word matches are supported

---

## Accomplishments Export

### Exporting Completed Tasks

Perfect for performance reviews, status reports, or personal productivity tracking!

1. Command: `Chroma: Export Accomplishments`
2. Choose date range:
   - **Last 3 Months**
   - **Last 6 Months** (default)
   - **Last 12 Months**
   - **Custom Range** (specify start and end dates)
3. File is saved as CSV to your workspace

### CSV Format

The exported file includes:
- Task title
- Description (optional, configurable)
- Completion date
- Recurrence pattern (if applicable)
- Completion count (for recurring tasks)

### Using Exported Data

**Excel/Sheets**:
- Open CSV directly in Excel or Google Sheets
- Create charts and pivot tables
- Filter and sort by date or type

**Performance Reviews**:
- Group accomplishments by category
- Use with LLMs (ChatGPT, Claude) to generate summaries
- Highlight impact and key achievements

**Configuration**:
```json
{
  "chroma.export.defaultDateRangeMonths": 6,
  "chroma.export.includeDescriptions": true,
  "chroma.export.groupRecurringTasks": true
}
```

---

## Settings & Configuration

### Accessing Settings

1. File → Preferences → Settings (or `Ctrl+,`)
2. Search for "Chroma"
3. Modify settings as needed

### Key Settings

#### Natural Language Highlighting

```json
{
  "chroma.nlh.enabled": true,
  "chroma.nlh.colors.nouns": "#569CD6",
  "chroma.nlh.colors.verbs": "#4EC9B0",
  "chroma.nlh.colors.adjectives": "#C586C0",
  "chroma.nlh.colors.adverbs": "#DCDCAA",
  "chroma.nlh.colors.numbers": "#B5CEA8",
  "chroma.nlh.colors.properNouns": "#4FC1FF"
}
```

#### Task Management

```json
{
  "chroma.tasks.enableNotifications": true,
  "chroma.tasks.notificationFrequency": "once",
  "chroma.tasks.showInStatusBar": true
}
```

#### Export Defaults

```json
{
  "chroma.export.defaultDateRangeMonths": 6,
  "chroma.export.includeDescriptions": true,
  "chroma.export.groupRecurringTasks": true
}
```

#### Database

```json
{
  "chroma.database.path": ".chroma/chroma.db"
}
```

---

## Troubleshooting

### Common Issues

#### Extension Not Activating

**Problem**: Extension doesn't load or show in sidebar

**Solutions**:
1. Ensure you have a folder/workspace open
2. Check the Output panel (View → Output → select "Chroma Workspace")
3. Reload VS Code window (`Ctrl+Shift+P` → "Reload Window")
4. Check for extension conflicts

#### Database Errors

**Problem**: "Failed to initialize database" error

**Solutions**:
1. Check disk space (SQLite needs write permissions)
2. Verify `.chroma` directory exists and is writable
3. Close other instances of VS Code using the same workspace
4. Delete `.chroma/chroma.db` to rebuild (WARNING: loses data)

#### Search Not Working

**Problem**: Search returns no results or incorrect results

**Solutions**:
1. Check that you have content in notes/cards
2. FTS5 (full-text search) requires better-sqlite3 (not available in test environment)
3. Try recreating the search index (feature coming soon)

#### Notes Not Highlighting

**Problem**: NLH not working in `.notesnlh` files

**Solutions**:
1. Check `chroma.nlh.enabled` setting is `true`
2. Verify file has `.notesnlh` extension
3. Check if NLH is toggled off for specific note
4. Reload window to refresh syntax highlighting

### Getting Help

1. **Check Logs**: View → Output → "Chroma Workspace"
2. **GitHub Issues**: Report bugs at [repository URL]
3. **Community**: Join discussions on GitHub Discussions

---

## Performance Tips

### Optimizing for Large Workspaces

#### Database Performance

- **Regular Maintenance**: SQLite performs best with periodic vacuuming
- **Index Usage**: Search uses optimized FTS5 indexes
- **Connection Pooling**: Single database connection per workspace

#### Managing Many Notes

- **Organize by Folders**: Use directory structure for note organization
- **Archive Old Boards**: Delete or export completed boards
- **Limit Active Tags**: Use 10-20 tags maximum for best UX

#### Search Performance

- **Specific Queries**: Use specific keywords instead of generic terms
- **Regular Updates**: Index updates automatically, no manual maintenance needed

### Best Practices

1. **Regular Exports**: Export accomplishments monthly for backup
2. **Tag Hygiene**: Remove unused tags to keep the list manageable
3. **Board Organization**: Limit active boards to 3-5 for optimal workflow
4. **Note Linking**: Link cards to notes for better context and searchability
5. **Backup**: Include `.chroma/` directory in your backup strategy (or commit to git)

---

## Keyboard Shortcuts

| Action | Windows/Linux | Mac |
|--------|---------------|-----|
| Global Search | `Ctrl+Shift+F` | `Cmd+Shift+F` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |
| Settings | `Ctrl+,` | `Cmd+,` |
| New Note | (Command Palette) | (Command Palette) |

---

## Integration Tips

### Version Control (Git)

**Include in Git**:
- `.chroma/` directory (for team collaboration)
- `.notesnlh` files

**Gitignore (Optional)**:
```gitignore
# Ignore database if workspace is personal
.chroma/chroma.db
.chroma/chroma.db-wal
.chroma/chroma.db-shm
```

### Workspace Sync

**Manual Sync**:
1. Copy `.chroma/` directory between machines
2. Use cloud storage (Dropbox, OneDrive) for workspace folder
3. Commit to Git for version-controlled sync

**Team Collaboration**:
- Share boards and cards via Git
- Use branches for different workflow states
- Resolve conflicts in `.chroma/chroma.db` carefully

---

## Advanced Topics

### Custom Recurrence Patterns

Coming in future updates:
- Complex custom patterns (e.g., "every 2nd Tuesday")
- Time-based activation for tasks
- Conditional recurrence (skip holidays)

### Data Migration

Export data for migration:
```
1. Export accomplishments to CSV
2. Copy `.chroma/` directory
3. Import into new workspace
```

### Extending Chroma

Ideas for custom extensions:
- Custom export formats (JSON, Markdown)
- Integration with external tools (Jira, Trello)
- Custom NLH color themes

---

## FAQ

**Q: Is my data secure?**  
A: Yes! All data is stored locally on your device in a SQLite database. No cloud services or external connections are used.

**Q: Can I use Chroma without internet?**  
A: Absolutely! Chroma works 100% offline.

**Q: How do I backup my data?**  
A: Simply copy the `.chroma/` directory or commit it to Git.

**Q: Can I collaborate with others?**  
A: Yes, by sharing the workspace folder and `.chroma/` directory via Git or cloud storage.

**Q: What happens if I delete a note file?**  
A: The corresponding database entry remains. You may want to manually delete linked cards.

**Q: Can I import data from other tools?**  
A: Currently manual import only. Future versions may support imports from Trello, Jira, etc.

---

## Support & Contributing

- **Issues**: Report bugs on GitHub Issues
- **Feature Requests**: Submit via GitHub Discussions
- **Contributing**: See CONTRIBUTING.md in the repository
- **License**: MIT License

---

**Happy Organizing! 🎨📝✅**
