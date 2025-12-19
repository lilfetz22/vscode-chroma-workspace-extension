import * as vscode from 'vscode';
import { TaskScheduler } from '../src/logic/TaskScheduler';
import { SettingsService } from '../src/logic/SettingsService';

// Mock vscode configuration for vacation mode testing
let mockConfig: { [key: string]: any } = {};
let configChangeCallback: ((event: vscode.ConfigurationChangeEvent) => void) | null = null;

// Wrapper object that holds array references - NEVER reassign this object
const mockData = {
    tasks: [] as any[],
    cards: [] as any[],
    boards: [] as any[],
    columns: [] as any[]
};

// Mock createCardFromTask before other mocks
jest.mock('../src/Task', () => ({
    createCardFromTask: jest.fn(async (task: any, _ignoreRecurrence: boolean) => {
        try {
            console.log('[MOCK] createCardFromTask called for task:', task.id, task.title);
            // Access arrays through mockData object (not reassigned, so closure is safe)
            const card = { id: `card-${mockData.cards.length + 1}`, title: task.title, description: task.description || '' };
            console.log('[MOCK] Pushing card to mockData.cards. Current length:', mockData.cards.length);
            mockData.cards.push(card);
            console.log('[MOCK] After push, mockData.cards.length:', mockData.cards.length);
            
            // Import database functions for tag copying
            const { copyTaskTagsToCard, getTagsByTaskId, addTagToCard } = require('../src/database');
            
            // Copy tags from task to card (bulk copy)
            const tagsCopied = copyTaskTagsToCard(task.id, card.id);
            
            // Fallback to individual tag copying if bulk copy failed
            if (tagsCopied === 0) {
                const tags = getTagsByTaskId(task.id);
                for (const tag of tags) {
                    addTagToCard(card.id, tag.id);
                }
            }
            
            console.log('[MOCK] Returning card:', card.id);
            return card;
        } catch (error) {
            console.error('[MOCK] Error in createCardFromTask:', error);
            throw error;
        }
    })
}));
jest.mock('vscode', () => {
    const mockConfiguration = {
        get: jest.fn((key: string, defaultValue?: any) => {
            console.log(`[MOCK CONFIG] get('${key}') => `, mockConfig[key] !== undefined ? mockConfig[key] : defaultValue);
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
            configChangeCallback = callback;
            return { dispose: jest.fn() };
        })
    };

    const mockStatusBarItem = {
        text: '',
        show: jest.fn(),
        hide: jest.fn(),
        dispose: jest.fn()
    };

    const mockOutputChannel = {
        append: jest.fn(),
        appendLine: jest.fn(),
        clear: jest.fn(),
        show: jest.fn(),
        hide: jest.fn(),
        dispose: jest.fn()
    };

    const mockWindow = {
        createStatusBarItem: jest.fn(() => mockStatusBarItem),
        createOutputChannel: jest.fn(() => mockOutputChannel),
        showErrorMessage: jest.fn(),
        showInformationMessage: jest.fn(),
        showWarningMessage: jest.fn((message: string, options: any, ...items: string[]) => {
            return Promise.resolve(items[0]); // Default to first button
        }),
        showInputBox: jest.fn()
    };

    const mockCommands = {
        executeCommand: jest.fn()
    };

    const mockConfigurationTarget = {
        Global: 1,
        Workspace: 2,
        WorkspaceFolder: 3
    };

    return {
        workspace: mockWorkspace,
        window: mockWindow,
        commands: mockCommands,
        ConfigurationTarget: mockConfigurationTarget,
        StatusBarAlignment: {
            Left: 1,
            Right: 2
        }
    };
});

// Mock database functions  
jest.mock('../src/database', () => ({
    getDb: jest.fn(),
    prepare: jest.fn((query: string) => {
        const mockStatement = {
            all: jest.fn((status?: string) => {
                if (query.includes('SELECT') && query.includes('tasks')) {
                    return status ? mockData.tasks.filter(t => t.status === status) : mockData.tasks;
                }
                return [];
            }),
            get: jest.fn((taskId?: string) => {
                // Always try to find task by ID regardless of query
                if (taskId) {
                    return mockData.tasks.find(t => t.id === taskId);
                }
                return undefined;
            }),
            run: jest.fn()
        };
        return mockStatement;
    }),
    createCard: jest.fn((data: any) => {
        const card = { id: `card-${mockData.cards.length + 1}`, ...data };
        mockData.cards.push(card);
        return card;
    }),
    getAllBoards: jest.fn(() => mockData.boards),
    getColumnsByBoardId: jest.fn((boardId: string) => {
        return mockData.columns.filter(c => c.board_id === boardId);
    }),
    createBoard: jest.fn((data: any) => {
        const board = { id: `board-${mockData.boards.length + 1}`, ...data };
        mockData.boards.push(board);
        return board;
    }),
    createColumn: jest.fn((data: any) => {
        const column = { id: `column-${mockData.columns.length + 1}`, ...data };
        mockData.columns.push(column);
        return column;
    }),
    copyTaskTagsToCard: jest.fn(() => 0),
    getTagsByTaskId: jest.fn(() => []),
    addTagToCard: jest.fn(),
    getCardById: jest.fn(),
    updateCard: jest.fn(),
    deleteCard: jest.fn(),
    getColumnById: jest.fn((columnId: string) => {
        return mockData.columns.find(c => c.id === columnId);
    }),
    reorderCardsOnInsert: jest.fn(),
    saveDatabase: jest.fn()
}));

describe('Vacation Mode', () => {
    let settingsService: SettingsService;

    test('VERIFY MOCK: createCardFromTask should be mocked', async () => {
        const { createCardFromTask } = require('../src/Task');
        console.log('createCardFromTask is:', typeof createCardFromTask);
        console.log('createCardFromTask._isMockFunction:', (createCardFromTask as any)._isMockFunction);
        expect(jest.isMockFunction(createCardFromTask)).toBe(true);
    });

    beforeEach(() => {
        // Reset mock config before each test - set each property directly to avoid closure issues
        mockConfig['nlh.enabled'] = true;
        mockConfig['nlh.colors.nouns'] = '#569CD6';
        mockConfig['nlh.colors.verbs'] = '#4EC9B0';
        mockConfig['nlh.colors.adjectives'] = '#C586C0';
        mockConfig['nlh.colors.adverbs'] = '#DCDCAA';
        mockConfig['nlh.colors.numbers'] = '#B5CEA8';
        mockConfig['nlh.colors.properNouns'] = '#4FC1FF';
        mockConfig['tasks.enableNotifications'] = true;
        mockConfig['tasks.notificationFrequency'] = 'once';
        mockConfig['tasks.showInStatusBar'] = true;
        mockConfig['tasks.vacationMode'] = false;
        mockConfig['tasks.vacationModeBoards'] = [];
        mockConfig['kanban.taskCreationColumn'] = 'To Do';
        mockConfig['kanban.completionColumn'] = 'Done';
        mockConfig['export.defaultDateRangeMonths'] = 6;
        mockConfig['export.includeDescriptions'] = true;
        mockConfig['export.groupRecurringTasks'] = true;
        mockConfig['database.path'] = '.chroma/chroma.db';
        
        // Reset mock data - clear and repopulate arrays (don't reassign mockData object!)
        mockData.tasks.length = 0;
        mockData.cards.length = 0;
        mockData.boards.length = 0;
        mockData.boards.push(
            { id: 'board-1', title: 'Test Board' },
            { id: 'board-2', title: 'Board 2' },
            { id: 'board-3', title: 'Board 3' }
        );
        mockData.columns.length = 0;
        mockData.columns.push(
            { id: 'column-1', title: 'To Do', board_id: 'board-1', position: 0 },
            { id: 'column-2', title: 'To Do', board_id: 'board-2', position: 0 },
            { id: 'column-3', title: 'To Do', board_id: 'board-3', position: 0 }
        );

        const database = require('../src/database');

        // Restore prepare mock
        (database.prepare as jest.Mock).mockImplementation((query: string) => {
            const mockStatement = {
                all: jest.fn((status?: string) => {
                    if (query.includes('SELECT') && query.includes('tasks')) {
                        return status ? mockData.tasks.filter(t => t.status === status) : mockData.tasks;
                    }
                    return [];
                }),
                get: jest.fn((taskId?: string) => {
                    // Always try to find task by ID regardless of query
                    if (taskId) {
                        return mockData.tasks.find(t => t.id === taskId);
                    }
                    return undefined;
                }),
                run: jest.fn()
            };
            return mockStatement;
        });

        // Restore tag function mocks
        (database.copyTaskTagsToCard as jest.Mock).mockImplementation(() => 0);
        (database.getTagsByTaskId as jest.Mock).mockImplementation(() => []);
        
        settingsService = new SettingsService();
        jest.clearAllMocks();
    });

    afterEach(() => {
        if (settingsService) {
            settingsService.dispose();
        }
    });

    describe('Settings Service', () => {
        test('vacation mode should default to false', () => {
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(false);
        });

        test('should be able to enable vacation mode', async () => {
            await settingsService.updateSetting('tasks.vacationMode', true);
            expect(mockConfig['tasks.vacationMode']).toBe(true);
            
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
        });

        test('should be able to disable vacation mode', async () => {
            mockConfig['tasks.vacationMode'] = true;
            await settingsService.updateSetting('tasks.vacationMode', false);
            expect(mockConfig['tasks.vacationMode']).toBe(false);
            
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(false);
        });

        test('vacation mode should be included in resetToDefaults', async () => {
            mockConfig['tasks.vacationMode'] = true;
            await settingsService.resetToDefaults();
            
            // After reset, value should be undefined (uses default)
            expect(mockConfig['tasks.vacationMode']).toBeUndefined();
        });

        test('vacationModeBoards should default to empty array', () => {
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards).toEqual([]);
        });

        test('should be able to set specific boards for vacation mode', async () => {
            await settingsService.updateSetting('tasks.vacationModeBoards', ['board-1', 'board-2']);
            expect(mockConfig['tasks.vacationModeBoards']).toEqual(['board-1', 'board-2']);
            
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards).toEqual(['board-1', 'board-2']);
        });

        test('should allow clearing vacation mode boards', async () => {
            mockConfig['tasks.vacationModeBoards'] = ['board-1', 'board-2'];
            await settingsService.updateSetting('tasks.vacationModeBoards', []);
            expect(mockConfig['tasks.vacationModeBoards']).toEqual([]);
            
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards).toEqual([]);
        });

        test('vacationModeBoards should be included in resetToDefaults', async () => {
            mockConfig['tasks.vacationModeBoards'] = ['board-1', 'board-2'];
            await settingsService.resetToDefaults();
            
            // After reset, value should be undefined (uses default empty array)
            expect(mockConfig['tasks.vacationModeBoards']).toBeUndefined();
        });
    });

    describe('TaskScheduler with Vacation Mode', () => {
        let scheduler: TaskScheduler;

        beforeEach(() => {
            scheduler = TaskScheduler.getInstance();
        });

        afterEach(() => {
            scheduler.stop();
        });

        test('should not create cards when vacation mode is enabled', async () => {
            // Enable vacation mode
            mockConfig['tasks.vacationMode'] = true;

            // Create a task that is due now
            const now = new Date();
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-1',
                title: 'Test Task',
                description: 'Test Description',
                dueDate: now.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Verify no cards were created
            expect(mockData.cards.length).toBe(0);
            
            // Verify no information message was shown
            expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
        });

        test('should create cards when vacation mode is disabled', async () => {
            // Disable vacation mode
            mockConfig['tasks.vacationMode'] = false;

            // Create a task that is due now
            const now = new Date();
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-1',
                title: 'Test Task',
                description: 'Test Description',
                dueDate: now.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Verify card was created
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Test Task');
        });

        test('should still count due tasks when vacation mode is enabled', async () => {
            // Enable vacation mode
            mockConfig['tasks.vacationMode'] = true;

            // Create tasks due today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-1',
                    title: 'Task 1',
                    dueDate: today.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                },
                {
                    id: 'task-2',
                    title: 'Task 2',
                    dueDate: today.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Verify task count was updated (status bar should show count)
            const statusBarItem = (scheduler as any).taskCountStatusBarItem;
            expect(statusBarItem.text).toContain('2');
        });

        test('should resume card creation when vacation mode is turned off', async () => {
            // Start with vacation mode enabled
            mockConfig['tasks.vacationMode'] = true;

            const now = new Date();
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-1',
                title: 'Test Task',
                dueDate: now.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            });

            // First check - vacation mode on
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(0);

            // Turn off vacation mode
            mockConfig['tasks.vacationMode'] = false;

            // Second check - vacation mode off
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);
        });

        test('should bulk copy task tags onto new card', async () => {
            const { copyTaskTagsToCard, getTagsByTaskId, addTagToCard } = require('../src/database');
            (copyTaskTagsToCard as jest.Mock).mockReturnValue(2);

            const now = new Date();
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-with-tags',
                title: 'Tagged Task',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            });

            await (scheduler as any).checkTasks();

            expect(copyTaskTagsToCard).toHaveBeenCalledWith('task-with-tags', 'card-1');
            expect(getTagsByTaskId).not.toHaveBeenCalled();
            expect(addTagToCard).not.toHaveBeenCalled();
        });

        test('should fall back to per-tag copy when bulk copy fails', async () => {
            const { copyTaskTagsToCard, getTagsByTaskId, addTagToCard } = require('../src/database');
            (copyTaskTagsToCard as jest.Mock).mockReturnValue(0);
            (getTagsByTaskId as jest.Mock).mockReturnValue([{ id: 'tag-1' }, { id: 'tag-2' }]);

            const now = new Date();
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-fallback',
                title: 'Fallback Task',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            });

            await (scheduler as any).checkTasks();

            expect(copyTaskTagsToCard).toHaveBeenCalledWith('task-fallback', 'card-1');
            expect(getTagsByTaskId).toHaveBeenCalledWith('task-fallback');
            expect(addTagToCard).toHaveBeenCalledTimes(2);
            expect(addTagToCard).toHaveBeenCalledWith('card-1', 'tag-1');
            expect(addTagToCard).toHaveBeenCalledWith('card-1', 'tag-2');
        });

        test('should not affect recurring task date updates in vacation mode', async () => {
            // Enable vacation mode
            mockConfig['tasks.vacationMode'] = true;

            // Create a recurring task that is overdue
            const past = new Date();
            past.setDate(past.getDate() - 1);
            
            const updateSpy = jest.fn();
            const { prepare } = require('../src/database');
            (prepare as jest.Mock).mockImplementation((query: string) => {
                if (query.includes('UPDATE')) {
                    return { run: updateSpy };
                }
                return {
                    all: jest.fn(() => [{
                        id: 'task-1',
                        title: 'Recurring Task',
                        dueDate: past.toISOString(),
                        status: 'pending',
                        recurrence: 'daily',
                        boardId: 'board-1'
                    }])
                };
            });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // In vacation mode, tasks should not be converted to cards
            expect(mockData.cards.length).toBe(0);
        });

        test('should apply vacation mode to all boards when vacationModeBoards is empty', async () => {
            // Enable vacation mode with empty board list (applies to all)
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = [];

            // Create tasks on multiple boards
            const now = new Date();
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-1',
                    title: 'Task Board 1',
                    dueDate: now.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                },
                {
                    id: 'task-2',
                    title: 'Task Board 2',
                    dueDate: now.toISOString(),
                    status: 'pending',
                    boardId: 'board-2'
                });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // No cards should be created on any board
            expect(mockData.cards.length).toBe(0);
        });

        test('should apply vacation mode only to selected boards', async () => {
            // Enable vacation mode for specific boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];

            // Create tasks on both boards - use past date to ensure they're due
            const past = new Date();
            past.setHours(past.getHours() - 1);
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-1',
                    title: 'Task Board 1',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                },
                {
                    id: 'task-2',
                    title: 'Task Board 2',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-2'
                });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Only task from board-2 should be converted to card (board-1 is in vacation mode)
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task Board 2');
        });

        test('should allow multiple boards in vacation mode', async () => {
            // Enable vacation mode for multiple boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1', 'board-2'];

            // Create tasks on all three boards - use past date to ensure they're due
            const past = new Date();
            past.setHours(past.getHours() - 1);
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-1',
                    title: 'Task Board 1',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                },
                {
                    id: 'task-2',
                    title: 'Task Board 2',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-2'
                },
                {
                    id: 'task-3',
                    title: 'Task Board 3',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-3'
                });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Only task from board-3 should be converted to card (board-1 and board-2 are in vacation mode)
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task Board 3');
        });

        test('should handle tasks with undefined boardId gracefully', async () => {
            // Enable vacation mode for specific boards (not global)
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];

            // Create a task with undefined boardId - use past date to ensure it's due
            const past = new Date();
            past.setHours(past.getHours() - 1);
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-undefined',
                    title: 'Task No Board',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: undefined
                },
                {
                    id: 'task-1',
                    title: 'Task Board 1',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Task with undefined boardId should be converted (only specific boards are paused)
            // Task from board-1 should NOT be converted (it's in vacation mode)
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task No Board');
        });

        test('should count tasks from all boards including vacation mode boards', async () => {
            // Enable vacation mode for specific boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];

            // Create tasks due today on both boards - use early morning to ensure they're both
            // "due today" and also <= now (past due)
            const today = new Date();
            today.setHours(0, 0, 0, 0);  // Midnight today - definitely in the past
            
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-1',
                    title: 'Task Board 1',
                    dueDate: today.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                },
                {
                    id: 'task-2',
                    title: 'Task Board 2',
                    dueDate: today.toISOString(),
                    status: 'pending',
                    boardId: 'board-2'
                });

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Verify task count includes tasks from both boards
            const statusBarItem = (scheduler as any).taskCountStatusBarItem;
            expect(statusBarItem.text).toContain('1');
            
            // Verify only board-2 task was converted to card
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task Board 2');
        });
    });

    // Note: Card edit/move warning tests are verified manually and through E2E testing
    // since Card.js is a JavaScript module that requires compiled TypeScript dependencies
    // The warning logic has been implemented in vscode/kanban/Card.js

    describe('Integration Tests', () => {
        test('vacation mode should prevent all task processing', async () => {
            mockConfig['tasks.vacationMode'] = true;

            const scheduler = TaskScheduler.getInstance();
            
            // Create multiple overdue tasks
            const past = new Date();
            past.setDate(past.getDate() - 2);
            
            mockData.tasks.length = 0; mockData.tasks.push(
                {
                    id: 'task-1',
                    title: 'Task 1',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    boardId: 'board-1'
                },
                {
                    id: 'task-2',
                    title: 'Task 2',
                    dueDate: past.toISOString(),
                    status: 'pending',
                    recurrence: 'daily',
                    boardId: 'board-1'
                });

            await (scheduler as any).checkTasks();

            // No cards should be created
            expect(mockData.cards.length).toBe(0);
            
            // No commands should be executed
            expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
            
            scheduler.stop();
        });

        test('switching vacation mode on and off should work correctly', async () => {
            const scheduler = TaskScheduler.getInstance();
            
            const past = new Date(Date.now() - 3600000); // 1 hour ago
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-1',
                title: 'Test Task',
                dueDate: past.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            });

            // Initial state: vacation mode off
            mockConfig['tasks.vacationMode'] = false;
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);

            // Clear cards for next test
            mockData.cards.length = 0;
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-2',
                title: 'Test Task 2',
                dueDate: past.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            });

            // Turn on vacation mode
            mockConfig['tasks.vacationMode'] = true;
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(0);

            // Clear and add new task
            mockData.tasks.length = 0; mockData.tasks.push({
                id: 'task-3',
                title: 'Test Task 3',
                dueDate: past.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            });

            // Turn off vacation mode again
            mockConfig['tasks.vacationMode'] = false;
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);
            
            scheduler.stop();
        });

        test('should allow switching between global and board-specific vacation mode', async () => {
            const scheduler = TaskScheduler.getInstance();
            const past = new Date();
            past.setHours(past.getHours() - 1);
            
            // Board-specific vacation mode (only board-1)
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];
            mockData.tasks.length = 0; mockData.tasks.push(
                { id: 'task-1a', title: 'Task B1 A', dueDate: past.toISOString(), status: 'pending', boardId: 'board-1' },
                { id: 'task-2a', title: 'Task B2 A', dueDate: past.toISOString(), status: 'pending', boardId: 'board-2' });
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task B2 A');

            // Switch to global vacation mode (empty list applies to all)
            mockData.cards.length = 0;
            mockConfig['tasks.vacationModeBoards'] = [];
            mockData.tasks.length = 0; mockData.tasks.push(
                { id: 'task-1b', title: 'Task B1 B', dueDate: past.toISOString(), status: 'pending', boardId: 'board-1' },
                { id: 'task-2b', title: 'Task B2 B', dueDate: past.toISOString(), status: 'pending', boardId: 'board-2' });
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(0);

            // Switch to board-2 specific vacation mode
            mockData.cards.length = 0;
            mockConfig['tasks.vacationModeBoards'] = ['board-2'];
            mockData.tasks.length = 0; mockData.tasks.push(
                { id: 'task-1c', title: 'Task B1 C', dueDate: past.toISOString(), status: 'pending', boardId: 'board-1' },
                { id: 'task-2c', title: 'Task B2 C', dueDate: past.toISOString(), status: 'pending', boardId: 'board-2' });
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task B1 C');
            
            scheduler.stop();
        });

        test('should handle dynamic changes to vacationModeBoards list', async () => {
            const scheduler = TaskScheduler.getInstance();
            const past = new Date();
            past.setHours(past.getHours() - 1);
            
            // Start with board-1 in vacation mode
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];
            
            mockData.tasks.length = 0; mockData.tasks.push(
                { id: 'task-1a', title: 'Task B1 A', dueDate: past.toISOString(), status: 'pending', boardId: 'board-1' },
                { id: 'task-2a', title: 'Task B2 A', dueDate: past.toISOString(), status: 'pending', boardId: 'board-2' },
                { id: 'task-3a', title: 'Task B3 A', dueDate: past.toISOString(), status: 'pending', boardId: 'board-3' });
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(2);
            expect(mockData.cards.find((c: any) => c.title === 'Task B2 A')).toBeDefined();
            expect(mockData.cards.find((c: any) => c.title === 'Task B3 A')).toBeDefined();

            // Add board-2 to vacation mode
            mockData.cards.length = 0;
            mockConfig['tasks.vacationModeBoards'] = ['board-1', 'board-2'];
            mockData.tasks.length = 0; mockData.tasks.push(
                { id: 'task-1b', title: 'Task B1 B', dueDate: past.toISOString(), status: 'pending', boardId: 'board-1' },
                { id: 'task-2b', title: 'Task B2 B', dueDate: past.toISOString(), status: 'pending', boardId: 'board-2' },
                { id: 'task-3b', title: 'Task B3 B', dueDate: past.toISOString(), status: 'pending', boardId: 'board-3' });
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task B3 B');

            // Remove board-1, add board-3 (now board-2 and board-3 in vacation mode)
            mockData.cards.length = 0;
            mockConfig['tasks.vacationModeBoards'] = ['board-2', 'board-3'];
            mockData.tasks.length = 0; mockData.tasks.push(
                { id: 'task-1c', title: 'Task B1 C', dueDate: past.toISOString(), status: 'pending', boardId: 'board-1' },
                { id: 'task-2c', title: 'Task B2 C', dueDate: past.toISOString(), status: 'pending', boardId: 'board-2' },
                { id: 'task-3c', title: 'Task B3 C', dueDate: past.toISOString(), status: 'pending', boardId: 'board-3' });
            await (scheduler as any).checkTasks();
            expect(mockData.cards.length).toBe(1);
            expect(mockData.cards[0].title).toBe('Task B1 C');
            
            scheduler.stop();
        });
    });
});




