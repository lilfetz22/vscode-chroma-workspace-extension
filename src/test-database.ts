// Test database setup using sql.js for Jest compatibility
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import { Note } from './models/Note';
import { Board } from './models/Board';
import { Column } from './models/Column';
import { Card } from './models/Card';
import { Tag } from './models/Tag';
import { randomBytes } from 'crypto';

let testDb: SqlJsDatabase | undefined;

// Wrapper to make sql.js API compatible with better-sqlite3
class SqlJsWrapper {
    constructor(private db: SqlJsDatabase) {}

    prepare(sql: string) {
        const db = this.db;
        return {
            run: (...params: any[]) => {
                db.run(sql, params);
                const changes = db.getRowsModified();
                const result = db.exec('SELECT last_insert_rowid() as id');
                const lastInsertRowid = result.length > 0 && result[0].values.length > 0 
                    ? result[0].values[0][0] as number 
                    : 0;
                return { changes, lastInsertRowid };
            },
            get: (...params: any[]) => {
                const result = db.exec(sql, params);
                if (result.length === 0 || result[0].values.length === 0) {
                    return undefined;
                }
                const row = result[0].values[0];
                const columns = result[0].columns;
                const obj: any = {};
                columns.forEach((col, idx) => {
                    obj[col] = row[idx];
                });
                return obj;
            },
            all: (...params: any[]) => {
                const result = db.exec(sql, params);
                if (result.length === 0) {
                    return [];
                }
                const rows = result[0].values;
                const columns = result[0].columns;
                return rows.map(row => {
                    const obj: any = {};
                    columns.forEach((col, idx) => {
                        obj[col] = row[idx];
                    });
                    return obj;
                });
            },
        };
    }

    exec(sql: string): void {
        this.db.exec(sql);
    }

    pragma(_pragma: string, _options?: any): any {
        // sql.js doesn't support pragma, just return undefined
        return undefined;
    }

    close(): void {
        this.db.close();
    }
}

export async function initTestDatabase(): Promise<any> {
    const SQL = await initSqlJs();
    testDb = new SQL.Database();
    const wrapper = new SqlJsWrapper(testDb);

    // Create all tables
    createTestTables(wrapper);
    
    return wrapper;
}

function createTestTables(db: any): void {
    // Create all tables needed for testing
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

        CREATE TABLE IF NOT EXISTS boards (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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
            order_index INTEGER NOT NULL,
            priority TEXT DEFAULT 'medium',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            description TEXT,
            recurrence_pattern TEXT,
            next_activation DATETIME,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

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

        CREATE TABLE IF NOT EXISTS migrations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        -- NOTE: FTS5 search_index table cannot be created in sql.js test environment
        -- The actual extension uses better-sqlite3 which supports FTS5
        -- Search functionality must be tested manually in the extension
    `);
}

export function getTestDb(): any {
    if (!testDb) {
        throw new Error('Test database not initialized. Call initTestDatabase() first.');
    }
    return new SqlJsWrapper(testDb);
}

export function closeTestDb(): void {
    if (testDb) {
        testDb.close();
        testDb = undefined;
    }
}

// Tag-related functions for testing
export function createTag(db: any, tag: Partial<Tag>): Tag {
    const id = tag.id || randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)');
    stmt.run(id, tag.name, tag.color);
    return { id, name: tag.name!, color: tag.color! };
}

export function getTagById(db: any, id: string): Tag {
    const stmt = db.prepare('SELECT * FROM tags WHERE id = ?');
    return stmt.get(id);
}

export function getAllTags(db: any): Tag[] {
    const stmt = db.prepare('SELECT * FROM tags ORDER BY name');
    return stmt.all();
}

export function updateTag(db: any, tag: Partial<Tag>): Tag {
    const stmt = db.prepare('UPDATE tags SET name = ?, color = ? WHERE id = ?');
    stmt.run(tag.name, tag.color, tag.id);
    return getTagById(db, tag.id!);
}

export function deleteTag(db: any, id: string): void {
    const stmt = db.prepare('DELETE FROM tags WHERE id = ?');
    stmt.run(id);
}

export function addTagToCard(db: any, cardId: string, tagId: string): void {
    const stmt = db.prepare('INSERT INTO card_tags (card_id, tag_id) VALUES (?, ?)');
    stmt.run(cardId, tagId);
}

export function removeTagFromCard(db: any, cardId: string, tagId: string): void {
    const stmt = db.prepare('DELETE FROM card_tags WHERE card_id = ? AND tag_id = ?');
    stmt.run(cardId, tagId);
}

export function getTagsByCardId(db: any, cardId: string): Tag[] {
    const stmt = db.prepare(`
        SELECT t.* FROM tags t
        INNER JOIN card_tags ct ON t.id = ct.tag_id
        WHERE ct.card_id = ?
    `);
    return stmt.all(cardId);
}

export function createCard(db: any, card: Partial<Card>): Card {
    const id = card.id || randomBytes(16).toString('hex');
    const stmt = db.prepare(
        'INSERT INTO cards (id, title, content, column_id, order_index, priority) VALUES (?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, card.title, card.content, card.column_id, card.order, card.priority);
    return {
        id,
        title: card.title!,
        content: card.content || '',
        column_id: card.column_id!,
        note_id: null,
        order: card.order!,
        priority: card.priority!,
    };
}
