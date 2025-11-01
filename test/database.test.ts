import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';
import * as path from 'path';
const dbPath = path.join(__dirname, '..', '.chroma', 'chroma.db');

import { initDatabase, createTables, createNote, getNoteById, getAllNotes, updateNote, deleteNote } from '../src/database';
import { Note } from '../src/models/Note';

import { closeDb } from '../src/database';

describe('Database Tests', () => {
    afterEach(() => {
        closeDb();
    });

    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
    });

    describe('Database Initialization', () => {
        it('should create a chroma.db file in the .chroma directory', () => {
            initDatabase();
            const fileExists = fs.existsSync(dbPath);
            expect(fileExists).to.be.true;
        });
    });

    describe('Table Creation', () => {
        it('should create a notes table in the database', () => {
            const db = initDatabase();
            createTables();
            const stmt = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'");
            const table = stmt.get();
            expect(table).to.not.be.undefined;
        });
    });

describe('CRUD Operations', () => {
    beforeEach(() => {
        if (fs.existsSync(dbPath)) {
            fs.unlinkSync(dbPath);
        }
        initDatabase();
        createTables();
    });

    it('should create a new note', () => {
        const newNote: Partial<Note> = {
            id: '1',
            title: 'Test Note',
            content: 'This is a test note.',
            file_path: '/path/to/note.notesnlh',
            nlh_enabled: true,
        };
        const createdNote = createNote(newNote);
        expect(createdNote).to.include(newNote);
    });

    it('should retrieve a note by id', () => {
        const newNote: Partial<Note> = {
            id: '1',
            title: 'Test Note',
            content: 'This is a test note.',
            file_path: '/path/to/note.notesnlh',
            nlh_enabled: true,
        };
        createNote(newNote);
        const retrievedNote = getNoteById('1');
        expect(retrievedNote).to.include(newNote);
    });

    it('should retrieve all notes', () => {
        const newNote1: Partial<Note> = {
            id: '1',
            title: 'Test Note 1',
            content: 'This is a test note 1.',
            file_path: '/path/to/note1.notesnlh',
            nlh_enabled: true,
        };
        const newNote2: Partial<Note> = {
            id: '2',
            title: 'Test Note 2',
            content: 'This is a test note 2.',
            file_path: '/path/to/note2.notesnlh',
            nlh_enabled: false,
        };
        createNote(newNote1);
        createNote(newNote2);
        const allNotes = getAllNotes();
        expect(allNotes).to.have.lengthOf(2);
    });

    it('should update a note', () => {
        const newNote: Partial<Note> = {
            id: '1',
            title: 'Test Note',
            content: 'This is a test note.',
            file_path: '/path/to/note.notesnlh',
            nlh_enabled: true,
        };
        createNote(newNote);
        const updatedNoteData: Partial<Note> = {
            id: '1',
            title: 'Updated Test Note',
            content: 'This is an updated test note.',
            file_path: '/path/to/updated-note.notesnlh',
            nlh_enabled: false,
        };
        const updatedNote = updateNote(updatedNoteData);
        expect(updatedNote).to.include(updatedNoteData);
    });

    it('should delete a note', () => {
        const newNote: Partial<Note> = {
            id: '1',
            title: 'Test Note',
            content: 'This is a test note.',
            file_path: '/path/to/note.notesnlh',
            nlh_enabled: true,
        };
        createNote(newNote);
        deleteNote('1');
        const retrievedNote = getNoteById('1');
        expect(retrievedNote).to.be.undefined;
    });
});
});
