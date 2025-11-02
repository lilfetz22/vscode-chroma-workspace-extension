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
