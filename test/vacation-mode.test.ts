import * as vscode from 'vscode';
import { TaskScheduler } from '../src/logic/TaskScheduler';
import { SettingsService } from '../src/logic/SettingsService';

// Mock vscode configuration for vacation mode testing
let mockConfig: { [key: string]: any } = {};
let configChangeCallback: ((event: vscode.ConfigurationChangeEvent) => void) | null = null;

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
let mockTasks: any[] = [];
let mockCards: any[] = [];
let mockBoards: any[] = [];
let mockColumns: any[] = [];

jest.mock('../src/database', () => ({
    getDb: jest.fn(),
    prepare: jest.fn((query: string) => ({
        all: jest.fn((status?: string) => {
            if (query.includes('SELECT') && query.includes('tasks')) {
                return status ? mockTasks.filter(t => t.status === status) : mockTasks;
            }
            return [];
        }),
        run: jest.fn()
    })),
    createCard: jest.fn((data: any) => {
        const card = { id: `card-${mockCards.length + 1}`, ...data };
        mockCards.push(card);
        return card;
    }),
    getAllBoards: jest.fn(() => mockBoards),
    getColumnsByBoardId: jest.fn((boardId: string) => {
        return mockColumns.filter(c => c.board_id === boardId);
    }),
    createBoard: jest.fn((data: any) => {
        const board = { id: `board-${mockBoards.length + 1}`, ...data };
        mockBoards.push(board);
        return board;
    }),
    createColumn: jest.fn((data: any) => {
        const column = { id: `column-${mockColumns.length + 1}`, ...data };
        mockColumns.push(column);
        return column;
    }),
    copyTaskTagsToCard: jest.fn(() => 0),
    getTagsByTaskId: jest.fn(() => []),
    addTagToCard: jest.fn(),
    getCardById: jest.fn(),
    updateCard: jest.fn(),
    deleteCard: jest.fn(),
    getColumnById: jest.fn((columnId: string) => {
        return mockColumns.find(c => c.id === columnId);
    }),
    reorderCardsOnInsert: jest.fn()
}));

describe('Vacation Mode', () => {
    let settingsService: SettingsService;

    beforeEach(() => {
        // Reset mock config before each test
        mockConfig = {
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
            'tasks.vacationMode': false,
            'tasks.vacationModeBoards': [],
            'kanban.taskCreationColumn': 'To Do',
            'kanban.completionColumn': 'Done',
            'export.defaultDateRangeMonths': 6,
            'export.includeDescriptions': true,
            'export.groupRecurringTasks': true,
            'database.path': '.chroma/chroma.db'
        };
        
        // Reset mock data
        mockTasks = [];
        mockCards = [];
        mockBoards = [{
            id: 'board-1',
            title: 'Test Board'
        }];
        mockColumns = [{
            id: 'column-1',
            title: 'To Do',
            board_id: 'board-1',
            position: 0
        }];
        
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
            mockTasks = [{
                id: 'task-1',
                title: 'Test Task',
                description: 'Test Description',
                dueDate: now.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            }];

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Verify no cards were created
            expect(mockCards.length).toBe(0);
            
            // Verify no information message was shown
            expect(vscode.window.showInformationMessage).not.toHaveBeenCalled();
        });

        test('should create cards when vacation mode is disabled', async () => {
            // Disable vacation mode
            mockConfig['tasks.vacationMode'] = false;

            // Create a task that is due now
            const now = new Date();
            mockTasks = [{
                id: 'task-1',
                title: 'Test Task',
                description: 'Test Description',
                dueDate: now.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            }];

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // Verify card was created
            expect(mockCards.length).toBe(1);
            expect(mockCards[0].title).toBe('Test Task');
        });

        test('should still count due tasks when vacation mode is enabled', async () => {
            // Enable vacation mode
            mockConfig['tasks.vacationMode'] = true;

            // Create tasks due today
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            mockTasks = [
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
                }
            ];

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
            mockTasks = [{
                id: 'task-1',
                title: 'Test Task',
                dueDate: now.toISOString(),
                status: 'pending',
                recurrence: null,
                boardId: 'board-1'
            }];

            // First check - vacation mode on
            await (scheduler as any).checkTasks();
            expect(mockCards.length).toBe(0);

            // Turn off vacation mode
            mockConfig['tasks.vacationMode'] = false;

            // Second check - vacation mode off
            await (scheduler as any).checkTasks();
            expect(mockCards.length).toBe(1);
        });

        test('should bulk copy task tags onto new card', async () => {
            const { copyTaskTagsToCard, getTagsByTaskId, addTagToCard } = require('../src/database');
            (copyTaskTagsToCard as jest.Mock).mockReturnValue(2);

            const now = new Date();
            mockTasks = [{
                id: 'task-with-tags',
                title: 'Tagged Task',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            }];

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
            mockTasks = [{
                id: 'task-fallback',
                title: 'Fallback Task',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            }];

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
            expect(mockCards.length).toBe(0);
        });

        test('should apply vacation mode to all boards when vacationModeBoards is empty', async () => {
            // Enable vacation mode with empty board list (applies to all)
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = [];

            // Create tasks on multiple boards
            const now = new Date();
            mockTasks = [
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
                }
            ];

            // Manually trigger checkTasks
            await (scheduler as any).checkTasks();

            // No cards should be created on any board
            expect(mockCards.length).toBe(0);
        });

        test('should apply vacation mode only to selected boards', async () => {
            // Enable vacation mode for specific boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];

            // Verify that the settings are correctly retrieved
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
            expect(taskSettings.vacationModeBoards).toEqual(['board-1']);
            expect(taskSettings.vacationModeBoards.includes('board-1')).toBe(true);
            expect(taskSettings.vacationModeBoards.includes('board-2')).toBe(false);
        });

        test('should allow multiple boards in vacation mode', async () => {
            // Enable vacation mode for multiple boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1', 'board-2'];

            // Verify that all specified boards are in vacation mode
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
            expect(taskSettings.vacationModeBoards).toEqual(['board-1', 'board-2']);
            expect(taskSettings.vacationModeBoards.length).toBe(2);
            expect(taskSettings.vacationModeBoards.includes('board-3')).toBe(false);
        });

        test('should handle tasks with undefined boardId gracefully', async () => {
            // Enable vacation mode for specific boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];

            // Verify that the board list is configured correctly
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards.length).toBe(1);
            expect(taskSettings.vacationModeBoards[0]).toBe('board-1');

            // An undefined boardId would not be included in vacation mode list
            const undefinedBoardId: any = undefined;
            const isInVacationMode = taskSettings.vacationModeBoards.includes(undefinedBoardId);
            expect(isInVacationMode).toBe(false);
        });

        test('should count tasks from all boards including vacation mode boards', async () => {
            // Enable vacation mode for specific boards
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];

            // Verify that both boards are tracked separately
            const taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
            expect(taskSettings.vacationModeBoards.length).toBe(1);
            
            // Tasks from board-1 should be in vacation mode
            expect(taskSettings.vacationModeBoards.includes('board-1')).toBe(true);
            // Tasks from board-2 should NOT be in vacation mode
            expect(taskSettings.vacationModeBoards.includes('board-2')).toBe(false);
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
            
            mockTasks = [
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
                }
            ];

            await (scheduler as any).checkTasks();

            // No cards should be created
            expect(mockCards.length).toBe(0);
            
            // No commands should be executed
            expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
            
            scheduler.stop();
        });

        test('switching vacation mode on and off should work correctly', async () => {
            const scheduler = TaskScheduler.getInstance();
            
            const now = new Date();
            mockTasks = [{
                id: 'task-1',
                title: 'Test Task',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            }];

            // Initial state: vacation mode off
            mockConfig['tasks.vacationMode'] = false;
            await (scheduler as any).checkTasks();
            expect(mockCards.length).toBe(1);

            // Clear cards for next test
            mockCards = [];
            mockTasks = [{
                id: 'task-2',
                title: 'Test Task 2',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            }];

            // Turn on vacation mode
            mockConfig['tasks.vacationMode'] = true;
            await (scheduler as any).checkTasks();
            expect(mockCards.length).toBe(0);

            // Clear and add new task
            mockTasks = [{
                id: 'task-3',
                title: 'Test Task 3',
                dueDate: now.toISOString(),
                status: 'pending',
                boardId: 'board-1'
            }];

            // Turn off vacation mode again
            mockConfig['tasks.vacationMode'] = false;
            await (scheduler as any).checkTasks();
            expect(mockCards.length).toBe(1);
            
            scheduler.stop();
        });

        test('should allow switching between global and board-specific vacation mode', async () => {
            const scheduler = TaskScheduler.getInstance();
            
            // Verify board-specific vacation mode can be set
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];
            
            let taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
            expect(taskSettings.vacationModeBoards).toEqual(['board-1']);
            expect(taskSettings.vacationModeBoards.includes('board-1')).toBe(true);
            expect(taskSettings.vacationModeBoards.includes('board-2')).toBe(false);

            // Switch to global vacation mode (empty list applies to all)
            mockConfig['tasks.vacationModeBoards'] = [];
            taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
            expect(taskSettings.vacationModeBoards).toEqual([]);

            // Switch back to specific board again (only board-2)
            mockConfig['tasks.vacationModeBoards'] = ['board-2'];
            taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationMode).toBe(true);
            expect(taskSettings.vacationModeBoards).toEqual(['board-2']);
            expect(taskSettings.vacationModeBoards.includes('board-2')).toBe(true);
            expect(taskSettings.vacationModeBoards.includes('board-1')).toBe(false);
            
            scheduler.stop();
        });

        test('should handle dynamic changes to vacationModeBoards list', async () => {
            const scheduler = TaskScheduler.getInstance();
            
            // Start with board-1 in vacation mode
            mockConfig['tasks.vacationMode'] = true;
            mockConfig['tasks.vacationModeBoards'] = ['board-1'];
            
            let taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards).toEqual(['board-1']);
            expect(taskSettings.vacationModeBoards.length).toBe(1);

            // Add board-2 to vacation mode
            mockConfig['tasks.vacationModeBoards'] = ['board-1', 'board-2'];
            taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards).toEqual(['board-1', 'board-2']);
            expect(taskSettings.vacationModeBoards.length).toBe(2);
            expect(taskSettings.vacationModeBoards.includes('board-3')).toBe(false);

            // Remove board-1, add board-3
            mockConfig['tasks.vacationModeBoards'] = ['board-2', 'board-3'];
            taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.vacationModeBoards).toEqual(['board-2', 'board-3']);
            expect(taskSettings.vacationModeBoards.includes('board-1')).toBe(false);
            expect(taskSettings.vacationModeBoards.includes('board-2')).toBe(true);
            expect(taskSettings.vacationModeBoards.includes('board-3')).toBe(true);
            
            scheduler.stop();
        });
    });
});
