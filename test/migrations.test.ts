import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';
import * as path from 'path';

const dbPath = path.join(__dirname, '..', '.chroma', 'chroma.db');

import { initDatabase, closeDb, getDb } from '../src/database';
import { initMigrationTable, getCurrentVersion, runMigrations, getMigrationHistory } from '../src/migrations';

describe('Migration System Tests', () => {
    beforeEach(() => {
        closeDb();
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    afterEach(() => {
        closeDb();
    });

    describe('Migration Table Initialization', () => {
        it('should create schema_migrations table', () => {
            initDatabase();
            const db = getDb();
            const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='schema_migrations'");
            const table = stmt.get();
            expect(table).to.not.be.undefined;
        });
    });

    describe('Migration Execution', () => {
        it('should run pending migrations', () => {
            initDatabase();
            const version = getCurrentVersion();
            expect(version).to.be.greaterThan(0);
        });

        it('should not run migrations twice', () => {
            initDatabase();
            const firstVersion = getCurrentVersion();
            runMigrations();
            const secondVersion = getCurrentVersion();
            expect(firstVersion).to.equal(secondVersion);
        });

        it('should track migration history', () => {
            initDatabase();
            const history = getMigrationHistory();
            expect(history).to.be.an('array');
            expect(history.length).to.be.greaterThan(0);
            expect(history[0]).to.have.property('version');
            expect(history[0]).to.have.property('name');
            expect(history[0]).to.have.property('applied_at');
        });
    });

    describe('Schema Verification', () => {
        it('should have notes table after migration', () => {
            initDatabase();
            const db = getDb();
            const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'");
            const table = stmt.get();
            expect(table).to.not.be.undefined;
        });
    });
});
