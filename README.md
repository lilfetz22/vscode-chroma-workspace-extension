# Chroma Workspace - VS Code Extension 

A comprehensive workspace management extension for Visual Studio Code that combines rich note-taking with Natural Language Highlighting, visual Kanban boards, task scheduling, and productivity analytics. Designed for professionals who need powerful project management capabilities directly in their development environment - **all data stored locally on your device**.

##  Extension Overview

**Chroma Workspace** brings together the best features of modern project management into VS Code:

- ** Notes with Natural Language Highlighting** - Intelligent syntax highlighting for natural language based on parts of speech
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

###  Kanban Board Management

Visual task tracking with full VS Code integration:

- **Custom Columns**: Create workflow stages (To Do, In Progress, Done, etc.)
- **Two Card Types**:
  - **Simple Cards**: Standalone tasks with rich descriptions
  - **Linked Cards**: Cards connected to existing notes
- **Priority System**: Assign priority levels (Low, Medium, High)
- **Command-Based Movement**: Move cards with VS Code commands
- **Tag Support**: Organize cards with flexible tagging

###  Task Scheduling & Automation

Advanced scheduling capabilities for recurring and time-based tasks:

- **Scheduled Tasks View**: Dedicated TreeView showing overdue, today, this week, and all tasks
- **Recurrence Patterns**: Daily, weekdays, weekly, bi-weekly, monthly, custom
- **Time-Based Activation**: Set specific times for tasks to appear on your board
- **Status Bar Integration**: Quick view of upcoming tasks
- **Notifications**: Reminders for due tasks

###  Accomplishments Export

Performance review made easy with intelligent task aggregation:

- **CSV Export**: Download completed tasks in spreadsheet format
- **Date Range Selection**: Last 3/6/12 months or custom range
- **Smart Grouping**: Recurring tasks automatically grouped together
- **LLM-Ready Format**: CSV output optimized for AI summarization

See full documentation below for detailed feature descriptions.

---

##  Installation

### From Source
1. Clone this repository
2. Open in VS Code
3. Run `npm install` to install dependencies
4. Press `F5` to launch Extension Development Host

---

##  Quick Start

1. Open a workspace folder in VS Code
2. Extension auto-creates `.chroma/chroma.db` 
3. Create first note: `Ctrl+Shift+P`  `Chroma: New Note`
4. Set up Kanban board from sidebar view

---

##  Configuration

Configure in VS Code settings:

```json
{
  "chroma.nlh.enabled": true,
  "chroma.tasks.enableNotifications": true,
  "chroma.export.defaultDateRangeMonths": 6
}
```

---

##  Local-First Architecture

- **SQLite Database**: All data in `.chroma/chroma.db`
- **No Cloud Dependencies**: Works completely offline
- **Git-Friendly**: Commit `.chroma/` for version control
- **Portable**: Copy folder to sync manually across machines

---

##  Contributing

Contributions welcome! See CONTRIBUTING.md for guidelines.

---

##  License

MIT License

---

##  Acknowledgments

- **notesnlh Extension**: Foundation by [canadaduane](https://github.com/canadaduane)
- **Chroma Parse Notes**: Feature inspiration
- **Compromise.js**: NLP library by [Spencer Kelly](https://github.com/spencermountain/compromise)

---

**Your workspace. Your data. Your device.** 
