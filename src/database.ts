import * as path from 'path';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import { Note } from './models/Note';
import { Board } from './models/Board';
import { Column } from './models/Column';
import { Card } from './models/Card';
import { Tag } from './models/Tag';
import { runMigrations } from './migrations';
import { randomBytes } from 'crypto';
import { getDebugLogger } from './logic/DebugLogger';

let logger: any;

function getLogger() {
    if (!logger) {
        try {
            const { createLogger } = require('./logic/Logger');
            logger = createLogger('Database');
        } catch {
            // Logger not available in test environment, use console
            logger = {
                debug: () => {},
                info: console.log,
                warn: console.warn,
                error: console.error
            };
        }
    }
    return logger;
}

let db: Database.Database | undefined;
let memoryDb: Database.Database | undefined;
let customDbPath: string | undefined;

/**
 * Set a custom database path (relative to workspace root)
 * Must be called before initDatabase()
 */
export function setDatabasePath(relativePath: string): void {
    if (db) {
        const error = new Error('Cannot change database path after database has been initialized');
        getLogger().error('Attempted to change database path after initialization', error);
        getDebugLogger().log('ERROR: Attempted to change database path after initialization:', error.message);
        throw error;
    }
    getLogger().info('Database path set to:', relativePath);
    getDebugLogger().log('Database path set to:', relativePath);
    customDbPath = relativePath;
}

/**
 * Get the configured database path
 */
export function getDatabasePath(): string {
    return customDbPath || '.chroma/chroma.db';
}

export function initDatabase(memory: boolean = false, workspaceRoot?: string): Database.Database {
    try {
        const caller = new Error().stack?.split('\n')[2]?.trim();
        getLogger().info('initDatabase called', { memory, workspaceRoot, caller });
        
        if (memory) {
            if (memoryDb) {
                getLogger().debug('Returning existing memory database');
                return memoryDb;
            }
            getLogger().info('Creating new in-memory database');
            memoryDb = new Database(':memory:');
            db = memoryDb;
        } else {
            if (db) {
                getLogger().debug('Returning existing database connection');
                return db;
            }
            
            // Determine the database path
            const relativePath = getDatabasePath();
            let dbPath: string;
            
            if (workspaceRoot) {
                // Use provided workspace root (for production)
                dbPath = path.join(workspaceRoot, relativePath);
            } else {
                // Fallback to __dirname (for testing)
                dbPath = path.join(__dirname, '..', relativePath);
                getLogger().warn('No workspaceRoot provided, using fallback path');
            }
            
            getLogger().info('Database path resolved to:', dbPath);
            getLogger().info('Database file exists:', fs.existsSync(dbPath));
            getLogger().info('__dirname is:', __dirname);
            
            const chromaDir = path.dirname(dbPath);
            if (!fs.existsSync(chromaDir)) {
                getLogger().info('Creating database directory:', chromaDir);
                fs.mkdirSync(chromaDir, { recursive: true });
            }
            
            getLogger().info('Opening database connection');
            db = new Database(dbPath);
        }

        db.pragma('journal_mode = WAL');
        getLogger().debug('Set journal_mode to WAL');
        
        db.pragma('foreign_keys = ON');
        getLogger().debug('Enabled foreign key constraints');

        // Run migrations automatically on initialization
        getLogger().info('Running database migrations');
        runMigrations();
        
        getLogger().info('Database initialized successfully');
        return db;
    } catch (error: any) {
        getLogger().error('Failed to initialize database', error);
        getDebugLogger().log('ERROR: Database initialization failed:', error.message, error.stack);
        throw new Error(`Database initialization failed: ${error.message}`);
    }
}

export function getDb(): Database.Database {
    if (!db) {
        getLogger().warn('Database not initialized when getDb() called, initializing now');
        getLogger().warn('This may indicate a module loading issue');
        return initDatabase(!!memoryDb);
    }
    getLogger().debug('getDb() returning existing database instance');
    return db;
}

export function createTables(): void {
    try {
        getLogger().info('Creating database tables');
        const db = getDb();
        const schema = `
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT NOT NULL,
                content TEXT,
                file_path TEXT UNIQUE NOT NULL,
                nlh_enabled BOOLEAN DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );
        `;
        db.exec(schema);
        getLogger().info('Database tables created successfully');
    } catch (error: any) {
        getLogger().error('Failed to create database tables', error);
        throw new Error(`Table creation failed: ${error.message}`);
    }
}

export function createNote(note: Partial<Note>): Note {
    try {
        getLogger().debug('Creating note', { title: note.title, file_path: note.file_path });
        const db = getDb();
        const stmt = db.prepare(
            'INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (@id, @title, @content, @file_path, @nlh_enabled)'
        );
        stmt.run({
            ...note,
            nlh_enabled: note.nlh_enabled ? 1 : 0,
        });
        getLogger().info('Note created successfully', { id: note.id });
        return getNoteById(note.id as string);
    } catch (error: any) {
        getLogger().error('Failed to create note', error, { note });
        throw new Error(`Note creation failed: ${error.message}`);
    }
}

export function getNoteById(id: string): Note {
    try {
        getLogger().debug('Fetching note by ID', { id });
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
        const note = stmt.get(id) as Note;
        if (note) {
            note.nlh_enabled = !!note.nlh_enabled;
            getLogger().debug('Note found', { id });
        } else {
            getLogger().warn('Note not found', { id });
        }
        return note;
    } catch (error: any) {
        getLogger().error('Failed to fetch note by ID', error, { id });
        throw new Error(`Failed to fetch note: ${error.message}`);
    }
}

export function getNoteByFilePath(filePath: string): Note {
    try {
        getLogger().debug('Fetching note by file path', { filePath });
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM notes WHERE file_path = ?');
        const note = stmt.get(filePath) as Note;
        if (note) {
            note.nlh_enabled = !!note.nlh_enabled;
            getLogger().debug('Note found', { filePath });
        } else {
            getLogger().debug('Note not found', { filePath });
        }
        return note;
    } catch (error: any) {
        getLogger().error('Failed to fetch note by file path', error, { filePath });
        throw new Error(`Failed to fetch note: ${error.message}`);
    }
}

export function findOrCreateNoteByPath(filePath: string): Note {
    try {
        getLogger().debug('Finding or creating note by path', { filePath });
        let note = getNoteByFilePath(filePath);
        if (!note) {
            getLogger().info('Note not found, creating new note', { filePath });
            const newNote: Partial<Note> = {
                id: randomBytes(16).toString('hex'),
                title: path.basename(filePath, '.notesnlh'),
                content: '',
                file_path: filePath,
                nlh_enabled: true,
            };
            note = createNote(newNote);
        }
        return note;
    } catch (error: any) {
        getLogger().error('Failed to find or create note', error, { filePath });
        throw new Error(`Failed to find or create note: ${error.message}`);
    }
}

export function getAllNotes(): Note[] {
    try {
        getLogger().debug('Fetching all notes');
        const db = getDb();
        const stmt = db.prepare('SELECT * FROM notes');
        const notes = stmt.all() as Note[];
        getLogger().info(`Found ${notes.length} notes`);
        return notes.map(note => ({
            ...note,
            nlh_enabled: !!note.nlh_enabled,
        }));
    } catch (error: any) {
        getLogger().error('Failed to fetch all notes', error);
        throw new Error(`Failed to fetch notes: ${error.message}`);
    }
}

export function updateNote(note: Partial<Note>): Note {
    try {
        getLogger().debug('Updating note', { id: note.id });
        const db = getDb();
        const stmt = db.prepare(
            'UPDATE notes SET title = @title, content = @content, file_path = @file_path, nlh_enabled = @nlh_enabled, updated_at = CURRENT_TIMESTAMP WHERE id = @id'
        );
        stmt.run({
            ...note,
            nlh_enabled: note.nlh_enabled ? 1 : 0,
        });
        getLogger().info('Note updated successfully', { id: note.id });
        return getNoteById(note.id as string);
    } catch (error: any) {
        getLogger().error('Failed to update note', error, { note });
        throw new Error(`Note update failed: ${error.message}`);
    }
}

export function deleteNote(id: string): void {
    const db = getDb();
    const stmt = db.prepare('DELETE FROM notes WHERE id = ?');
    stmt.run(id);
}

export function closeDb(): void {
    if (db) {
        db.close();
        db = undefined;
    }
}

// Kanban Board CRUD
export function createBoard(board: Partial<Board>): Board {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)');
    stmt.run(id, board.title);
    
    // Automatically create default columns
    const defaultColumns = [
        { title: 'To Do', position: 0 },
        { title: 'In Progress', position: 1 },
        { title: 'Done', position: 2 }
    ];
    
    for (const col of defaultColumns) {
        createColumn({ 
            title: col.title, 
            board_id: id, 
            position: col.position 
        });
    }
    
    return getBoardById(id);
}

export function getBoardById(id: string): Board {
    const db = getDb();
    return db.prepare('SELECT * FROM boards WHERE id = ?').get(id) as Board;
}

export function getAllBoards(): Board[] {
    const db = getDb();
    return db.prepare('SELECT * FROM boards').all() as Board[];
}

export function updateBoard(board: Partial<Board>): Board {
    const db = getDb();
    const stmt = db.prepare('UPDATE boards SET title = ? WHERE id = ?');
    stmt.run(board.title, board.id);
    return getBoardById(board.id as string);
}

export function deleteBoard(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM boards WHERE id = ?').run(id);
}

// Column CRUD
const rowToColumn = (row: any): Column => {
    if (!row) return row;
    return row as Column;
};

export function createColumn(column: Partial<Column>): Column {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO columns (id, title, board_id, position) VALUES (?, ?, ?, ?)');
    stmt.run(id, column.title, column.board_id, column.position);
    return getColumnById(id);
}

export function getColumnById(id: string): Column {
    const db = getDb();
    const row = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);
    return rowToColumn(row);
}

export function getColumnsByBoardId(boardId: string): Column[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').all(boardId);
    return rows.map(rowToColumn);
}

export function updateColumn(column: Partial<Column>): Column {
    const db = getDb();
    if (!column.id) {
        throw new Error("Column id is required for update");
    }
    const fields: string[] = [];
    const values: any[] = [];
    if (column.title !== undefined) {
        fields.push("title = ?");
        values.push(column.title);
    }
    if (column.position !== undefined) {
        fields.push("position = ?");
        values.push(column.position);
    }
    if (fields.length === 0) {
        // Nothing to update
        return getColumnById(column.id as string);
    }
    const sql = `UPDATE columns SET ${fields.join(", ")} WHERE id = ?`;
    values.push(column.id);
    const stmt = db.prepare(sql);
    stmt.run(...values);
    return getColumnById(column.id as string);
}

export function deleteColumn(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM columns WHERE id = ?').run(id);
}

// Card CRUD
const rowToCard = (row: any): Card => {
    if (!row) return row;
    return row as Card;
}

export function createCard(card: Partial<Card>): Card {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO cards (id, column_id, position, card_type, title, content, note_id, summary, priority, scheduled_at, recurrence, activated_at, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, card.column_id, card.position ?? 0, card.card_type ?? 'simple', card.title, card.content ?? null, card.note_id ?? null, card.summary ?? null, card.priority ?? 0, card.scheduled_at ?? null, card.recurrence ?? null, card.activated_at ?? null, card.completed_at ?? null);
    return getCardById(id);
}

export function getCardById(id: string): Card {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
    return rowToCard(row);
}

export function getCardsByColumnId(columnId: string): Card[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM cards WHERE column_id = ? ORDER BY position').all(columnId);
    return rows.map(rowToCard);
}

export function updateCard(card: Partial<Card>): Card {
    const db = getDb();
    if (!card.id) {
        throw new Error("Card id is required for update");
    }
    // Only update fields that are provided
    const fields: { [key: string]: any } = {
        title: card.title,
        content: card.content,
        column_id: card.column_id,
        position: card.position,
        card_type: card.card_type,
        note_id: card.note_id,
        summary: card.summary,
        priority: card.priority,
        scheduled_at: card.scheduled_at,
        recurrence: card.recurrence,
        activated_at: card.activated_at,
        completed_at: card.completed_at,
    };
    const setClauses: string[] = [];
    const values: any[] = [];
    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            setClauses.push(`${key} = ?`);
            values.push(value);
        }
    }
    setClauses.push("updated_at = CURRENT_TIMESTAMP");
    if (setClauses.length === 1) {
        // Only updated_at, nothing else to update
        throw new Error("No fields to update");
    }
    const sql = `UPDATE cards SET ${setClauses.join(', ')} WHERE id = ?`;
    values.push(card.id);
    db.prepare(sql).run(...values);
    return getCardById(card.id as string);
}

export function deleteCard(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM cards WHERE id = ?').run(id);
}

// Tag CRUD
export function createTag(tag: Partial<Tag>): Tag {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)');
    stmt.run(id, tag.name, tag.color);
    return getTagById(id);
}

export function getTagById(id: string): Tag {
    const db = getDb();
    return db.prepare('SELECT * FROM tags WHERE id = ?').get(id) as Tag;
}

export function getAllTags(): Tag[] {
    const db = getDb();
    return db.prepare('SELECT * FROM tags ORDER BY name').all() as Tag[];
}

export function updateTag(tag: Partial<Tag>): Tag {
    const db = getDb();
    if (!tag.id) {
        throw new Error("Tag id is required for update");
    }
    const stmt = db.prepare('UPDATE tags SET name = ?, color = ? WHERE id = ?');
    stmt.run(tag.name, tag.color, tag.id);
    return getTagById(tag.id as string);
}

export function deleteTag(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM tags WHERE id = ?').run(id);
}

// Card-Tag Relationships
export function addTagToCard(cardId: string, tagId: string): void {
    const db = getDb();
    const logger = getLogger();
    
    // Log database information
    logger.info(`addTagToCard: Database instance:`, db.name);
    logger.info(`addTagToCard: Database in WAL mode:`, db.inTransaction);
    
    // Count total cards
    const cardCount = db.prepare('SELECT COUNT(*) as count FROM cards').get() as any;
    logger.info(`addTagToCard: Total cards in database: ${cardCount.count}`);
    
    // List all card IDs
    const allCardIds = db.prepare('SELECT id, title FROM cards LIMIT 10').all();
    logger.info(`addTagToCard: First 10 cards:`, allCardIds);
    
    // Verify card exists
    const card = db.prepare('SELECT id FROM cards WHERE id = ?').get(cardId);
    logger.info(`addTagToCard: Checking card ${cardId}, found:`, card);
    if (!card) {
        const error = new Error(`Card with ID ${cardId} does not exist`);
        logger.error('addTagToCard failed:', error);
        throw error;
    }
    
    // Verify tag exists
    const tag = db.prepare('SELECT id FROM tags WHERE id = ?').get(tagId);
    logger.info(`addTagToCard: Checking tag ${tagId}, found:`, tag);
    if (!tag) {
        const error = new Error(`Tag with ID ${tagId} does not exist`);
        logger.error('addTagToCard failed:', error);
        throw error;
    }
    
    logger.info(`addTagToCard: Inserting card_id=${cardId}, tag_id=${tagId}`);
    try {
        db.prepare('INSERT INTO card_tags (card_id, tag_id) VALUES (?, ?)').run(cardId, tagId);
        logger.info(`addTagToCard: Successfully inserted`);
    } catch (err) {
        logger.error(`addTagToCard: Insert failed:`, err);
        throw err;
    }
}

export function removeTagFromCard(cardId: string, tagId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM card_tags WHERE card_id = ? AND tag_id = ?').run(cardId, tagId);
}

export function getTagsByCardId(cardId: string): Tag[] {
    const db = getDb();
    const stmt = db.prepare(`
        SELECT t.* FROM tags t
        JOIN card_tags ct ON t.id = ct.tag_id
        WHERE ct.card_id = ?
    `);
    return stmt.all(cardId) as Tag[];
}

// Task-Tag Relationships
export function addTagToTask(taskId: string, tagId: string): void {
    const db = getDb();
    db.prepare('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)').run(taskId, tagId);
}

export function removeTagFromTask(taskId: string, tagId: string): void {
    const db = getDb();
    db.prepare('DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?').run(taskId, tagId);
}

export function getTagsByTaskId(taskId: string): Tag[] {
    const db = getDb();
    const stmt = db.prepare(`
        SELECT t.* FROM tags t
        JOIN task_tags tt ON t.id = tt.tag_id
        WHERE tt.task_id = ?
    `);
    return stmt.all(taskId) as Tag[];
}
