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
        createOutputChannel: jest.fn(() => ({
            appendLine: jest.fn(),
            append: jest.fn(),
            show: jest.fn(),
            hide: jest.fn(),
            clear: jest.fn(),
            dispose: jest.fn(),
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
