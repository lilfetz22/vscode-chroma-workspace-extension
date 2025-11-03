import * as fs from 'fs';
import * as path from 'path';
import { initDatabase } from '../src/database';
import { runMigrations, getCurrentVersion } from '../src/migrations';
import Database from 'better-sqlite3';

describe('Migration Functions', () => {
    const dbPath = path.join(__dirname, '..', '.chroma', 'test.db');
    let db: Database.Database;

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        db = initDatabase(true);
    });

    it('should run migrations', () => {
        runMigrations();
        const version = getCurrentVersion();
        expect(version).toBe(5);
    });
});
