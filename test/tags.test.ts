import { initDatabase, getDb, createTag, getTagById, getAllTags, updateTag, deleteTag, createCard, addTagToCard, removeTagFromCard, getTagsByCardId } from '../src/database';
import { Board } from '../src/models/Board';
import { Card } from '../src/models/Card';
import { Column } from '../src/models/Column';
import { Tag } from '../src/models/Tag';
import { randomBytes } from 'crypto';

describe('Tagging System', () => {
    beforeAll(() => {
        initDatabase(true); // Use in-memory database for tests
    });

    afterAll(() => {
        getDb().close();
    });

    let board: Board;
    let column: Column;
    let card: Card;

    beforeEach(() => {
        const db = getDb();
        db.exec('DELETE FROM tags');
        db.exec('DELETE FROM card_tags');
        db.exec('DELETE FROM cards');

        board = { id: randomBytes(16).toString('hex'), name: 'Test Board' };
        db.prepare('INSERT INTO boards (id, name) VALUES (?, ?)').run(board.id, board.name);

        column = { id: randomBytes(16).toString('hex'), name: 'Test Column', board_id: board.id, order: 0 };
        db.prepare('INSERT INTO columns (id, name, board_id, order_index) VALUES (?, ?, ?, ?)').run(column.id, column.name, column.board_id, column.order);

        card = createCard({
            title: 'Test Card',
            content: 'Test Content',
            column_id: column.id,
            order: 0,
            priority: 'medium',
        });
    });

    it('should create a new tag', () => {
        const tag = createTag({ name: 'Test Tag', color: '#ff0000' });
        expect(tag.id).toBeDefined();
        expect(tag.name).toBe('Test Tag');
        expect(tag.color).toBe('#ff0000');
    });

    it('should get a tag by ID', () => {
        const newTag = createTag({ name: 'Test Tag', color: '#ff0000' });
        const tag = getTagById(newTag.id);
        expect(tag).toEqual(newTag);
    });

    it('should get all tags', () => {
        createTag({ name: 'Tag 1', color: '#ff0000' });
        createTag({ name: 'Tag 2', color: '#00ff00' });
        const tags = getAllTags();
        expect(tags.length).toBe(2);
    });

    it('should update a tag', () => {
        const tag = createTag({ name: 'Test Tag', color: '#ff0000' });
        const updatedTag = updateTag({ id: tag.id, name: 'Updated Tag', color: '#0000ff' });
        expect(updatedTag.name).toBe('Updated Tag');
        expect(updatedTag.color).toBe('#0000ff');
    });

    it('should delete a tag', () => {
        const tag = createTag({ name: 'Test Tag', color: '#ff0000' });
        deleteTag(tag.id);
        const deletedTag = getTagById(tag.id);
        expect(deletedTag).toBeUndefined();
    });

    it('should add a tag to a card', () => {
        const tag = createTag({ name: 'Test Tag', color: '#ff0000' });
        addTagToCard(card.id, tag.id);
        const cardTags = getTagsByCardId(card.id);
        expect(cardTags.length).toBe(1);
        expect(cardTags[0].id).toBe(tag.id);
    });

    it('should remove a tag from a card', () => {
        const tag = createTag({ name: 'Test Tag', color: '#ff0000' });
        addTagToCard(card.id, tag.id);
        removeTagFromCard(card.id, tag.id);
        const cardTags = getTagsByCardId(card.id);
        expect(cardTags.length).toBe(0);
    });
});
