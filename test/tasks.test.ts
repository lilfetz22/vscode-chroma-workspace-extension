import { getNextDueDate } from '../src/logic/Recurrence';
import { Task } from '../src/models/Task';
import * as vscode from 'vscode';
import { initTestDatabase, closeTestDb, createTask, getTaskById, getAllTasks, updateTask, deleteTask, clearTasks } from '../src/test-database';
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
            clearTasks(db);
        });

        it('should insert a task into the database', () => {
            const taskId = 'test-task-1';
            const title = 'Test Task';
            const dueDate = new Date().toISOString();

            createTask(db, { id: taskId, title, due_date: dueDate, recurrence: 'daily', status: 'pending' });

            const task = getTaskById(db, taskId);
            expect(task).toBeDefined();
            expect(task.title).toBe('Test Task');
            expect(task.recurrence).toBe('daily');
            expect(task.status).toBe('pending');
        });

        it('should retrieve all tasks', () => {
            const now = new Date().toISOString();

            createTask(db, { id: 'task-1', title: 'Task 1', due_date: now, status: 'pending' });
            createTask(db, { id: 'task-2', title: 'Task 2', due_date: now, status: 'completed' });

            const tasks = getAllTasks(db);
            expect(tasks).toHaveLength(2);
        });

        it('should update a task status', () => {
            const taskId = 'test-task-update';
            const now = new Date().toISOString();

            createTask(db, { id: taskId, title: 'Update Test', due_date: now, status: 'pending' });

            updateTask(db, taskId, { status: 'completed' });

            const task = getTaskById(db, taskId);
            expect(task.status).toBe('completed');
        });

        it('should delete a task', () => {
            const taskId = 'test-task-delete';
            const now = new Date().toISOString();

            createTask(db, { id: taskId, title: 'Delete Test', due_date: now, status: 'pending' });

            deleteTask(db, taskId);

            const task = getTaskById(db, taskId);
            expect(task).toBeUndefined();
        });
    });
});
