import * as vscode from 'vscode';
import { convertTaskToCard } from '../src/Task';
import * as database from '../src/database';
import { getNextDueDate } from '../src/logic/Recurrence';
import { Task } from '../src/models/Task';
import { Logger } from '../src/logic/Logger';
import * as SettingsService from '../src/logic/SettingsService';

jest.mock('vscode');

describe('Recurring Task Conversion to Card', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.clearAllTimers();
    });

    afterEach(() => {
        jest.restoreAllMocks();
        jest.useRealTimers();
    });

    describe('getNextDueDate with forceNext parameter', () => {
        it('should advance to next occurrence when forceNext is true, even if current due date has not passed', () => {
            // Scenario: Task is due at 10 AM on Jan 12, 2026 (weekly recurrence)
            // Current time is 9 AM on Jan 12, 2026
            // Expected: Next due date should be Jan 19, 2026 at 10 AM
            
            // Mock current time to be 9 AM on Jan 12, 2026 (before the task is due)
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2026-01-12T09:00:00Z'));
            
            const dueDate = new Date('2026-01-12T10:00:00Z');
            const task: Task = {
                id: 'test-task-1',
                title: 'Weekly Task',
                dueDate: dueDate,
                recurrence: 'weekly',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const nextDueDate = getNextDueDate(task, true);

            expect(nextDueDate).not.toBeNull();
            expect(nextDueDate!.toISOString()).toBe('2026-01-19T10:00:00.000Z');

            jest.useRealTimers();
        });

        it('should return current due date when forceNext is false and task is not yet due', () => {
            // Mock current time to be 9 AM on Jan 12, 2026 (before the task is due)
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2026-01-12T09:00:00Z'));
            
            const dueDate = new Date('2026-01-12T10:00:00Z');
            const task: Task = {
                id: 'test-task-2',
                title: 'Weekly Task',
                dueDate: dueDate,
                recurrence: 'weekly',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const nextDueDate = getNextDueDate(task, false);

            expect(nextDueDate).not.toBeNull();
            // Should return the current due date since it hasn't passed yet and forceNext is false
            expect(nextDueDate!.toISOString()).toBe('2026-01-12T10:00:00.000Z');

            jest.useRealTimers();
        });

        it('should advance to next occurrence for daily recurrence with forceNext', () => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2026-01-12T09:00:00Z'));
            
            const dueDate = new Date('2026-01-12T10:00:00Z');
            const task: Task = {
                id: 'test-task-3',
                title: 'Daily Task',
                dueDate: dueDate,
                recurrence: 'daily',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const nextDueDate = getNextDueDate(task, true);

            expect(nextDueDate).not.toBeNull();
            expect(nextDueDate!.toISOString()).toBe('2026-01-13T10:00:00.000Z');

            jest.useRealTimers();
        });

        it('should advance to next occurrence for monthly recurrence with forceNext', () => {
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2026-01-12T09:00:00Z'));
            
            const dueDate = new Date('2026-01-12T10:00:00Z');
            const task: Task = {
                id: 'test-task-4',
                title: 'Monthly Task',
                dueDate: dueDate,
                recurrence: 'monthly',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const nextDueDate = getNextDueDate(task, true);

            expect(nextDueDate).not.toBeNull();
            expect(nextDueDate!.toISOString()).toBe('2026-02-12T10:00:00.000Z');

            jest.useRealTimers();
        });
    });

    describe('convertTaskToCard', () => {
        function mockBasicDatabaseCalls() {
            jest.spyOn(database, 'getDb').mockReturnValue({} as any);
            jest.spyOn(database, 'getAllBoards').mockReturnValue([
                { id: 'board-1', title: 'Test Board' }
            ] as any);
            jest.spyOn(database, 'getColumnsByBoardId').mockReturnValue([
                { id: 'col-1', title: 'To Do', board_id: 'board-1' }
            ] as any);
            jest.spyOn(database, 'getColumnById').mockReturnValue({
                id: 'col-1',
                title: 'To Do',
                board_id: 'board-1'
            } as any);
            jest.spyOn(database, 'createCard').mockReturnValue({
                id: 'card-1',
                title: 'Test Card',
                column_id: 'col-1'
            } as any);
            jest.spyOn(database, 'getTagsByTaskId').mockReturnValue([]);
            jest.spyOn(database, 'copyTaskTagsToCard').mockReturnValue(0);
            jest.spyOn(database, 'reorderCardsOnInsert').mockImplementation(() => {});
            jest.spyOn(database, 'saveDatabase').mockImplementation(() => {});
        }

        it('should reschedule recurring task to next occurrence when converted to card', async () => {
            mockBasicDatabaseCalls();

            const updateSpy = jest.fn();
            
            jest.spyOn(database, 'prepare').mockImplementation((sql: string) => {
                if (sql.includes('UPDATE tasks SET due_date')) {
                    return { run: updateSpy } as any;
                }
                return { run: jest.fn() } as any;
            });

            // Mock Logger to avoid errors
            jest.spyOn(Logger, 'getInstance').mockReturnValue({
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
                debug: jest.fn(),
            } as any);

            // Mock SettingsService
            jest.spyOn(SettingsService, 'getSettingsService').mockReturnValue({
                getKanbanSettings: () => ({
                    taskCreationColumn: 'To Do',
                    completionColumn: 'Done'
                })
            } as any);

            // Mock current time to be 9 AM on Jan 12, 2026 (before the task is due)
            jest.useFakeTimers();
            jest.setSystemTime(new Date('2026-01-12T09:00:00Z'));
            
            const dueDate = new Date('2026-01-12T10:00:00Z');
            const task: Task = {
                id: 'task-1',
                title: 'Weekly Task',
                dueDate: dueDate,
                recurrence: 'weekly',
                status: 'pending',
                boardId: 'board-1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await convertTaskToCard(task);

            // Verify that the task was updated with the next occurrence date
            expect(updateSpy).toHaveBeenCalledWith(
                '2026-01-19T10:00:00.000Z',
                'task-1'
            );

            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
                'Task "Weekly Task" converted to card.'
            );

            jest.useRealTimers();
        });

        it('should delete non-recurring task when converted to card', async () => {
            mockBasicDatabaseCalls();

            const deleteSpy = jest.fn();
            jest.spyOn(database, 'prepare').mockImplementation((sql: string) => {
                if (sql.includes('DELETE FROM tasks')) {
                    return { run: deleteSpy } as any;
                }
                return { run: jest.fn() } as any;
            });

            jest.spyOn(Logger, 'getInstance').mockReturnValue({
                info: jest.fn(),
                warn: jest.fn(),
                error: jest.fn(),
                debug: jest.fn(),
            } as any);

            // Mock SettingsService
            jest.spyOn(SettingsService, 'getSettingsService').mockReturnValue({
                getKanbanSettings: () => ({
                    taskCreationColumn: 'To Do',
                    completionColumn: 'Done'
                })
            } as any);

            const dueDate = new Date('2026-01-12T10:00:00Z');
            const task: Task = {
                id: 'task-2',
                title: 'One-time Task',
                dueDate: dueDate,
                recurrence: null,
                status: 'pending',
                boardId: 'board-1',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await convertTaskToCard(task);

            // Verify that non-recurring task was deleted
            expect(deleteSpy).toHaveBeenCalledWith('task-2');

            expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(
                'Task "One-time Task" converted to card.'
            );
        });
    });
});
