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
    // Create all tables needed for testing - schema matches DATABASE_SCHEMA.md
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
            title TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS columns (
            id TEXT PRIMARY KEY,
            board_id TEXT NOT NULL,
            title TEXT NOT NULL,
            position INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (board_id) REFERENCES boards(id) ON DELETE CASCADE
        );

        CREATE TABLE IF NOT EXISTS cards (
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
            FOREIGN KEY (column_id) REFERENCES columns(id) ON DELETE CASCADE,
            FOREIGN KEY (note_id) REFERENCES notes(id) ON DELETE SET NULL
        );

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

        CREATE TABLE IF NOT EXISTS tags (
            id TEXT PRIMARY KEY,
            name TEXT UNIQUE NOT NULL,
            color TEXT NOT NULL DEFAULT '#808080',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
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

// Task-Tag relationship functions
export function addTagToTask(db: any, taskId: string, tagId: string): void {
    const stmt = db.prepare('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)');
    stmt.run(taskId, tagId);
}

export function removeTagFromTask(db: any, taskId: string, tagId: string): void {
    const stmt = db.prepare('DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?');
    stmt.run(taskId, tagId);
}

export function getTagsByTaskId(db: any, taskId: string): Tag[] {
    const stmt = db.prepare(`
        SELECT t.* FROM tags t
        INNER JOIN task_tags tt ON t.id = tt.tag_id
        WHERE tt.task_id = ?
    `);
    return stmt.all(taskId);
}

// Note-related functions
export function createNote(db: any, note: Partial<Note>): any {
    const id = note.id || randomBytes(16).toString('hex');
    const stmt = db.prepare(
        'INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)'
    );
    // Explicitly coerce undefined to NULL while preserving empty strings
    stmt.run(id, note.title, note.content ?? null, note.file_path, note.nlh_enabled ? 1 : 0);
    return {
        id,
        title: note.title!,
        content: note.content ?? null,
        file_path: note.file_path!,
        nlh_enabled: note.nlh_enabled ? 1 : 0
    };
}

export function getNoteById(db: any, id: string): Note | undefined {
    const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    return stmt.get(id);
}

export function getNoteByPath(db: any, filePath: string): Note | undefined {
    const stmt = db.prepare('SELECT * FROM notes WHERE file_path = ?');
    return stmt.get(filePath);
}

export function getAllNotes(db: any): Note[] {
    const stmt = db.prepare('SELECT * FROM notes ORDER BY created_at DESC');
    return stmt.all();
}

export function updateNote(db: any, id: string, updates: Partial<Note>): void {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
    }
    if (updates.content !== undefined) {
        fields.push('content = ?');
        values.push(updates.content);
    }
    if (updates.nlh_enabled !== undefined) {
        fields.push('nlh_enabled = ?');
        values.push(updates.nlh_enabled ? 1 : 0);
    }
    
    if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const sql = `UPDATE notes SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(sql);
        stmt.run(...values);
    }
}

export function deleteNote(db: any, id: string): void {
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(id);
}

// Board-related functions
export function createBoard(db: any, board: Partial<Board>): Board {
    const id = board.id || randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)');
    stmt.run(id, board.title);
    
    // Automatically create default columns
    const defaultColumns = [
        { title: 'To Do', position: 0 },
        { title: 'In Progress', position: 1 },
        { title: 'Done', position: 2 }
    ];
    
    for (const col of defaultColumns) {
        createColumn(db, { 
            title: col.title, 
            board_id: id, 
            position: col.position 
        });
    }
    
    return { id, title: board.title! };
}

export function getBoardById(db: any, id: string): Board | undefined {
    const stmt = db.prepare('SELECT * FROM boards WHERE id = ?');
    return stmt.get(id);
}

export function getAllBoards(db: any): Board[] {
    const stmt = db.prepare('SELECT * FROM boards ORDER BY created_at DESC');
    return stmt.all();
}

// Column-related functions
export function createColumn(db: any, column: Partial<Column>): Column {
    const id = column.id || randomBytes(16).toString('hex');
    const stmt = db.prepare(
        'INSERT INTO columns (id, title, board_id, position) VALUES (?, ?, ?, ?)'
    );
    stmt.run(id, column.title, column.board_id, column.position);
    return {
        id,
        title: column.title!,
        board_id: column.board_id!,
        position: column.position!
    };
}

export function getColumnsByBoardId(db: any, boardId: string): Column[] {
    const stmt = db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position');
        const rows = stmt.all(boardId) as any[];
        // Fallback mapping if legacy schema (name/order_index) still present in an existing test DB
        return rows.map(r => ({
            id: r.id,
            board_id: r.board_id,
            title: r.title !== undefined ? r.title : r.name,
            position: r.position !== undefined ? r.position : r.order_index,
            created_at: r.created_at
        })) as Column[];
}

// Card-related functions
export function createCard(db: any, card: Partial<Card>): Card {
    const id = card.id || randomBytes(16).toString('hex');
    const stmt = db.prepare(
        'INSERT INTO cards (id, column_id, position, card_type, title, content, note_id, summary, priority, scheduled_at, recurrence, activated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(id, card.column_id, card.position ?? 0, card.card_type ?? 'simple', card.title, card.content ?? null, card.note_id ?? null, card.summary ?? null, card.priority ?? 0, card.scheduled_at ?? null, card.recurrence ?? null, card.activated_at ?? null, card.completed_at ?? null);
    return {
        id,
        column_id: card.column_id!,
        position: card.position ?? 0,
        card_type: card.card_type ?? 'simple',
        title: card.title!,
        content: card.content ?? null,
        note_id: card.note_id ?? null,
        summary: card.summary ?? null,
        priority: card.priority ?? 0,
        scheduled_at: card.scheduled_at ?? null,
        recurrence: card.recurrence ?? null,
        activated_at: card.activated_at ?? null,
        completed_at: card.completed_at ?? null,
    };
}

export function getCardById(db: any, id: string): Card | undefined {
    const stmt = db.prepare('SELECT * FROM cards WHERE id = ?');
    const row = stmt.get(id);
    if (!row) return undefined;
    return row as Card;
}

export function getCardsByColumnId(db: any, columnId: string): Card[] {
    const stmt = db.prepare('SELECT * FROM cards WHERE column_id = ? ORDER BY position');
    return stmt.all(columnId) as Card[];
}

export function updateCard(db: any, id: string, updates: Partial<Card>): void {
    const fields: string[] = [];
    const values: any[] = [];
    
    if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
    }
    if (updates.content !== undefined) {
        fields.push('content = ?');
        values.push(updates.content);
    }
    if (updates.priority !== undefined) {
        fields.push('priority = ?');
        values.push(updates.priority);
    }
    if (updates.column_id !== undefined) {
        fields.push('column_id = ?');
        values.push(updates.column_id);
    }
    if (updates.position !== undefined) {
        fields.push('position = ?');
        values.push(updates.position);
    }
    if (updates.card_type !== undefined) {
        fields.push('card_type = ?');
        values.push(updates.card_type);
    }
    if (updates.summary !== undefined) {
        fields.push('summary = ?');
        values.push(updates.summary);
    }
    if (updates.scheduled_at !== undefined) {
        fields.push('scheduled_at = ?');
        values.push(updates.scheduled_at);
    }
    if (updates.recurrence !== undefined) {
        fields.push('recurrence = ?');
        values.push(updates.recurrence);
    }
    if (updates.activated_at !== undefined) {
        fields.push('activated_at = ?');
        values.push(updates.activated_at);
    }
    if (updates.completed_at !== undefined) {
        fields.push('completed_at = ?');
        values.push(updates.completed_at);
    }
    if (updates.note_id !== undefined) {
        fields.push('note_id = ?');
        values.push(updates.note_id);
    }
    
    if (fields.length > 0) {
        values.push(id);
        const sql = `UPDATE cards SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(sql);
        stmt.run(...values);
    }
}

export function deleteCard(db: any, id: string): void {
    const stmt = db.prepare('DELETE FROM cards WHERE id = ?');
    stmt.run(id);
}

/**
 * Reorder cards in a column when inserting a new card at a specific position.
 * Increments the position of all cards at or above the insertion position by 1.
 */
export function reorderCardsOnInsert(db: any, columnId: string, insertPosition: number): void {
    const stmt = db.prepare('UPDATE cards SET position = position + 1 WHERE column_id = ? AND position >= ?');
    stmt.run(columnId, insertPosition);
}

/**
 * Decrement positions of cards in a column when removing a card.
 * Decrements the position of all cards positioned after the removed position by 1.
 */
export function reorderCardsOnRemove(db: any, columnId: string, removedPosition: number): void {
    const stmt = db.prepare('UPDATE cards SET position = position - 1 WHERE column_id = ? AND position > ?');
    stmt.run(columnId, removedPosition);
}

/**
 * Refresh and normalize card positions in a column.
 * Re-sequences all cards in the column to have consecutive positions starting from 1.
 */
export function refreshColumnPriority(db: any, columnId: string): void {
    // Get all cards in the column ordered by their current position
    const cards = getCardsByColumnId(db, columnId);
    
    // Re-assign positions sequentially (1, 2, 3, ...)
    cards.forEach((card, index) => {
        const newPosition = index + 1;
        if (card.position !== newPosition) {
            const stmt = db.prepare('UPDATE cards SET position = ? WHERE id = ?');
            stmt.run(newPosition, card.id);
        }
    });
}

// Task-related functions
export function createTask(db: any, task: any): any {
    const id = task.id || randomBytes(16).toString('hex');
    // Allow callers to pass either due_date (DB style) or dueDate (model style)
    const dueDateInput = task.due_date ?? task.dueDate ?? new Date().toISOString();
    const due_date = dueDateInput instanceof Date ? dueDateInput.toISOString() : dueDateInput;
    const stmt = db.prepare(
        'INSERT INTO tasks (id, title, description, due_date, recurrence, status, card_id) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run(
        id,
        task.title,
        task.description ?? null,
        due_date,
        task.recurrence ?? null,
        task.status ?? 'pending',
        task.card_id ?? null
    );
    return {
        id,
        title: task.title!,
        description: task.description ?? null,
        due_date,
        recurrence: task.recurrence ?? null,
        status: task.status ?? 'pending',
        card_id: task.card_id ?? null
    };
}

export function getTaskById(db: any, id: string): any | undefined {
    const stmt = db.prepare('SELECT * FROM tasks WHERE id = ?');
    return stmt.get(id);
}

export function getAllTasks(db: any): any[] {
    const stmt = db.prepare('SELECT * FROM tasks');
    return stmt.all();
}

export function updateTask(db: any, id: string, updates: any): void {
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.title !== undefined) {
        fields.push('title = ?');
        values.push(updates.title);
    }
    if (updates.description !== undefined) {
        fields.push('description = ?');
        values.push(updates.description);
    }
    if (updates.due_date !== undefined || updates.dueDate !== undefined) {
        const dueInput = updates.due_date ?? updates.dueDate;
        const due = dueInput instanceof Date ? dueInput.toISOString() : dueInput;
        fields.push('due_date = ?');
        values.push(due);
    }
    if (updates.recurrence !== undefined) {
        fields.push('recurrence = ?');
        values.push(updates.recurrence);
    }
    if (updates.status !== undefined) {
        fields.push('status = ?');
        values.push(updates.status);
    }
    if (updates.card_id !== undefined) {
        fields.push('card_id = ?');
        values.push(updates.card_id);
    }

    if (fields.length > 0) {
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(id);
        const sql = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
        const stmt = db.prepare(sql);
        stmt.run(...values);
    }
}

export function deleteTask(db: any, id: string): void {
    const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    stmt.run(id);
}

export function clearTasks(db: any): void {
    db.exec('DELETE FROM tasks');
}
