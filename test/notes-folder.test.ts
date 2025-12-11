import * as vscode from 'vscode';
import * as path from 'path';
import { getNotesFolder } from '../src/utils/notesFolder';

jest.mock('vscode');

describe('notesFolder utility', () => {
    let mockWorkspaceFolders: vscode.WorkspaceFolder[];
    let mockGetConfiguration: jest.Mock;

    beforeEach(() => {
        // Reset mocks before each test
        jest.clearAllMocks();

        // Set up default workspace folders
        mockWorkspaceFolders = [
            {
                uri: { fsPath: '/home/user/project' } as any,
                name: 'project',
                index: 0
            }
        ];

        mockGetConfiguration = jest.fn(() => ({
            get: jest.fn((key: string, defaultValue: string) => {
                if (key === 'database.path') {
                    return defaultValue;
                }
                return null;
            })
        }));

        (vscode.workspace.getConfiguration as jest.Mock) = mockGetConfiguration;
        (vscode.workspace.workspaceFolders as any) = mockWorkspaceFolders;
    });

    describe('basic functionality', () => {
        it('should return null when no workspace folders are open', () => {
            (vscode.workspace.workspaceFolders as any) = undefined;

            const result = getNotesFolder();

            expect(result).toBeNull();
        });

        it('should return null when workspace folders array is empty', () => {
            (vscode.workspace.workspaceFolders as any) = [];

            const result = getNotesFolder();

            expect(result).toBeNull();
        });

        it('should return notes folder with default database path', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/home/user/project', '.chroma', 'notes'));
        });

        it('should use first workspace folder when multiple are open', () => {
            mockWorkspaceFolders = [
                {
                    uri: { fsPath: '/home/user/project1' } as any,
                    name: 'project1',
                    index: 0
                },
                {
                    uri: { fsPath: '/home/user/project2' } as any,
                    name: 'project2',
                    index: 1
                }
            ];
            (vscode.workspace.workspaceFolders as any) = mockWorkspaceFolders;

            const result = getNotesFolder();

            // Path separator might be \ on Windows or / on Unix
            expect(result).toMatch(/project1.*notes/);
        });
    });

    describe('relative database path handling', () => {
        it('should resolve relative path with default database path', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => '.chroma/chroma.db')
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/home/user/project', '.chroma', 'notes'));
        });

        it('should resolve custom relative database path', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return 'data/app.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/home/user/project', 'data', 'notes'));
        });

        it('should handle relative path with multiple subdirectories', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return 'config/db/deep/chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/home/user/project', 'config/db/deep', 'notes'));
        });

        it('should handle relative path with parent directory reference', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return '../shared/chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/home/user/project', '../shared', 'notes'));
        });
    });

    describe('absolute database path handling', () => {
        it('should use absolute database path as-is', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return '/absolute/path/to/chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/absolute/path/to', 'notes'));
        });

        it('should ignore workspace folder when absolute path is configured', () => {
            mockWorkspaceFolders = [
                {
                    uri: { fsPath: '/home/user/project' } as any,
                    name: 'project',
                    index: 0
                }
            ];
            (vscode.workspace.workspaceFolders as any) = mockWorkspaceFolders;

            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return '/mnt/external/chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).not.toMatch(/project/);
            // Should contain "external" and "notes"
            expect(result).toMatch(/external.*notes|notes.*external/);
        });

        it('should handle Windows absolute paths', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return 'C:\\Users\\username\\data\\chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBeDefined();
            expect(result).toMatch(/notes/);
        });
    });

    describe('configuration retrieval', () => {
        it('should read from chroma configuration', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            getNotesFolder();

            expect(config).toHaveBeenCalledWith('chroma');
        });

        it('should read database.path setting', () => {
            const mockGet = jest.fn((key: string, defaultValue: string) => defaultValue);
            const config = jest.fn(() => ({
                get: mockGet
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            getNotesFolder();

            expect(mockGet).toHaveBeenCalledWith('database.path', '.chroma/chroma.db');
        });

        it('should use default database path when setting is not configured', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    // Return undefined to simulate unconfigured setting, then return default
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBeDefined();
            expect(result).toMatch(/chroma.*notes|notes/);
        });

        it('should use configured database path when available', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return 'custom/db/path.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join('/home/user/project', 'custom/db', 'notes'));
        });
    });

    describe('notes folder naming', () => {
        it('should always name the notes folder "notes"', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toContain(path.join(path.sep, 'notes'));
        });

        it('should place notes folder in same directory as database', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return 'database/chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();
            const dbDir = path.join('/home/user/project', 'database');

            expect(result).toBe(path.join(dbDir, 'notes'));
        });
    });

    describe('edge cases', () => {
        it('should handle workspace path with trailing slash', () => {
            mockWorkspaceFolders = [
                {
                    uri: { fsPath: '/home/user/project/' } as any,
                    name: 'project',
                    index: 0
                }
            ];
            (vscode.workspace.workspaceFolders as any) = mockWorkspaceFolders;

            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBeDefined();
            expect(result).toContain('notes');
        });

        it('should handle database path with trailing slash', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return '.chroma/';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBeDefined();
            expect(result).toContain('notes');
        });

        it('should handle empty string database path', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return '';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBeDefined();
            expect(result).toContain('notes');
        });

        it('should handle very deeply nested workspace paths', () => {
            const deepPath = '/home/user/very/deep/project/structure/workspace';
            mockWorkspaceFolders = [
                {
                    uri: { fsPath: deepPath } as any,
                    name: 'workspace',
                    index: 0
                }
            ];
            (vscode.workspace.workspaceFolders as any) = mockWorkspaceFolders;

            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBe(path.join(deepPath, '.chroma', 'notes'));
        });

        it('should handle database path with mixed separators', () => {
            const config = jest.fn(() => ({
                get: jest.fn((key: string, defaultValue: string) => {
                    if (key === 'database.path') {
                        return 'db\\data/chroma.db';
                    }
                    return defaultValue;
                })
            }));
            (vscode.workspace.getConfiguration as jest.Mock) = config;

            const result = getNotesFolder();

            expect(result).toBeDefined();
            expect(result).toContain('notes');
        });
    });
});
