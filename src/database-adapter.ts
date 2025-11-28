// Database adapter to support both better-sqlite3 (production) and sql.js (testing)
import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';
import BetterSqlite3, { Database as BetterSqlite3Database } from 'better-sqlite3';
import { getDebugLogger } from './logic/DebugLogger';

// Common interface for both database implementations
export interface DatabaseAdapter {
    prepare(sql: string): StatementAdapter;
    exec(sql: string): void;
    pragma(pragma: string, options?: any): any;
    close(): void;
}

export interface StatementAdapter {
    run(...params: any[]): { changes: number; lastInsertRowid: number | bigint };
    get(...params: any[]): any;
    all(...params: any[]): any[];
}

class BetterSqlite3Adapter implements DatabaseAdapter {
    constructor(private db: BetterSqlite3Database) {}

    prepare(sql: string): StatementAdapter {
        const stmt = this.db.prepare(sql);
        return {
            run: (...params: any[]) => stmt.run(...params),
            get: (...params: any[]) => stmt.get(...params),
            all: (...params: any[]) => stmt.all(...params),
        };
    }

    exec(sql: string): void {
        this.db.exec(sql);
    }

    pragma(pragma: string, options?: any): any {
        return this.db.pragma(pragma, options);
    }

    close(): void {
        this.db.close();
    }
}

class SqlJsAdapter implements DatabaseAdapter {
    constructor(private db: SqlJsDatabase) {}

    prepare(sql: string): StatementAdapter {
        return {
            run: (...params: any[]) => {
                // Log for debugging
                try {
                    const debugLogger = getDebugLogger();
                    debugLogger.log('[SqlJsAdapter] Running SQL:', sql);
                    debugLogger.log('[SqlJsAdapter] With params:', JSON.stringify(params));
                } catch (e) {
                    // Fallback to console if debug logger not available
                    console.log('[SqlJsAdapter] Running SQL:', sql);
                    console.log('[SqlJsAdapter] With params:', JSON.stringify(params));
                }
                
                this.db.run(sql, params);
                const changes = this.db.getRowsModified();
                // Get last insert rowid by querying
                const result = this.db.exec('SELECT last_insert_rowid() as id');
                const lastInsertRowid = result.length > 0 && result[0].values.length > 0 
                    ? result[0].values[0][0] as number 
                    : 0;
                return { changes, lastInsertRowid };
            },
            get: (...params: any[]) => {
                const result = this.db.exec(sql, params);
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
                const result = this.db.exec(sql, params);
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

    pragma(pragma: string, options?: any): any {
        // sql.js doesn't support pragma the same way, so we'll just ignore it
        return undefined;
    }

    close(): void {
        this.db.close();
    }
}

export async function createSqlJsAdapter(): Promise<DatabaseAdapter> {
    const SQL = await initSqlJs();
    const db = new SQL.Database();
    return new SqlJsAdapter(db);
}

export function createBetterSqlite3Adapter(pathOrMemory: string): DatabaseAdapter {
    const db = new BetterSqlite3(pathOrMemory);
    return new BetterSqlite3Adapter(db);
}
