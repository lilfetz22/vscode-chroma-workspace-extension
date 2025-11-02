import * as fs from 'fs';
import * as path from 'path';
import { initDatabase, getDb, createTables, closeDb } from '../src/database';
import Database from 'better-sqlite3';

describe('Database Functions', () => {
    const dbPath = path.join(__dirname, '..', '.chroma', 'test.db');
    let db: Database.Database;

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        db = initDatabase(true);
        createTables();
    });

    it('should initialize the database', () => {
        expect(db).toBeDefined();
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const tableNames = tables.map((t: any) => t.name);
        expect(tableNames).toContain('notes');
    });
});
