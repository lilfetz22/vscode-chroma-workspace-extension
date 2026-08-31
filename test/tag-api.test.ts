import * as vscode from 'vscode';
import * as database from '../src/database';
import { addTag, selectOrCreateTags } from '../vscode/Tag';

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

describe('selectOrCreateTags', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockedDb.getAllTags.mockReturnValue([
            { id: 'tag-1', name: 'Urgent', color: '#FF0000' },
            { id: 'tag-2', name: 'Follow up', color: '#00FF00' }
        ] as any);
    });

    it('uses a native multi-select picker and returns selected tag ids', async () => {
        (vscode.window.showQuickPick as jest.Mock).mockImplementationOnce((items, options) => {
            expect(options.canPickMany).toBe(true);
            expect(items.map((item: any) => item.label)).not.toContain('$(check) Done selecting tags');
            return Promise.resolve([items[1]]);
        });

        await expect(selectOrCreateTags()).resolves.toEqual(['tag-1']);
    });

    it('marks preselected tags as picked for editing', async () => {
        (vscode.window.showQuickPick as jest.Mock).mockImplementationOnce((items) => {
            expect(items.find((item: any) => item.tagId === 'tag-1').picked).toBe(true);
            expect(items.find((item: any) => item.tagId === 'tag-2').picked).toBe(false);
            return Promise.resolve([items[1], items[2]]);
        });

        await expect(selectOrCreateTags(['tag-1'])).resolves.toEqual(['tag-1', 'tag-2']);
    });
});
