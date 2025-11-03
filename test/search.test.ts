import { initDatabase, createNote, createCard, createBoard, createColumn, closeDb } from '../src/database';
import { search } from '../src/logic/search';

describe('Search', () => {
  beforeAll(() => {
    initDatabase(true); // Use in-memory database for tests
  });

  afterAll(() => {
    closeDb();
  });

  it('should return an empty array when the database is empty', async () => {
    const results = await search('test');
    expect(results).toEqual([]);
  });

  it('should return notes that match the search query', async () => {
    createNote({
      id: '1',
      title: 'Test Note',
      content: 'This is a test note.',
      file_path: '/test.notesnlh',
      nlh_enabled: true,
    });

    const results = await search('test');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Test Note');
    expect(results[0].type).toBe('note');
  });

  it('should return cards that match the search query', async () => {
    const board = createBoard({ name: 'Test Board' });
    const column = createColumn({ name: 'Test Column', board_id: board.id, order: 0 });
    createCard({
      id: '2',
      title: 'Test Card',
      content: 'This is a test card.',
      column_id: column.id,
      order: 0,
    });

    const results = await search('test');
    expect(results.length).toBe(2);
    expect(results[1].title).toBe('Test Card');
    expect(results[1].type).toBe('card');
  });

  it('should return ranked results', async () => {
    createNote({
      id: '3',
      title: 'Another Test Note',
      content: 'This note is also a test.',
      file_path: '/another-test.notesnlh',
      nlh_enabled: true,
    });

    const results = await search('another');
    expect(results.length).toBe(1);
    expect(results[0].title).toBe('Another Test Note');
    expect(results[0].rank).toBeLessThan(0);
  });
});
