import { initTestDatabase, closeTestDb } from '../src/test-database';

describe('Migration Functions', () => {
    let db: any;

    beforeAll(async () => {
        db = await initTestDatabase();
    });

    afterAll(() => {
        closeTestDb();
    });

    it('should have migrations table', () => {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const tableNames = tables.map((t: any) => t.name);
        expect(tableNames).toContain('migrations');
    });

    it('should have all required tables', () => {
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
        const tableNames = tables.map((t: any) => t.name);
        
        expect(tableNames).toContain('notes');
        expect(tableNames).toContain('boards');
        expect(tableNames).toContain('columns');
        expect(tableNames).toContain('cards');
        expect(tableNames).toContain('tasks');
        expect(tableNames).toContain('tags');
        expect(tableNames).toContain('card_tags');
    });
});
