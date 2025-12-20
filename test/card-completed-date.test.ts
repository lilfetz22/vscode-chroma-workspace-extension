import { 
    initTestDatabase, 
    closeTestDb,
    createBoard,
    createColumn,
    createCard,
    getCardById,
    updateCard
} from '../src/test-database';

describe('Card Completed Date Editing', () => {
    let db: any;
    let boardId: string;
    let doneColumnId: string;
    let inProgressColumnId: string;
    let cardId: string;

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

        // Create test board and columns
        const board = createBoard(db, { title: 'Test Board' });
        boardId = board.id;

        const inProgressColumn = createColumn(db, { 
            board_id: boardId, 
            title: 'In Progress', 
            position: 1 
        });
        inProgressColumnId = inProgressColumn.id;

        const doneColumn = createColumn(db, { 
            board_id: boardId, 
            title: 'Done', 
            position: 2 
        });
        doneColumnId = doneColumn.id;

        // Helper function to format local time without timezone conversion
        const toLocalISOString = (date: Date) => {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');
            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        };

        // Create a test card in the Done column with a completed date in local time
        const card = createCard(db, {
            column_id: doneColumnId,
            title: 'Test Card',
            content: 'Test content',
            card_type: 'simple',
            position: 1,
            completed_at: toLocalISOString(new Date(2025, 11, 18, 14, 30, 0))
        });
        cardId = card.id;
    });

    describe('Database Schema', () => {
        it('should have completed_at column in cards table', () => {
            const columns = db.prepare(`PRAGMA table_info(cards)`).all();
            const columnNames = columns.map((c: any) => c.name);
            expect(columnNames).toContain('completed_at');
        });

        it('should allow null values for completed_at', () => {
            const card = createCard(db, {
                column_id: inProgressColumnId,
                title: 'Incomplete Card',
                card_type: 'simple',
                position: 1,
                completed_at: null
            });

            expect(card.completed_at).toBeNull();
        });
    });

    describe('Reading Completed Date', () => {
        it('should retrieve card with completed_at date', () => {
            const card = getCardById(db, cardId);
            
            expect(card).toBeDefined();
            expect(card.completed_at).toBeDefined();
            expect(card.completed_at).toBe('2025-12-18T14:30:00');
        });

        it('should parse completed_at as valid local date string', () => {
            const card = getCardById(db, cardId);
            const date = new Date(card.completed_at);
            
            expect(date.getFullYear()).toBe(2025);
            expect(date.getMonth()).toBe(11); // December (0-indexed)
            expect(date.getDate()).toBe(18);
            expect(date.getHours()).toBe(14);
            expect(date.getMinutes()).toBe(30);
        });
    });

    describe('Updating Completed Date', () => {
        it('should update completed_at to a new date', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const newDate = toLocalISOString(new Date(2025, 11, 17, 9, 15, 0));
            
            updateCard(db, cardId, {
                completed_at: newDate
            });

            const updatedCard = getCardById(db, cardId);
            expect(updatedCard.completed_at).toBe(newDate);
        });

        it('should update completed_at to yesterday\'s date', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // Simulate backdating to yesterday in local time
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            yesterday.setHours(17, 45, 0, 0);
            const yesterdayLocal = toLocalISOString(yesterday);
            
            updateCard(db, cardId, {
                completed_at: yesterdayLocal
            });

            const updatedCard = getCardById(db, cardId);
            expect(updatedCard.completed_at).toBe(yesterdayLocal);
            
            const retrievedDate = new Date(updatedCard.completed_at);
            expect(retrievedDate.getDate()).toBe(yesterday.getDate());
            expect(retrievedDate.getHours()).toBe(17);
            expect(retrievedDate.getMinutes()).toBe(45);
        });

        it('should update only completed_at without affecting other fields', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const originalCard = getCardById(db, cardId);
            const newDate = toLocalISOString(new Date(2025, 11, 16, 10, 0, 0));
            
            updateCard(db, cardId, {
                completed_at: newDate
            });

            const updatedCard = getCardById(db, cardId);
            expect(updatedCard.title).toBe(originalCard.title);
            expect(updatedCard.content).toBe(originalCard.content);
            expect(updatedCard.column_id).toBe(originalCard.column_id);
            expect(updatedCard.position).toBe(originalCard.position);
            expect(updatedCard.completed_at).toBe(newDate);
            expect(updatedCard.completed_at).not.toBe(originalCard.completed_at);
        });

        it('should clear completed_at by setting to null', () => {
            updateCard(db, cardId, {
                completed_at: null
            });

            const updatedCard = getCardById(db, cardId);
            expect(updatedCard.completed_at).toBeNull();
        });

        it('should handle multiple updates to completed_at', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const date1 = toLocalISOString(new Date(2025, 11, 17, 10, 0, 0));
            const date2 = toLocalISOString(new Date(2025, 11, 16, 15, 30, 0));
            const date3 = toLocalISOString(new Date(2025, 11, 15, 8, 45, 0));
            
            updateCard(db, cardId, { completed_at: date1 });
            expect(getCardById(db, cardId).completed_at).toBe(date1);
            
            updateCard(db, cardId, { completed_at: date2 });
            expect(getCardById(db, cardId).completed_at).toBe(date2);
            
            updateCard(db, cardId, { completed_at: date3 });
            expect(getCardById(db, cardId).completed_at).toBe(date3);
        });
    });

    describe('Date Validation Scenarios', () => {
        it('should store dates in local time format', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // Create date in local time
            const localDate = toLocalISOString(new Date(2025, 11, 18, 14, 30, 0));
            updateCard(db, cardId, { completed_at: localDate });
            
            const card = getCardById(db, cardId);
            expect(card.completed_at).toBe(localDate);
            expect(card.completed_at).not.toContain('Z'); // Confirm local format (no UTC marker)
        });

        it('should store dates with time precision (hours and minutes)', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const preciseDate = toLocalISOString(new Date(2025, 11, 18, 9, 42, 0));
            updateCard(db, cardId, { completed_at: preciseDate });
            
            const card = getCardById(db, cardId);
            const storedDate = new Date(card.completed_at);
            
            expect(storedDate.getHours()).toBe(9);
            expect(storedDate.getMinutes()).toBe(42);
        });

        it('should handle edge case: midnight time', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const midnightDate = toLocalISOString(new Date(2025, 11, 18, 0, 0, 0));
            updateCard(db, cardId, { completed_at: midnightDate });
            
            const card = getCardById(db, cardId);
            const storedDate = new Date(card.completed_at);
            
            expect(storedDate.getHours()).toBe(0);
            expect(storedDate.getMinutes()).toBe(0);
        });

        it('should handle edge case: end of day time', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            const endOfDayDate = toLocalISOString(new Date(2025, 11, 18, 23, 59, 0));
            updateCard(db, cardId, { completed_at: endOfDayDate });
            
            const card = getCardById(db, cardId);
            const storedDate = new Date(card.completed_at);
            
            expect(storedDate.getHours()).toBe(23);
            expect(storedDate.getMinutes()).toBe(59);
        });
    });

    describe('Integration with Card Lifecycle', () => {
        it('should set completed_at when card moves to completion column', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // Create card without completed_at
            const incompleteCard = createCard(db, {
                column_id: inProgressColumnId,
                title: 'New Card',
                card_type: 'simple',
                position: 1,
                completed_at: null
            });

            expect(incompleteCard.completed_at).toBeNull();

            // Simulate moving to Done column and setting completed_at in local time
            const completedTime = toLocalISOString(new Date());
            updateCard(db, incompleteCard.id, {
                column_id: doneColumnId,
                completed_at: completedTime
            });

            const movedCard = getCardById(db, incompleteCard.id);
            expect(movedCard.column_id).toBe(doneColumnId);
            expect(movedCard.completed_at).toBe(completedTime);
        });

        it('should clear completed_at when card moves from completion column', () => {
            // Card starts in Done column with completed_at set
            expect(getCardById(db, cardId).completed_at).not.toBeNull();

            // Move back to In Progress and clear completed_at
            updateCard(db, cardId, {
                column_id: inProgressColumnId,
                completed_at: null
            });

            const movedCard = getCardById(db, cardId);
            expect(movedCard.column_id).toBe(inProgressColumnId);
            expect(movedCard.completed_at).toBeNull();
        });

        it('should maintain completed_at when editing other card properties', () => {
            const originalCompletedAt = getCardById(db, cardId).completed_at;

            // Update title and content but not completed_at
            updateCard(db, cardId, {
                title: 'Updated Title',
                content: 'Updated content'
            });

            const updatedCard = getCardById(db, cardId);
            expect(updatedCard.title).toBe('Updated Title');
            expect(updatedCard.content).toBe('Updated content');
            expect(updatedCard.completed_at).toBe(originalCompletedAt);
        });
    });

    describe('Error Handling', () => {
        it('should not throw when updating non-existent card ID', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // updateCard in test-database doesn't throw, it just doesn't update anything
            expect(() => {
                updateCard(db, 'non-existent-id', {
                    completed_at: toLocalISOString(new Date())
                });
            }).not.toThrow();
        });

        it('should not throw when updating with empty ID', () => {
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // updateCard in test-database doesn't throw, it just doesn't update anything
            expect(() => {
                updateCard(db, '', {
                    completed_at: toLocalISOString(new Date())
                });
            }).not.toThrow();
        });
    });

    describe('Query and Filtering', () => {
        it('should find completed cards by date range', () => {
            // Helper function to format local time without timezone conversion
            const toLocalISOString = (date: Date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                const hours = String(date.getHours()).padStart(2, '0');
                const minutes = String(date.getMinutes()).padStart(2, '0');
                const seconds = String(date.getSeconds()).padStart(2, '0');
                return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
            };

            // Create multiple cards with different completion dates in local time
            createCard(db, {
                column_id: doneColumnId,
                title: 'Card 1',
                card_type: 'simple',
                position: 2,
                completed_at: toLocalISOString(new Date(2025, 11, 15, 10, 0, 0))
            });

            createCard(db, {
                column_id: doneColumnId,
                title: 'Card 2',
                card_type: 'simple',
                position: 3,
                completed_at: toLocalISOString(new Date(2025, 11, 17, 14, 0, 0))
            });

            createCard(db, {
                column_id: doneColumnId,
                title: 'Card 3',
                card_type: 'simple',
                position: 4,
                completed_at: toLocalISOString(new Date(2025, 11, 19, 9, 0, 0))
            });

            // Query cards completed between Dec 16-18 (local time)
            const cards = db.prepare(`
                SELECT * FROM cards 
                WHERE completed_at >= ? AND completed_at < ?
                ORDER BY completed_at
            `).all('2025-12-16T00:00:00', '2025-12-19T00:00:00');

            expect(cards.length).toBe(2);
            expect(cards[0].title).toBe('Card 2');
            expect(cards[1].title).toBe('Test Card');
        });

        it('should exclude cards without completed_at from completion queries', () => {
            // Create card without completed_at
            createCard(db, {
                column_id: doneColumnId,
                title: 'Incomplete Card',
                card_type: 'simple',
                position: 5,
                completed_at: null
            });

            const completedCards = db.prepare(`
                SELECT * FROM cards WHERE completed_at IS NOT NULL
            `).all();

            expect(completedCards.length).toBe(1);
            expect(completedCards[0].id).toBe(cardId);
        });
    });
});
