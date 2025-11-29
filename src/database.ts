import * as path from 'path';
import * as fs from 'fs';
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
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

let db: SqlJsDatabase | undefined;
let memoryDb: SqlJsDatabase | undefined;
let customDbPath: string | undefined;
let dbFilePath: string | undefined;
let dbLastMtime: number | undefined; // Track last modification time for cross-workspace sync

// Wrapper to make sql.js compatible with better-sqlite3 API
export interface Statement {
    run(...params: any[]): { changes: number; lastInsertRowid: number };
    get(...params: any[]): any;
    all(...params: any[]): any[];
}

/**
 * Create a prepared statement wrapper for sql.js
 * This provides a better-sqlite3-compatible API
 */
export function prepare(sql: string): Statement {
    const database = getDb();
    return {
        run: (...params: any[]) => {
            // Log for debugging
            try {
                const debugLogger = getDebugLogger();
                debugLogger.log('[database.prepare.run] SQL:', sql);
                debugLogger.log('[database.prepare.run] Params:', JSON.stringify(params));
            } catch (e) {
                console.log('[database.prepare.run] SQL:', sql);
                console.log('[database.prepare.run] Params:', JSON.stringify(params));
            }
            
            // sql.js expects an array, our API accepts variadic args - convert
            try {
                database.run(sql, params.length > 0 ? params : []);
            } catch (err) {
                getDebugLogger().log('[database.prepare.run] ERROR executing SQL:', err);
                throw err;
            }
            
            const changes = database.getRowsModified();
            const result = database.exec('SELECT last_insert_rowid() as id');
            const lastInsertRowid = result.length > 0 && result[0].values.length > 0 
                ? result[0].values[0][0] as number 
                : 0;
            saveDatabase(); // Auto-save after write
            return { changes, lastInsertRowid };
        },
        get: (...params: any[]) => {
            const result = database.exec(sql, params.length > 0 ? params : []);
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
            const result = database.exec(sql, params.length > 0 ? params : []);
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

/**
 * Get the full resolved database file path (only available after initDatabase)
 */
export function getDatabaseFilePath(): string | undefined {
    return dbFilePath;
}

export async function initDatabase(memory: boolean = false, workspaceRoot?: string): Promise<SqlJsDatabase> {
    try {
        const caller = new Error().stack?.split('\n')[2]?.trim();
        getLogger().info('initDatabase called', { memory, workspaceRoot, caller });
        
        // Initialize sql.js with WASM file location
        // The WASM file is copied to dist/ by esbuild.js
        const SQL = await initSqlJs({
            locateFile: (file) => {
                // Look in the dist folder where esbuild copies it
                const wasmPath = path.join(__dirname, '..', 'dist', file);
                getLogger().debug('Loading WASM file from:', wasmPath);
                return wasmPath;
            }
        });
        
        if (memory) {
            if (memoryDb) {
                getLogger().debug('Returning existing memory database');
                return memoryDb;
            }
            getLogger().info('Creating new in-memory database');
            memoryDb = new SQL.Database();
            db = memoryDb;
        } else {
            if (db) {
                getLogger().debug('Returning existing database connection');
                return db;
            }
            
            // Determine the database path
            const configuredPath = getDatabasePath();
            let dbPath: string;
            
            // Check if the configured path is absolute (shared database outside workspace)
            if (path.isAbsolute(configuredPath)) {
                dbPath = configuredPath;
                getLogger().info('Using absolute database path (shared database)');
            } else if (workspaceRoot) {
                // Use provided workspace root (for production)
                dbPath = path.join(workspaceRoot, configuredPath);
            } else {
                // Fallback to __dirname (for testing)
                dbPath = path.join(__dirname, '..', configuredPath);
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
            
            // Load existing database file or create new one
            let buffer: Uint8Array | undefined;
            if (fs.existsSync(dbPath)) {
                buffer = fs.readFileSync(dbPath);
                // Store the file's modification time for cross-workspace sync detection
                dbLastMtime = fs.statSync(dbPath).mtimeMs;
                getLogger().info('Loaded existing database file');
            }
            
            db = new SQL.Database(buffer);
            dbFilePath = dbPath;
            getLogger().info('Database initialized from file');
        }

        // sql.js doesn't support pragma, but we track foreign keys in migrations
        getLogger().debug('Database ready (sql.js doesn\'t use pragma)');

        // Run migrations automatically on initialization
        getLogger().info('Running database migrations');
        runMigrations();

        // Ensure FTS5-dependent objects are compatible with sql.js
        try {
            ensureSearchIndexCompatible();
        } catch (compatErr: any) {
            getLogger().warn('Search index compatibility check failed', compatErr);
        }
        
        getLogger().info('Database initialized successfully');
        return db;
    } catch (error: any) {
        getLogger().error('Failed to initialize database', error);
        getDebugLogger().log('ERROR: Database initialization failed:', error.message, error.stack);
        throw new Error(`Database initialization failed: ${error.message}`);
    }
}

// Save database to file
export function saveDatabase(): void {
    if (!db || !dbFilePath || memoryDb) {
        return; // Don't save memory databases
    }
    try {
        const data = db.export();
        fs.writeFileSync(dbFilePath, data);
        // Update our tracked mtime after saving
        dbLastMtime = fs.statSync(dbFilePath).mtimeMs;
        getLogger().debug('Database saved to file');
    } catch (error: any) {
        getLogger().error('Failed to save database', error);
    }
}

/**
 * Check if the database file has been modified externally (e.g., by another VS Code workspace)
 * Returns true if the file has changed since we last loaded/saved it
 */
export function hasDatabaseChangedExternally(): boolean {
    if (!dbFilePath || memoryDb || !dbLastMtime) {
        return false;
    }
    try {
        if (!fs.existsSync(dbFilePath)) {
            return false;
        }
        const currentMtime = fs.statSync(dbFilePath).mtimeMs;
        return currentMtime > dbLastMtime;
    } catch (error: any) {
        getLogger().error('Failed to check database mtime', error);
        return false;
    }
}

/**
 * Reload the database from disk if it has been modified externally
 * Used for cross-workspace synchronization when using a shared database
 * Returns true if the database was reloaded, false otherwise
 */
export async function reloadDatabaseIfChanged(): Promise<{ reloaded: boolean; externalChange: boolean }> {
    if (!dbFilePath || memoryDb) {
        return { reloaded: false, externalChange: false };
    }
    
    const externalChange = hasDatabaseChangedExternally();
    if (!externalChange) {
        getLogger().debug('Database has not changed externally, no reload needed');
        return { reloaded: false, externalChange: false };
    }
    
    getLogger().info('Database file changed externally, reloading...');
    getDebugLogger().log('Database file changed externally, reloading from disk');
    
    try {
        // Read the updated file
        const buffer = fs.readFileSync(dbFilePath);
        const currentMtime = fs.statSync(dbFilePath).mtimeMs;
        
        // Initialize sql.js
        const SQL = await initSqlJs({
            locateFile: (file) => {
                const wasmPath = path.join(__dirname, '..', 'dist', file);
                return wasmPath;
            }
        });
        
        // Close the old database if it exists
        if (db) {
            db.close();
        }
        
        // Create new database from the updated file
        db = new SQL.Database(buffer);
        dbLastMtime = currentMtime;
        
        getLogger().info('Database reloaded from disk successfully');
        getDebugLogger().log('Database reloaded from disk successfully');
        
        return { reloaded: true, externalChange: true };
    } catch (error: any) {
        getLogger().error('Failed to reload database', error);
        getDebugLogger().log('ERROR: Failed to reload database:', error.message);
        return { reloaded: false, externalChange: true };
    }
}

export function getDb(): SqlJsDatabase {
    if (!db) {
        getLogger().error('Database not initialized when getDb() called');
        throw new Error('Database not initialized. Call initDatabase() first.');
    }
    getLogger().debug('getDb() returning existing database instance');
    return db;
}

/**
 * If the existing database has an FTS5 virtual table named `search_index`,
 * replace it with a regular table so sql.js can operate without the fts5 module.
 * Also recreates the triggers to use the regular table.
 */
function ensureSearchIndexCompatible(): void {
    const database = getDb();
    const logger = getLogger();
    
    // Check if search_index exists and if it's an FTS5 virtual table
    const result = database.exec(`
        SELECT name, type, sql FROM sqlite_master 
        WHERE name = 'search_index' LIMIT 1;
    `);
    
    if (!result || result.length === 0 || result[0].values.length === 0) {
        logger.info('No search_index table found, will be created by migrations');
        return;
    }
    
    const row = result[0].values[0];
    const sqlText = String(row[2] || '');
    const isVirtualFts5 = /VIRTUAL\s+TABLE/i.test(sqlText) && /fts5/i.test(sqlText);
    
    if (!isVirtualFts5) {
        logger.info('search_index is already a regular table, no conversion needed');
        return;
    }
    
    logger.info('Found FTS5 virtual table, converting to regular table for sql.js compatibility');
    
    // Step 1: Drop ALL triggers that reference search_index (they use FTS5 syntax)
    // These triggers insert into the FTS5 table which causes the error
    database.exec(`
        DROP TRIGGER IF EXISTS notes_after_insert;
        DROP TRIGGER IF EXISTS notes_after_delete;
        DROP TRIGGER IF EXISTS notes_after_update;
        DROP TRIGGER IF EXISTS cards_after_insert;
        DROP TRIGGER IF EXISTS cards_after_delete;
        DROP TRIGGER IF EXISTS cards_after_update;
    `);
    logger.info('Dropped FTS5-dependent triggers');
    
    // Step 2: Drop the FTS5 virtual table (we can't read from it in sql.js)
    database.exec(`DROP TABLE IF EXISTS search_index;`);
    logger.info('Dropped FTS5 virtual table');
    
    // Step 3: Create the regular search_index table with indexes
    database.exec(`
        CREATE TABLE IF NOT EXISTS search_index (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            content TEXT,
            entity_id TEXT NOT NULL,
            entity_type TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS idx_search_title ON search_index(title);
        CREATE INDEX IF NOT EXISTS idx_search_content ON search_index(content);
        CREATE INDEX IF NOT EXISTS idx_search_entity ON search_index(entity_id, entity_type);
    `);
    logger.info('Created regular search_index table');
    
    // Step 4: Recreate the triggers with regular table INSERT syntax
    database.exec(`
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
            DELETE FROM search_index WHERE entity_id = old.id AND entity_type = 'note';
        END;

        -- Trigger to delete from search_index when a card is deleted
        CREATE TRIGGER IF NOT EXISTS cards_after_delete
        AFTER DELETE ON cards
        BEGIN
            DELETE FROM search_index WHERE entity_id = old.id AND entity_type = 'card';
        END;

        -- Trigger to update search_index when a note is updated
        CREATE TRIGGER IF NOT EXISTS notes_after_update
        AFTER UPDATE ON notes
        BEGIN
            UPDATE search_index
            SET title = new.title, content = new.content
            WHERE entity_id = new.id AND entity_type = 'note';
        END;

        -- Trigger to update search_index when a card is updated
        CREATE TRIGGER IF NOT EXISTS cards_after_update
        AFTER UPDATE ON cards
        BEGIN
            UPDATE search_index
            SET title = new.title, content = new.content
            WHERE entity_id = new.id AND entity_type = 'card';
        END;
    `);
    logger.info('Recreated triggers for regular table');
    
    // Step 5: Repopulate search_index from existing notes and cards
    try {
        database.exec(`
            INSERT INTO search_index (title, content, entity_id, entity_type)
            SELECT title, content, id, 'note' FROM notes;
        `);
        database.exec(`
            INSERT INTO search_index (title, content, entity_id, entity_type)
            SELECT title, content, id, 'card' FROM cards;
        `);
        logger.info('Repopulated search_index from existing data');
    } catch (e: any) {
        logger.warn('Could not repopulate search_index, will be populated by triggers going forward', e);
    }
    
    // Save the database after conversion
    saveDatabase();
    logger.info('FTS5 to regular table conversion complete');
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
        getDb(); // Ensure DB is initialized
        const stmt = prepare(
            'INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)'
        );
        stmt.run(
            note.id,
            note.title,
            note.content,
            note.file_path,
            note.nlh_enabled ? 1 : 0
        );
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
        getDb(); // Ensure DB is initialized
        const stmt = prepare('SELECT * FROM notes WHERE id = ?');
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
        getDb(); // Ensure DB is initialized
        const stmt = prepare('SELECT * FROM notes WHERE file_path = ?');
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
        getDb(); // Ensure DB is initialized
        const stmt = prepare('SELECT * FROM notes');
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
        getDb(); // Ensure DB is initialized
        const stmt = prepare(
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
    getDb(); // Ensure DB is initialized
    const stmt = prepare('DELETE FROM notes WHERE id = ?');
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
    const stmt = prepare('INSERT INTO boards (id, title) VALUES (?, ?)');
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
    return prepare('SELECT * FROM boards WHERE id = ?').get(id) as Board;
}

export function getAllBoards(): Board[] {
    const db = getDb();
    return prepare('SELECT * FROM boards').all() as Board[];
}

export function updateBoard(board: Partial<Board>): Board {
    getDb(); // Ensure DB is initialized
    const stmt = prepare('UPDATE boards SET title = ? WHERE id = ?');
    stmt.run(board.title, board.id);
    return getBoardById(board.id as string);
}

export function deleteBoard(id: string): void {
    const db = getDb();
    prepare('DELETE FROM boards WHERE id = ?').run(id);
}

// Column CRUD
const rowToColumn = (row: any): Column => {
    if (!row) return row;
    return row as Column;
};

export function createColumn(column: Partial<Column>): Column {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = prepare('INSERT INTO columns (id, title, board_id, position) VALUES (?, ?, ?, ?)');
    stmt.run(id, column.title, column.board_id, column.position);
    return getColumnById(id);
}

export function getColumnById(id: string): Column {
    const db = getDb();
    const row = prepare('SELECT * FROM columns WHERE id = ?').get(id);
    return rowToColumn(row);
}

export function getColumnsByBoardId(boardId: string): Column[] {
    const db = getDb();
    const rows = prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY position').all(boardId);
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
    const stmt = prepare(sql);
    stmt.run(...values);
    return getColumnById(column.id as string);
}

export function deleteColumn(id: string): void {
    const db = getDb();
    prepare('DELETE FROM columns WHERE id = ?').run(id);
}

// Card CRUD
const rowToCard = (row: any): Card => {
    if (!row) return row;
    return row as Card;
}

export function createCard(card: Partial<Card>): Card {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = prepare('INSERT INTO cards (id, column_id, position, card_type, title, content, note_id, summary, priority, scheduled_at, recurrence, activated_at, completed_at, converted_from_task_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, card.column_id, card.position ?? 0, card.card_type ?? 'simple', card.title, card.content ?? null, card.note_id ?? null, card.summary ?? null, card.priority ?? 0, card.scheduled_at ?? null, card.recurrence ?? null, card.activated_at ?? null, card.completed_at ?? null, card.converted_from_task_at ?? null);
    return getCardById(id);
}

export function getCardById(id: string): Card {
    const db = getDb();
    const row = prepare('SELECT * FROM cards WHERE id = ?').get(id);
    return rowToCard(row);
}

export function getCardsByColumnId(columnId: string): Card[] {
    const db = getDb();
    const rows = prepare('SELECT * FROM cards WHERE column_id = ? ORDER BY position').all(columnId);
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
        converted_from_task_at: card.converted_from_task_at,
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
    prepare(sql).run(...values);
    return getCardById(card.id as string);
}

export function deleteCard(id: string): void {
    const db = getDb();
    prepare('DELETE FROM cards WHERE id = ?').run(id);
}

// Tag CRUD
export function createTag(tag: Partial<Tag>): Tag {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = prepare('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)');
    stmt.run(id, tag.name, tag.color);
    return getTagById(id);
}

export function getTagById(id: string): Tag {
    const db = getDb();
    return prepare('SELECT * FROM tags WHERE id = ?').get(id) as Tag;
}

export function getAllTags(): Tag[] {
    const db = getDb();
    return prepare('SELECT * FROM tags ORDER BY name').all() as Tag[];
}

export function updateTag(tag: Partial<Tag>): Tag {
    const db = getDb();
    if (!tag.id) {
        throw new Error("Tag id is required for update");
    }
    const stmt = prepare('UPDATE tags SET name = ?, color = ? WHERE id = ?');
    stmt.run(tag.name, tag.color, tag.id);
    return getTagById(tag.id as string);
}

export function deleteTag(id: string): void {
    const db = getDb();
    prepare('DELETE FROM tags WHERE id = ?').run(id);
}

// Card-Tag Relationships
export function addTagToCard(cardId: string, tagId: string): void {
    const db = getDb();
    const logger = getLogger();
    
    // Verify card exists
    const card = prepare('SELECT id FROM cards WHERE id = ?').get(cardId);
    if (!card) {
        const error = new Error(`Card with ID ${cardId} does not exist`);
        logger.error('addTagToCard failed: Card not found', error);
        throw error;
    }
    
    // Verify tag exists
    const tag = prepare('SELECT id FROM tags WHERE id = ?').get(tagId);
    if (!tag) {
        const error = new Error(`Tag with ID ${tagId} does not exist`);
        logger.error('addTagToCard failed: Tag not found', error);
        throw error;
    }
    
    // Debug logging (only logged when debug level is enabled)
    logger.debug(`addTagToCard: Database instance type: sql.js`);
    logger.debug(`addTagToCard: sql.js doesn't support transactions like better-sqlite3`);
    const cardCount = prepare('SELECT COUNT(*) as count FROM cards').get() as any;
    logger.debug(`addTagToCard: Total cards in database: ${cardCount.count}`);
    const allCardIds = prepare('SELECT id, title FROM cards LIMIT 10').all();
    logger.debug(`addTagToCard: First 10 cards: ${JSON.stringify(allCardIds)}`);
    logger.debug(`addTagToCard: Inserting card_id=${cardId}, tag_id=${tagId}`);
    
    try {
        prepare('INSERT INTO card_tags (card_id, tag_id) VALUES (?, ?)').run(cardId, tagId);
        logger.debug(`addTagToCard: Successfully inserted tag ${tagId} to card ${cardId}`);
    } catch (err) {
        logger.error(`addTagToCard: Insert failed`, err);
        throw err;
    }
}

export function removeTagFromCard(cardId: string, tagId: string): void {
    const db = getDb();
    prepare('DELETE FROM card_tags WHERE card_id = ? AND tag_id = ?').run(cardId, tagId);
}

export function getTagsByCardId(cardId: string): Tag[] {
    getDb(); // Ensure DB is initialized
    const stmt = prepare(`
        SELECT t.* FROM tags t
        JOIN card_tags ct ON t.id = ct.tag_id
        WHERE ct.card_id = ?
    `);
    return stmt.all(cardId) as Tag[];
}

// Task-Tag Relationships
export function addTagToTask(taskId: string, tagId: string): void {
    const db = getDb();
    const logger = getLogger();
    
    // Verify task exists
    const task = prepare('SELECT id FROM tasks WHERE id = ?').get(taskId);
    if (!task) {
        const error = new Error(`Task with ID ${taskId} does not exist`);
        logger.error('addTagToTask failed: Task not found', error);
        throw error;
    }
    
    // Verify tag exists
    const tag = prepare('SELECT id FROM tags WHERE id = ?').get(tagId);
    if (!tag) {
        const error = new Error(`Tag with ID ${tagId} does not exist`);
        logger.error('addTagToTask failed: Tag not found', error);
        throw error;
    }
    
    // Debug logging (only logged when debug level is enabled)
    logger.debug(`addTagToTask: Inserting task_id=${taskId}, tag_id=${tagId}`);
    
    try {
        prepare('INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)').run(taskId, tagId);
        logger.debug(`addTagToTask: Successfully inserted tag ${tagId} to task ${taskId}`);
    } catch (err) {
        logger.error(`addTagToTask: Insert failed`, err);
        throw err;
    }
}

export function removeTagFromTask(taskId: string, tagId: string): void {
    const db = getDb();
    prepare('DELETE FROM task_tags WHERE task_id = ? AND tag_id = ?').run(taskId, tagId);
}

export function getTagsByTaskId(taskId: string): Tag[] {
    getDb(); // Ensure DB is initialized
    const stmt = prepare(`
        SELECT t.* FROM tags t
        JOIN task_tags tt ON t.id = tt.tag_id
        WHERE tt.task_id = ?
    `);
    return stmt.all(taskId) as Tag[];
}

