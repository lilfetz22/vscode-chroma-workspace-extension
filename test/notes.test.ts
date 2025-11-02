import { createNote, deleteNote, findOrCreateNoteByPath, getNoteByFilePath, initDatabase, getDb, closeDb } from '../src/database';
import { Note } from '../src/models/Note';

describe('Note Functions', () => {
    let db;
    beforeAll(() => {
        initDatabase(true);
        db = getDb();
    });

    afterAll(() => {
        closeDb();
    });

    beforeEach(() => {
        db.prepare('DELETE FROM notes').run();
    });

    it('should create a new note', () => {
        const note: Partial<Note> = {
            id: 'test-note',
            title: 'Test Note',
            content: 'This is a test note.',
            file_path: '/path/to/test-note.notesnlh',
        };
        createNote(note);
        const retrievedNote = getNoteByFilePath('/path/to/test-note.notesnlh');
        expect(retrievedNote).toBeDefined();
        expect(retrievedNote.title).toBe('Test Note');
    });

    it('should find or create a note by path', () => {
        const note = findOrCreateNoteByPath('/path/to/new-note.notesnlh');
        expect(note).toBeDefined();
        expect(note.title).toBe('new-note');
    });

    it('should delete a note', () => {
        const note: Partial<Note> = {
            id: 'test-note-2',
            title: 'Test Note 2',
            content: 'This is another test note.',
            file_path: '/path/to/test-note-2.notesnlh',
        };
        createNote(note);
        deleteNote('test-note-2');
        const retrievedNote = getNoteByFilePath('/path/to/test-note-2.notesnlh');
        expect(retrievedNote).toBeUndefined();
    });
});
