# SQLite Database Schema for Chroma Workspace Extension

## Overview
Local-first architecture using SQLite for all data storage in `.chroma/chroma.db`

## Tables

### notes
```sql
CREATE TABLE notes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT,
  file_path TEXT UNIQUE NOT NULL,
  nlh_enabled BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_notes_updated ON notes(updated_at DESC);
CREATE INDEX idx_notes_title ON notes(title);
```

### boards
```sql
CREATE TABLE boards (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### columns
```sql
CREATE TABLE columns (
  id TEXT PRIMARY KEY,
  board_id TEXT NOT NULL,
  title TEXT NOT NULL,
  position INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
);
CREATE INDEX idx_columns_board ON columns(board_id, position);
```

### cards
```sql
CREATE TABLE cards (
  id TEXT PRIMARY KEY,
  column_id TEXT NOT NULL,
  position INTEGER NOT NULL,
  card_type TEXT CHECK(card_type IN (''simple'', ''linked'')) NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  note_id TEXT,
  summary TEXT,
  priority INTEGER DEFAULT 0,
  scheduled_at DATETIME,
  recurrence TEXT,
  activated_at DATETIME,
  completed_at DATETIME,
  converted_from_task_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
  FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL
);
CREATE INDEX idx_cards_column ON cards(column_id, position);
CREATE INDEX idx_cards_scheduled ON cards(scheduled_at);
CREATE INDEX idx_cards_completed ON cards(completed_at);
```

### scheduled_tasks
```sql
CREATE TABLE scheduled_tasks (
  id TEXT PRIMARY KEY,
  card_id TEXT NOT NULL,
  scheduled_at DATETIME NOT NULL,
  recurrence TEXT,
  activated_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE
);
CREATE INDEX idx_scheduled_tasks_date ON scheduled_tasks(scheduled_at);
```

### tags
```sql
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  color TEXT NOT NULL DEFAULT ''#808080'',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_tags_name ON tags(name);
```

### card_tags
```sql
CREATE TABLE card_tags (
  card_id TEXT NOT NULL,
  tag_id TEXT NOT NULL,
  PRIMARY KEY (card_id, tag_id),
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);
CREATE INDEX idx_card_tags_tag ON card_tags(tag_id);
```

### user_settings
```sql
CREATE TABLE user_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### tasks
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATETIME NOT NULL,
  recurrence TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  card_id TEXT,
  board_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL,
  FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE SET NULL
);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
```

## Migration from Supabase
See `MIGRATION.md` for data export/import procedures.
