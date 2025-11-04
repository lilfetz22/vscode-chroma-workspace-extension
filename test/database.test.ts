import { 
    initTestDatabase, 
    getTestDb, 
    closeTestDb,
    createNote,
    getNoteById,
    getNoteByPath,
    getAllNotes,
    updateNote,
    deleteNote,
    createBoard,
    getBoardById,
    getAllBoards,
    createColumn,
    getColumnsByBoardId,
    createCard,
    getCardById,
    getCardsByColumnId,
    updateCard,
    deleteCard
} from '../src/test-database';
import { randomBytes } from 'crypto';

describe('Database Functions', () => {
    let db: any;

    beforeAll(async () => {
        db = await initTestDatabase();
    });

    afterAll(() => {
        closeTestDb();
    });

    beforeEach(() => {
        // Clean up data before each test
        db.exec('DELETE FROM cards');
        db.exec('DELETE FROM columns');
        db.exec('DELETE FROM boards');
        db.exec('DELETE FROM notes');
    });

    describe('Database Initialization', () => {
        it('should initialize the database', () => {
            expect(db).toBeDefined();
            const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
            const tableNames = tables.map((t: any) => t.name);
            expect(tableNames).toContain('notes');
            expect(tableNames).toContain('boards');
            expect(tableNames).toContain('columns');
            expect(tableNames).toContain('cards');
            expect(tableNames).toContain('tags');
        });
    });

    describe('Note CRUD Operations', () => {
        it('should create a new note', () => {
            const note = createNote(db, {
                title: 'Test Note',
                content: 'Test content',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            expect(note).toBeDefined();
            expect(note.title).toBe('Test Note');
            expect(note.content).toBe('Test content');
            expect(note.file_path).toBe('/test/note.notesnlh');
            expect(note.nlh_enabled).toBe(1);
        });

        it('should get a note by ID', () => {
            const note = createNote(db, {
                title: 'Test Note',
                content: 'Test content',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            const fetchedNote = getNoteById(db, note.id);
            expect(fetchedNote).toBeDefined();
            expect(fetchedNote?.id).toBe(note.id);
            expect(fetchedNote?.title).toBe('Test Note');
        });

        it('should get a note by file path', () => {
            const note = createNote(db, {
                title: 'Test Note',
                content: 'Test content',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            const fetchedNote = getNoteByPath(db, '/test/note.notesnlh');
            expect(fetchedNote).toBeDefined();
            expect(fetchedNote?.id).toBe(note.id);
            expect(fetchedNote?.file_path).toBe('/test/note.notesnlh');
        });

        it('should get all notes', () => {
            createNote(db, {
                title: 'Note 1',
                content: 'Content 1',
                file_path: '/test/note1.notesnlh',
                nlh_enabled: true
            });
            createNote(db, {
                title: 'Note 2',
                content: 'Content 2',
                file_path: '/test/note2.notesnlh',
                nlh_enabled: false
            });

            const notes = getAllNotes(db);
            expect(notes).toHaveLength(2);
            expect(notes[0].title).toBe('Note 1');
            expect(notes[1].title).toBe('Note 2');
        });

        it('should update a note', () => {
            const note = createNote(db, {
                title: 'Original Title',
                content: 'Original content',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            updateNote(db, note.id, {
                title: 'Updated Title',
                content: 'Updated content',
                nlh_enabled: false
            });

            const updatedNote = getNoteById(db, note.id);
            expect(updatedNote?.title).toBe('Updated Title');
            expect(updatedNote?.content).toBe('Updated content');
            expect(updatedNote?.nlh_enabled).toBe(0);
        });

        it('should delete a note', () => {
            const note = createNote(db, {
                title: 'Test Note',
                content: 'Test content',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            deleteNote(db, note.id);

            const fetchedNote = getNoteById(db, note.id);
            expect(fetchedNote).toBeUndefined();
        });

        it('should handle notes with null content', () => {
            const note = createNote(db, {
                title: 'Empty Note',
                content: null,
                file_path: '/test/empty.notesnlh',
                nlh_enabled: true
            });

            expect(note).toBeDefined();
            expect(note.content).toBeNull();
        });

        it('should prevent duplicate file paths', () => {
            createNote(db, {
                title: 'Note 1',
                content: 'Content 1',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            expect(() => {
                createNote(db, {
                    title: 'Note 2',
                    content: 'Content 2',
                    file_path: '/test/note.notesnlh',
                    nlh_enabled: true
                });
            }).toThrow();
        });
    });

    describe('Board CRUD Operations', () => {
        it('should create a new board', () => {
            const board = createBoard(db, { name: 'Test Board' });

            expect(board).toBeDefined();
            expect(board.name).toBe('Test Board');
            expect(board.id).toBeDefined();
        });

        it('should get a board by ID', () => {
            const board = createBoard(db, { name: 'Test Board' });
            const fetchedBoard = getBoardById(db, board.id);

            expect(fetchedBoard).toBeDefined();
            expect(fetchedBoard?.id).toBe(board.id);
            expect(fetchedBoard?.name).toBe('Test Board');
        });

        it('should get all boards', () => {
            createBoard(db, { name: 'Board 1' });
            createBoard(db, { name: 'Board 2' });

            const boards = getAllBoards(db);
            expect(boards).toHaveLength(2);
        });
    });

    describe('Column CRUD Operations', () => {
        let boardId: string;

        beforeEach(() => {
            const board = createBoard(db, { name: 'Test Board' });
            boardId = board.id;
        });

        it('should create a new column', () => {
            const column = createColumn(db, {
                name: 'To Do',
                board_id: boardId,
                order: 0
            });

            expect(column).toBeDefined();
            expect(column.name).toBe('To Do');
            expect(column.board_id).toBe(boardId);
            expect(column.order).toBe(0);
        });

        it('should get columns by board ID', () => {
            createColumn(db, { name: 'To Do', board_id: boardId, order: 0 });
            createColumn(db, { name: 'In Progress', board_id: boardId, order: 1 });
            createColumn(db, { name: 'Done', board_id: boardId, order: 2 });

            const columns = getColumnsByBoardId(db, boardId);
            expect(columns).toHaveLength(3);
            expect(columns[0].name).toBe('To Do');
            expect(columns[1].name).toBe('In Progress');
            expect(columns[2].name).toBe('Done');
        });

        it('should maintain column order', () => {
            createColumn(db, { name: 'Column C', board_id: boardId, order: 2 });
            createColumn(db, { name: 'Column A', board_id: boardId, order: 0 });
            createColumn(db, { name: 'Column B', board_id: boardId, order: 1 });

            const columns = getColumnsByBoardId(db, boardId);
            expect(columns[0].name).toBe('Column A');
            expect(columns[1].name).toBe('Column B');
            expect(columns[2].name).toBe('Column C');
        });
    });

    describe('Card CRUD Operations', () => {
        let boardId: string;
        let columnId: string;

        beforeEach(() => {
            const board = createBoard(db, { name: 'Test Board' });
            boardId = board.id;
            const column = createColumn(db, { name: 'To Do', board_id: boardId, order: 0 });
            columnId = column.id;
        });

        it('should create a new card', () => {
            const card = createCard(db, {
                title: 'Test Card',
                content: 'Test content',
                column_id: columnId,
                order: 0,
                priority: 'medium',
                note_id: null
            });

            expect(card).toBeDefined();
            expect(card.title).toBe('Test Card');
            expect(card.content).toBe('Test content');
            expect(card.column_id).toBe(columnId);
        });

        it('should get a card by ID', () => {
            const card = createCard(db, {
                title: 'Test Card',
                content: 'Test content',
                column_id: columnId,
                order: 0,
                priority: 'medium',
                note_id: null
            });

            const fetchedCard = getCardById(db, card.id);
            expect(fetchedCard).toBeDefined();
            expect(fetchedCard?.id).toBe(card.id);
            expect(fetchedCard?.title).toBe('Test Card');
        });

        it('should get cards by column ID', () => {
            createCard(db, { title: 'Card 1', content: '', column_id: columnId, order: 0, priority: 'low', note_id: null });
            createCard(db, { title: 'Card 2', content: '', column_id: columnId, order: 1, priority: 'high', note_id: null });

            const cards = getCardsByColumnId(db, columnId);
            expect(cards).toHaveLength(2);
            expect(cards[0].title).toBe('Card 1');
            expect(cards[1].title).toBe('Card 2');
        });

        it('should update a card', () => {
            const card = createCard(db, {
                title: 'Original Title',
                content: 'Original content',
                column_id: columnId,
                order: 0,
                priority: 'medium',
                note_id: null
            });

            updateCard(db, card.id, {
                title: 'Updated Title',
                priority: 'high'
            });

            const updatedCard = getCardById(db, card.id);
            expect(updatedCard?.title).toBe('Updated Title');
            expect(updatedCard?.priority).toBe('high');
            expect(updatedCard?.content).toBe('Original content');
        });

        it('should delete a card', () => {
            const card = createCard(db, {
                title: 'Test Card',
                content: 'Test content',
                column_id: columnId,
                order: 0,
                priority: 'medium',
                note_id: null
            });

            deleteCard(db, card.id);

            const fetchedCard = getCardById(db, card.id);
            expect(fetchedCard).toBeUndefined();
        });

        it('should link a card to a note', () => {
            const note = createNote(db, {
                title: 'Test Note',
                content: 'Note content',
                file_path: '/test/note.notesnlh',
                nlh_enabled: true
            });

            const card = createCard(db, {
                title: 'Test Card',
                content: 'Card content',
                column_id: columnId,
                order: 0,
                priority: 'medium',
                note_id: note.id
            });

            expect(card.note_id).toBe(note.id);

            const fetchedCard = getCardById(db, card.id);
            expect(fetchedCard?.note_id).toBe(note.id);
        });

        it('should maintain card order within column', () => {
            createCard(db, { title: 'Card C', content: '', column_id: columnId, order: 2, priority: 'low', note_id: null });
            createCard(db, { title: 'Card A', content: '', column_id: columnId, order: 0, priority: 'low', note_id: null });
            createCard(db, { title: 'Card B', content: '', column_id: columnId, order: 1, priority: 'low', note_id: null });

            const cards = getCardsByColumnId(db, columnId);
            expect(cards[0].title).toBe('Card A');
            expect(cards[1].title).toBe('Card B');
            expect(cards[2].title).toBe('Card C');
        });

        it('should handle different priority levels', () => {
            const lowCard = createCard(db, { title: 'Low', content: '', column_id: columnId, order: 0, priority: 'low', note_id: null });
            const medCard = createCard(db, { title: 'Medium', content: '', column_id: columnId, order: 1, priority: 'medium', note_id: null });
            const highCard = createCard(db, { title: 'High', content: '', column_id: columnId, order: 2, priority: 'high', note_id: null });

            expect(lowCard.priority).toBe('low');
            expect(medCard.priority).toBe('medium');
            expect(highCard.priority).toBe('high');
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty result sets gracefully', () => {
            const notes = getAllNotes(db);
            expect(notes).toEqual([]);

            const boards = getAllBoards(db);
            expect(boards).toEqual([]);
        });

        it('should return undefined for non-existent IDs', () => {
            const fakeId = randomBytes(16).toString('hex');
            
            const note = getNoteById(db, fakeId);
            expect(note).toBeUndefined();

            const board = getBoardById(db, fakeId);
            expect(board).toBeUndefined();

            const card = getCardById(db, fakeId);
            expect(card).toBeUndefined();
        });

        it('should handle special characters in content', () => {
            const specialContent = "Test with 'quotes' and \"double quotes\" and \n newlines";
            const note = createNote(db, {
                title: 'Special Characters',
                content: specialContent,
                file_path: '/test/special.notesnlh',
                nlh_enabled: true
            });

            const fetchedNote = getNoteById(db, note.id);
            expect(fetchedNote?.content).toBe(specialContent);
        });
    });
});
