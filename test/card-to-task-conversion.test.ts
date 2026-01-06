import * as vscode from 'vscode';
import { convertCardToTask } from '../src/Task';
import * as database from '../src/database';

function createAutoAcceptQuickPick() {
    let acceptHandler: (() => void | Promise<void>) | undefined;
    let hideHandler: (() => void) | undefined;

    const qp: any = {
        items: [],
        activeItems: [],
        selectedItems: [],
        onDidAccept: (cb: any) => {
            acceptHandler = cb;
            return { dispose: jest.fn() };
        },
        onDidHide: (cb: any) => {
            hideHandler = cb;
            return { dispose: jest.fn() };
        },
        show: () => {
            qp.selectedItems = qp.items.length ? [qp.items[0]] : [];
            // Trigger accept on next tick so awaits inside handler run
            Promise.resolve().then(() => acceptHandler && acceptHandler());
        },
        dispose: jest.fn(),
    };

    return qp;
}

describe('convertCardToTask', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    function mockUiFlow() {
        const qp = createAutoAcceptQuickPick();
        (vscode.window as any).createQuickPick = jest.fn(() => qp);
        (vscode.window.showInputBox as jest.Mock)
            .mockResolvedValueOnce('Task Title') // Task title
            .mockResolvedValueOnce('2025-01-01') // Date confirmation
            .mockResolvedValueOnce('09:00');      // Time selection
        (vscode.window.showQuickPick as jest.Mock)
            .mockResolvedValueOnce({ label: 'Once', description: 'No recurrence' }) // Recurrence
            .mockResolvedValueOnce('No'); // Add more tags?
        return qp;
    }

    it('uses database card details and persists board id when converting a tree item', async () => {
        mockUiFlow();

        const runSpy = jest.fn();
        jest.spyOn(database, 'prepare').mockImplementation((sql: string) => {
            if (sql.startsWith('INSERT INTO tasks')) {
                return { run: runSpy } as any;
            }
            throw new Error(`Unexpected SQL: ${sql}`);
        });
        jest.spyOn(database, 'getCardById').mockReturnValue({
            id: 'card-1',
            column_id: 'col-1',
            title: 'Card Title',
            content: 'Card body',
        } as any);
        jest.spyOn(database, 'getColumnById').mockReturnValue({ id: 'col-1', board_id: 'board-1' } as any);
        jest.spyOn(database, 'getTagsByCardId').mockReturnValue([]);
        jest.spyOn(database, 'addTagToTask').mockImplementation(() => {});
        jest.spyOn(database, 'saveDatabase').mockImplementation(() => {});
        jest.spyOn(database, 'deleteCard').mockImplementation(() => {});
        jest.spyOn(database, 'getDb').mockReturnValue({} as any);

        await convertCardToTask({ cardId: 'card-1', boardId: 'board-1', label: 'Card Title' } as any);

        expect(runSpy).toHaveBeenCalledTimes(1);
        const args = runSpy.mock.calls[0];
        expect(args[1]).toBe('Task Title');
        expect(args[2]).toBe('Card body');
        expect(args[5]).toBe('card-1');
        expect(args[6]).toBe('board-1');
        expect(database.deleteCard).toHaveBeenCalledWith('card-1');
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Card converted to task.');
    });

    it('surfaces the underlying error instead of "undefined" when insertion fails', async () => {
        mockUiFlow();

        jest.spyOn(database, 'prepare').mockImplementation((sql: string) => {
            if (sql.startsWith('INSERT INTO tasks')) {
                return { run: () => { throw 'boom'; } } as any;
            }
            throw new Error(`Unexpected SQL: ${sql}`);
        });
        jest.spyOn(database, 'getCardById').mockReturnValue({
            id: 'card-1',
            column_id: 'col-1',
            title: 'Card Title',
            content: 'Card body',
        } as any);
        jest.spyOn(database, 'getColumnById').mockReturnValue({ id: 'col-1', board_id: 'board-1' } as any);
        jest.spyOn(database, 'getTagsByCardId').mockReturnValue([]);
        jest.spyOn(database, 'addTagToTask').mockImplementation(() => {});
        jest.spyOn(database, 'saveDatabase').mockImplementation(() => {});
        jest.spyOn(database, 'deleteCard').mockImplementation(() => {});
        jest.spyOn(database, 'getDb').mockReturnValue({} as any);

        await convertCardToTask({ cardId: 'card-1', boardId: 'board-1', label: 'Card Title' } as any);

        expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Failed to convert card to task: boom');
        // Card should not be deleted when conversion fails
        expect(database.deleteCard).not.toHaveBeenCalled();
    });

    it('calls reorderCardsOnRemove with correct column_id and position after card deletion', async () => {
        mockUiFlow();

        const runSpy = jest.fn();
        const reorderSpy = jest.fn();
        const deleteCardSpy = jest.fn();
        
        jest.spyOn(database, 'prepare').mockImplementation((sql: string) => {
            if (sql.startsWith('INSERT INTO tasks')) {
                return { run: runSpy } as any;
            }
            throw new Error(`Unexpected SQL: ${sql}`);
        });
        jest.spyOn(database, 'getCardById').mockReturnValue({
            id: 'card-1',
            column_id: 'col-1',
            position: 2,
            title: 'Card Title',
            content: 'Card body',
        } as any);
        jest.spyOn(database, 'getColumnById').mockReturnValue({ id: 'col-1', board_id: 'board-1' } as any);
        jest.spyOn(database, 'getTagsByCardId').mockReturnValue([]);
        jest.spyOn(database, 'addTagToTask').mockImplementation(() => {});
        jest.spyOn(database, 'saveDatabase').mockImplementation(() => {});
        jest.spyOn(database, 'deleteCard').mockImplementation(deleteCardSpy);
        jest.spyOn(database, 'reorderCardsOnRemove').mockImplementation(reorderSpy);
        jest.spyOn(database, 'getDb').mockReturnValue({} as any);

        await convertCardToTask({ cardId: 'card-1', boardId: 'board-1', label: 'Card Title' } as any);

        expect(deleteCardSpy).toHaveBeenCalledWith('card-1');
        expect(reorderSpy).toHaveBeenCalledWith('col-1', 2);
        expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Card converted to task.');
    });
});
