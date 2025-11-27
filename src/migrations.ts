import { getDb, prepare } from './database';
import * as fs from 'fs';
import * as path from 'path';

export interface Migration {
    version: number;
    name: string;
    up: (db: any) => void;
}

// Define all migrations in order
const migrations: Migration[] = [
    {
        version: 1,
        name: 'initial_schema',
        up: (db) => {
            db.exec(`
                CREATE TABLE IF NOT EXISTS notes (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    content TEXT,
                    file_path TEXT UNIQUE NOT NULL,
                    nlh_enabled BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
            `);
        }
    },
    {
        version: 2,
        name: 'add_kanban_tables',
        up: (db) => {
            db.exec(`
                CREATE TABLE IF NOT EXISTS boards (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS columns (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    board_id TEXT NOT NULL,
                    order_index INTEGER NOT NULL,
                    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS cards (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    content TEXT,
                    column_id TEXT NOT NULL,
                    note_id TEXT,
                    order_index INTEGER NOT NULL,
                    priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
                    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL
                );
            `);
        }
    },
    {
        version: 3,
        name: 'add_tasks_table',
        up: (db) => {
            db.exec(`
                CREATE TABLE IF NOT EXISTS tasks (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    description TEXT,
                    due_date DATETIME NOT NULL,
                    recurrence TEXT,
                    status TEXT NOT NULL DEFAULT 'pending',
                    card_id TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE SET NULL
                );
                CREATE INDEX idx_tasks_due_date ON tasks(due_date);
                CREATE INDEX idx_tasks_status ON tasks(status);
            `);
        }
    },
    {
        version: 4,
        name: 'add_tagging_system',
        up: (db) => {
            db.exec(`
                CREATE TABLE IF NOT EXISTS tags (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL UNIQUE,
                    color TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS card_tags (
                    card_id TEXT NOT NULL,
                    tag_id TEXT NOT NULL,
                    PRIMARY KEY (card_id, tag_id),
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
                );
            `);
        }
    },
    {
        version: 5,
        name: 'add_full_text_search',
        up: (db) => {
            db.exec(`
                -- Create regular table for searching notes and cards (sql.js doesn't support FTS5)
                CREATE TABLE IF NOT EXISTS search_index (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT,
                    content TEXT,
                    entity_id TEXT NOT NULL,
                    entity_type TEXT NOT NULL
                );
                
                -- Create indexes for faster LIKE queries
                CREATE INDEX IF NOT EXISTS idx_search_title ON search_index(title);
                CREATE INDEX IF NOT EXISTS idx_search_content ON search_index(content);
                CREATE INDEX IF NOT EXISTS idx_search_entity ON search_index(entity_id, entity_type);

                -- Trigger to insert into search_index when a new note is created
                CREATE TRIGGER IF NOT EXISTS notes_after_insert
                AFTER INSERT ON notes
                BEGIN
                    INSERT INTO search_index (title, content, entity_id, entity_type)
                    VALUES (new.title, new.content, new.id, 'note');
                END;

                -- Trigger to insert into search_index when a new card is created
                CREATE TRIGGER IF NOT EXISTS cards_after_insert
                AFTER INSERT ON cards
                BEGIN
                    INSERT INTO search_index (title, content, entity_id, entity_type)
                    VALUES (new.title, new.content, new.id, 'card');
                END;

                -- Trigger to delete from search_index when a note is deleted
                CREATE TRIGGER IF NOT EXISTS notes_after_delete
                AFTER DELETE ON notes
                BEGIN
                    DELETE FROM search_index WHERE entity_id = old.id;
                END;

                -- Trigger to delete from search_index when a card is deleted
                CREATE TRIGGER IF NOT EXISTS cards_after_delete
                AFTER DELETE ON cards
                BEGIN
                    DELETE FROM search_index WHERE entity_id = old.id;
                END;

                -- Trigger to update search_index when a note is updated
                CREATE TRIGGER IF NOT EXISTS notes_after_update
                AFTER UPDATE ON notes
                BEGIN
                    UPDATE search_index
                    SET title = new.title, content = new.content
                    WHERE entity_id = new.id;
                END;

                -- Trigger to update search_index when a card is updated
                CREATE TRIGGER IF NOT EXISTS cards_after_update
                AFTER UPDATE ON cards
                BEGIN
                    UPDATE search_index
                    SET title = new.title, content = new.content
                    WHERE entity_id = new.id;
                END;
            `);
        }
    },
    {
        version: 6,
        name: 'add_task_tags_table',
        up: (db) => {
            db.exec(`
                CREATE TABLE IF NOT EXISTS task_tags (
                    task_id TEXT NOT NULL,
                    tag_id TEXT NOT NULL,
                    PRIMARY KEY (task_id, tag_id),
                    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
                );
                CREATE INDEX IF NOT EXISTS idx_task_tags_tag ON task_tags(tag_id);
            `);
        }
    },
    {
        version: 7,
        name: 'add_completed_at_to_cards',
        up: (db) => {
            db.exec(`
                ALTER TABLE cards ADD COLUMN completed_at DATETIME;
                CREATE INDEX IF NOT EXISTS idx_cards_completed ON cards(completed_at);
            `);
        }
    },
    {
        version: 8,
        name: 'align_schema_with_documentation',
        up: (db) => {
            // Temporarily disable foreign keys for table restructuring
            db.pragma('foreign_keys = OFF');
            
            // Drop FTS triggers that reference cards table
            db.exec(`
                DROP TRIGGER IF EXISTS cards_after_insert;
                DROP TRIGGER IF EXISTS cards_after_delete;
                DROP TRIGGER IF EXISTS cards_after_update;
            `);
            
            // Recreate boards table with correct schema
            db.exec(`
                CREATE TABLE boards_new (
                    id TEXT PRIMARY KEY,
                    title TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                INSERT INTO boards_new (id, title) SELECT id, name FROM boards;
                DROP TABLE boards;
                ALTER TABLE boards_new RENAME TO boards;
            `);
            
            // Recreate columns table with correct schema
            db.exec(`
                CREATE TABLE columns_new (
                    id TEXT PRIMARY KEY,
                    board_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    position INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
                );
                INSERT INTO columns_new (id, board_id, title, position)
                SELECT id, board_id, name, order_index FROM columns;
                DROP TABLE columns;
                ALTER TABLE columns_new RENAME TO columns;
                CREATE INDEX idx_columns_board ON columns(board_id, position);
            `);
            
            // Recreate cards table with correct schema
            db.exec(`
                CREATE TABLE cards_new (
                    id TEXT PRIMARY KEY,
                    column_id TEXT NOT NULL,
                    position INTEGER NOT NULL,
                    card_type TEXT CHECK(card_type IN ('simple', 'linked')) NOT NULL,
                    title TEXT NOT NULL,
                    content TEXT,
                    note_id TEXT,
                    summary TEXT,
                    priority INTEGER DEFAULT 0,
                    scheduled_at DATETIME,
                    recurrence TEXT,
                    activated_at DATETIME,
                    completed_at DATETIME,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
                    FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL
                );
                INSERT INTO cards_new (id, column_id, position, card_type, title, content, note_id, priority, completed_at, created_at, updated_at)
                SELECT 
                    id, 
                    column_id, 
                    order_index,
                    'simple',
                    title, 
                    content, 
                    note_id, 
                    CASE priority
                        WHEN 'low' THEN 0
                        WHEN 'medium' THEN 1
                        WHEN 'high' THEN 2
                        ELSE 0
                    END,
                    completed_at,
                    created_at,
                    COALESCE(updated_at, created_at)
                FROM cards;
                DROP TABLE cards;
                ALTER TABLE cards_new RENAME TO cards;
                CREATE INDEX idx_cards_column ON cards(column_id, position);
                CREATE INDEX idx_cards_scheduled ON cards(scheduled_at);
                CREATE INDEX idx_cards_completed ON cards(completed_at);
            `);
            
            // Recreate FTS triggers for cards
            db.exec(`
                CREATE TRIGGER IF NOT EXISTS cards_after_insert
                AFTER INSERT ON cards
                BEGIN
                    INSERT INTO search_index (title, content, entity_id, entity_type)
                    VALUES (new.title, new.content, new.id, 'card');
                END;

                CREATE TRIGGER IF NOT EXISTS cards_after_delete
                AFTER DELETE ON cards
                BEGIN
                    DELETE FROM search_index WHERE entity_id = old.id;
                END;

                CREATE TRIGGER IF NOT EXISTS cards_after_update
                AFTER UPDATE ON cards
                BEGIN
                    UPDATE search_index
                    SET title = new.title, content = new.content
                    WHERE entity_id = new.id;
                END;
            `);
            
            // Recreate tags table with created_at column
            db.exec(`
                CREATE TABLE tags_new (
                    id TEXT PRIMARY KEY,
                    name TEXT UNIQUE NOT NULL,
                    color TEXT NOT NULL DEFAULT '#808080',
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );
                INSERT INTO tags_new (id, name, color) SELECT id, name, color FROM tags;
                DROP TABLE tags;
                ALTER TABLE tags_new RENAME TO tags;
                CREATE INDEX idx_tags_name ON tags(name);
            `);
            
            // Recreate card_tags with proper indexes
            db.exec(`
                CREATE TABLE card_tags_new (
                    card_id TEXT NOT NULL,
                    tag_id TEXT NOT NULL,
                    PRIMARY KEY (card_id, tag_id),
                    FOREIGN KEY (card_id) REFERENCES cards(id) ON DELETE CASCADE,
                    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
                );
                INSERT INTO card_tags_new SELECT * FROM card_tags;
                DROP TABLE card_tags;
                ALTER TABLE card_tags_new RENAME TO card_tags;
                CREATE INDEX idx_card_tags_tag ON card_tags(tag_id);
            `);
            
            // Re-enable foreign keys
            db.pragma('foreign_keys = ON');
        }
    },
    {
        version: 9,
        name: 'fix_cards_updated_at_column',
        up: (db) => {
            // Check if updated_at column exists, if not add it
            const tableInfo = db.prepare("PRAGMA table_info(cards)").all();
            const hasUpdatedAt = tableInfo.some((col: any) => col.name === 'updated_at');
            
            if (!hasUpdatedAt) {
                console.log('Adding missing updated_at column to cards table');
                db.exec(`
                    ALTER TABLE cards ADD COLUMN updated_at DATETIME;
                    UPDATE cards SET updated_at = created_at WHERE updated_at IS NULL;
                `);
            } else {
                console.log('Cards table already has updated_at column');
            }
        }
    },
    {
        version: 10,
        name: 'add_converted_from_task_at_column',
        up: (db) => {
            // Add converted_from_task_at column to cards table
            const tableInfo = db.prepare("PRAGMA table_info(cards)").all();
            const hasConvertedFromTaskAt = tableInfo.some((col: any) => col.name === 'converted_from_task_at');
            
            if (!hasConvertedFromTaskAt) {
                console.log('Adding converted_from_task_at column to cards table');
                db.exec(`
                    ALTER TABLE cards ADD COLUMN converted_from_task_at DATETIME;
                `);
            } else {
                console.log('Cards table already has converted_from_task_at column');
            }
        }
    },
    {
        version: 11,
        name: 'add_board_id_to_tasks',
        up: (db) => {
            // Add board_id column to tasks table
            const tableInfo = db.prepare("PRAGMA table_info(tasks)").all();
            const hasBoardId = tableInfo.some((col: any) => col.name === 'board_id');
            
            if (!hasBoardId) {
                console.log('Adding board_id column to tasks table');
                db.exec(`
                    ALTER TABLE tasks ADD COLUMN board_id TEXT REFERENCES boards(id) ON DELETE SET NULL;
                `);
            } else {
                console.log('Tasks table already has board_id column');
            }
        }
    }
];

export function initMigrationTable(): void {
    const db = getDb();
    db.exec(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            version INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `);
}

export function getCurrentVersion(): number {
    const db = getDb();
    try {
        const result = prepare('SELECT MAX(version) as version FROM schema_migrations').get() as { version: number | null };
        return result.version || 0;
    } catch (error) {
        return 0;
    }
}

export function runMigrations(): void {
    const db = getDb();
    initMigrationTable();
    
    const currentVersion = getCurrentVersion();
    const pendingMigrations = migrations.filter(m => m.version > currentVersion);
    
    if (pendingMigrations.length === 0) {
        console.log('Database is up to date. Current version:', currentVersion);
        return;
    }
    
    console.log(`Running ${pendingMigrations.length} pending migration(s)...`);
    
    for (const migration of pendingMigrations) {
        console.log(`Applying migration ${migration.version}: ${migration.name}`);
        
        // NOTE: sql.js doesn't support transactions like better-sqlite3
        // Apply migration and record it
        try {
            migration.up(db);
            prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(migration.version, migration.name);
            console.log(`Migration ${migration.version} applied successfully`);
        } catch (error: any) {
            console.error(`Failed to apply migration ${migration.version}:`, error.message);
            throw error;
        }
    }
    
    console.log('All migrations completed successfully');
}

export function getMigrationHistory(): Array<{ version: number; name: string; applied_at: string }> {
    const db = getDb();
    try {
        return prepare('SELECT version, name, applied_at FROM schema_migrations ORDER BY version').all() as Array<{ version: number; name: string; applied_at: string }>;
    } catch (error) {
        return [];
    }
}

