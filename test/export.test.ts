import {
    calculateDateRange,
    getCompletedTasks,
    groupRecurringTasks,
    convertToCSV,
    isGroupedTask,
    CompletedTask,
    GroupedTask
} from '../src/logic/ExportAccomplishments';
import { initTestDatabase, closeTestDb } from '../src/test-database';
import { v4 as uuidv4 } from 'uuid';

describe('Export Accomplishments', () => {
    let db: any;

    beforeAll(async () => {
        db = await initTestDatabase();
    });

    afterAll(() => {
        closeTestDb();
    });

    beforeEach(() => {
        // Clear tables before each test
        db.exec('DELETE FROM tasks');
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

    describe('getCompletedTasks', () => {
        it('should fetch completed tasks within date range', () => {
            // Insert test tasks
            const now = new Date();
            const yesterday = new Date(now);
            yesterday.setDate(now.getDate() - 1);
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);
            const lastMonth = new Date(now);
            lastMonth.setMonth(now.getMonth() - 1);

            const tasks = [
                { id: uuidv4(), title: 'Task 1', status: 'completed', due_date: yesterday.toISOString(), updated_at: yesterday.toISOString() },
                { id: uuidv4(), title: 'Task 2', status: 'completed', due_date: lastWeek.toISOString(), updated_at: lastWeek.toISOString() },
                { id: uuidv4(), title: 'Task 3', status: 'pending', due_date: lastWeek.toISOString(), updated_at: lastWeek.toISOString() },
                { id: uuidv4(), title: 'Task 4', status: 'completed', due_date: lastMonth.toISOString(), updated_at: lastMonth.toISOString() }
            ];

            const stmt = db.prepare('INSERT INTO tasks (id, title, status, due_date, updated_at) VALUES (?, ?, ?, ?, ?)');
            for (const task of tasks) {
                stmt.run(task.id, task.title, task.status, task.due_date, task.updated_at);
            }

            // Query for last 2 weeks
            const twoWeeksAgo = new Date(now);
            twoWeeksAgo.setDate(now.getDate() - 14);
            const results = getCompletedTasks(twoWeeksAgo, now, db);

            expect(results.length).toBe(2); // Task 1 and Task 2
            expect(results[0].title).toBe('Task 1'); // Most recent first
            expect(results[1].title).toBe('Task 2');
        });

        it('should return empty array when no completed tasks exist', () => {
            const now = new Date();
            const lastWeek = new Date(now);
            lastWeek.setDate(now.getDate() - 7);

            const results = getCompletedTasks(lastWeek, now, db);
            expect(results.length).toBe(0);
        });

        it('should exclude tasks outside date range', () => {
            const now = new Date();
            const twoMonthsAgo = new Date(now);
            twoMonthsAgo.setMonth(now.getMonth() - 2);
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(now.getMonth() - 1);

            const tasks = [
                { id: uuidv4(), title: 'Old Task', status: 'completed', due_date: twoMonthsAgo.toISOString(), updated_at: twoMonthsAgo.toISOString() },
                { id: uuidv4(), title: 'Recent Task', status: 'completed', due_date: oneMonthAgo.toISOString(), updated_at: oneMonthAgo.toISOString() }
            ];

            const stmt = db.prepare('INSERT INTO tasks (id, title, status, due_date, updated_at) VALUES (?, ?, ?, ?, ?)');
            for (const task of tasks) {
                stmt.run(task.id, task.title, task.status, task.due_date, task.updated_at);
            }

            // Query for last month only
            const results = getCompletedTasks(oneMonthAgo, now, db);
            expect(results.length).toBe(1);
            expect(results[0].title).toBe('Recent Task');
        });
    });

    describe('groupRecurringTasks', () => {
        it('should group recurring tasks by title and recurrence', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'Daily Standup',
                    description: 'Team meeting',
                    due_date: now.toISOString(),
                    recurrence: 'daily',
                    completed_at: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '2',
                    title: 'Daily Standup',
                    description: 'Team meeting',
                    due_date: now.toISOString(),
                    recurrence: 'daily',
                    completed_at: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '3',
                    title: 'Daily Standup',
                    description: 'Team meeting',
                    due_date: now.toISOString(),
                    recurrence: 'daily',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringTasks(tasks);
            
            expect(grouped.length).toBe(1);
            expect(isGroupedTask(grouped[0])).toBe(true);
            
            if (isGroupedTask(grouped[0])) {
                expect(grouped[0].title).toBe('Daily Standup');
                expect(grouped[0].count).toBe(3);
                expect(grouped[0].recurrence).toBe('daily');
            }
        });

        it('should not group single recurring task instances', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'Weekly Review',
                    description: 'Review progress',
                    due_date: now.toISOString(),
                    recurrence: 'weekly',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringTasks(tasks);
            
            expect(grouped.length).toBe(1);
            expect(isGroupedTask(grouped[0])).toBe(false);
        });

        it('should keep non-recurring tasks separate', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'One-time Task',
                    description: 'Complete project',
                    due_date: now.toISOString(),
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '2',
                    title: 'Another One-time Task',
                    description: 'Another project',
                    due_date: now.toISOString(),
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringTasks(tasks);
            
            expect(grouped.length).toBe(2);
            expect(isGroupedTask(grouped[0])).toBe(false);
            expect(isGroupedTask(grouped[1])).toBe(false);
        });

        it('should group recurring tasks separately by different recurrence patterns', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'Meeting',
                    description: 'Team sync',
                    due_date: now.toISOString(),
                    recurrence: 'daily',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '2',
                    title: 'Meeting',
                    description: 'Team sync',
                    due_date: now.toISOString(),
                    recurrence: 'daily',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                },
                {
                    id: '3',
                    title: 'Meeting',
                    description: 'Team sync',
                    due_date: now.toISOString(),
                    recurrence: 'weekly',
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const grouped = groupRecurringTasks(tasks);
            
            // Should create 2 groups: one for daily (2 tasks) and one single weekly
            expect(grouped.length).toBe(2);
            
            const dailyGroup = grouped.find(g => isGroupedTask(g) && g.recurrence === 'daily');
            expect(dailyGroup).toBeDefined();
            if (dailyGroup && isGroupedTask(dailyGroup)) {
                expect(dailyGroup.count).toBe(2);
            }

            const weeklyTask = grouped.find(g => !isGroupedTask(g) || g.recurrence === 'weekly');
            expect(weeklyTask).toBeDefined();
        });
    });

    describe('convertToCSV', () => {
        it('should convert regular tasks to CSV format', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'Task 1',
                    description: 'Description 1',
                    due_date: now.toISOString(),
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const csv = convertToCSV(tasks);
            const lines = csv.split('\n');
            
            expect(lines.length).toBe(2); // Header + 1 task
            expect(lines[0]).toBe('Title,Description,Recurrence,Count,Completed Date,Date Range');
            expect(lines[1]).toContain('Task 1');
            expect(lines[1]).toContain('Description 1');
            expect(lines[1]).toContain(',1,'); // Count
        });

        it('should convert grouped tasks to CSV format', () => {
            const now = new Date();
            const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            const groupedTasks: GroupedTask[] = [
                {
                    title: 'Daily Standup',
                    description: 'Team meeting',
                    recurrence: 'daily',
                    count: 5,
                    firstCompleted: yesterday.toISOString(),
                    lastCompleted: now.toISOString()
                }
            ];

            const csv = convertToCSV(groupedTasks);
            const lines = csv.split('\n');
            
            expect(lines.length).toBe(2);
            expect(lines[1]).toContain('Daily Standup');
            expect(lines[1]).toContain('daily');
            expect(lines[1]).toContain(',5,'); // Count
            expect(lines[1]).toContain(' - '); // Date range separator
        });

        it('should escape CSV special characters', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'Task with, comma',
                    description: 'Description with "quotes"',
                    due_date: now.toISOString(),
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const csv = convertToCSV(tasks);
            
            expect(csv).toContain('"Task with, comma"'); // Should be quoted
            expect(csv).toContain('"Description with ""quotes"""'); // Quotes should be escaped
        });

        it('should handle empty task list', () => {
            const csv = convertToCSV([]);
            const lines = csv.split('\n');
            
            expect(lines.length).toBe(1); // Only header
            expect(lines[0]).toBe('Title,Description,Recurrence,Count,Completed Date,Date Range');
        });

        it('should handle tasks with null descriptions', () => {
            const now = new Date();
            const tasks: CompletedTask[] = [
                {
                    id: '1',
                    title: 'Task without description',
                    description: null,
                    due_date: now.toISOString(),
                    recurrence: null,
                    completed_at: now.toISOString(),
                    created_at: now.toISOString()
                }
            ];

            const csv = convertToCSV(tasks);
            
            expect(csv).toContain('Task without description');
            expect(csv).not.toContain('null');
        });
    });

    describe('isGroupedTask', () => {
        it('should identify grouped tasks correctly', () => {
            const groupedTask: GroupedTask = {
                title: 'Test',
                description: 'Desc',
                recurrence: 'daily',
                count: 5,
                firstCompleted: new Date().toISOString(),
                lastCompleted: new Date().toISOString()
            };

            expect(isGroupedTask(groupedTask)).toBe(true);
        });

        it('should identify regular tasks correctly', () => {
            const regularTask: CompletedTask = {
                id: '1',
                title: 'Test',
                description: 'Desc',
                due_date: new Date().toISOString(),
                recurrence: null,
                completed_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            };

            expect(isGroupedTask(regularTask)).toBe(false);
        });
    });

    describe('Integration test: Full export flow', () => {
        it('should handle a realistic export scenario', () => {
            const now = new Date();
            
            // Create a mix of completed tasks over the past month
            const tasks = [
                // Daily recurring tasks (5 completions)
                ...Array.from({ length: 5 }, (_, i) => ({
                    id: uuidv4(),
                    title: 'Daily Standup',
                    description: 'Team sync',
                    status: 'completed',
                    due_date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString(),
                    recurrence: 'daily',
                    updated_at: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString()
                })),
                // Weekly recurring tasks (2 completions)
                ...Array.from({ length: 2 }, (_, i) => ({
                    id: uuidv4(),
                    title: 'Weekly Review',
                    description: 'Review progress',
                    status: 'completed',
                    due_date: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000).toISOString(),
                    recurrence: 'weekly',
                    updated_at: new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000).toISOString()
                })),
                // One-time tasks (3 tasks)
                {
                    id: uuidv4(),
                    title: 'Complete Project A',
                    description: 'Finish the implementation',
                    status: 'completed',
                    due_date: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    recurrence: null,
                    updated_at: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: uuidv4(),
                    title: 'Write Documentation',
                    description: 'API docs',
                    status: 'completed',
                    due_date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    recurrence: null,
                    updated_at: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString()
                },
                {
                    id: uuidv4(),
                    title: 'Code Review',
                    description: 'Review PR #123',
                    status: 'completed',
                    due_date: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
                    recurrence: null,
                    updated_at: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString()
                }
            ];

            const stmt = db.prepare('INSERT INTO tasks (id, title, description, status, due_date, recurrence, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)');
            for (const task of tasks) {
                stmt.run(task.id, task.title, task.description, task.status, task.due_date, task.recurrence || null, task.updated_at);
            }

            // Fetch completed tasks for last month
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(now.getMonth() - 1);
            const completedTasks = getCompletedTasks(oneMonthAgo, now, db);

            expect(completedTasks.length).toBe(10); // 5 + 2 + 3

            // Group recurring tasks
            const grouped = groupRecurringTasks(completedTasks);

            // Should have 5 entries: 1 grouped daily (5 tasks), 1 grouped weekly (2 tasks), 3 one-time tasks
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
