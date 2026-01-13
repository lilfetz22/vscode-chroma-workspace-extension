import * as vscode from 'vscode';
import { DashboardProvider } from '../src/views/DashboardProvider';
import * as database from '../src/database';

jest.mock('vscode');
jest.mock('../src/database');

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
                return { dispose: jest.fn() };
            }),
            cspSource: 'mock-csp-source'
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
        (database.getDb as jest.Mock).mockReturnValue({});
        (database.prepare as jest.Mock).mockReturnValue({
            all: jest.fn().mockReturnValue([])
        });
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
    });
});
