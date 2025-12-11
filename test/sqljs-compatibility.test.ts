/**
 * Tests to ensure sql.js compatibility - sql.js only supports positional parameters (?),
 * NOT named parameters (@param). This test suite catches if named parameters are
 * accidentally reintroduced into SQL statements.
 */

import { initTestDatabase, closeTestDb } from '../src/test-database';

describe('sql.js Compatibility Tests', () => {
    let db: any;

    beforeAll(async () => {
        db = await initTestDatabase();
    });

    afterAll(() => {
        closeTestDb();
    });

    beforeEach(() => {
        db.exec('DELETE FROM notes');
    });

    describe('SQL Statement Parameter Validation', () => {
        it('should reject SQL statements with named parameters (@param)', () => {
            // sql.js does not support named parameters like @param
            const invalidSql = 'UPDATE notes SET title = @title WHERE id = @id';
            
            expect(() => {
                const stmt = db.prepare(invalidSql);
                stmt.run({ title: 'Test', id: '123' });
            }).toThrow();
        });

        it('should accept SQL statements with positional parameters (?)', () => {
            // Create a test note first
            const insertStmt = db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)');
            insertStmt.run('test-id', 'Test', 'Content', '/path/test.notesnlh', 1);
            
            // This should work - positional parameters
            const validSql = 'UPDATE notes SET title = ? WHERE id = ?';
            
            expect(() => {
                const stmt = db.prepare(validSql);
                stmt.run('Updated Title', 'test-id');
            }).not.toThrow();
        });

    describe('Parameter Type Validation', () => {
        it('should only pass primitive types to sql.js (no objects)', () => {
            // sql.js expects: string, number, Uint8Array, null
            // NOT: objects, arrays (except Uint8Array)
            
            const insertStmt = db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)');
            insertStmt.run('param-test-1', 'Test', 'Content', '/path/test.notesnlh', 1);
            
            // Intercept the actual parameters passed to sql.js
            let parametersPassed: any[] = [];
            const originalPrepare = db.prepare;
            db.prepare = (sql: string) => {
                const stmt = originalPrepare.call(db, sql);
                if (sql.includes('UPDATE notes')) {
                    const originalRun = stmt.run;
                    stmt.run = function(...params: any[]) {
                        parametersPassed = params;
                        
                        // Validate each parameter
                        params.forEach((param, idx) => {
                            if (param !== null && typeof param === 'object') {
                                throw new Error(
                                    `Parameter ${idx} is an object: ${JSON.stringify(param)}. ` +
                                    `sql.js only supports primitives (string, number, null). ` +
                                    `This causes: "Wrong API use: tried to bind a value of an unknown type"`
                                );
                            }
                        });
                        
                        return originalRun.call(this, ...params);
                    };
                }
                return stmt;
            };

            try {
                // Test with positional parameters
                const sql = 'UPDATE notes SET title = ?, content = ?, nlh_enabled = ? WHERE id = ?';
                const stmt = db.prepare(sql);
                stmt.run('Updated', 'Content', 0, 'param-test-1');

                // Verify parameters are primitives
                expect(parametersPassed.length).toBeGreaterThan(0);
                parametersPassed.forEach(param => {
                    const isValid = param === null || 
                                   typeof param === 'string' || 
                                   typeof param === 'number' ||
                                   typeof param === 'boolean';
                    expect(isValid).toBe(true);
                });
            } finally {
                db.prepare = originalPrepare;
            }
        });

        it('should handle boolean to number conversion for database storage', () => {
            const insertStmt = db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)');
            insertStmt.run('bool-test-1', 'Test', 'Content', '/path/test.notesnlh', 1);

            // Test that we properly convert boolean true to 1 and false to 0
            const sql = 'UPDATE notes SET nlh_enabled = ? WHERE id = ?';
            const stmt = db.prepare(sql);
            
            stmt.run(0, 'bool-test-1');  // false -> 0
            
            const result = db.prepare('SELECT nlh_enabled FROM notes WHERE id = ?').get('bool-test-1');
            expect(result.nlh_enabled).toBe(0);
        });
    });

    describe('Regression Test - Object Spreading Bug', () => {
        it('should verify parameter count matches SQL placeholders', () => {
            const insertStmt = db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)');
            insertStmt.run('count-test-1', 'Test', 'Content', '/path/test.notesnlh', 1);
            
            let sqlPlaceholderCount = 0;
            let actualParamCount = 0;
            
            const originalPrepare = db.prepare;
            db.prepare = (sql: string) => {
                const stmt = originalPrepare.call(db, sql);
                if (sql.includes('UPDATE notes')) {
                    // Count ? placeholders in SQL
                    sqlPlaceholderCount = (sql.match(/\?/g) || []).length;
                    
                    const originalRun = stmt.run;
                    stmt.run = function(...params: any[]) {
                        actualParamCount = params.length;
                        
                        if (actualParamCount !== sqlPlaceholderCount) {
                            throw new Error(
                                `Parameter count mismatch: SQL has ${sqlPlaceholderCount} placeholders ` +
                                `but ${actualParamCount} parameters were provided`
                            );
                        }
                        
                        return originalRun.call(this, ...params);
                    };
                }
                return stmt;
            };

            try {
                const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
                const stmt = db.prepare(sql);
                stmt.run('Updated', 'New Content', 'count-test-1');

                expect(sqlPlaceholderCount).toBe(3);
                expect(actualParamCount).toBe(3);
            } finally {
                db.prepare = originalPrepare;
            }
        });

        it('should not pass objects as parameters (the core bug)', () => {
            // This is the critical test - the bug was passing an object to stmt.run()
            // sql.js expects: stmt.run(val1, val2, val3) NOT stmt.run({key: val1, key2: val2})
            
            const insertStmt = db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)');
            insertStmt.run('object-test-1', 'Test', 'Content', '/path/test.notesnlh', 1);

            const sql = 'UPDATE notes SET title = ?, content = ? WHERE id = ?';
            const stmt = db.prepare(sql);
            
            // This should throw - passing object to sql.js
            expect(() => {
                stmt.run({ title: 'Updated', content: 'Content', id: 'object-test-1' });
            }).toThrow();
            
            // This should work - passing positional parameters
            expect(() => {
                stmt.run('Updated', 'Content', 'object-test-1');
            }).not.toThrow();
        });
    });

    describe('Error Messages', () => {
        it('should provide clear error if object is passed to sql.js', () => {
            // This simulates what happens if someone accidentally uses named params again
            
            const sql = 'UPDATE notes SET title = ? WHERE id = ?';
            const stmt = db.prepare(sql);
            
            // Try to pass an object (this should fail)
            expect(() => {
                // sql.js will throw if we pass an object instead of primitives
                stmt.run({ title: 'Test', id: '123' });
            }).toThrow();
        });
    });
});
