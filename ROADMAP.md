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
**Status**: ✅ COMPLETE

### Tasks:
- [x] Install and configure SQLite3 for Node.js
- [x] Create database initialization module (`src/database/init.ts`)
- [x] Implement table creation scripts
- [x] Build database query utilities
- [x] Create migration system for schema updates
- [x] Add database connection pooling

### Deliverables:
- Working SQLite database in `.chroma/chroma.db` ✅
- CRUD operations for all tables ✅
- Database utility module ✅
- Migration system with version tracking ✅

---

## Phase 3: Notes Integration (Week 5-6)
**Status**: ✅ COMPLETE

### Tasks:
- [x] Maintain existing NLH functionality from notesnlh
- [x] Add database tracking for `.notesnlh` files
- [x] Implement file watcher for note changes
- [x] Sync file system ↔ database
- [x] Add note metadata storage (tags, timestamps)
- [x] Test NLH with database integration

### Deliverables:
- Notes fully functional with database backing ✅
- File system sync working ✅
- NLH preserved from original extension ✅

---

## Phase 4: Kanban Board View (Week 7-9)
**Status**: ✅ COMPLETE

### Tasks:
- [x] Create TreeView provider for boards
- [x] Implement board/column/card data models
- [x] Build card creation commands
- [x] Add card movement commands (Up/Down/To Column)
- [x] Create card editing UI
- [x] Implement priority system
- [x] Add card-to-note linking

### Deliverables:
- Kanban TreeView in sidebar ✅
- Full CRUD operations for cards ✅
- Command palette integration ✅

---

## Phase 5: Task Scheduling (Week 10-11)
**Status**: ✅ COMPLETE

### Tasks:
- [x] Create Scheduled Tasks TreeView
- [x] Implement recurrence logic (daily, weekly, monthly, etc.)
- [x] Build task activation system (time-based)
- [x] Add status bar item for task count
- [x] Implement task notifications
- [x] Create task editing modal
- [x] Add "Convert Card to Task" command

### Deliverables:
- Scheduled Tasks view working ✅
- Recurrence patterns functional ✅
- Notifications system ✅

---

## Phase 6: Tagging System (Week 12)
**Status**: 🔜 NEXT UP

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

**Last Updated**: November 3, 2025
**Current Phase**: Phase 5 (Complete) → Phase 6 (Next)
