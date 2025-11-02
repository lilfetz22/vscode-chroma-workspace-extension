const vscode = {
    window: {
        showInformationMessage: jest.fn(),
        showErrorMessage: jest.fn(),
        showInputBox: jest.fn(),
        showQuickPick: jest.fn(),
        createStatusBarItem: jest.fn(() => ({
            show: jest.fn(),
            text: '',
        })),
    },
    commands: {
        registerCommand: jest.fn(),
    },
    StatusBarAlignment: {
        Left: 1,
    },
};

module.exports = vscode;
