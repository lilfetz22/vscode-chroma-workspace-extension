jest.mock('vscode');

import {
    calculateDateRange,
    getCompletedCards,
    groupRecurringCards,
    convertToCSV,
    isGroupedCard,
    CompletedCard,
    GroupedCard
} from '../src/logic/ExportAccomplishments';
import { initTestDatabase, closeTestDb } from '../src/test-database';
import * as database from '../src/database';
import { v4 as uuidv4 } from 'uuid';

// We'll set up a mock for prepare function that uses the test database
let testDb: any;

// Mock vscode configuration for settings service
let mockConfig: { [key: string]: any } = {
    'nlh.enabled': true,
    'nlh.colors.nouns': '#569CD6',
    'nlh.colors.verbs': '#4EC9B0',
    'nlh.colors.adjectives': '#C586C0',
    'nlh.colors.adverbs': '#DCDCAA',
    'nlh.colors.numbers': '#B5CEA8',
    'nlh.colors.properNouns': '#4FC1FF',
    'tasks.enableNotifications': true,
    'tasks.notificationFrequency': 'once',
    'tasks.showInStatusBar': true,
    'export.defaultDateRangeMonths': 6,
    'export.includeDescriptions': true,
    'export.groupRecurringTasks': true,
    'database.path': '.chroma/chroma.db'
};

jest.mock('vscode', () => {
    const mockConfiguration = {
        get: jest.fn((key: string, defaultValue?: any) => {
            return mockConfig[key] !== undefined ? mockConfig[key] : defaultValue;
        }),
        update: jest.fn(async (key: string, value: any) => {
            mockConfig[key] = value;
            return Promise.resolve();
        })
    };

    const mockWorkspace = {
        getConfiguration: jest.fn(() => mockConfiguration),
        onDidChangeConfiguration: jest.fn((callback: any) => {
            return { dispose: jest.fn() };
        })
    };

    return {
        workspace: mockWorkspace,
        ConfigurationTarget: {
            Global: 1,
            Workspace: 2,
            WorkspaceFolder: 3
        }
    };
});

describe('Export Accomplishments', () => {
    let db: any;

    beforeAll(async () => {
        db = await initTestDatabase();
        testDb = db;
        // Mock the prepare function to use our test database
        jest.spyOn(database, 'prepare').mockImplementation((sql: string) => {
            return {
                run: (...params: any[]) => db.prepare(sql).run(...params),
                get: (...params: any[]) => db.prepare(sql).get(...params),
                all: (...params: any[]) => db.prepare(sql).all(...params)
            };
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
        closeTestDb();
    });

    beforeEach(() => {
        // Clear tables before each test
        db.exec('DELETE FROM cards');
        db.exec('DELETE FROM columns');
        db.exec('DELETE FROM boards');
        // Reset mock config to defaults
        mockConfig = {
            'export.defaultDateRangeMonths': 6,
            'export.includeDescriptions': true,
            'export.groupRecurringTasks': true,
            'kanban.completionColumn': 'Done'
        };
    });

    describe('calculateDateRange', () => {
        it('should calculate 3 months range correctly', () => {
            const range = calculateDateRange('3months');
            expect(range).not.toBeNull();
            if (range) {
                const monthsDiff = Math.round(
                    (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
                );
                expect(monthsDiff).toBeGreaterThanOrEqual(2);
                expect(monthsDiff).toBeLessThanOrEqual(4);
                expect(range.label).toBe('Last 3 Months');
            }
        });

        it('should calculate 6 months range correctly', () => {
            const range = calculateDateRange('6months');
            expect(range).not.toBeNull();
            if (range) {
                const monthsDiff = Math.round(
                    (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
                );
                expect(monthsDiff).toBeGreaterThanOrEqual(5);
                expect(monthsDiff).toBeLessThanOrEqual(7);
                expect(range.label).toBe('Last 6 Months');
            }
        });

        it('should calculate 12 months range correctly', () => {
            const range = calculateDateRange('12months');
            expect(range).not.toBeNull();
            if (range) {
                const monthsDiff = Math.round(
                    (range.endDate.getTime() - range.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
                );
                expect(monthsDiff).toBeGreaterThanOrEqual(11);
                expect(monthsDiff).toBeLessThanOrEqual(13);
                expect(range.label).toBe('Last 12 Months');
            }
        });

        it('should return null for custom range', () => {
            const range = calculateDateRange('custom');
            expect(range).toBeNull();
        });

        it('should return null for invalid option', () => {
            const range = calculateDateRange('invalid');
            expect(range).toBeNull();
        });
    });

    describe('getCompletedCards', () => {
        it('should fetch completed cards within date range', () => {
            // Setup board and columns
            const boardId = uuidv4();
            const doneColumnId = uuidv4();
            db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)').run(boardId, 'Test Board');
            db.prepare('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)').run(doneColumnId, boardId, 'Done', 0);

            // Insert test cards
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);

            const cards = [
                { id: uuidv4(), title: 'Card 1', column_id: doneColumnId, completed_at: yesterday.toISOString() },
                { id: uuidv4(), title: 'Card 2', column_id: doneColumnId, completed_at: lastWeek.toISOString() },
                { id: uuidv4(), title: 'Card 3', column_id: doneColumnId, completed_at: null }, // Not completed
                { id: uuidv4(), title: 'Card 4', column_id: doneColumnId, completed_at: lastMonth.toISOString() }
            ];

            const stmt = db.prepare('INSERT INTO cards (id, title, column_id, position, card_type, completed_at) VALUES (?, ?, ?, ?, ?, ?)');
            for (const card of cards) {
                stmt.run(card.id, card.title, card.column_id, 0, 'simple', card.completed_at);
            }

            // Query for last 2 weeks
            const twoWeeksAgo = new Date(now);
            twoWeeksAgo.setDate(now.getDate() - 14);
            const results = getCompletedCards(boardId, twoWeeksAgo, now);

            expect(results.length).toBe(2); // Card 1 and Card 2
            expect(results[0].title).toBe('Card 1'); // Most recent first
            expect(results[1].title).toBe('Card 2');
        });

        it('should return empty array when no completed cards exist', () => {
            const boardId = uuidv4();
            const doneColumnId = uuidv4();
            db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)').run(boardId, 'Test Board');
            db.prepare('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)').run(doneColumnId, boardId, 'Done', 0);

            const now = new Date();
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);

            const results = getCompletedCards(boardId, lastWeek, now);
            expect(results.length).toBe(0);
        });

        it('should exclude cards outside date range', () => {
            const boardId = uuidv4();
            const doneColumnId = uuidv4();
            db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)').run(boardId, 'Test Board');
            db.prepare('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)').run(doneColumnId, boardId, 'Done', 0);

            const now = new Date();
            const twoMonthsAgo = new Date(now);
            twoMonthsAgo.setMonth(now.getMonth() - 2);
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(now.getMonth() - 1);

            const cards = [
                { id: uuidv4(), title: 'Old Card', column_id: doneColumnId, completed_at: twoMonthsAgo.toISOString() },
                { id: uuidv4(), title: 'Recent Card', column_id: doneColumnId, completed_at: oneMonthAgo.toISOString() }
            ];

            const stmt = db.prepare('INSERT INTO cards (id, title, column_id, position, card_type, completed_at) VALUES (?, ?, ?, ?, ?, ?)');
            for (const card of cards) {
                stmt.run(card.id, card.title, card.column_id, 0, 'simple', card.completed_at);
            }

            // Query for last month only
            const results = getCompletedCards(boardId, oneMonthAgo, now);
            expect(results.length).toBe(1);
            expect(results[0].title).toBe('Recent Card');
        });
    });

    describe('groupRecurringCards', () => {
        it('should group recurring cards by title and recurrence', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'Daily Standup',
                    content: 'Team meeting',
                    recurrence: 'daily',
                    completed_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '2',
                    title: 'Daily Standup',
                    content: 'Team meeting',
                    recurrence: 'daily',
                    completed_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '3',
                    title: 'Daily Standup',
                    content: 'Team meeting',
                    recurrence: 'daily',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringCards(cards);
            
            expect(grouped.length).toBe(1);
            expect(isGroupedCard(grouped[0])).toBe(true);
            
            if (isGroupedCard(grouped[0])) {
                expect(grouped[0].title).toBe('Daily Standup');
                expect(grouped[0].count).toBe(3);
                expect(grouped[0].recurrence).toBe('daily');
            }
        });

        it('should not group single recurring card instances', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'Weekly Review',
                    content: 'Review progress',
                    recurrence: 'weekly',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringCards(cards);
            
            expect(grouped.length).toBe(1);
            expect(isGroupedCard(grouped[0])).toBe(false);
        });

        it('should keep non-recurring cards separate', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'One-time Task',
                    content: 'Complete project',
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '2',
                    title: 'Another One-time Task',
                    content: 'Another project',
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringCards(cards);
            
            expect(grouped.length).toBe(2);
            expect(isGroupedCard(grouped[0])).toBe(false);
            expect(isGroupedCard(grouped[1])).toBe(false);
        });

        it('should group recurring cards separately by different recurrence patterns', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'Meeting',
                    content: 'Team sync',
                    recurrence: 'daily',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '2',
                    title: 'Meeting',
                    content: 'Team sync',
                    recurrence: 'daily',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '3',
                    title: 'Meeting',
                    content: 'Team sync',
                    recurrence: 'weekly',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringCards(cards);
            
            // Should create 2 groups: one for daily (2 cards) and one single weekly
            expect(grouped.length).toBe(2);
            
            const dailyGroup = grouped.find(g => isGroupedCard(g) && g.recurrence === 'daily');
            expect(dailyGroup).toBeDefined();
            if (dailyGroup && isGroupedCard(dailyGroup)) {
                expect(dailyGroup.count).toBe(2);
            }

            const weeklyCard = grouped.find(g => !isGroupedCard(g) || g.recurrence === 'weekly');
            expect(weeklyCard).toBeDefined();
        });
    });

    describe('convertToCSV', () => {
        it('should convert regular cards to CSV format', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'Card 1',
                    content: 'Content 1',
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const csv = convertToCSV(cards);
            const lines = csv.split('\n');
            
            expect(lines.length).toBe(2); // Header + 1 card
            expect(lines[0]).toBe('Title,Description,Recurrence,Count,Completed Date,Date Range');
            expect(lines[1]).toContain('Card 1');
            expect(lines[1]).toContain('Content 1');
            expect(lines[1]).toContain(',1,'); // Count
        });

        it('should convert grouped cards to CSV format', () => {
            const now = new Date();
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const groupedCards: GroupedCard[] = [
                {
                    title: 'Daily Standup',
                    content: 'Team meeting',
                    recurrence: 'daily',
                    count: 5,
                    firstCompleted: yesterday.toISOString(),
                    lastCompleted: now.toISOString()
                }
            ];

            const csv = convertToCSV(groupedCards);
            const lines = csv.split('\n');
            
            expect(lines.length).toBe(2);
            expect(lines[1]).toContain('Daily Standup');
            expect(lines[1]).toContain('daily');
            expect(lines[1]).toContain(',5,'); // Count
            expect(lines[1]).toContain(' - '); // Date range separator
        });

        it('should escape CSV special characters', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'Card with, comma',
                    content: 'Content with "quotes"',
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const csv = convertToCSV(cards);
            
            expect(csv).toContain('"Card with, comma"'); // Should be quoted
            expect(csv).toContain('"Content with ""quotes"""'); // Quotes should be escaped
        });

        it('should handle empty card list', () => {
            const csv = convertToCSV([]);
            const lines = csv.split('\n');
            
            expect(lines.length).toBe(1); // Only header
            expect(lines[0]).toBe('Title,Description,Recurrence,Count,Completed Date,Date Range');
        });

        it('should handle cards with null content', () => {
            const now = new Date();
            const cards: CompletedCard[] = [
                {
                    id: '1',
                    title: 'Card without content',
                    content: null,
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const csv = convertToCSV(cards);
            
            expect(csv).toContain('Card without content');
            expect(csv).not.toContain('null');
        });
    });

    describe('isGroupedCard', () => {
        it('should identify grouped cards correctly', () => {
            const groupedCard: GroupedCard = {
                title: 'Test',
                content: 'Desc',
                recurrence: 'daily',
                count: 5,
                firstCompleted: new Date().toISOString(),
                lastCompleted: new Date().toISOString()
            };

            expect(isGroupedCard(groupedCard)).toBe(true);
        });

        it('should identify regular cards correctly', () => {
            const regularCard: CompletedCard = {
                id: '1',
                title: 'Test',
                content: 'Desc',
                recurrence: null,
                completed_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            expect(isGroupedCard(regularCard)).toBe(false);
        });
    });

    describe('Integration test: Full export flow', () => {
        it('should handle a realistic export scenario', () => {
            // Setup board and columns
            const boardId = uuidv4();
            const doneColumnId = uuidv4();
            db.prepare('INSERT INTO boards (id, title) VALUES (?, ?)').run(boardId, 'Test Board');
            db.prepare('INSERT INTO columns (id, board_id, title, position) VALUES (?, ?, ?, ?)').run(doneColumnId, boardId, 'Done', 0);

            const now = new Date();
            
            // Create a mix of completed cards over the past month
            const cards = [
                // Daily recurring cards (5 completions)
                ...Array.from({ length: 5 }, (_, i) => ({
                    id: uuidv4(),
                    title: 'Daily Standup',
                    content: 'Team sync',
                    column_id: doneColumnId,
                    recurrence: 'daily',
                    completed_at: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
                })),
                // Weekly recurring cards (2 completions)
                ...Array.from({ length: 2 }, (_, i) => ({
                    id: uuidv4(),
                    title: 'Weekly Review',
                    content: 'Review progress',
                    column_id: doneColumnId,
                    recurrence: 'weekly',
                    completed_at: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000).toISOString()
                })),
                // One-time cards (3 cards)
                {
                    id: uuidv4(),
                    title: 'Complete Project A',
                    content: 'Finish the implementation',
                    column_id: doneColumnId,
                    recurrence: null,
                    completed_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: uuidv4(),
                    title: 'Write Documentation',
                    content: 'API docs',
                    column_id: doneColumnId,
                    recurrence: null,
                    completed_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: uuidv4(),
                    title: 'Code Review',
                    content: 'Review PR #123',
                    column_id: doneColumnId,
                    recurrence: null,
                    completed_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];

            const stmt = db.prepare('INSERT INTO cards (id, title, content, column_id, position, card_type, recurrence, completed_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
            for (const card of cards) {
                stmt.run(card.id, card.title, card.content, card.column_id, 0, 'simple', card.recurrence || null, card.completed_at);
            }

            // Fetch completed cards for last month
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(now.getMonth() - 1);
            const completedCards = getCompletedCards(boardId, oneMonthAgo, now);

            expect(completedCards.length).toBe(10); // 5 + 2 + 3

            // Group recurring cards
            const grouped = groupRecurringCards(completedCards);

            // Should have 5 entries: 1 grouped daily (5 cards), 1 grouped weekly (2 cards), 3 one-time cards
            expect(grouped.length).toBe(5);

            // Convert to CSV
            const csv = convertToCSV(grouped);
            const lines = csv.split('\n');

            expect(lines.length).toBe(6); // Header + 5 rows
            expect(csv).toContain('Daily Standup');
            expect(csv).toContain('Weekly Review');
            expect(csv).toContain('Complete Project A');
            expect(csv).toContain('Write Documentation');
            expect(csv).toContain('Code Review');
        });
    });
});
