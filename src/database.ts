import * as path from 'path';
import * as fs from 'fs';
import Database from 'better-sqlite3';
import { Note } from './models/Note';
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
