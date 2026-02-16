import * as vscode from 'vscode';

// Mock child_process module
jest.mock('child_process', () => ({
    execFile: jest.fn(),
}));

// Import after mocking
import { GitService } from '../src/services/gitService';
import * as childProcess from 'child_process';

jest.mock('fs');
jest.mock('path');
jest.mock('vscode');

// Mock getDebugLogger
jest.mock('../src/logic/DebugLogger', () => ({
    getDebugLogger: () => ({
        log: jest.fn(),
    }),
}));

const fs = require('fs');
const path = require('path');

// Get the mocked execFile
const mockExecFile = childProcess.execFile as jest.MockedFunction<any>;

describe('GitService', () => {
    let gitService: GitService;
    let mockConfig: { [key: string]: any } = {};

    beforeEach(() => {
        jest.clearAllMocks();

        // Configure mockExecFile to return promises
        mockExecFile.mockResolvedValue({ stdout: '', stderr: '' });

        // Mock configuration
        mockConfig = {
            'enableGitSync': true,
            'autoPushOnChanges': true,
        };

        const mockConfiguration = {
            get: jest.fn((key: string, defaultValue?: any) => {
                return mockConfig[key] !== undefined ? mockConfig[key] : defaultValue;
            }),
        };

        (vscode.workspace.getConfiguration as jest.Mock).mockReturnValue(mockConfiguration);

        // Mock fs.existsSync
        fs.existsSync.mockReturnValue(true);

        // Mock path functions
        path.dirname.mockImplementation((p: string) => {
            const parts = p.split('/');
            parts.pop();
            return parts.join('/') || '/';
        });
        path.join.mockImplementation((...args: string[]) => args.join('/'));
        path.relative.mockImplementation((from: string, to: string) => {
            if (to.startsWith(from)) {
                return to.substring(from.length + 1);
            }
            return to;
        });
        path.parse.mockImplementation((p: string) => ({
            root: '/',
            dir: path.dirname(p),
            base: p.split('/').pop() || '',
            ext: '',
            name: '',
        }));

        gitService = new GitService('/test/path/.chroma/chroma.db');
    });

    describe('Git Repository Detection', () => {
        it('should find git repository in parent directory', async () => {
            fs.existsSync.mockImplementation((p: string) => {
                return p === '/test/.git';
            });

            const result = await (gitService as any).findGitRepository();
            expect(result).toBe('/test');
        });

        it('should return null when no git repository found', async () => {
            fs.existsSync.mockReturnValue(false);

            const result = await (gitService as any).findGitRepository();
            expect(result).toBeNull();
        });

        it('should cache git repository root (tri-state: undefined/string/null)', async () => {
            fs.existsSync.mockReturnValue(false);

            // Initially undefined (not checked yet)
            expect((gitService as any).gitRepositoryRoot).toBeUndefined();

            // After first call, should be null (checked and not found)
            await (gitService as any).getGitRepositoryRoot();
            expect((gitService as any).gitRepositoryRoot).toBeNull();

            // Subsequent calls should not search again
            fs.existsSync.mockClear();
            await (gitService as any).getGitRepositoryRoot();
            expect(fs.existsSync).not.toHaveBeenCalled();
        });
    });

    describe('Shell Injection Prevention', () => {
        it('should use execFile with array arguments (not shell commands)', async () => {
            fs.existsSync.mockImplementation((p: string) => p === '/test/.git');

            await (gitService as any).isGitInstalled();

            // Verify execFile was called
            expect(mockExecFile).toHaveBeenCalled();
            
            // Verify arguments are passed as an array
            const firstCall = mockExecFile.mock.calls[0];
            expect(firstCall[0]).toBe('git');
            expect(Array.isArray(firstCall[1])).toBe(true);
        });
    });

    describe('Stash Improvements', () => {
        it('should include --include-untracked flag when stashing', async () => {
            fs.existsSync.mockImplementation((p: string) => p === '/test/.git');
            mockExecFile.mockResolvedValue({ stdout: '', stderr: '' });

            await (gitService as any).gitStash();

            // Find the stash call
            const stashCall = mockExecFile.mock.calls.find((call: any) => 
                call[1] && call[1][0] === 'stash'
            );

            expect(stashCall).toBeDefined();
            expect(stashCall[1]).toContain('--include-untracked');
        });
    });

    describe('Scoped Git Add', () => {
        it('should stage only database directory, not entire repository', async () => {
            fs.existsSync.mockImplementation((p: string) => p === '/test/.git');
            path.relative.mockReturnValue('.chroma');
            mockExecFile.mockResolvedValue({ stdout: '', stderr: '' });

            await (gitService as any).gitAdd();

            // Find the add call
            const addCall = mockExecFile.mock.calls.find((call: any) => 
                call[1] && call[1][0] === 'add'
            );

            expect(addCall).toBeDefined();
            expect(addCall[1]).toEqual(['add', '.chroma']);
        });
    });

    describe('Structured Commit Return', () => {
        it('should return hadChanges flag (not rely on string matching)', async () => {
            fs.existsSync.mockImplementation((p: string) => p === '/test/.git');
            mockExecFile
                .mockResolvedValueOnce({ stdout: 'M file.txt', stderr: '' })
                .mockResolvedValueOnce({ stdout: '', stderr: '' });

            const result = await (gitService as any).gitCommit();

            expect(result).toHaveProperty('hadChanges');
            expect(typeof result.hadChanges).toBe('boolean');
            expect(result.hadChanges).toBe(true);
        });

        it('should return hadChanges=false when no changes', async () => {
            fs.existsSync.mockImplementation((p: string) => p === '/test/.git');
            mockExecFile.mockResolvedValueOnce({ stdout: '', stderr: '' });

            const result = await (gitService as any).gitCommit();

            expect(result.hadChanges).toBe(false);
        });
    });

    describe('Configuration', () => {
        it('should skip sync when git sync is disabled', async () => {
            mockConfig['enableGitSync'] = false;

            const result = await gitService.sync();

            expect(result.success).toBe(false);
            expect(result.message).toContain('not enabled');
        });

        it('should not start watching when git sync is disabled', async () => {
            mockConfig['enableGitSync'] = false;

            const spy = jest.spyOn(vscode.workspace, 'createFileSystemWatcher');
            await gitService.startWatching();

            expect(spy).not.toHaveBeenCalled();
        });

        it('should not start watching when auto-push is disabled', async () => {
            mockConfig['autoPushOnChanges'] = false;

            const spy = jest.spyOn(vscode.workspace, 'createFileSystemWatcher');
            await gitService.startWatching();

            expect(spy).not.toHaveBeenCalled();
        });
    });
});
