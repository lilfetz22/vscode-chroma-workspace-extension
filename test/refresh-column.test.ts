import { initTestDatabase, closeTestDb } from '../src/test-database';
import {
    createBoard,
    createColumn,
    createCard,
    getCardsByColumnId,
    refreshColumnPriority
} from '../src/test-database';

describe('Refresh Column Priority', () => {
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
    });

    test('should re-sequence card positions to be consecutive', () => {
        // Create a board and column
        const board = createBoard(db, { title: 'Test Board' });
        const column = createColumn(db, { title: 'Test Column', board_id: board.id, position: 0 });

        // Create cards with non-consecutive positions (simulating gaps)
        const card1 = createCard(db, { title: 'Card 1', content: '', column_id: column.id, position: 1, priority: 0, note_id: null });
        const card2 = createCard(db, { title: 'Card 2', content: '', column_id: column.id, position: 5, priority: 0, note_id: null });
        const card3 = createCard(db, { title: 'Card 3', content: '', column_id: column.id, position: 10, priority: 0, note_id: null });

        // Refresh the column priority
        refreshColumnPriority(db, column.id);

        // Get cards after refresh
        const cards = getCardsByColumnId(db, column.id);

        // Verify positions are now consecutive
        expect(cards.length).toBe(3);
        expect(cards[0].position).toBe(1);
        expect(cards[0].id).toBe(card1.id);
        expect(cards[1].position).toBe(2);
        expect(cards[1].id).toBe(card2.id);
        expect(cards[2].position).toBe(3);
        expect(cards[2].id).toBe(card3.id);
    });

    test('should maintain order when refreshing already consecutive positions', () => {
        // Create a board and column
        const board = createBoard(db, { title: 'Test Board' });
        const column = createColumn(db, { title: 'Test Column', board_id: board.id, position: 0 });

        // Create cards with already consecutive positions
        const card1 = createCard(db, { title: 'Card 1', content: '', column_id: column.id, position: 1, priority: 0, note_id: null });
        const card2 = createCard(db, { title: 'Card 2', content: '', column_id: column.id, position: 2, priority: 0, note_id: null });
        const card3 = createCard(db, { title: 'Card 3', content: '', column_id: column.id, position: 3, priority: 0, note_id: null });

        // Refresh the column priority
        refreshColumnPriority(db, column.id);

        // Get cards after refresh
        const cards = getCardsByColumnId(db, column.id);

        // Verify positions remain the same
        expect(cards.length).toBe(3);
        expect(cards[0].position).toBe(1);
        expect(cards[0].id).toBe(card1.id);
        expect(cards[1].position).toBe(2);
        expect(cards[1].id).toBe(card2.id);
        expect(cards[2].position).toBe(3);
        expect(cards[2].id).toBe(card3.id);
    });

    test('should handle empty column', () => {
        // Create a board and column
        const board = createBoard(db, { title: 'Test Board' });
        const column = createColumn(db, { title: 'Test Column', board_id: board.id, position: 0 });

        // Refresh empty column (should not throw error)
        expect(() => refreshColumnPriority(db, column.id)).not.toThrow();

        // Verify no cards exist
        const cards = getCardsByColumnId(db, column.id);
        expect(cards.length).toBe(0);
    });

    test('should preserve card order when positions have large gaps', () => {
        // Create a board and column
        const board = createBoard(db, { title: 'Test Board' });
        const column = createColumn(db, { title: 'Test Column', board_id: board.id, position: 0 });

        // Create cards with very large gaps
        const card1 = createCard(db, { title: 'Card 1', content: '', column_id: column.id, position: 100, priority: 0, note_id: null });
        const card2 = createCard(db, { title: 'Card 2', content: '', column_id: column.id, position: 500, priority: 0, note_id: null });
        const card3 = createCard(db, { title: 'Card 3', content: '', column_id: column.id, position: 1000, priority: 0, note_id: null });

        // Refresh the column priority
        refreshColumnPriority(db, column.id);

        // Get cards after refresh
        const cards = getCardsByColumnId(db, column.id);

        // Verify positions are normalized but order is preserved
        expect(cards.length).toBe(3);
        expect(cards[0].position).toBe(1);
        expect(cards[0].id).toBe(card1.id);
        expect(cards[1].position).toBe(2);
        expect(cards[1].id).toBe(card2.id);
        expect(cards[2].position).toBe(3);
        expect(cards[2].id).toBe(card3.id);
    });

    test('should work correctly with completion columns ordered by completed_at', () => {
        // This test verifies that refreshColumnPriority respects the ordering returned by getCardsByColumnId,
        // which may be different for completion columns (sorted by completed_at DESC)
        const board = createBoard(db, { title: 'Test Board' });
        const column = createColumn(db, { title: 'Done', board_id: board.id, position: 0 });

        // Create cards with completed_at dates
        const now = new Date();
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

        const card1 = createCard(db, {
            title: 'Oldest Card',
            content: '',
            column_id: column.id,
            position: 10,
            priority: 0,
            note_id: null,
            completed_at: twoDaysAgo.toISOString()
        });
        const card2 = createCard(db, {
            title: 'Middle Card',
            content: '',
            column_id: column.id,
            position: 5,
            priority: 0,
            note_id: null,
            completed_at: yesterday.toISOString()
        });
        const card3 = createCard(db, {
            title: 'Newest Card',
            content: '',
            column_id: column.id,
            position: 1,
            priority: 0,
            note_id: null,
            completed_at: now.toISOString()
        });

        // Refresh the column priority
        refreshColumnPriority(db, column.id);

        // Get cards after refresh
        const cards = getCardsByColumnId(db, column.id);

        // For non-completion columns or test database, positions should follow the current order
        // The refresh should normalize positions based on the order returned by getCardsByColumnId
        expect(cards.length).toBe(3);
        expect(cards[0].position).toBe(1);
        expect(cards[1].position).toBe(2);
        expect(cards[2].position).toBe(3);
    });
});
