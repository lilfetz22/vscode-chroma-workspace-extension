import { addTag } from '../vscode/Tag';
import * as database from '../src/database';

jest.mock('vscode');
jest.mock('../src/database');

const mockedDb = database as jest.Mocked<typeof database>;

describe('addTag API path', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedDb.getAllTags.mockReturnValue([]);
        mockedDb.createTag.mockImplementation((tag: any) => ({ id: 'tag-1', ...tag }));
    });

    it('trims the name and normalizes a CSS color name to hex', async () => {
        const tag = await addTag({ __api: true, name: '  urgent  ', color: 'blue' });

        expect(mockedDb.createTag).toHaveBeenCalledWith({ name: 'urgent', color: '#0000FF' });
        expect(mockedDb.saveDatabase).toHaveBeenCalled();
        expect(tag).toEqual({ id: 'tag-1', name: 'urgent', color: '#0000FF' });
    });

    it('normalizes 3-digit hex shorthand', async () => {
        await addTag({ __api: true, name: 'short', color: '#abc' });

        expect(mockedDb.createTag).toHaveBeenCalledWith({ name: 'short', color: '#AABBCC' });
    });

    it('assigns a color when none is supplied', async () => {
        await addTag({ __api: true, name: 'no-color' });

        const created = mockedDb.createTag.mock.calls[0][0] as any;
        expect(created.color).toMatch(/^#[0-9A-F]{6}$/);
    });

    it('rejects a missing or blank name', async () => {
        await expect(addTag({ __api: true, name: '   ' })).rejects.toThrow('Tag name is required');
        expect(mockedDb.createTag).not.toHaveBeenCalled();
    });

    it('rejects a duplicate name case-insensitively', async () => {
        mockedDb.getAllTags.mockReturnValue([{ id: 'existing', name: 'Urgent', color: '#FF0000' }]);

        await expect(addTag({ __api: true, name: 'urgent' })).rejects.toThrow(/already exists/);
        expect(mockedDb.createTag).not.toHaveBeenCalled();
    });

    it('rejects an unrecognized color', async () => {
        await expect(addTag({ __api: true, name: 'bad', color: 'notacolor' }))
            .rejects.toThrow(/Invalid color/);
        expect(mockedDb.createTag).not.toHaveBeenCalled();
    });
});
