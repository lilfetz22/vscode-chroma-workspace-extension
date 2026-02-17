const vscode = require('vscode');
const { createBoard, updateBoard, deleteBoard: dbDeleteBoard, createColumn, updateColumn, deleteColumn: dbDeleteColumn, getColumnById, saveDatabase } = require('../../out/src/database');

async function addBoard() {
    const boardName = await vscode.window.showInputBox({ prompt: 'Enter a name for the new board' });
    if (boardName) {
        createBoard({ title: boardName });
        saveDatabase();
    }
}

async function editBoard(board) {
    if (!board || !board.boardId) {
        vscode.window.showErrorMessage('No board selected');
        return;
    }
    const newBoardName = await vscode.window.showInputBox({ value: board.label });
    if (newBoardName) {
        updateBoard({ id: board.boardId, title: newBoardName });
        saveDatabase();
    }
}

async function deleteBoard(board) {
    if (!board || !board.boardId) {
        vscode.window.showErrorMessage('No board selected');
        return;
    }
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the board "${board.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        dbDeleteBoard(board.boardId);
        saveDatabase();
    }
}

async function addColumn(board) {
    if (!board || !board.boardId) {
        vscode.window.showErrorMessage('No board selected');
        return;
    }
    const columnName = await vscode.window.showInputBox({ prompt: 'Enter a name for the new column' });
    if (columnName) {
        createColumn({ title: columnName, board_id: board.boardId, position: 0 });
        saveDatabase();
    }
}

async function editColumn(column) {
    if (!column || !column.columnId) {
        vscode.window.showErrorMessage('No column selected');
        return;
    }
    const newColumnName = await vscode.window.showInputBox({ value: column.label });
    if (newColumnName) {
        updateColumn({ id: column.columnId, title: newColumnName });
        saveDatabase();
    }
}

async function deleteColumn(column) {
    if (!column || !column.columnId) {
        vscode.window.showErrorMessage('No column selected');
        return;
    }
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the column "${column.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        dbDeleteColumn(column.columnId);
        saveDatabase();
    }
}

async function copyBoardId(board) {
    if (!board || !board.boardId) {
        vscode.window.showErrorMessage('No board selected');
        return;
    }
    await vscode.env.clipboard.writeText(board.boardId);
    vscode.window.showInformationMessage(`Board ID copied to clipboard: ${board.boardId}`);
}

async function toggleColumnVisibility(column, desiredHiddenState) {
    if (!column || !column.columnId) {
        vscode.window.showErrorMessage('No column selected');
        return;
    }
    const columnData = getColumnById(column.columnId);
    const currentHiddenState = columnData && columnData.hidden ? 1 : 0;
    const hasExplicitState = desiredHiddenState === 0 || desiredHiddenState === 1;
    const newHiddenState = hasExplicitState ? desiredHiddenState : (currentHiddenState ? 0 : 1);
    updateColumn({ id: column.columnId, hidden: newHiddenState });
    saveDatabase();
}

module.exports = {
    addBoard,
    editBoard,
    deleteBoard,
    addColumn,
    editColumn,
    deleteColumn,
    copyBoardId,
    toggleColumnVisibility
};
