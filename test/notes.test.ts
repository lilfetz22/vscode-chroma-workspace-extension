import { 
    initTestDatabase, 
    closeTestDb, 
    createNote, 
    getNoteByPath, 
    deleteNote 
} from '../src/test-database';
import { Note } from '../src/models/Note';

describe('Note Functions', () => {
    let db: any;

    beforeAll(async () => {
        db = await initTestDatabase();
    });

    afterAll(() => {
        closeTestDb();
    });

    beforeEach(() => {
        db.exec('DELETE FROM notes');
    });

    it('should create a new note', () => {
        const note = createNote(db, {
            id: 'test-note',
            title: 'Test Note',
            content: 'This is a test note.',
            file_path: '/path/to/test-note.notesnlh',
            nlh_enabled: true
        });
        
        expect(note).toBeDefined();
        expect(note.title).toBe('Test Note');
        
        const retrievedNote = getNoteByPath(db, '/path/to/test-note.notesnlh');
        expect(retrievedNote).toBeDefined();
        expect(retrievedNote?.title).toBe('Test Note');
    });

    it('should find or create a note by path', () => {
        let note = getNoteByPath(db, '/path/to/new-note.notesnlh');
        
        if (!note) {
            note = createNote(db, {
                title: 'new-note',
                content: '',
                file_path: '/path/to/new-note.notesnlh',
                nlh_enabled: true
            });
        }
        
        expect(note).toBeDefined();
        expect(note.file_path).toBe('/path/to/new-note.notesnlh');
    });

    it('should delete a note', () => {
        createNote(db, {
            id: 'test-note-2',
            title: 'Test Note 2',
            content: 'This is another test note.',
            file_path: '/path/to/test-note-2.notesnlh',
            nlh_enabled: true
        });
        
        deleteNote(db, 'test-note-2');
        
        const retrievedNote = getNoteByPath(db, '/path/to/test-note-2.notesnlh');
        expect(retrievedNote).toBeUndefined();
    });
});
