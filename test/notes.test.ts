import { expect } from 'chai';
import * as path from 'path';
import { createNote, deleteNote, findOrCreateNoteByPath, getNoteByFilePath, initDatabase } from '../src/database';
import { Note } from '../src/models/Note';

describe('Database: Notes', () => {
    const testNote: Partial<Note> = {
        id: 'test-note-1',
        title: 'Test Note',
        content: 'This is a test note.',
        file_path: '/path/to/test-note.notesnlh',
        nlh_enabled: true,
    };

    before(() => {
        initDatabase();
    });

    after(() => {
        deleteNote(testNote.id as string);
    });

    it('should create a new note in the database', () => {
        createNote(testNote);
        const note = getNoteByFilePath(testNote.file_path as string);
        expect(note).to.not.be.undefined;
        expect(note.title).to.equal(testNote.title);
    });

    it('should find a note by its file path', () => {
        const note = getNoteByFilePath(testNote.file_path as string);
        expect(note).to.not.be.undefined;
        expect(note.id).to.equal(testNote.id);
    });

    it('should find an existing note or create a new one', () => {
        const note = findOrCreateNoteByPath(testNote.file_path as string);
        expect(note).to.not.be.undefined;
        expect(note.id).to.equal(testNote.id);

        const newNotePath = '/path/to/new-note.notesnlh';
        const newNote = findOrCreateNoteByPath(newNotePath);
        expect(newNote).to.not.be.undefined;
        expect(newNote.file_path).to.equal(newNotePath);
        deleteNote(newNote.id);
    });
});
