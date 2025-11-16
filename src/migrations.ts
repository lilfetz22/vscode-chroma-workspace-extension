import { getDb } from './database';
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
                -- Create FTS5 virtual table for searching notes and cards
                CREATE VIRTUAL TABLE IF NOT EXISTS search_index USING fts5(
                    title,
                    content,
                    entity_id UNINDEXED,
                    entity_type UNINDEXED
                );

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
        const result = db.prepare('SELECT MAX(version) as version FROM schema_migrations').get() as { version: number | null };
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
        
        // Run migration in a transaction
        const transaction = db.transaction(() => {
            migration.up(db);
            db.prepare('INSERT INTO schema_migrations (version, name) VALUES (?, ?)').run(migration.version, migration.name);
        });
        
        try {
            transaction();
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
        return db.prepare('SELECT version, name, applied_at FROM schema_migrations ORDER BY version').all() as Array<{ version: number; name: string; applied_at: string }>;
    } catch (error) {
        return [];
    }
}
