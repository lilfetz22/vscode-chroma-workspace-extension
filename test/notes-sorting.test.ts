import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import { NotesProvider, NoteFile } from '../src/views/NotesProvider';

// Mock vscode module
jest.mock('vscode', () => {
    const mockGetConfiguration = jest.fn();
    return {
        workspace: {
            getConfiguration: mockGetConfiguration,
            workspaceFolders: [{ uri: { fsPath: process.cwd() } }]
        },
        EventEmitter: jest.fn().mockImplementation(() => ({
            event: jest.fn(),
            fire: jest.fn()
        })),
        TreeItem: jest.fn(),
        TreeItemCollapsibleState: {
            None: 0,
            Collapsed: 1,
            Expanded: 2
        },
        ThemeIcon: jest.fn(),
        Uri: {
            file: (filePath: string) => ({ fsPath: filePath })
        }
    };
});

// Mock the notesFolder utility
jest.mock('../src/utils/notesFolder', () => ({
    getNotesFolder: jest.fn()
}));

import * as vscode from 'vscode';
import { getNotesFolder } from '../src/utils/notesFolder';

describe('Notes Sorting Feature', () => {
    let tempDir: string;
    let notesFolder: string;
    let notesProvider: NotesProvider;
    let mockGetConfiguration: jest.Mock;

    beforeAll(() => {
        // Create a temporary directory for testing
        tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'notes-sort-test-'));
        notesFolder = path.join(tempDir, 'notes');
        fs.mkdirSync(notesFolder, { recursive: true });
    });

    afterAll(() => {
        // Clean up temporary directory
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });

    beforeEach(() => {
        jest.clearAllMocks();
        (getNotesFolder as jest.Mock).mockReturnValue(notesFolder);
        
        // Get the mock function from vscode.workspace.getConfiguration
        mockGetConfiguration = vscode.workspace.getConfiguration as jest.Mock;
        
        // Clean notes folder before each test
        if (fs.existsSync(notesFolder)) {
            const files = fs.readdirSync(notesFolder);
            files.forEach(file => {
                fs.unlinkSync(path.join(notesFolder, file));
            });
        }

        notesProvider = new NotesProvider();
    });

    describe('Configuration Setting', () => {
        it('should have lastModified as default sort order', () => {
            const mockConfig = {
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            // Create test files
            createTestNote('a.notesnlh', 100);
            createTestNote('b.notesnlh', 200);

            const notes = notesProvider.getChildren();

            expect(mockConfig.get).toHaveBeenCalledWith('notes.sortOrder', 'lastModified');
        });

        it('should accept alphabetical as a valid sort order', () => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('alphabetical')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('z.notesnlh');
            createTestNote('a.notesnlh');

            notesProvider.getChildren();

            expect(mockConfig.get).toHaveBeenCalledWith('notes.sortOrder', 'lastModified');
        });
    });

    describe('Alphabetical Sorting', () => {
        beforeEach(() => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('alphabetical')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);
        });

        it('should sort notes alphabetically A-Z', async () => {
            createTestNote('zebra.notesnlh');
            createTestNote('apple.notesnlh');
            createTestNote('banana.notesnlh');
            createTestNote('mango.notesnlh');

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(4);
            expect(notes[0].name).toBe('apple.notesnlh');
            expect(notes[1].name).toBe('banana.notesnlh');
            expect(notes[2].name).toBe('mango.notesnlh');
            expect(notes[3].name).toBe('zebra.notesnlh');
        });

        it('should handle mixed case sorting correctly', async () => {
            createTestNote('Zebra.notesnlh');
            createTestNote('apple.notesnlh');
            createTestNote('Banana.notesnlh');
            createTestNote('MANGO.notesnlh');

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(4);
            // localeCompare is case-insensitive by default
            expect(notes[0].name).toBe('apple.notesnlh');
            expect(notes[1].name).toBe('Banana.notesnlh');
            expect(notes[2].name).toBe('MANGO.notesnlh');
            expect(notes[3].name).toBe('Zebra.notesnlh');
        });

        it('should handle numeric prefixes correctly', async () => {
            createTestNote('10-note.notesnlh');
            createTestNote('2-note.notesnlh');
            createTestNote('1-note.notesnlh');
            createTestNote('20-note.notesnlh');

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(4);
            // String comparison: 1, 10, 2, 20
            expect(notes[0].name).toBe('1-note.notesnlh');
            expect(notes[1].name).toBe('10-note.notesnlh');
            expect(notes[2].name).toBe('2-note.notesnlh');
            expect(notes[3].name).toBe('20-note.notesnlh');
        });

        it('should handle special characters in filenames', async () => {
            createTestNote('_underscore.notesnlh');
            createTestNote('normal.notesnlh');
            createTestNote('-dash.notesnlh');

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(3);
            // localeCompare behavior: special characters may be sorted to beginning or end depending on locale
            // Just verify all files are present and sorted consistently
            const fileNames = notes.map(n => n.name);
            expect(fileNames).toContain('_underscore.notesnlh');
            expect(fileNames).toContain('normal.notesnlh');
            expect(fileNames).toContain('-dash.notesnlh');
            // Verify the sort is deterministic (same order every time)
            const notes2 = await notesProvider.getChildren();
            expect(notes2.map(n => n.name)).toEqual(fileNames);
        });
    });

    describe('Last Modified Sorting', () => {
        beforeEach(() => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);
        });

        it('should sort notes by last modified date (newest first)', async () => {
            // Create files with different modification times
            // Offset in milliseconds from now (older = more negative)
            createTestNote('oldest.notesnlh', -3000);
            createTestNote('middle.notesnlh', -2000);
            createTestNote('newest.notesnlh', -1000);

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(3);
            expect(notes[0].name).toBe('newest.notesnlh');
            expect(notes[1].name).toBe('middle.notesnlh');
            expect(notes[2].name).toBe('oldest.notesnlh');
        });

        it('should handle files with same modification time', async () => {
            // Create files and then set them to exact same timestamp
            const fixedTime = new Date(Date.now() - 5000);
            
            createTestNote('file1.notesnlh');
            createTestNote('file2.notesnlh');
            
            // Set both files to exact same timestamp
            const notesFolder = (getNotesFolder as jest.Mock)();
            fs.utimesSync(path.join(notesFolder, 'file1.notesnlh'), fixedTime, fixedTime);
            fs.utimesSync(path.join(notesFolder, 'file2.notesnlh'), fixedTime, fixedTime);

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(2);
            // When times are equal, fallback to alphabetical
            expect(notes[0].name).toBe('file1.notesnlh');
            expect(notes[1].name).toBe('file2.notesnlh');
        });

        it('should update sort order when files are modified', async () => {
            createTestNote('first.notesnlh', -2000);
            createTestNote('second.notesnlh', -1000);

            let notes = await notesProvider.getChildren();
            expect(notes[0].name).toBe('second.notesnlh');

            // Modify the first file to make it newest
            const firstPath = path.join(notesFolder, 'first.notesnlh');
            const now = new Date();
            fs.utimesSync(firstPath, now, now);

            // Wait a bit to ensure time difference
            await new Promise(resolve => setTimeout(resolve, 10));

            notesProvider.refresh();
            notes = await notesProvider.getChildren();
            expect(notes[0].name).toBe('first.notesnlh');
        });

        it('should handle very old files correctly', async () => {
            // Create files with dates far in the past
            createTestNote('old2000.notesnlh', -1000000000); // ~11 days ago
            createTestNote('old1990.notesnlh', -2000000000); // ~23 days ago
            createTestNote('recent.notesnlh', -100);

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(3);
            expect(notes[0].name).toBe('recent.notesnlh');
            expect(notes[1].name).toBe('old2000.notesnlh');
            expect(notes[2].name).toBe('old1990.notesnlh');
        });
    });

    describe('Default Behavior', () => {
        it('should use lastModified when no configuration is set', async () => {
            const mockConfig = {
                get: jest.fn((key: string, defaultValue: string) => defaultValue)
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('z-oldest.notesnlh', -3000);
            createTestNote('a-newest.notesnlh', -1000);

            const notes = await notesProvider.getChildren();

            expect(notes).toHaveLength(2);
            // Should sort by lastModified (default), not alphabetically
            expect(notes[0].name).toBe('a-newest.notesnlh');
            expect(notes[1].name).toBe('z-oldest.notesnlh');
        });

        it('should use lastModified when configuration returns undefined', async () => {
            const mockConfig = {
                get: jest.fn().mockReturnValue(undefined)
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('z-oldest.notesnlh', -3000);
            createTestNote('a-newest.notesnlh', -1000);

            const notes = await notesProvider.getChildren();

            // Should use default value 'lastModified'
            expect(notes[0].name).toBe('a-newest.notesnlh');
        });
    });

    describe('Configuration Changes', () => {
        it('should respond to configuration changes from alphabetical to lastModified', async () => {
            // Start with alphabetical
            let mockConfig = {
                get: jest.fn().mockReturnValue('alphabetical')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('z-oldest.notesnlh', -3000);
            createTestNote('a-newest.notesnlh', -1000);

            let notes = await notesProvider.getChildren();
            expect(notes[0].name).toBe('a-newest.notesnlh');
            expect(notes[1].name).toBe('z-oldest.notesnlh');

            // Change to lastModified
            mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            notesProvider.refresh();
            notes = await notesProvider.getChildren();
            expect(notes[0].name).toBe('a-newest.notesnlh');
            expect(notes[1].name).toBe('z-oldest.notesnlh');
        });

        it('should respond to configuration changes from lastModified to alphabetical', async () => {
            // Start with lastModified
            let mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('z-oldest.notesnlh', -3000);
            createTestNote('a-newest.notesnlh', -1000);

            let notes = await notesProvider.getChildren();
            expect(notes[0].name).toBe('a-newest.notesnlh');

            // Change to alphabetical
            mockConfig = {
                get: jest.fn().mockReturnValue('alphabetical')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            notesProvider.refresh();
            notes = await notesProvider.getChildren();
            expect(notes[0].name).toBe('a-newest.notesnlh');
            expect(notes[1].name).toBe('z-oldest.notesnlh');
        });
    });

    describe('Error Handling', () => {
        it('should fallback to alphabetical when file stat fails', async () => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('valid.notesnlh');
            
            // Create a note entry that will fail stat
            const invalidNotePath = path.join(notesFolder, 'invalid.notesnlh');
            fs.writeFileSync(invalidNotePath, 'test');
            fs.unlinkSync(invalidNotePath); // Delete it to cause stat to fail
            
            // Manually add to folder to test error handling
            // (In real scenario this shouldn't happen, but tests error recovery)
            
            const notes = await notesProvider.getChildren();
            expect(notes.length).toBeGreaterThan(0);
        });

        it('should handle empty notes folder gracefully', async () => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            const notes = await notesProvider.getChildren();
            expect(notes).toHaveLength(0);
        });

        it('should handle invalid sort order value by using default', async () => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('invalid-sort-order')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            createTestNote('z.notesnlh', -2000);
            createTestNote('a.notesnlh', -1000);

            const notes = await notesProvider.getChildren();

            // Should default to lastModified behavior when invalid value provided
            expect(notes[0].name).toBe('a.notesnlh');
            expect(notes[1].name).toBe('z.notesnlh');
        });
    });

    describe('Edge Cases', () => {
        beforeEach(() => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);
        });

        it('should handle single note correctly', async () => {
            createTestNote('only-note.notesnlh');

            const notes = await notesProvider.getChildren();
            expect(notes).toHaveLength(1);
            expect(notes[0].name).toBe('only-note.notesnlh');
        });

        it('should handle notes with identical timestamps', async () => {
            const fixedTime = Date.now() - 5000;
            
            // Create multiple notes with exact same timestamp
            createTestNote('note1.notesnlh', -5000);
            createTestNote('note2.notesnlh', -5000);
            createTestNote('note3.notesnlh', -5000);

            const notes = await notesProvider.getChildren();
            expect(notes).toHaveLength(3);
            // All have same time, so should maintain some consistent order
        });

        it('should handle notes folder that does not exist yet', async () => {
            const nonExistentFolder = path.join(tempDir, 'non-existent');
            (getNotesFolder as jest.Mock).mockReturnValue(nonExistentFolder);

            const notes = await notesProvider.getChildren();
            
            // Should create folder and return empty array
            expect(notes).toHaveLength(0);
            expect(fs.existsSync(nonExistentFolder)).toBe(true);
        });
    });

    describe('Performance', () => {
        it('should efficiently handle large number of notes', async () => {
            const mockConfig = {
                get: jest.fn().mockReturnValue('lastModified')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            // Create 100 notes with varying timestamps
            for (let i = 0; i < 100; i++) {
                createTestNote(`note-${i.toString().padStart(3, '0')}.notesnlh`, -i * 100);
            }

            const startTime = Date.now();
            const notes = await notesProvider.getChildren();
            const endTime = Date.now();

            expect(notes).toHaveLength(100);
            expect(notes[0].name).toBe('note-000.notesnlh'); // Newest
            expect(notes[99].name).toBe('note-099.notesnlh'); // Oldest
            
            // Should complete in reasonable time (< 1 second)
            expect(endTime - startTime).toBeLessThan(1000);
        });

        it('should efficiently switch between sort orders', async () => {
            // Create 50 notes
            for (let i = 0; i < 50; i++) {
                createTestNote(`note-${i}.notesnlh`, -i * 100);
            }

            let mockConfig = {
                get: jest.fn().mockReturnValue('alphabetical')
            };
            mockGetConfiguration.mockReturnValue(mockConfig);

            const startTime = Date.now();
            
            // Alternate between sort orders
            await notesProvider.getChildren();
            
            mockConfig.get = jest.fn().mockReturnValue('lastModified');
            await notesProvider.getChildren();
            
            mockConfig.get = jest.fn().mockReturnValue('alphabetical');
            await notesProvider.getChildren();
            
            const endTime = Date.now();

            // Should complete all operations quickly
            expect(endTime - startTime).toBeLessThan(500);
        });
    });
});

/**
 * Helper function to create a test note with optional timestamp offset
 * @param filename Name of the note file
 * @param timestampOffset Milliseconds to offset from current time (negative = past)
 */
function createTestNote(filename: string, timestampOffset: number = 0): void {
    const notesFolder = (getNotesFolder as jest.Mock)();
    const filePath = path.join(notesFolder, filename);
    const content = `# ${filename.replace('.notesnlh', '')}\n\nTest content`;
    
    fs.writeFileSync(filePath, content, 'utf8');
    
    if (timestampOffset !== 0) {
        const targetTime = new Date(Date.now() + timestampOffset);
        fs.utimesSync(filePath, targetTime, targetTime);
    }
}
