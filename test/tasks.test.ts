import { getNextDueDate } from '../src/logic/Recurrence';
import { Task } from '../src/models/Task';
import * as vscode from 'vscode';
import { initTestDatabase, closeTestDb } from '../src/test-database';
import * as TaskCommands from '../src/Task';

jest.mock('vscode');

describe('Task Scheduling', () => {
    describe('Recurrence Logic', () => {
        it('should calculate the next due date for a daily recurring task', () => {
            const now = new Date();
            const task: Task = {
                id: 'test-task-1',
                title: 'Daily Task',
                dueDate: now,
                recurrence: 'daily',
                status: 'pending',
                createdAt: now,
                updatedAt: now,
            };
            const nextDueDate = getNextDueDate(task);
            const expectedNextDueDate = new Date(now);
            expectedNextDueDate.setDate(now.getDate() + 1);
            expect(nextDueDate?.toISOString()).toBe(expectedNextDueDate.toISOString());
        });
    });

    describe('Task Database Operations', () => {
        let db: any;

        beforeAll(async () => {
            db = await initTestDatabase();
        });

        afterAll(() => {
            closeTestDb();
        });

        beforeEach(() => {
            db.exec('DELETE FROM tasks');
        });

        it('should insert a task into the database', () => {
            const taskId = 'test-task-1';
            const title = 'Test Task';
            const dueDate = new Date().toISOString();
            
            db.prepare('INSERT INTO tasks (id, title, due_date, recurrence, status) VALUES (?, ?, ?, ?, ?)').run(
                taskId, title, dueDate, 'daily', 'pending'
            );

            const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
            expect(task).toBeDefined();
            expect(task.title).toBe('Test Task');
            expect(task.recurrence).toBe('daily');
            expect(task.status).toBe('pending');
        });

        it('should retrieve all tasks', () => {
            const now = new Date().toISOString();
            
            db.prepare('INSERT INTO tasks (id, title, due_date, status) VALUES (?, ?, ?, ?)').run(
                'task-1', 'Task 1', now, 'pending'
            );
            db.prepare('INSERT INTO tasks (id, title, due_date, status) VALUES (?, ?, ?, ?)').run(
                'task-2', 'Task 2', now, 'completed'
            );

            const tasks = db.prepare('SELECT * FROM tasks').all();
            expect(tasks).toHaveLength(2);
        });

        it('should update a task status', () => {
            const taskId = 'test-task-update';
            const now = new Date().toISOString();
            
            db.prepare('INSERT INTO tasks (id, title, due_date, status) VALUES (?, ?, ?, ?)').run(
                taskId, 'Update Test', now, 'pending'
            );

            db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run('completed', taskId);

            const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
            expect(task.status).toBe('completed');
        });

        it('should delete a task', () => {
            const taskId = 'test-task-delete';
            const now = new Date().toISOString();
            
            db.prepare('INSERT INTO tasks (id, title, due_date, status) VALUES (?, ?, ?, ?)').run(
                taskId, 'Delete Test', now, 'pending'
            );

            db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);

            const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
            expect(task).toBeUndefined();
        });
    });
});
