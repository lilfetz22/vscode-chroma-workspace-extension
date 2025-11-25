import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { 
    validateImportData, 
    importFromJson, 
    exportToJson,
    SupabaseExportData 
} from '../src/logic/Migration';
import { initTestDatabase, closeTestDb } from '../src/test-database';

describe('Migration', () => {
    let tempDir: string;
    let testJsonPath: string;
    let db: any;

    beforeEach(async () => {
        // Create temporary directory for test files
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chroma-migration-test-'));
        testJsonPath = path.join(tempDir, 'test-import.json');
        
        // Initialize test database
        db = await initTestDatabase();
    });

    afterEach(() => {
        // Clean up
        closeTestDb();
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    describe('validateImportData', () => {
        test('should validate valid data structure', () => {
            const validData: SupabaseExportData = {
                notes: [
                    {
                        id: 'note-1',
                        title: 'Test Note',
                        content: 'Test content',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ],
                boards: [
                    {
                        id: 'board-1',
                        title: 'Test Board',
                        created_at: new Date().toISOString()
                    }
                ],
                columns: [
                    {
                        id: 'col-1',
                        board_id: 'board-1',
                        title: 'To Do',
                        position: 0,
                        created_at: new Date().toISOString()
                    }
                ],
                cards: [
                    {
                        id: 'card-1',
                        column_id: 'col-1',
                        position: 0,
                        card_type: 'simple',
                        title: 'Test Card',
                        content: 'Test content',
                        note_id: null,
                        summary: null,
                        priority: 0,
                        scheduled_at: null,
                        recurrence: null,
                        activated_at: null,
                        completed_at: null,
                        created_at: new Date().toISOString()
                    }
                ],
                tags: [
                    {
                        id: 'tag-1',
                        name: 'Important',
                        color: '#FF0000',
                        created_at: new Date().toISOString()
                    }
                ],
                card_tags: [
                    {
                        card_id: 'card-1',
                        tag_id: 'tag-1'
                    }
                ],
                tasks: [
                    {
                        id: 'task-1',
                        title: 'Test Task',
                        description: 'Test description',
                        due_date: new Date().toISOString(),
                        recurrence: null,
                        status: 'pending',
                        card_id: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]
            };

            const result = validateImportData(validData);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.stats.notes).toBe(1);
            expect(result.stats.boards).toBe(1);
            expect(result.stats.columns).toBe(1);
            expect(result.stats.cards).toBe(1);
            expect(result.stats.tags).toBe(1);
            expect(result.stats.card_tags).toBe(1);
            expect(result.stats.tasks).toBe(1);
        });

        test('should reject invalid data (not an object)', () => {
            const result = validateImportData(null);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Import data must be a JSON object or array');
        });

        test('should reject notes with missing id', () => {
            const invalidData = {
                notes: [
                    {
                        title: 'Test Note',
                        content: 'Test content'
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Note 0: missing or invalid id');
        });

        test('should reject notes with missing title', () => {
            const invalidData = {
                notes: [
                    {
                        id: 'note-1',
                        content: 'Test content'
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Note 0: missing or invalid title');
        });

        test('should reject boards with missing id', () => {
            const invalidData = {
                boards: [
                    {
                        title: 'Test Board'
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Board 0: missing or invalid id');
        });

        test('should reject cards with invalid card_type', () => {
            const invalidData = {
                cards: [
                    {
                        id: 'card-1',
                        column_id: 'col-1',
                        position: 0,
                        card_type: 'invalid',
                        title: 'Test Card'
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain("Card 0: card_type must be 'simple' or 'linked'");
        });

        test('should warn about invalid tag color format', () => {
            const invalidData = {
                tags: [
                    {
                        id: 'tag-1',
                        name: 'Test Tag',
                        color: 'red'
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.warnings.length).toBeGreaterThan(0);
            expect(result.warnings[0]).toContain('color should be in hex format');
        });

        test('should reject columns with missing board_id', () => {
            const invalidData = {
                columns: [
                    {
                        id: 'col-1',
                        title: 'Test Column',
                        position: 0
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Column 0: missing or invalid board_id');
        });

        test('should reject card_tags with missing card_id', () => {
            const invalidData = {
                card_tags: [
                    {
                        tag_id: 'tag-1'
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Card tag 0: missing or invalid card_id');
        });

        test('should reject tasks with missing title', () => {
            const invalidData = {
                tasks: [
                    {
                        id: 'task-1',
                        due_date: new Date().toISOString()
                    }
                ]
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Task 0: missing or invalid title');
        });

        test('should handle empty arrays', () => {
            const emptyData: SupabaseExportData = {
                notes: [],
                boards: [],
                columns: [],
                cards: [],
                tags: [],
                card_tags: [],
                tasks: []
            };

            const result = validateImportData(emptyData);

            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.stats.notes).toBe(0);
        });

        test('should reject non-array values for notes', () => {
            const invalidData = {
                notes: 'not an array'
            };

            const result = validateImportData(invalidData);

            expect(result.valid).toBe(false);
            expect(result.errors).toContain('Notes must be an array');
        });

        test('should handle partial data (only notes)', () => {
            const partialData = {
                notes: [
                    {
                        id: 'note-1',
                        title: 'Test Note',
                        content: 'Content',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]
            };

            const result = validateImportData(partialData);

            expect(result.valid).toBe(true);
            expect(result.stats.notes).toBe(1);
            expect(result.stats.boards).toBe(0);
        });
    });

    describe('importFromJson', () => {
        test('should successfully import valid data', async () => {
            const validData: SupabaseExportData = {
                notes: [
                    {
                        id: 'note-1',
                        title: 'Test_Note',
                        content: 'Test content',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ],
                boards: [
                    {
                        id: 'board-1',
                        title: 'Test Board',
                        created_at: new Date().toISOString()
                    }
                ],
                columns: [
                    {
                        id: 'col-1',
                        board_id: 'board-1',
                        title: 'To Do',
                        position: 0,
                        created_at: new Date().toISOString()
                    }
                ],
                tags: [
                    {
                        id: 'tag-1',
                        name: 'Important',
                        color: '#FF0000',
                        created_at: new Date().toISOString()
                    }
                ]
            };

            // Write test data to file
            fs.writeFileSync(testJsonPath, JSON.stringify(validData), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            if (!result.success) {
                console.error('Import failed:', result.message, result.errors);
            }
            expect(result.success).toBe(true);
            expect(result.message).toContain('Successfully imported');

            // Verify data was imported
            const notes = db.prepare('SELECT * FROM notes').all();
            const boards = db.prepare('SELECT * FROM boards').all();
            const columns = db.prepare('SELECT * FROM columns').all();
            const tags = db.prepare('SELECT * FROM tags').all();

            expect(notes).toHaveLength(1);
            expect(boards).toHaveLength(1);
            expect(columns).toHaveLength(1);
            expect(tags).toHaveLength(1);
        });

        test('should fail on invalid JSON file', async () => {
            fs.writeFileSync(testJsonPath, 'invalid json', 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(false);
            expect(result.message).toBeDefined();
        });

        test('should fail on missing file', async () => {
            const result = await importFromJson('/nonexistent/file.json', tempDir);

            expect(result.success).toBe(false);
        });

        test('should import array of boards directly', async () => {
            const boardsArray = [
                {
                    id: 'board-1',
                    title: 'Test Board 1',
                    created_at: new Date().toISOString()
                },
                {
                    id: 'board-2',
                    title: 'Test Board 2',
                    created_at: new Date().toISOString()
                }
            ];

            fs.writeFileSync(testJsonPath, JSON.stringify(boardsArray), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(true);
            expect(result.message).toContain('Successfully imported');
            expect(result.message).toContain('2 boards');

            // Verify boards were imported
            const boards = db.prepare('SELECT * FROM boards').all();
            expect(boards.length).toBe(2);
            expect(boards.find((b: any) => b.id === 'board-1')).toBeDefined();
            expect(boards.find((b: any) => b.id === 'board-2')).toBeDefined();
        });

        test('should import array of columns directly', async () => {
            // First create a board for the columns
            db.prepare('INSERT INTO boards (id, title, created_at) VALUES (?, ?, ?)').run(
                'board-1',
                'Test Board',
                new Date().toISOString()
            );

            const columnsArray = [
                {
                    id: 'col-1',
                    board_id: 'board-1',
                    title: 'Column 1',
                    position: 0,
                    created_at: new Date().toISOString()
                },
                {
                    id: 'col-2',
                    board_id: 'board-1',
                    title: 'Column 2',
                    position: 1,
                    created_at: new Date().toISOString()
                }
            ];

            fs.writeFileSync(testJsonPath, JSON.stringify(columnsArray), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(true);
            expect(result.message).toContain('2 columns');

            // Verify columns were imported
            const columns = db.prepare('SELECT * FROM columns').all();
            expect(columns.length).toBe(2);
        });

        test('should fail on invalid data structure', async () => {
            const invalidData = {
                notes: [
                    {
                        title: 'Missing ID'
                    }
                ]
            };

            fs.writeFileSync(testJsonPath, JSON.stringify(invalidData), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(false);
            expect(result.message).toContain('validation failed');
            expect(result.errors).toBeDefined();
        });

        test('should create note files during import', async () => {
            const validData: SupabaseExportData = {
                notes: [
                    {
                        id: 'note-1',
                        title: 'Test_Note',
                        content: 'This is test content',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]
            };

            fs.writeFileSync(testJsonPath, JSON.stringify(validData), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(true);

            // Check that note file was created (filename includes sanitized title and ID)
            const notePath = path.join(tempDir, 'notes', 'test_note_note-1.notesnlh');
            expect(fs.existsSync(notePath)).toBe(true);
            
            const noteContent = fs.readFileSync(notePath, 'utf-8');
            expect(noteContent).toBe('This is test content');
        });

        test('should import cards with all fields', async () => {
            const validData: SupabaseExportData = {
                boards: [
                    {
                        id: 'board-1',
                        title: 'Test Board',
                        created_at: new Date().toISOString()
                    }
                ],
                columns: [
                    {
                        id: 'col-1',
                        board_id: 'board-1',
                        title: 'To Do',
                        position: 0,
                        created_at: new Date().toISOString()
                    }
                ],
                cards: [
                    {
                        id: 'card-1',
                        column_id: 'col-1',
                        position: 0,
                        card_type: 'simple',
                        title: 'Test Card',
                        content: 'Card content',
                        note_id: null,
                        summary: 'Summary',
                        priority: 1,
                        scheduled_at: new Date().toISOString(),
                        recurrence: 'daily',
                        activated_at: null,
                        completed_at: null,
                        created_at: new Date().toISOString()
                    }
                ]
            };

            fs.writeFileSync(testJsonPath, JSON.stringify(validData), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(true);

            // db already available from beforeEach
            const card = db.prepare('SELECT * FROM cards WHERE id = ?').get('card-1') as any;

            expect(card).toBeDefined();
            expect(card.title).toBe('Test Card');
            expect(card.content).toBe('Card content');
            expect(card.priority).toBe(1);  // Priority stored as integer: 0=low, 1=medium, 2=high
            // Note: recurrence is not stored in cards table in local schema
        });

        test('should import card-tag associations', async () => {
            const validData: SupabaseExportData = {
                boards: [{ id: 'board-1', title: 'Board', created_at: new Date().toISOString() }],
                columns: [{ id: 'col-1', board_id: 'board-1', title: 'Col', position: 0, created_at: new Date().toISOString() }],
                cards: [
                    {
                        id: 'card-1',
                        column_id: 'col-1',
                        position: 0,
                        card_type: 'simple',
                        title: 'Card',
                        content: null,
                        note_id: null,
                        summary: null,
                        priority: 0,
                        scheduled_at: null,
                        recurrence: null,
                        activated_at: null,
                        completed_at: null,
                        created_at: new Date().toISOString()
                    }
                ],
                tags: [{ id: 'tag-1', name: 'Tag', color: '#FF0000', created_at: new Date().toISOString() }],
                card_tags: [{ card_id: 'card-1', tag_id: 'tag-1' }]
            };

            fs.writeFileSync(testJsonPath, JSON.stringify(validData), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(true);

            // db already available from beforeEach
            const cardTag = db.prepare('SELECT * FROM card_tags WHERE card_id = ? AND tag_id = ?')
                .get('card-1', 'tag-1');

            expect(cardTag).toBeDefined();
        });

        test('should import tasks with all fields', async () => {
            const dueDate = new Date().toISOString();
            const validData: SupabaseExportData = {
                tasks: [
                    {
                        id: 'task-1',
                        title: 'Test Task',
                        description: 'Task description',
                        due_date: dueDate,
                        recurrence: 'weekly',
                        status: 'pending',
                        card_id: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]
            };

            fs.writeFileSync(testJsonPath, JSON.stringify(validData), 'utf-8');

            const result = await importFromJson(testJsonPath, tempDir, undefined, db);

            expect(result.success).toBe(true);

            // db already available from beforeEach
            const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get('task-1') as any;

            expect(task).toBeDefined();
            expect(task.title).toBe('Test Task');
            expect(task.description).toBe('Task description');
            expect(task.recurrence).toBe('weekly');
            expect(task.status).toBe('pending');
        });

        test('should track progress with callback', async () => {
            const validData: SupabaseExportData = {
                notes: [
                    {
                        id: 'note-1',
                        title: 'Note',
                        content: 'Content',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    }
                ]
            };

            fs.writeFileSync(testJsonPath, JSON.stringify(validData), 'utf-8');

            const progressUpdates: Array<{ message: string; percentage: number }> = [];
            const progressCallback = (message: string, percentage: number) => {
                progressUpdates.push({ message, percentage });
            };

            const result = await importFromJson(testJsonPath, tempDir, progressCallback, db);

            expect(result.success).toBe(true);
            expect(progressUpdates.length).toBeGreaterThan(0);
            expect(progressUpdates[0].message).toContain('Reading');
            expect(progressUpdates[progressUpdates.length - 1].percentage).toBe(100);
        });
    });

    describe('exportToJson', () => {
        test('should export empty database', async () => {
            const outputPath = path.join(tempDir, 'export.json');

            const result = await exportToJson(outputPath, undefined, db);

            expect(result.success).toBe(true);
            expect(fs.existsSync(outputPath)).toBe(true);

            const exportedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            expect(exportedData.notes).toEqual([]);
            expect(exportedData.boards).toEqual([]);
        });

        test('should export database with data', async () => {
            // db already available from beforeEach
            
            // Insert test data
            db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)')
                .run('note-1', 'Test Note', 'Content', '/test/note.notesnlh', 1);
            db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)').run('board-1', 'Test Board');
            db.prepare('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)').run('tag-1', 'Tag', '#FF0000');

            const outputPath = path.join(tempDir, 'export.json');
            const result = await exportToJson(outputPath, undefined, db);

            expect(result.success).toBe(true);

            const exportedData = JSON.parse(fs.readFileSync(outputPath, 'utf-8'));
            expect(exportedData.notes).toHaveLength(1);
            expect(exportedData.boards).toHaveLength(1);
            expect(exportedData.tags).toHaveLength(1);
            expect(exportedData.notes[0].id).toBe('note-1');
        });

        test('should track progress with callback', async () => {
            const outputPath = path.join(tempDir, 'export.json');
            const progressUpdates: Array<{ message: string; percentage: number }> = [];
            const progressCallback = (message: string, percentage: number) => {
                progressUpdates.push({ message, percentage });
            };

            const result = await exportToJson(outputPath, progressCallback, db);

            expect(result.success).toBe(true);
            expect(progressUpdates.length).toBeGreaterThan(0);
            expect(progressUpdates[progressUpdates.length - 1].percentage).toBe(100);
        });

        test('should create output directory if it does not exist', async () => {
            const outputPath = path.join(tempDir, 'subdir', 'export.json');

            const result = await exportToJson(outputPath, undefined, db);

            expect(result.success).toBe(true);
            expect(fs.existsSync(outputPath)).toBe(true);
        });

        test('should export valid JSON format', async () => {
            // db already available from beforeEach
            db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)')
                .run('note-1', 'Note', 'Content', '/test.notesnlh', 1);

            const outputPath = path.join(tempDir, 'export.json');
            await exportToJson(outputPath, undefined, db);

            const jsonContent = fs.readFileSync(outputPath, 'utf-8');
            expect(() => JSON.parse(jsonContent)).not.toThrow();

            const parsed = JSON.parse(jsonContent);
            expect(parsed).toHaveProperty('notes');
            expect(parsed).toHaveProperty('boards');
            expect(parsed).toHaveProperty('columns');
            expect(parsed).toHaveProperty('cards');
            expect(parsed).toHaveProperty('tags');
            expect(parsed).toHaveProperty('card_tags');
            expect(parsed).toHaveProperty('tasks');
        });
    });

    describe('roundtrip import/export', () => {
        test('should preserve data through export and import', async () => {
            // db already available from beforeEach
            
            // Insert original data
            db.prepare('INSERT INTO notes (id, title, content, file_path, nlh_enabled) VALUES (?, ?, ?, ?, ?)')
                .run('note-1', 'Original_Note', 'Original content', '/test.notesnlh', 1);
            db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)').run('board-1', 'Original Board');
            db.prepare('INSERT INTO tags (id, name, color) VALUES (?, ?, ?)').run('tag-1', 'Original Tag', '#00FF00');

            // Export
            const exportPath = path.join(tempDir, 'export.json');
            const exportResult = await exportToJson(exportPath, undefined, db);
            expect(exportResult.success).toBe(true);

            // Clear database
            db.prepare('DELETE FROM notes').run();
            db.prepare('DELETE FROM boards').run();
            db.prepare('DELETE FROM tags').run();

            // Import
            const importResult = await importFromJson(exportPath, tempDir, undefined, db);
            expect(importResult.success).toBe(true);

            // Verify data
            const notes = db.prepare('SELECT * FROM notes').all();
            const boards = db.prepare('SELECT * FROM boards').all();
            const tags = db.prepare('SELECT * FROM tags').all();

            expect(notes).toHaveLength(1);
            expect(boards).toHaveLength(1);
            expect(tags).toHaveLength(1);
            expect((notes[0] as any).title).toBe('Original_Note');
            expect((boards[0] as any).title).toBe('Original Board');  // Boards use 'title' column
            expect((tags[0] as any).name).toBe('Original Tag');
        });
    });
});
