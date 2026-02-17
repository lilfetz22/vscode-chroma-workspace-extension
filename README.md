# Chroma Workspace - VS Code Extension 

A comprehensive workspace management extension for Visual Studio Code that combines rich note-taking with Natural Language Highlighting, visual Kanban boards, task scheduling, and productivity analytics. Designed for professionals who need powerful project management capabilities directly in their development environment - **all data stored locally on your device**.

##  Extension Overview

**Chroma Workspace** brings together the best features of modern project management into VS Code:

- ** Notes with Natural Language Highlighting** - Intelligent syntax highlighting for natural language based on parts of speech
- ** Notes View** - Centralized panel to browse and create all your `.notesnlh` notes
- ** Dashboard View** - Open workspace data in the editor area with flexible layout options
- ** Kanban Boards** - Visual task management with customizable columns and cards
- ** Task Scheduling** - Schedule tasks with recurrence patterns and time-based automation
- ** Tag System** - Organize cards and tasks with flexible tagging
- ** Accomplishments Export** - Export completed tasks for performance reviews
- ** Global Search** - Search across all notes, cards, and projects instantly
- ** 100% Local Storage** - All data stored on device using SQLite - no cloud dependencies

Perfect for professionals working in secured environments where cloud-based tools are restricted.

---

##  Key Features

###  Notes with Natural Language Highlighting (NLH)

Built on the proven **notesnlh** extension foundation with enhanced workspace integration:

- **Real-time Part-of-Speech Highlighting**: Automatically colorizes text based on grammar:
  - **Nouns** - Entities and types
  - **Verbs** - Actions and functions  
  - **Adjectives** - Descriptive words
  - **Adverbs** - Modifiers
  - **Numbers** - Numeric values
  - **Proper Nouns** - Names and places
  
- **Customizable Colors**: Configure highlighting colors per part of speech
- **Per-Note Toggle**: Enable/disable NLH for individual notes
- **Rich Text Support**: Format notes with TODO lists, links, and cross-references
- **File Format**: Uses `.notesnlh` files for seamless compatibility

**NLP Engine**: Uses the [Compromise NLP library](https://github.com/spencermountain/compromise) for intelligent text analysis.

###  Notes View

Centralized panel for managing all your notes in one place:

- **Dedicated Notes Panel**: Browse all `.notesnlh` files from the sidebar view
- **Quick Access**: Click any note to open it instantly in the editor
- **Add Note Button**: Create new notes directly from the view with the "+" button
  - Validates note names and prevents duplicates
  - Auto-creates notes folder if it doesn't exist
  - Opens newly created notes immediately
- **Live Updates**: Notes view refreshes automatically when files are created, modified, or deleted
- **Smart Location**: Notes stored in `.chroma/notes/` folder (or custom path based on database location)
- **Flexible Sorting**: Notes displayed by last modified date (default) or alphabetically

**Note**: The notes folder location follows your `chroma.database.path` setting. If you use a shared database, notes will be in the same parent directory.

###  Kanban Board Management

Visual task tracking with full VS Code integration:

- **Custom Columns**: Create workflow stages (To Do, In Progress, Done, etc.)
- **Two Card Types**:
  - **Simple Cards**: Standalone tasks with rich descriptions
  - **Linked Cards**: Cards connected to existing notes
- **Interactive Card Positioning**: Choose exactly where new or moved cards appear in columns
  - Select position during card creation and movement
  - Visual position picker with pagination for large columns
  - Auto-positioning for completion columns
  - Position numbers displayed in card labels
- **Command-Based Movement**: Move cards with VS Code commands
- **Tag Support**: Organize cards with flexible tagging and colored icons for visual identification

###  Task Scheduling & Automation

Advanced scheduling capabilities for recurring and time-based tasks:

- **Scheduled Tasks View**: Dedicated TreeView showing overdue, today, this week, and all tasks
- **Enhanced Recurrence Patterns**: 
  - Daily, weekdays only, weekly, bi-weekly, monthly
  - Custom weekly patterns (select specific days of the week)
  - Human-readable recurrence labels in tooltips
- **Time-Based Activation**: Set specific times for tasks to appear on your board
- **Vacation Mode**: Temporarily pause scheduled task-to-card conversion when away
- **Status Bar Integration**: Quick view of upcoming tasks
- **Notifications**: Reminders for due tasks
- **Board Assignment**: Tasks can be targeted to a specific board; you'll be prompted to pick a board when multiple boards exist, one board is auto-selected, and a default board+column is created if none exist.
- **Tag Inheritance**: Tags from scheduled tasks are automatically copied to created cards
- **Manual Early Conversion**: Convert scheduled tasks to cards before their scheduled time by hovering over a task in the Scheduled Tasks View and clicking the 'Convert to Card' button.

###  Accomplishments Export (FUTURE FEATURE)

Performance review made easy with intelligent task aggregation:

- **CSV Export**: Download completed tasks in spreadsheet format
- **Date Range Selection**: Last 3/6/12 months or custom range
- **Smart Grouping**: Recurring tasks automatically grouped together
- **LLM-Ready Format**: CSV output optimized for AI summarization

See full documentation below for detailed feature descriptions.

---

##  Installation

### Option 1: From Pre-built VSIX (Recommended)

If you have the `.vsix` file:

1. Open VS Code
2. Go to Extensions view (`Ctrl+Shift+X`)
3. Click `...` menu > **Install from VSIX...**
4. Select `chroma-workspace-0.0.1.vsix`
5. Reload VS Code when prompted

Or via command line:
```powershell
code --install-extension chroma-workspace-0.0.1.vsix
```

### Option 2: Build from Source

For the complete build process, see **[BUILD.md](BUILD.md)**.

**Quick steps:**
```powershell
# 1. Install dependencies
npm install

# 2. Compile TypeScript
npm run compile

# 3. Bundle with esbuild
node esbuild.js

# 4. Package as VSIX (requires vsce)
npm install -g @vscode/vsce
vsce package

# 5. Install the generated .vsix file (see Option 1 above)
```

### Option 3: Development Mode

Run without installing (for development/testing):

1. Open this folder in VS Code
2. Press `F5` to launch Extension Development Host
3. Test the extension in the new window

---

##  Quick Start

1. Open a workspace folder in VS Code
2. Extension auto-creates `.chroma/chroma.db` 
3. Open Chroma Workspace panel from the sidebar
4. Click the Notes view and use the "+" button to create your first note
5. Set up Kanban boards, scheduled tasks, and tags as needed

##  Opening the Dashboard

For a full-screen workspace view, open the **Chroma Workspace Dashboard**:

- Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
- Run command: `Chroma: Open Dashboard`
- The dashboard opens in the editor area as a tab
- Move it to a separate editor group or window by dragging the tab

**Dashboard Features:**
- **Tabbed Interface**: Switch between Notes, Kanban, Tasks, and Tags views
- **All Boards at Once**: View all your Kanban boards with their columns and cards
- **Task Overview**: See all scheduled tasks in one place
- **Tag Management**: Browse all tags with color indicators
- **Flexible Layout**: Resize, move to split view, or drag to a separate window

---

##  Configuration

Chroma Workspace can be extensively customized through VS Code settings. Access settings via:
- **File > Preferences > Settings** (Windows/Linux)
- **Code > Preferences > Settings** (macOS)
- Or search for "Chroma" in the settings

### Natural Language Highlighting Settings

Control how notes are highlighted:

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

- **`chroma.nlh.enabled`**: Enable/disable Natural Language Highlighting (default: `true`)
- **`chroma.nlh.colors.*`**: Customize colors for each part of speech (hex format)

### Task & Notification Settings

Control task notifications and status bar display:

```json
{
  "chroma.tasks.enableNotifications": true,
  "chroma.tasks.notificationFrequency": "once",
  "chroma.tasks.showInStatusBar": true
}
```

- **`chroma.tasks.enableNotifications`**: Show notifications for due tasks (default: `true`)
- **`chroma.tasks.notificationFrequency`**: How often to notify about overdue tasks
  - `"once"`: Show notification only once per task (default)
  - `"hourly"`: Remind every hour
  - `"daily"`: Remind once per day
- **`chroma.tasks.showInStatusBar`**: Display task count in status bar (default: `true`)

### Export Settings

Configure accomplishments export defaults:

```json
{
  "chroma.export.defaultDateRangeMonths": 6,
  "chroma.export.includeDescriptions": true,
  "chroma.export.groupRecurringTasks": true
}
```

- **`chroma.export.defaultDateRangeMonths`**: Default time range for exports (default: `6`, range: 1-60)
- **`chroma.export.includeDescriptions`**: Include task descriptions in CSV export (default: `true`)
- **`chroma.export.groupRecurringTasks`**: Group multiple completions of recurring tasks (default: `true`)

### Kanban Settings

Customize Kanban board behavior:

```json
{
  "chroma.kanban.taskCreationColumn": "To Do",
  "chroma.kanban.completionColumn": "Done"
}
```

- **`chroma.kanban.taskCreationColumn`**: Name of the column where new tasks are created (default: `"To Do"`).
- **`chroma.kanban.completionColumn`**: Name of the column that marks tasks as complete (default: `"Done"`).
  - Cards moved to this column are timestamped and sorted by completion date
  - Position selection is skipped for completion columns (cards auto-placed at top)

### Database Settings

Configure where your data is stored:

```json
{
  "chroma.database.path": ".chroma/chroma.db"
}
```

- **`chroma.database.path`**: Relative path to SQLite database within workspace (default: `".chroma/chroma.db"`)
  - Must be a path ending in `.db`. You can use a relative path (default) for per-workspace databases or an absolute path (e.g. `C:\\Users\\You\\shared-chroma.db` or `/home/you/chroma-shared.db`) to share a database across multiple workspaces.
  - After changing this setting, reload the VS Code window (`Developer: Reload Window`) or restart VS Code for the new database location to take effect.

---

##  Local-First Architecture

- **SQLite Database**: All data in `.chroma/chroma.db`
- **No Cloud Dependencies**: Works completely offline
- **Git-Friendly**: Commit `.chroma/` for version control
- **Portable**: Copy folder to sync manually across machines

---

##  Debugging & Troubleshooting

### Debug Logging

Chroma Workspace includes comprehensive debug logging for troubleshooting:

- **Output Panel**: View logs in VS Code's Output panel (select "Chroma Workspace Debug")
- **SQL-Level Debugging**: Track database queries and operations
- **Operation Logging**: Monitor tag operations, card movements, and task scheduling
- **Automatic Logging**: Debug logs stored in `.chroma/debug.log` within your workspace

To view debug output:
1. Open VS Code's Output panel (`Ctrl+Shift+U` or `Cmd+Shift+U`)
2. Select **"Chroma Workspace Debug"** from the dropdown
3. Monitor real-time operations as you use the extension

---

##  Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

---

##  License

MIT License

---

##  Acknowledgments

- **notesnlh Extension**: Foundation by [canadaduane](https://github.com/canadaduane)
- **Chroma Parse Notes**: Feature inspiration [lilfetz22](https://github.com/lilfetz22/chroma-parse-notes)
- **Compromise.js**: NLP library by [Spencer Kelly](https://github.com/spencermountain/compromise)

---

**Your workspace. Your data. Your device.** 

---

## Releasing and Versioning

This repo uses **semantic-release** to automate versioning, changelog generation, GitHub releases, and VSIX packaging/publishing based on **Conventional Commits**.

### Commit Message Format

Use the format: `type(scope): subject`

**Common types:**
- `feat`: New feature (triggers **minor** version bump: 1.0.0 → 1.1.0)
- `fix`: Bug fix (triggers **patch** version bump: 1.0.0 → 1.0.1)
- `docs`: Documentation changes (no version bump)
- `refactor`: Code refactoring (no version bump)
- `perf`: Performance improvements (triggers **patch** bump)
- `test`: Test additions/changes (no version bump)
- `chore`: Build process or auxiliary tool changes (no version bump)

**Breaking changes** (triggers **major** version bump: 1.0.0 → 2.0.0):
- Add `!` after type/scope: `feat(api)!: remove deprecated methods`
- OR include footer: `BREAKING CHANGE: description`

**Examples:**
```bash
feat(kanban): add swimlanes to board
fix(tasks): correct timezone logic for daily schedule
fix(build): externalize bindings module in esbuild config
chore: update dependencies
feat(search)!: change search API to async
```

### Development Workflow

1. **Make changes** to code
2. **Build and test**: `npm run build && npm test`
3. **Stage changes**: `git add <files>`
4. **Commit with conventional format**:
   ```bash
   git commit -m "fix(build): externalize native module dependencies"
   ```
5. **Push to main**:
   ```bash
   git push origin master
   ```

### Automated Release Process (CI/CD)

When you push to `master`, GitHub Actions automatically:

1. **Analyzes commits** since the last release
2. **Determines version bump** (major/minor/patch) based on commit types
3. **Updates** `package.json` version
4. **Generates** CHANGELOG.md with all changes
5. **Creates** GitHub release with release notes
6. **Packages** VSIX file
7. **Publishes** to VS Code Marketplace (if `VSCE_PAT` repository secret is configured)

### Manual Release (Optional)

For local testing or manual releases:

```bash
npm run build
npm run release
```

**Requirements:**
- `GITHUB_TOKEN` environment variable (for GitHub release)
- `VSCE_PAT` environment variable (optional, for marketplace publishing)

**Note:** Normally releases are performed automatically via GitHub Actions. Manual releases are only needed for testing the release process locally.

### Marketplace Publishing Setup

To enable automatic publishing to the VS Code Marketplace:

1. Create a Personal Access Token (PAT) at https://dev.azure.com/
   - Organization: All accessible organizations
   - Scopes: Marketplace (Acquire, Manage)
2. Add the PAT as a repository secret named `VSCE_PAT` in GitHub Settings → Secrets
3. Push commits to `master` - extension will auto-publish on release
