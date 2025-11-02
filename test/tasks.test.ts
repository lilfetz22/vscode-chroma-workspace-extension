import { getNextDueDate } from '../src/logic/Recurrence';
import { Task } from '../src/models/Task';
import * as vscode from 'vscode';
import { closeDb, getDb, initDatabase } from '../src/database';
import * as TaskCommands from '../src/Task';
import { Database } from 'better-sqlite3';

jest.mock('vscode');

describe('Task Scheduling', () => {
    describe('Recurrence Logic', () => {
        it('should calculate the next due date for a daily recurring task', () => {
            const task: Task = {
                id: 1,
                title: 'Daily Task',
                dueDate: new Date('2025-01-01'),
                recurrence: 'daily',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            const nextDueDate = getNextDueDate(task);
            expect(nextDueDate?.getDate()).toBe(new Date().getDate() + 1);
        });
    });

    describe('Task Commands', () => {
        let db: Database;
        beforeAll(() => {
            initDatabase(true);
            db = getDb();
        });

        afterAll(() => {
            closeDb();
        });

        beforeEach(() => {
            db.prepare('DELETE FROM tasks').run();
        });

        it('should add a new task', async () => {
            (vscode.window.showInputBox as jest.Mock)
                .mockResolvedValueOnce('New Task')
                .mockResolvedValueOnce('2025-01-01');
            (vscode.window.showQuickPick as jest.Mock).mockResolvedValueOnce('daily');

            await TaskCommands.addTask();

            const task = db.prepare('SELECT * FROM tasks WHERE title = ?').get('New Task') as Task;
            expect(task).toBeDefined();
            if (task) {
                expect(task.recurrence).toBe('daily');
            }
        });
    });
});
