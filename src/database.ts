import * as path from 'path';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import { Note } from './models/Note';
import { Board } from './models/Board';
import { Column } from './models/Column';
import { Card } from './models/Card';
import { runMigrations } from './migrations';
import { randomBytes } from 'crypto';

let db: Database.Database | undefined;

export function initDatabase(): Database.Database {
    if (db) {
        return db;
    }

    const dbPath = path.join(__dirname, '..', '.chroma', 'chroma.db');
    const chromaDir = path.dirname(dbPath);

    try {
        if (!fs.existsSync(chromaDir)) {
            fs.mkdirSync(chromaDir);
        }

        db = new Database(dbPath);
        db.pragma('journal_mode = WAL');

        console.log('Chroma database initialized at:', dbPath);
        
        // Run migrations automatically on initialization
        runMigrations();
        
        return db;
    } catch (error: any) {
        console.error(`Failed to initialize Chroma database: ${error.message}`);
        throw error;
    }
}

export function getDb(): Database.Database {
    if (!db) {
        return initDatabase();
    }
    return db;
}

export function createTables(): void {
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
}

export function createNote(note: Partial<Note>): Note {
    const db = getDb();
    const stmt = db.prepare(
        'INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (@id, @title, @content, @file_path, @nlh_enabled)'
    );
    stmt.run({
        ...note,
        nlh_enabled: note.nlh_enabled ? 1 : 0,
    });
    return getNoteById(note.id as string);
}

export function getNoteById(id: string): Note {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM notes WHERE id = ?');
    const note = stmt.get(id) as Note;
    if (note) {
        note.nlh_enabled = !!note.nlh_enabled;
    }
    return note;
}

export function getNoteByFilePath(filePath: string): Note {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM notes WHERE file_path = ?');
    const note = stmt.get(filePath) as Note;
    if (note) {
        note.nlh_enabled = !!note.nlh_enabled;
    }
    return note;
}

export function findOrCreateNoteByPath(filePath: string): Note {
    let note = getNoteByFilePath(filePath);
    if (!note) {
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
}

export function getAllNotes(): Note[] {
    const db = getDb();
    const stmt = db.prepare('SELECT * FROM notes');
    const notes = stmt.all() as Note[];
    return notes.map(note => ({
        ...note,
        nlh_enabled: !!note.nlh_enabled,
    }));
}

export function updateNote(note: Partial<Note>): Note {
    const db = getDb();
    const stmt = db.prepare(
        'UPDATE notes SET title = @title, content = @content, file_path = @file_path, nlh_enabled = @nlh_enabled, updated_at = CURRENT_TIMESTAMP WHERE id = @id'
    );
    stmt.run({
        ...note,
        nlh_enabled: note.nlh_enabled ? 1 : 0,
    });
    return getNoteById(note.id as string);
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
    const stmt = db.prepare('INSERT INTO boards (id, name) VALUES (?, ?)');
    stmt.run(id, board.name);
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
    const stmt = db.prepare('UPDATE boards SET name = ? WHERE id = ?');
    stmt.run(board.name, board.id);
    return getBoardById(board.id as string);
}

export function deleteBoard(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM boards WHERE id = ?').run(id);
}

// Column CRUD
const rowToColumn = (row: any): Column => {
    if (!row) return row;
    const { order_index, ...rest } = row;
    return { ...rest, order: order_index };
};

export function createColumn(column: Partial<Column>): Column {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO columns (id, name, board_id, order_index) VALUES (?, ?, ?, ?)');
    stmt.run(id, column.name, column.board_id, column.order);
    return getColumnById(id);
}

export function getColumnById(id: string): Column {
    const db = getDb();
    const row = db.prepare('SELECT * FROM columns WHERE id = ?').get(id);
    return rowToColumn(row);
}

export function getColumnsByBoardId(boardId: string): Column[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM columns WHERE board_id = ? ORDER BY order_index').all(boardId);
    return rows.map(rowToColumn);
}

export function updateColumn(column: Partial<Column>): Column {
    const db = getDb();
    const stmt = db.prepare('UPDATE columns SET name = ?, order_index = ? WHERE id = ?');
    stmt.run(column.name, column.order, column.id);
    return getColumnById(column.id as string);
}

export function deleteColumn(id: string): void {
    const db = getDb();
    db.prepare('DELETE FROM columns WHERE id = ?').run(id);
}

// Card CRUD
const rowToCard = (row: any): Card => {
    if (!row) return row;
    const { id, title, content, column_id, note_id, order_index, priority } = row;
    return { id, title, content, column_id, note_id, order: order_index, priority };
}

export function createCard(card: Partial<Card>): Card {
    const db = getDb();
    const id = randomBytes(16).toString('hex');
    const stmt = db.prepare('INSERT INTO cards (id, title, content, column_id, note_id, order_index, priority) VALUES (?, ?, ?, ?, ?, ?, ?)');
    stmt.run(id, card.title, card.content, card.column_id, card.note_id, card.order, card.priority);
    return getCardById(id);
}

export function getCardById(id: string): Card {
    const db = getDb();
    const row = db.prepare('SELECT * FROM cards WHERE id = ?').get(id);
    return rowToCard(row);
}

export function getCardsByColumnId(columnId: string): Card[] {
    const db = getDb();
    const rows = db.prepare('SELECT * FROM cards WHERE column_id = ? ORDER BY order_index').all(columnId);
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
        note_id: card.note_id,
        order_index: card.order,
        priority: card.priority,
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
