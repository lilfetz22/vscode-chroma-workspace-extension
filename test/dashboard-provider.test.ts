import * as vscode from 'vscode';
import { DashboardProvider } from '../src/views/DashboardProvider';
import * as database from '../src/database';
import * as fs from 'fs';
import * as notesFolder from '../src/utils/notesFolder';

jest.mock('vscode');
jest.mock('../src/database');
jest.mock('fs');
jest.mock('../src/utils/notesFolder');

describe('DashboardProvider', () => {
    let mockContext: vscode.ExtensionContext;
    let mockWebview: any;
    let mockWebviewPanel: any;

    beforeEach(() => {
        // Reset all mocks
        jest.clearAllMocks();

        // Reset the static currentPanel by accessing the private property
        // This is a workaround for testing static classes
        (DashboardProvider as any).currentPanel = undefined;

        // Setup mock webview
        mockWebview = {
            html: '',
            postMessage: jest.fn(),
            onDidReceiveMessage: jest.fn((callback) => {
                // Store the callback so we can invoke it in tests
                mockWebview.messageHandler = callback;
                return { dispose: jest.fn() };
            }),
            cspSource: 'mock-csp-source',
            messageHandler: null as any
        };

        // Setup mock webview panel
        mockWebviewPanel = {
            webview: mockWebview,
            reveal: jest.fn(),
            onDidDispose: jest.fn((callback) => {
                return { dispose: jest.fn() };
            })
        };

        // Mock vscode.window.createWebviewPanel
        (vscode.window.createWebviewPanel as jest.Mock).mockReturnValue(mockWebviewPanel);

        // Setup mock extension context
        mockContext = {
            subscriptions: [],
            extensionUri: vscode.Uri.file('/mock/extension/path')
        } as any;

        // Mock vscode.Uri.joinPath
        (vscode.Uri.joinPath as jest.Mock).mockReturnValue(vscode.Uri.file('/mock/media'));

        // Mock database functions to return empty data
        (database.getAllBoards as jest.Mock).mockReturnValue([]);
        (database.getAllTags as jest.Mock).mockReturnValue([]);
        (database.prepare as jest.Mock).mockReturnValue({
            all: jest.fn().mockReturnValue([])
        });

        // Mock file system for notes
        (notesFolder.getNotesFolder as jest.Mock).mockReturnValue('/mock/notes');
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readdirSync as jest.Mock).mockReturnValue([]);
        (fs.statSync as jest.Mock).mockReturnValue({ mtime: new Date() });
    });

    describe('show', () => {
        it('should create a new webview panel when called for the first time', () => {
            DashboardProvider.show(mockContext);

            expect(vscode.window.createWebviewPanel).toHaveBeenCalledWith(
                'chromaDashboard',
                'Chroma Workspace Dashboard',
                vscode.ViewColumn.One,
                expect.objectContaining({
                    enableScripts: true,
                    retainContextWhenHidden: true
                })
            );
        });

        it('should set HTML content on the webview', () => {
            DashboardProvider.show(mockContext);

            expect(mockWebview.html).toBeTruthy();
            expect(mockWebview.html).toContain('Chroma Workspace Dashboard');
        });

        it('should setup message handler for webview', () => {
            DashboardProvider.show(mockContext);

            expect(mockWebview.onDidReceiveMessage).toHaveBeenCalled();
        });

        it('should reveal existing panel instead of creating new one', () => {
            // First call creates the panel
            DashboardProvider.show(mockContext);
            expect(vscode.window.createWebviewPanel).toHaveBeenCalledTimes(1);

            // Second call should reveal instead of creating
            DashboardProvider.show(mockContext);
            expect(vscode.window.createWebviewPanel).toHaveBeenCalledTimes(1);
            expect(mockWebviewPanel.reveal).toHaveBeenCalledWith(vscode.ViewColumn.One);
        });
    });

    describe('refresh', () => {
        it('should send refresh message to existing panel', () => {
            DashboardProvider.show(mockContext);
            mockWebview.postMessage.mockClear();

            DashboardProvider.refresh();

            expect(mockWebview.postMessage).toHaveBeenCalledWith({ type: 'refresh' });
        });

        it('should do nothing if panel does not exist', () => {
            // Don't call show(), so panel is undefined
            DashboardProvider.refresh();

            // Should not throw and postMessage should not be called
            expect(mockWebview.postMessage).not.toHaveBeenCalled();
        });
    });

    describe('data handling', () => {
        it('should load data with boards, tasks, and tags', () => {
            const mockBoards = [
                { id: '1', name: 'Test Board' }
            ];
            const mockTasks = [
                { id: '1', title: 'Test Task', status: 'pending', dueDate: new Date().toISOString() }
            ];
            const mockTags = [
                { id: '1', name: 'Test Tag', color: '#ff0000' }
            ];

            (database.getAllBoards as jest.Mock).mockReturnValue(mockBoards);
            (database.getAllTags as jest.Mock).mockReturnValue(mockTags);
            (database.prepare as jest.Mock).mockReturnValue({
                all: jest.fn().mockReturnValue(mockTasks)
            });
            (database.getColumnsByBoardId as jest.Mock).mockReturnValue([]);

            DashboardProvider.show(mockContext);

            // The show method should have set up the panel
            expect(vscode.window.createWebviewPanel).toHaveBeenCalled();
            expect(mockWebview.html).toContain('Chroma Workspace Dashboard');
        });

        it('should handle getData message and send enriched data', async () => {
            // Mock the SettingsService module for this test
            const SettingsService = require('../src/logic/SettingsService');
            const mockGetSettingsService = jest.spyOn(SettingsService, 'getSettingsService').mockReturnValue({
                getKanbanSettings: () => ({ completionColumn: 'Done' })
            });
            
            const mockBoards = [
                { id: 'board1', name: 'Test Board' }
            ];
            const mockColumns = [
                { id: 'col1', board_id: 'board1', name: 'Column 1' }
            ];
            const mockCards = [
                { id: 'card1', column_id: 'col1', title: 'Test Card' }
            ];
            const mockTasks = [
                { id: 'task1', title: 'Test Task', status: 'pending', dueDate: new Date().toISOString() }
            ];
            const mockTags = [
                { id: 'tag1', name: 'Test Tag', color: '#ff0000' }
            ];

            (database.getAllBoards as jest.Mock).mockReturnValue(mockBoards);
            (database.getAllTags as jest.Mock).mockReturnValue(mockTags);
            
            // Mock prepare to return different results based on the query
            (database.prepare as jest.Mock).mockImplementation((query: string) => {
                if (query.includes('SELECT * FROM columns')) {
                    return { all: jest.fn().mockReturnValue(mockColumns) };
                } else if (query.includes('SELECT * FROM cards')) {
                    return { all: jest.fn().mockReturnValue(mockCards) };
                } else if (query.includes('SELECT ct.card_id')) {
                    return { all: jest.fn().mockReturnValue([]) };
                } else if (query.includes('tasks')) {
                    return { all: jest.fn().mockReturnValue(mockTasks) };
                }
                return { all: jest.fn().mockReturnValue([]) };
            });
            
            (fs.readdirSync as jest.Mock).mockReturnValue(['note1.notesnlh']);

            DashboardProvider.show(mockContext);

            // Clear the postMessage mock to only track the getData response
            mockWebview.postMessage.mockClear();

            // Simulate receiving a getData message
            await mockWebview.messageHandler({ type: 'getData' });

            // Verify that postMessage was called with enriched data
            expect(mockWebview.postMessage).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'data',
                    tasks: mockTasks,
                    tags: mockTags,
                    notes: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'note1.notesnlh'
                        })
                    ]),
                    boards: expect.arrayContaining([
                        expect.objectContaining({
                            id: 'board1',
                            name: 'Test Board',
                            columns: expect.arrayContaining([
                                expect.objectContaining({
                                    id: 'col1',
                                    name: 'Column 1'
                                })
                            ])
                        })
                    ]),
                    settings: expect.objectContaining({
                        completionColumn: expect.any(String)
                    })
                })
            );
            
            // Restore the mock
            mockGetSettingsService.mockRestore();
        });

        it('should handle openNote message and open the note file', async () => {
            DashboardProvider.show(mockContext);

            const testPath = '/mock/notes/test.notesnlh';
            await mockWebview.messageHandler({ type: 'openNote', path: testPath });

            expect(vscode.window.showTextDocument).toHaveBeenCalledWith(
                expect.objectContaining({ fsPath: testPath })
            );
        });

        it('should handle executeCommand message with whitelisted commands', async () => {
            DashboardProvider.show(mockContext);

            await mockWebview.messageHandler({ 
                type: 'executeCommand', 
                command: 'chroma.addBoard',
                args: undefined
            });

            expect(vscode.commands.executeCommand).toHaveBeenCalledWith('chroma.addBoard', undefined);
        });

        it('should reject non-whitelisted commands', async () => {
            const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
            
            DashboardProvider.show(mockContext);

            await mockWebview.messageHandler({ 
                type: 'executeCommand', 
                command: 'dangerous.command',
                args: undefined
            });

            expect(vscode.commands.executeCommand).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringContaining('non-whitelisted command')
            );

            consoleWarnSpy.mockRestore();
        });
    });
});
