const vscode = require('vscode');
const { createBoard, updateBoard, deleteBoard: dbDeleteBoard, createColumn, updateColumn, deleteColumn: dbDeleteColumn } = require('../../out/database');

async function addBoard() {
    const boardName = await vscode.window.showInputBox({ prompt: 'Enter a name for the new board' });
    if (boardName) {
        createBoard({ name: boardName });
    }
}

async function editBoard(board) {
    const newBoardName = await vscode.window.showInputBox({ value: board.label });
    if (newBoardName) {
        updateBoard({ id: board.boardId, name: newBoardName });
    }
}

async function deleteBoard(board) {
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the board "${board.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        dbDeleteBoard(board.boardId);
    }
}

async function addColumn(board) {
    const columnName = await vscode.window.showInputBox({ prompt: 'Enter a name for the new column' });
    if (columnName) {
        createColumn({ name: columnName, board_id: board.boardId, order: 0 });
    }
}

async function editColumn(column) {
    const newColumnName = await vscode.window.showInputBox({ value: column.label });
    if (newColumnName) {
        updateColumn({ id: column.columnId, name: newColumnName });
    }
}

async function deleteColumn(column) {
    const confirm = await vscode.window.showWarningMessage(`Are you sure you want to delete the column "${column.label}"?`, { modal: true }, 'Delete');
    if (confirm === 'Delete') {
        dbDeleteColumn(column.columnId);
    }
}

module.exports = {
    addBoard,
    editBoard,
    deleteBoard,
    addColumn,
    editColumn,
    deleteColumn
};
