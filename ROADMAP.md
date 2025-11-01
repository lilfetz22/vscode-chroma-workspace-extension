# Chroma Workspace Extension - Development Roadmap

## Phase 1: Foundation (Current - Week 1-2)
**Status**:  COMPLETE - Scaffolding Done

- [x] Copy notesnlh extension codebase as foundation
- [x] Initialize fresh Git repository
- [x] Create comprehensive README.md
- [x] Design SQLite database schema
- [x] Update package.json metadata

**Deliverables**:
- Clean extension structure
- Documentation foundation
- Database design

---

## Phase 2: Database Layer (Week 3-4)
**Status**:  NEXT UP

### Tasks:
- [ ] Install and configure SQLite3 for Node.js
- [ ] Create database initialization module (`src/database/init.ts`)
- [ ] Implement table creation scripts
- [ ] Build database query utilities
- [ ] Create migration system for schema updates
- [ ] Add database connection pooling

### Deliverables:
- Working SQLite database in `.chroma/chroma.db`
- CRUD operations for all tables
- Database utility module

---

## Phase 3: Notes Integration (Week 5-6)
**Status**:  PLANNED

### Tasks:
- [ ] Maintain existing NLH functionality from notesnlh
- [ ] Add database tracking for `.notesnlh` files
- [ ] Implement file watcher for note changes
- [ ] Sync file system  database
- [ ] Add note metadata storage (tags, timestamps)
- [ ] Test NLH with database integration

### Deliverables:
- Notes fully functional with database backing
- File system sync working
- NLH preserved from original extension

---

## Phase 4: Kanban Board View (Week 7-9)
**Status**:  PLANNED

### Tasks:
- [ ] Create TreeView provider for boards
- [ ] Implement board/column/card data models
- [ ] Build card creation commands
- [ ] Add card movement commands (Up/Down/To Column)
- [ ] Create card editing UI
- [ ] Implement priority system
- [ ] Add card-to-note linking

### Deliverables:
- Kanban TreeView in sidebar
- Full CRUD operations for cards
- Command palette integration

---

## Phase 5: Task Scheduling (Week 10-11)
**Status**:  PLANNED

### Tasks:
- [ ] Create Scheduled Tasks TreeView
- [ ] Implement recurrence logic (daily, weekly, monthly, etc.)
- [ ] Build task activation system (time-based)
- [ ] Add status bar item for task count
- [ ] Implement task notifications
- [ ] Create task editing modal
- [ ] Add "Convert Card to Task" command

### Deliverables:
- Scheduled Tasks view working
- Recurrence patterns functional
- Notifications system

---

## Phase 6: Tagging System (Week 12)
**Status**:  PLANNED

### Tasks:
- [ ] Create Tag management UI
- [ ] Implement tag CRUD operations
- [ ] Add tag color picker
- [ ] Build tag filtering
- [ ] Integrate tags with cards
- [ ] Add tag search functionality

### Deliverables:
- Full tagging system
- Tag-based filtering
- Color-coded tags

---

## Phase 7: Global Search (Week 13-14)
**Status**:  PLANNED

### Tasks:
- [ ] Implement SQLite full-text search (FTS5)
- [ ] Create search command with QuickPick UI
- [ ] Add keyboard shortcut (Ctrl/Cmd+K)
- [ ] Build search result navigation
- [ ] Add search result previews
- [ ] Implement search ranking

### Deliverables:
- Fast global search
- Clean search UI
- Jump-to-result navigation

---

## Phase 8: Export Accomplishments (Week 15)
**Status**:  PLANNED

### Tasks:
- [ ] Create date range picker UI
- [ ] Implement SQL query for completed tasks
- [ ] Build recurring task grouping logic
- [ ] Add CSV export functionality
- [ ] Create "Export Accomplishments" command
- [ ] Add export success notification

### Deliverables:
- CSV export working
- Recurring task grouping
- Date range selection

---

## Phase 9: Settings & Configuration (Week 16)
**Status**:  PLANNED

### Tasks:
- [ ] Define VS Code settings schema
- [ ] Implement settings reading/writing
- [ ] Create settings UI (if needed)
- [ ] Add NLH color configuration
- [ ] Add notification preferences
- [ ] Add database path configuration

### Deliverables:
- Full settings system
- Customizable preferences
- Settings persistence

---

## Phase 10: Testing & Polish (Week 17-18)
**Status**:  PLANNED

### Tasks:
- [ ] Write unit tests for database operations
- [ ] Test all commands and views
- [ ] Performance optimization
- [ ] Error handling improvements
- [ ] Add logging system
- [ ] Create user documentation
- [ ] Fix bugs and edge cases

### Deliverables:
- Comprehensive test coverage
- Stable extension
- Complete documentation

---

## Phase 11: Migration Tools (Week 19)
**Status**:  PLANNED

### Tasks:
- [ ] Build Supabase export script
- [ ] Create JSON import command
- [ ] Implement data validation
- [ ] Add migration progress UI
- [ ] Test with real Chroma Parse Notes data
- [ ] Document migration process

### Deliverables:
- Working migration from web app
- MIGRATION.md documentation
- Data validation

---

## Phase 12: Release Preparation (Week 20)
**Status**:  PLANNED

### Tasks:
- [ ] Create extension icon
- [ ] Write CHANGELOG.md
- [ ] Update README with screenshots
- [ ] Create demo video
- [ ] Set up CI/CD for releases
- [ ] Publish to VS Code Marketplace
- [ ] Create GitHub releases

### Deliverables:
- Published extension
- Complete documentation
- Release automation

---

## Future Enhancements (Post-Release)

### WebView Kanban Board
- Rich drag-and-drop interface
- Visual board designer
- Inline card editing

### Image Support in Notes
- Embed images in `.notesnlh` files
- Store in `.chroma/attachments/`
- Image preview in hover

### Team Collaboration
- Git-based sync workflow
- Conflict resolution
- Shared boards

### Advanced Analytics
- Task completion trends
- Time tracking
- Productivity reports

### Mobile Companion
- Read-only mobile access
- Quick task creation
- Notification sync

---

## Success Metrics

-  All features from Chroma Parse Notes migrated
-  Extension works offline with local storage
-  Performance: <100ms for most operations
-  No data loss during migration
-  Positive user feedback on marketplace

---

**Last Updated**: November 1, 2025
**Current Phase**: Phase 1 (Complete)  Phase 2 (Next)
