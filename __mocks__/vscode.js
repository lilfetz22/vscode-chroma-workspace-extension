// EventEmitter mock for testing
class EventEmitter {
    constructor() {
        this._listeners = [];
    }

    event(listener) {
        this._listeners.push(listener);
        // Return a disposal function
        return () => {
            const index = this._listeners.indexOf(listener);
            if (index > -1) {
                this._listeners.splice(index, 1);
            }
        };
    }

    // The 'fire' method should call all registered listeners
    fire(data) {
        this._listeners.forEach(listener => listener(data));
    }

    dispose() {
        this._listeners = [];
    }
}

const vscode = {
    window: {
        showInformationMessage: jest.fn(),
        showErrorMessage: jest.fn(),
        showInputBox: jest.fn(),
        showQuickPick: jest.fn(),
        showTextDocument: jest.fn(),
        registerTreeDataProvider: jest.fn(),
        createTreeView: jest.fn(),
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
    workspace: {
        openTextDocument: jest.fn(),
        getConfiguration: jest.fn(),
        workspaceFolders: [],
        createFileSystemWatcher: jest.fn(),
    },
    EventEmitter,
    TreeItemCollapsibleState: {
        None: 0,
        Collapsed: 1,
        Expanded: 2,
    },
    ThemeIcon: class {
        constructor(id) {
            this.id = id;
        }
    },
    Uri: {
        file: jest.fn((path) => ({ fsPath: path })),
    },
    TreeItem: class {
        constructor(label, collapsibleState) {
            this.label = label;
            this.collapsibleState = collapsibleState;
        }
    },
    StatusBarAlignment: {
        Left: 1,
    },
};

module.exports = vscode;
