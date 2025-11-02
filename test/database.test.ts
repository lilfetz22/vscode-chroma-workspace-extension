import { expect } from 'chai';
import 'mocha';
import * as fs from 'fs';
import * as path from 'path';
const dbPath = path.join(__dirname, '..', '.chroma', 'chroma.db');

import { initDatabase, createTables, createNote, getNoteById, getAllNotes, updateNote, deleteNote, createBoard, getBoardById, getAllBoards, updateBoard, deleteBoard, createColumn, getColumnsByBoardId, createCard, getCardsByColumnId } from '../src/database';
import { Note } from '../src/models/Note';
import { Board } from '../src/models/Board';
import { Column } from '../src/models/Column';
import { Card } from '../src/models/Card';

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

    describe('Kanban CRUD Operations', () => {
        beforeEach(() => {
            if (fs.existsSync(dbPath)) {
                fs.unlinkSync(dbPath);
            }
            initDatabase();
            createTables();
        });

        it('should create a new board', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            expect(createdBoard).to.include(newBoard);
        });

        it('should retrieve a board by id', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            const retrievedBoard = getBoardById(createdBoard.id);
            expect(retrievedBoard).to.include(newBoard);
        });

        it('should retrieve all boards', () => {
            const newBoard1: Partial<Board> = {
                name: 'Test Board 1',
            };
            const newBoard2: Partial<Board> = {
                name: 'Test Board 2',
            };
            createBoard(newBoard1);
            createBoard(newBoard2);
            const allBoards = getAllBoards();
            expect(allBoards).to.have.lengthOf(2);
        });

        it('should update a board', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            const updatedBoardData: Partial<Board> = {
                id: createdBoard.id,
                name: 'Updated Test Board',
            };
            const updatedBoard = updateBoard(updatedBoardData);
            expect(updatedBoard).to.include(updatedBoardData);
        });

        it('should delete a board', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            deleteBoard(createdBoard.id);
            const retrievedBoard = getBoardById(createdBoard.id);
            expect(retrievedBoard).to.be.undefined;
        });

        it('should create a new column', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            const newColumn: Partial<Column> = {
                name: 'Test Column',
                board_id: createdBoard.id,
                order: 1,
            };
            const createdColumn = createColumn(newColumn);
            expect(createdColumn).to.include(newColumn);
        });

        it('should retrieve columns by board id', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            const newColumn1: Partial<Column> = {
                name: 'Test Column 1',
                board_id: createdBoard.id,
                order: 1,
            };
            const newColumn2: Partial<Column> = {
                name: 'Test Column 2',
                board_id: createdBoard.id,
                order: 2,
            };
            createColumn(newColumn1);
            createColumn(newColumn2);
            const allColumns = getColumnsByBoardId(createdBoard.id);
            expect(allColumns).to.have.lengthOf(2);
        });

        it('should create a new card', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            const newColumn: Partial<Column> = {
                name: 'Test Column',
                board_id: createdBoard.id,
                order: 1,
            };
            const createdColumn = createColumn(newColumn);
            const newCard: Partial<Card> = {
                title: 'Test Card',
                content: 'This is a test card.',
                column_id: createdColumn.id,
                order: 1,
                priority: 'medium',
            };
            const createdCard = createCard(newCard);
            expect(createdCard).to.include(newCard);
        });

        it('should retrieve cards by column id', () => {
            const newBoard: Partial<Board> = {
                name: 'Test Board',
            };
            const createdBoard = createBoard(newBoard);
            const newColumn: Partial<Column> = {
                name: 'Test Column',
                board_id: createdBoard.id,
                order: 1,
            };
            const createdColumn = createColumn(newColumn);
            const newCard1: Partial<Card> = {
                title: 'Test Card 1',
                content: 'This is a test card 1.',
                column_id: createdColumn.id,
                order: 1,
                priority: 'medium',
            };
            const newCard2: Partial<Card> = {
                title: 'Test Card 2',
                content: 'This is a test card 2.',
                column_id: createdColumn.id,
                order: 2,
                priority: 'high',
            };
            createCard(newCard1);
            createCard(newCard2);
            const allCards = getCardsByColumnId(createdColumn.id);
            expect(allCards).to.have.lengthOf(2);
        });
    });
});
