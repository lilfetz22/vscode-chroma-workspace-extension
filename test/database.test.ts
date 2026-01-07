import { 
    initTestDatabase, 
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
    deleteCard,
    reorderCardsOnRemove,
    normalizeAllCardPositions
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
            const board = createBoard(db, { title: 'Test Board' });

            expect(board).toBeDefined();
            expect(board.title).toBe('Test Board');
            expect(board.id).toBeDefined();
        });

        it('should get a board by ID', () => {
            const board = createBoard(db, { title: 'Test Board' });
            const fetchedBoard = getBoardById(db, board.id);

            expect(fetchedBoard).toBeDefined();
            expect(fetchedBoard?.id).toBe(board.id);
            expect(fetchedBoard?.title).toBe('Test Board');
        });

        it('should get all boards', () => {
            createBoard(db, { title: 'Board 1' });
            createBoard(db, { title: 'Board 2' });

            const boards = getAllBoards(db);
            expect(boards).toHaveLength(2);
        });
    });

    describe('Column CRUD Operations', () => {
        let boardId: string;

        beforeEach(() => {
            const board = createBoard(db, { title: 'Test Board' });
            boardId = board.id;
        });

        it('should create a new column', () => {
            const column = createColumn(db, {
                title: 'To Do',
                board_id: boardId,
                position: 0
            });

            expect(column).toBeDefined();
            expect(column.title).toBe('To Do');
            expect(column.board_id).toBe(boardId);
            expect(column.position).toBe(0);
        });

        it('should get columns by board ID', () => {
            // createBoard automatically creates 3 default columns, so this test verifies that
            const columns = getColumnsByBoardId(db, boardId);
            expect(columns).toHaveLength(3);
            expect(columns[0].title).toBe('To Do');
            expect(columns[1].title).toBe('In Progress');
            expect(columns[2].title).toBe('Done');
        });

        it('should maintain column order', () => {
            // Clear default columns first to test ordering
            db.exec(`DELETE FROM columns WHERE board_id = '${boardId}'`);
            
            createColumn(db, { title: 'Column C', board_id: boardId, position: 2 });
            createColumn(db, { title: 'Column A', board_id: boardId, position: 0 });
            createColumn(db, { title: 'Column B', board_id: boardId, position: 1 });

            const columns = getColumnsByBoardId(db, boardId);
            expect(columns[0].title).toBe('Column A');
            expect(columns[1].title).toBe('Column B');
            expect(columns[2].title).toBe('Column C');
        });
    });

    describe('Card CRUD Operations', () => {
        let boardId: string;
        let columnId: string;

        beforeEach(() => {
            const board = createBoard(db, { title: 'Test Board' });
            boardId = board.id;
            const column = createColumn(db, { title: 'To Do', board_id: boardId, position: 0 });
            columnId = column.id;
        });

        it('should create a new card', () => {
            const card = createCard(db, {
                title: 'Test Card',
                content: 'Test content',
                column_id: columnId,
                position: 0,
                priority: 1,
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
                position: 0,
                priority: 1,
                note_id: null
            });

            const fetchedCard = getCardById(db, card.id);
            expect(fetchedCard).toBeDefined();
            expect(fetchedCard?.id).toBe(card.id);
            expect(fetchedCard?.title).toBe('Test Card');
        });

        it('should get cards by column ID', () => {
            createCard(db, { title: 'Card 1', content: '', column_id: columnId, position: 0, priority: 0, note_id: null });
            createCard(db, { title: 'Card 2', content: '', column_id: columnId, position: 1, priority: 2, note_id: null });

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
                position: 0,
                priority: 1,
                note_id: null
            });

            updateCard(db, card.id, {
                title: 'Updated Title',
                priority: 2
            });

            const updatedCard = getCardById(db, card.id);
            expect(updatedCard?.title).toBe('Updated Title');
            expect(updatedCard?.priority).toBe(2);
            expect(updatedCard?.content).toBe('Original content');
        });

        it('should delete a card', () => {
            const card = createCard(db, {
                title: 'Test Card',
                content: 'Test content',
                column_id: columnId,
                position: 0,
                priority: 1,
                note_id: null
            });

            deleteCard(db, card.id);

            const fetchedCard = getCardById(db, card.id);
            expect(fetchedCard).toBeUndefined();
        });

        it('should reorder card positions when a card is deleted', () => {
            // Create multiple cards in the same column
            const card1 = createCard(db, { title: 'Card 1', content: '', column_id: columnId, position: 0, priority: 0, note_id: null });
            const card2 = createCard(db, { title: 'Card 2', content: '', column_id: columnId, position: 1, priority: 0, note_id: null });
            const card3 = createCard(db, { title: 'Card 3', content: '', column_id: columnId, position: 2, priority: 0, note_id: null });
            const card4 = createCard(db, { title: 'Card 4', content: '', column_id: columnId, position: 3, priority: 0, note_id: null });

            // Delete the card at position 1 (Card 2) and reorder remaining cards
            deleteCard(db, card2.id);
            reorderCardsOnRemove(db, columnId, 1);

            // Get remaining cards
            const cards = getCardsByColumnId(db, columnId);
            
            // Should have 3 cards left
            expect(cards).toHaveLength(3);
            
            // Positions should be 0, 1, 2 (no gap at position 1)
            expect(cards[0].id).toBe(card1.id);
            expect(cards[0].position).toBe(0);
            
            expect(cards[1].id).toBe(card3.id);
            expect(cards[1].position).toBe(1); // Decremented from 2 to 1
            
            expect(cards[2].id).toBe(card4.id);
            expect(cards[2].position).toBe(2); // Decremented from 3 to 2
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
                position: 0,
                priority: 1,
                note_id: note.id
            });

            expect(card.note_id).toBe(note.id);

            const fetchedCard = getCardById(db, card.id);
            expect(fetchedCard?.note_id).toBe(note.id);
        });

        it('should maintain card order within column', () => {
            createCard(db, { title: 'Card C', content: '', column_id: columnId, position: 2, priority: 0, note_id: null });
            createCard(db, { title: 'Card A', content: '', column_id: columnId, position: 0, priority: 0, note_id: null });
            createCard(db, { title: 'Card B', content: '', column_id: columnId, position: 1, priority: 0, note_id: null });

            const cards = getCardsByColumnId(db, columnId);
            expect(cards[0].title).toBe('Card A');
            expect(cards[1].title).toBe('Card B');
            expect(cards[2].title).toBe('Card C');
        });

        it('should handle different priority levels', () => {
            const lowCard = createCard(db, { title: 'Low', content: '', column_id: columnId, position: 0, priority: 0, note_id: null });
            const medCard = createCard(db, { title: 'Medium', content: '', column_id: columnId, position: 1, priority: 1, note_id: null });
            const highCard = createCard(db, { title: 'High', content: '', column_id: columnId, position: 2, priority: 2, note_id: null });

            expect(lowCard.priority).toBe(0);
            expect(medCard.priority).toBe(1);
            expect(highCard.priority).toBe(2);
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

    describe('Card Position Normalization', () => {
        it('should normalize card positions with gaps to consecutive integers', () => {
            const board = createBoard(db, { title: 'Test Board' });
            const column = createColumn(db, { title: 'To Do', board_id: board.id, position: 0 });
            
            // Create cards with gaps in positions (1, 2, 4, 5)
            const card1 = createCard(db, { title: 'Card 1', content: '', column_id: column.id, position: 1, priority: 0, note_id: null });
            const card2 = createCard(db, { title: 'Card 2', content: '', column_id: column.id, position: 2, priority: 0, note_id: null });
            const card3 = createCard(db, { title: 'Card 3', content: '', column_id: column.id, position: 4, priority: 0, note_id: null });
            const card4 = createCard(db, { title: 'Card 4', content: '', column_id: column.id, position: 5, priority: 0, note_id: null });
            
            // Run normalization
            normalizeAllCardPositions(db);
            
            // Verify positions are now 1, 2, 3, 4
            const cards = getCardsByColumnId(db, column.id);
            expect(cards).toHaveLength(4);
            expect(cards[0].position).toBe(1);
            expect(cards[1].position).toBe(2);
            expect(cards[2].position).toBe(3);
            expect(cards[3].position).toBe(4);
            
            // Verify order is preserved
            expect(cards[0].title).toBe('Card 1');
            expect(cards[1].title).toBe('Card 2');
            expect(cards[2].title).toBe('Card 3');
            expect(cards[3].title).toBe('Card 4');
        });

        it('should normalize positions starting at wrong number', () => {
            const board = createBoard(db, { title: 'Test Board' });
            const column = createColumn(db, { title: 'To Do', board_id: board.id, position: 0 });
            
            // Create cards starting at position 2 (2, 3, 4)
            createCard(db, { title: 'Card A', content: '', column_id: column.id, position: 2, priority: 0, note_id: null });
            createCard(db, { title: 'Card B', content: '', column_id: column.id, position: 3, priority: 0, note_id: null });
            createCard(db, { title: 'Card C', content: '', column_id: column.id, position: 4, priority: 0, note_id: null });
            
            normalizeAllCardPositions(db);
            
            const cards = getCardsByColumnId(db, column.id);
            expect(cards[0].position).toBe(1);
            expect(cards[1].position).toBe(2);
            expect(cards[2].position).toBe(3);
        });

        it('should skip completion columns during normalization', () => {
            const board = createBoard(db, { title: 'Test Board' });
            const todoColumn = createColumn(db, { title: 'To Do', board_id: board.id, position: 0 });
            const doneColumn = createColumn(db, { title: 'Done', board_id: board.id, position: 1 });
            
            // Create cards with gaps in both columns
            createCard(db, { title: 'Todo 1', content: '', column_id: todoColumn.id, position: 2, priority: 0, note_id: null });
            createCard(db, { title: 'Todo 2', content: '', column_id: todoColumn.id, position: 4, priority: 0, note_id: null });
            
            // Completion column cards should be skipped
            createCard(db, { title: 'Done 1', content: '', column_id: doneColumn.id, position: 5, priority: 0, note_id: null });
            createCard(db, { title: 'Done 2', content: '', column_id: doneColumn.id, position: 10, priority: 0, note_id: null });
            
            normalizeAllCardPositions(db);
            
            // To Do column should be normalized
            const todoCards = getCardsByColumnId(db, todoColumn.id);
            expect(todoCards[0].position).toBe(1);
            expect(todoCards[1].position).toBe(2);
            
            // Done column should NOT be normalized (positions unchanged)
            const doneCards = getCardsByColumnId(db, doneColumn.id);
            expect(doneCards[0].position).toBe(5);
            expect(doneCards[1].position).toBe(10);
        });

        it('should handle multiple boards and columns', () => {
            const board1 = createBoard(db, { title: 'Board 1' });
            const board2 = createBoard(db, { title: 'Board 2' });
            
            const col1 = createColumn(db, { title: 'Col 1', board_id: board1.id, position: 0 });
            const col2 = createColumn(db, { title: 'Col 2', board_id: board1.id, position: 1 });
            const col3 = createColumn(db, { title: 'Col 3', board_id: board2.id, position: 0 });
            
            // Add cards with gaps in all columns
            createCard(db, { title: 'B1C1-1', content: '', column_id: col1.id, position: 10, priority: 0, note_id: null });
            createCard(db, { title: 'B1C1-2', content: '', column_id: col1.id, position: 20, priority: 0, note_id: null });
            
            createCard(db, { title: 'B1C2-1', content: '', column_id: col2.id, position: 5, priority: 0, note_id: null });
            createCard(db, { title: 'B1C2-2', content: '', column_id: col2.id, position: 15, priority: 0, note_id: null });
            createCard(db, { title: 'B1C2-3', content: '', column_id: col2.id, position: 25, priority: 0, note_id: null });
            
            createCard(db, { title: 'B2C3-1', content: '', column_id: col3.id, position: 100, priority: 0, note_id: null });
            
            normalizeAllCardPositions(db);
            
            // All columns should be normalized independently
            const col1Cards = getCardsByColumnId(db, col1.id);
            expect(col1Cards.map(c => c.position)).toEqual([1, 2]);
            
            const col2Cards = getCardsByColumnId(db, col2.id);
            expect(col2Cards.map(c => c.position)).toEqual([1, 2, 3]);
            
            const col3Cards = getCardsByColumnId(db, col3.id);
            expect(col3Cards.map(c => c.position)).toEqual([1]);
        });

        it('should not modify already normalized positions', () => {
            const board = createBoard(db, { title: 'Test Board' });
            const column = createColumn(db, { title: 'To Do', board_id: board.id, position: 0 });
            
            // Create cards with proper consecutive positions
            createCard(db, { title: 'Card 1', content: '', column_id: column.id, position: 1, priority: 0, note_id: null });
            createCard(db, { title: 'Card 2', content: '', column_id: column.id, position: 2, priority: 0, note_id: null });
            createCard(db, { title: 'Card 3', content: '', column_id: column.id, position: 3, priority: 0, note_id: null });
            
            normalizeAllCardPositions(db);
            
            const cards = getCardsByColumnId(db, column.id);
            expect(cards[0].position).toBe(1);
            expect(cards[1].position).toBe(2);
            expect(cards[2].position).toBe(3);
        });

        it('should handle empty columns gracefully', () => {
            const board = createBoard(db, { title: 'Test Board' });
            const emptyColumn = createColumn(db, { title: 'Empty', board_id: board.id, position: 0 });
            
            // Should not throw error on empty column
            expect(() => normalizeAllCardPositions(db)).not.toThrow();
            
            const cards = getCardsByColumnId(db, emptyColumn.id);
            expect(cards).toHaveLength(0);
        });
    });
});
