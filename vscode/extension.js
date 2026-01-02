const vscode = require("vscode");
const nlp = require('compromise');
const os = require("os");
const paths = require("path");
const fs = require('fs');
const {
  Uri,
  Range,
  Position,
  DocumentLink,
  DocumentLinkProvider,
  commands,
  languages,
  workspace,
  window,
} = vscode;
const { KanbanProvider } = require('./kanban/KanbanProvider');
const { TaskProvider } = require('../out/src/views/TaskProvider');
const { TagsProvider } = require('../out/src/views/TagsProvider');
const { NotesProvider } = require('../out/src/views/NotesProvider');
const { TaskScheduler } = require('../out/src/logic/TaskScheduler');
const { addBoard, editBoard, deleteBoard, addColumn, editColumn, deleteColumn, copyBoardId } = require('./kanban/Board');
const { addCard, editCard, moveCard, deleteCard, editCardCompletedDate } = require('./kanban/Card');
const { convertCardToTask, addTask, editTask, completeTask, deleteTask, convertTaskToCard } = require('../out/src/Task');
const { addTag, editTag, deleteTag, assignTag, removeTag } = require('./Tag');
const { addNote, editNote } = require('./Note');
const { exportAccomplishments } = require('../out/src/logic/ExportAccomplishments');
const { importFromJson, exportToJson } = require('../out/src/logic/Migration');

let kanbanProvider;
let kanbanTreeView;
let taskProvider;
let tagsProvider;
let notesProvider;

// Define color for each part of speech
const posColors = {
  Noun: 'entity_name_type',
  Verb: 'entity_name_function',
  Adjective: 'entity_other_attribute_name',
  Adverb: 'adverb_language',
  Value: 'value_type'
};

const tokenTypes = ['entity_name_type', 'entity_name_function', 'entity_other_attribute_name', 'adverb_language', 'value_type'];
const tokenModifiers = [];
const { initDatabase, createTables, findOrCreateNoteByPath, updateNote, deleteNote, getNoteByFilePath, getNoteById, getCardById, setDatabasePath, reloadDatabaseIfChanged, hasDatabaseChangedExternally, getDatabaseFilePath } = require('../out/src/database');
const { search } = require('../out/src/logic/search');
const { getSettingsService } = require('../out/src/logic/SettingsService');
const { initDebugLogger, getDebugLogger } = require('../out/src/logic/DebugLogger');


exports.activate = async function activate(context) {
  const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
  const config = vscode.workspace.getConfiguration('chroma');
  const configuredPath = config.get('database.path');

  // Resolve database path early so the debug logger writes to the same file as the database
  let resolvedDbPath;
  if (configuredPath && typeof configuredPath === 'string') {
    resolvedDbPath = paths.isAbsolute(configuredPath)
      ? configuredPath
      : (workspaceRoot ? paths.join(workspaceRoot, configuredPath) : configuredPath);
  } else if (workspaceRoot) {
    resolvedDbPath = paths.join(workspaceRoot, '.chroma', 'chroma.db');
  }

  const logDir = resolvedDbPath ? paths.dirname(resolvedDbPath) : (workspaceRoot || process.cwd());
  initDebugLogger(logDir);
  getDebugLogger().log('=== Extension Activated ===');
  if (workspaceRoot) {
    getDebugLogger().log('Workspace root:', workspaceRoot);
  }
  getDebugLogger().log('Configured database path:', configuredPath);
  getDebugLogger().log('Log directory:', logDir);

  // Initialize database FIRST before creating any providers
  try {
    if (configuredPath && typeof configuredPath === 'string') {
      setDatabasePath(configuredPath);
    }
    if (workspaceRoot) {
      getDebugLogger().log('Initializing database with workspace root');
      await initDatabase(false, workspaceRoot);
      getDebugLogger().log('Database initialized successfully');
    }
  } catch (e) {
    getDebugLogger().log('ERROR: Database initialization failed');
    getDebugLogger().log('Error message:', e?.message || String(e));
    if (e?.stack) {
      getDebugLogger().log('Stack trace:', e.stack);
    }
    vscode.window.showErrorMessage(`Chroma: Database initialization failed: ${e?.message || e}`);
    return; // Don't continue if database fails
  }

  // Now create providers AFTER database is ready
  kanbanProvider = new KanbanProvider();
  kanbanTreeView = vscode.window.createTreeView('kanban', { treeDataProvider: kanbanProvider });
  taskProvider = new TaskProvider();
  vscode.window.registerTreeDataProvider('scheduledTasks', taskProvider);
  tagsProvider = new TagsProvider();
  vscode.window.registerTreeDataProvider('tags', tagsProvider);
  notesProvider = new NotesProvider();
  vscode.window.registerTreeDataProvider('notes', notesProvider);

  // Cross-workspace sync: Reload database from disk when window gains focus
  // This supports shared databases where multiple VS Code workspaces access the same .db file
  context.subscriptions.push(
    vscode.window.onDidChangeWindowState(async (windowState) => {
      if (windowState.focused) {
        try {
          const result = await reloadDatabaseIfChanged();
          if (result.externalChange && result.reloaded) {
            getDebugLogger().log('Database reloaded due to external changes, refreshing all providers');
            vscode.window.showInformationMessage('Chroma: Database updated from another workspace');
            // Refresh all providers to reflect the updated data
            kanbanProvider.refresh();
            taskProvider.refresh();
            tagsProvider.refresh();
            notesProvider.refresh();
          } else if (result.externalChange && !result.reloaded) {
            getDebugLogger().log('WARNING: Database changed externally but reload failed');
            vscode.window.showWarningMessage('Chroma: Database was modified externally but reload failed. Consider reloading the window.');
          }
        } catch (e) {
          getDebugLogger().log('ERROR: Failed to check/reload database on focus:', e?.message || String(e));
        }
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('chroma.refreshTasks', () => {
      taskProvider.refresh();
    }),
    vscode.commands.registerCommand('chroma.refreshTags', () => {
      tagsProvider.refresh();
    }),
    vscode.commands.registerCommand('chroma.refreshKanban', () => {
      kanbanProvider.refresh();
    }),
    vscode.commands.registerCommand('chroma.refreshNotes', () => {
      notesProvider.refresh();
    }),
    vscode.commands.registerCommand('chroma.addBoard', () => {
        addBoard().then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.editBoard', (board) => {
        editBoard(board).then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.deleteBoard', (board) => {
        deleteBoard(board).then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.addColumn', (board) => {
        addColumn(board).then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.editColumn', (column) => {
        editColumn(column).then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.deleteColumn', (column) => {
        deleteColumn(column).then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.copyBoardId', (board) => {
        copyBoardId(board);
    }),
    vscode.commands.registerCommand('chroma.addCard', (column) => {
      addCard(column).then(() => {
        kanbanProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.editCard', (card) => {
      editCard(card).then(() => {
        kanbanProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.deleteCard', (card) => {
        deleteCard(card).then(() => {
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.moveCard', (card) => {
      moveCard(card).then(() => {
        kanbanProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.editCardCompletedDate', (card) => {
      editCardCompletedDate(card).then(() => {
        kanbanProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.convertCardToTask', (card) => {
      convertCardToTask(card).then(() => {
        taskProvider.refresh();
        kanbanProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.addTask', () => {
      addTask().then(() => {
        taskProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.editTask', (task) => {
      editTask(task).then(() => {
        taskProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.convertTaskToCard', (task) => {
      convertTaskToCard(task).then(() => {
        taskProvider.refresh();
        kanbanProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.completeTask', (task) => {
      completeTask(task).then(() => {
        taskProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.deleteTask', (task) => {
      deleteTask(task).then(() => {
        taskProvider.refresh();
      });
    }),
    vscode.commands.registerCommand('chroma.addTag', () => {
        addTag().then(() => {
            tagsProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.addNote', () => {
        addNote().then(() => {
            notesProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.editNote', (noteFile) => {
        editNote(noteFile).then(() => {
            notesProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.editTag', (tag) => {
        editTag(tag).then(() => {
            tagsProvider.refresh();
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.deleteTag', (tag) => {
        deleteTag(tag).then(() => {
            tagsProvider.refresh();
            kanbanProvider.refresh();
        });
    }),
    vscode.commands.registerCommand('chroma.exportAccomplishments', async () => {
      await exportAccomplishments();
    }),
    vscode.commands.registerCommand('chroma.importData', async () => {
      // Select JSON file to import
      const fileUri = await vscode.window.showOpenDialog({
        canSelectFiles: true,
        canSelectFolders: false,
        canSelectMany: false,
        filters: {
          'JSON Files': ['json']
        },
        title: 'Select Chroma Parse Notes Export File'
      });

      if (!fileUri || fileUri.length === 0) {
        return;
      }

      const jsonPath = fileUri[0].fsPath;
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

      if (!workspaceRoot) {
        vscode.window.showErrorMessage('No workspace folder is open. Please open a workspace first.');
        return;
      }

      // Show confirmation dialog
      const confirm = await vscode.window.showWarningMessage(
        'This will import data from the selected file. Do you want to continue?',
        { modal: true },
        'Import'
      );

      if (confirm !== 'Import') {
        return;
      }

      // Show progress
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Importing data...',
        cancellable: false
      }, async (progress) => {
        const result = await importFromJson(jsonPath, workspaceRoot, (message, percentage) => {
          progress.report({ message, increment: percentage });
        });

        if (result.success) {
          vscode.window.showInformationMessage(result.message);
          // Refresh all views
          kanbanProvider.refresh();
          taskProvider.refresh();
          tagsProvider.refresh();
        } else {
          vscode.window.showErrorMessage(`Import failed: ${result.message}`);
          if (result.errors) {
            const showDetails = await vscode.window.showErrorMessage(
              'Import validation errors occurred',
              'Show Details'
            );
            if (showDetails === 'Show Details') {
              const channel = vscode.window.createOutputChannel('Chroma Import Errors');
              channel.appendLine('Import Validation Errors:');
              result.errors.forEach(error => channel.appendLine(`- ${error}`));
              channel.show();
            }
          }
        }
      });
    }),
    vscode.commands.registerCommand('chroma.exportData', async () => {
      // Select output file
      const fileUri = await vscode.window.showSaveDialog({
        filters: {
          'JSON Files': ['json']
        },
        title: 'Export Chroma Data',
        defaultUri: vscode.Uri.file('chroma-export.json')
      });

      if (!fileUri) {
        return;
      }

      const outputPath = fileUri.fsPath;

      // Show progress
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Exporting data...',
        cancellable: false
      }, async (progress) => {
        const result = await exportToJson(outputPath, (message, percentage) => {
          progress.report({ message, increment: percentage });
        });

        if (result.success) {
          const openFile = await vscode.window.showInformationMessage(
            result.message,
            'Open File'
          );
          if (openFile === 'Open File') {
            const doc = await vscode.workspace.openTextDocument(outputPath);
            await vscode.window.showTextDocument(doc);
          }
        } else {
          vscode.window.showErrorMessage(`Export failed: ${result.message}`);
        }
      });
    }),
    vscode.commands.registerCommand('chroma.search', async () => {
      const query = await vscode.window.showInputBox({
        placeHolder: 'Search notes and cards...',
        prompt: 'Enter your search query',
      });

      if (query) {
        const results = await search(query);
        if (results.length === 0) {
          vscode.window.showInformationMessage('No results found.');
          return;
        }

        const picks = results.map(result => ({
          label: result.title,
          description: result.type,
          result: result,
        }));

        const selected = await vscode.window.showQuickPick(picks, {
          matchOnDescription: true,
        });

        if (selected) {
          if (selected.result.type === 'note') {
            const note = await getNoteById(selected.result.id);
            if (note && note.file_path) {
              const uri = vscode.Uri.file(note.file_path);
              await vscode.workspace.openTextDocument(uri).then(doc => {
                vscode.window.showTextDocument(doc);
              });
            }
          } else if (selected.result.type === 'card') {
            const card = await getCardById(selected.result.id);
            if (card) {
              await kanbanTreeView.reveal(card, { select: true, focus: true });
            }
          }
        }
      }
    })
  );

  // Note: Database initialization is already handled earlier in the activate function (lines 68-82)
  // This duplicate initialization block has been removed to prevent conflicts

  vscode.workspace.onDidOpenTextDocument((document) => {
    if (document.languageId === 'notesnlh') {
      try {
        findOrCreateNoteByPath(document.fileName);
      } catch (err) {
        vscode.window.showErrorMessage("Failed to open or create note: " + (err && err.message ? err.message : err));
        console.error("findOrCreateNoteByPath error:", err);
      }
    }
  });

  const watcher = vscode.workspace.createFileSystemWatcher('**/*.notesnlh');
  context.subscriptions.push(watcher);

  watcher.onDidCreate(uri => {
    try {
      // Refresh notes view when a new note file is created
      notesProvider.refresh();
    } catch (err) {
      console.error("Error handling file creation for", uri.fsPath, ":", err);
    }
  });

  watcher.onDidChange(uri => {
    try {
      const note = getNoteByFilePath(uri.fsPath);
      if (note) {
        const content = fs.readFileSync(uri.fsPath, 'utf8');
        updateNote({ ...note, content });
      }
      // Refresh notes view in case file is in notes folder
      notesProvider.refresh();
    } catch (err) {
      console.error("Error handling file change for", uri.fsPath, ":", err);
      vscode.window.showErrorMessage("Failed to update note for " + uri.fsPath + ": " + (err && err.message ? err.message : err));
    }
  });

  watcher.onDidDelete(uri => {
    try {
      const note = getNoteByFilePath(uri.fsPath);
      if (note) {
        deleteNote(note.id);
      }
      // Refresh notes view in case file was in notes folder
      notesProvider.refresh();
    } catch (err) {
      console.error("Error handling file delete for", uri.fsPath, ":", err);
      vscode.window.showErrorMessage("Failed to delete note for " + uri.fsPath + ": " + (err && err.message ? err.message : err));
    }
  });

  context.subscriptions.push(
    commands.registerTextEditorCommand(
      "chroma.cycleTaskForward",
      cycleTaskForwardNew
    ),
    commands.registerTextEditorCommand(
      "chroma.cycleTaskBackward",
      cycleTaskBackwardNew
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('chroma.nlh')) {
        // Trigger a re-highlight of all open documents
        vscode.workspace.textDocuments.forEach(doc => {
          if (doc.languageId === 'notesnlh') {
            vscode.languages.triggerTokenSemanticTokensRefresh();
          }
        });
      }
    })
  );
  function expandPathHome(path) {
    if (path.slice(0, 1) == "~") {
      return paths.join(os.homedir(), path.slice(1, path.length));
    } else {
      return path;
    }
  }

  function regexpSubstitute(text, matches) {
    return text.replace(/\$(\d+)/g, (_, p1) => matches[parseInt(p1, 10)]);
  }

  const linkPattern = /("([^"]+?\.notesnlh)"|[^\s]+?\.notesnlh)/g;
  // A file can describe it's own links via this pattern, e.g.
  //   [/\(MLG-\d+\)/ -> https://mediciventures.atlassian.net/browse/$0]
  const externalLinkPatterns = /\[\/([^\/]+)\/\s*->\s*(https?:\/\/[^\]]+)\]/g;
  const linkProvider = {
    provideDocumentLinks: async function (document, token) {
      let relativeRoot;
      if (document.uri.scheme === "file") {
        relativeRoot = paths.dirname(document.uri.fsPath);
      } else {
        relativeRoot = null;
      }
      let text = document.getText();
      let match;
      const externalPatterns = [];

      // use global link patterns from config
      const linkPatterns = vscode.workspace.getConfiguration("chroma.nlh")["linkPatterns"];
      if (linkPatterns) {
        for (let [regexp, link] of Object.entries(linkPatterns)) {
          externalPatterns.push({ regexp, link });
        }
      }

      // use local link patterns from this file
      while ((match = externalLinkPatterns.exec(text))) {
        externalPatterns.push({ regexp: match[1], link: match[2] });
      }
      const results = [];

      // Find "*.notesnlh" links to other notesnlh files in this document
      while ((match = linkPattern.exec(text))) {
        const linkEnd = document.positionAt(linkPattern.lastIndex);
        const linkStart = linkEnd.translate({
          characterDelta: -match[1].length,
        });
        const range = new Range(linkStart, linkEnd);
        // If inner parens match on the unquoted link text, prefer that,
        // otherwise, use the outermost match (no parens)
        const linkPath = expandPathHome(match[2] ? match[2] : match[1]);
        let linkTarget;
        if (paths.isAbsolute(linkPath)) {
          linkTarget = linkPath;
        } else if (relativeRoot) {
          linkTarget = paths.resolve(relativeRoot, linkPath);
        } else {
          // Can't add the link if it isn't absolute, and we
          // don't have a relative dir path to work with
          continue;
        }
        const fileUri = Uri.file(linkTarget);
        const docLink = new DocumentLink(range, fileUri);
        results.push(docLink);
      }

      // Find customized external links in this document
      for (pattern of externalPatterns) {
        const RE = new RegExp(pattern.regexp, "g");
        while ((match = RE.exec(text))) {
          const linkEnd = document.positionAt(RE.lastIndex);
          const linkStart = linkEnd.translate({
            characterDelta: -match[0].length,
          });
          const range = new Range(linkStart, linkEnd);
          const uri = Uri.parse(regexpSubstitute(pattern.link, match));
          const docLink = new DocumentLink(range, uri);
          results.push(docLink);
        }
      }
      return results;
    },
  };

  context.subscriptions.push(
    languages.registerDocumentLinkProvider({ scheme: 'file', language: "notesnlh" }, linkProvider)
  );

  function swap(obj) {
    let ret = {};
    for (let key in obj) {
      ret[obj[key]] = key;
    }
    return ret;
  }

  const nextStateLookup = {
    "[ ]": "[√]",
    "[√]": "[!]",
    "[!]": "[x]",
    "[x]": "[ ]",
  };

  function nextTaskState(currentState) {
    const lookup = nextStateLookup[currentState];
    if (lookup) {
      return lookup;
    } else {
      return currentState;
    }
  }

  function prevTaskState(currentState) {
    const lookup = swap(nextStateLookup)[currentState];
    if (lookup) {
      return lookup;
    } else {
      return currentState;
    }
  }

  function cycleTaskForwardNew(editor) {
    cycleTask(editor, nextTaskState);
  }

  function cycleTaskBackwardNew(editor) {
    cycleTask(editor, prevTaskState);
  }

  function cycleTask(editor, nextStateFn) {
    editor.edit((editBuilder) => {
      editor.selections.forEach((selection) => {
        let lineNo = selection.start.line;
        while (lineNo <= selection.end.line) {
          const line = editor.document.lineAt(lineNo);
          const m = line.text.match(/^\s*(\[.?\])/);
          if (m) {
            const braceMatch = m[1];
            const position = line.text.indexOf(braceMatch);
            const range = new Range(
              new Position(lineNo, position),
              new Position(lineNo, position + 3)
            );
            const newText = nextStateFn(braceMatch);
            editBuilder.replace(range, newText);
          } else {
            let insertPos = selection.active.character;
            const m2 = line.text.match(/[^\s]/);
            if (m2) {
              insertPos = line.text.indexOf(m2[0]);
            }
            editBuilder.insert(new Position(lineNo, insertPos), "[ ] ");
          }
          lineNo++;
        }
      });
    });
  }

  function getSupportedLanguages() {
    const tmLanguagePath = paths.join(__dirname, '..', 'syntaxes', 'notesnlh.tmLanguage.json');
    const tmLanguageContent = fs.readFileSync(tmLanguagePath, 'utf8');
    const tmLanguage = JSON.parse(tmLanguageContent);

    
    const languages = tmLanguage.patterns
    .filter(pattern => pattern.begin && pattern.begin.includes('\\[') && pattern.begin.includes('\\]'))
    .map(pattern => {
      const match = pattern.begin.match(/\\\[(.*?)\\\]/);
      return match ? match[1].split('|') : [];
    })
    .flat();
    // console.log(new Set(languages));
    
    return new Set(languages);
  }

  function isInSpecialBlock(lineNumber, characterNumber, specialBlocks) {
    for (const block of specialBlocks) {
      if (lineNumber > block.start.line && lineNumber < block.end.line) {
        return true;
      }
      if (lineNumber === block.start.line && characterNumber >= block.start.character) {
        return true;
      }
      if (lineNumber === block.end.line && characterNumber <= block.end.character) {
        return true;
      }
    }
    return false;
  }

  function shouldHighlightPOS(pos, config) {
    // First check if NLH is enabled
    const chromaConfig = vscode.workspace.getConfiguration('chroma');
    if (!chromaConfig.get('nlh.enabled', true)) {
      return false;
    }

    switch (pos.toLowerCase()) {
      case 'noun':
        return config.get('highlightNouns', true);
      case 'verb':
        return config.get('highlightVerbs', true);
      case 'adjective':
        return config.get('highlightAdjectives', true);
      case 'adverb':
        return config.get('highlightAdverbs', true);
      case 'value':
        return config.get('highlightNumbers', true);
      default:
        return false;
    }
  }

  // Define the semantic tokens provider
  const semanticTokensProvider = {
    provideDocumentSemanticTokens(document) {
      const text = document.getText();
      const supportedLanguages = getSupportedLanguages();
      const lines = text.split('\n');
      const specialBlocks = [];
      
      // Detect special blocks
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.startsWith('//') || line.startsWith('#') || 
        line.startsWith('[!]') || line.startsWith('[√]')
        ) {
            specialBlocks.push({
                start: new vscode.Position(i, 0),
                end: new vscode.Position(i, lines[i].length)
            });
        }
        const languageMatch = line.match(/^\[([^\]]+)\]/);
        if (languageMatch && supportedLanguages.has(languageMatch[1])) {
            const startIndex = i;
            while (i < lines.length && !lines[i].includes('[end]') && !lines[i].includes('[/')) {
                i++;
            }
            // console.log('end_of_block:', i, lines[i].length)
            specialBlocks.push({
                start: new vscode.Position(startIndex, 0),
                end: new vscode.Position(i, lines[i].length)
            });
          }
      }
  
      try {
        const doc = nlp(text);
        const json = doc.json();
        const builder = new vscode.SemanticTokensBuilder(legend);
        let lineNumber = 0;
        let characterNumber = 0;
        // console.log('json:', json);
        const config = vscode.workspace.getConfiguration('chroma.nlh');

        for (const sentence of json) {
          for (const term of sentence.terms) {
            if (!term || typeof term !== 'object') {
              console.log('Invalid term:', term, 'type of term:', typeof term);
              continue;
            }

            var pos = term.tags[0];
            if (pos.toLowerCase().includes('noun')) {
              pos = 'Noun';
            }
            // Handle puctuation before the terms
            const preText = term.pre;
            // if ((lineNumber === 19) || (lineNumber === 18)){
            //   console.log('preText:', lineNumber, characterNumber, specialblock, preText);
            // }
            for (const char of preText) {
              if (char === '\n') {
                lineNumber++;
                characterNumber = 0;
              } else { //  if (!specialblock)
                characterNumber++;                
              }
            }
              // console.log(`Pushing token: ${term.text}, Type: ${posColors[pos]}, 
              //   Range: ${range.start.line + 1}:${range.start.character + 1}-${range.end.line + 1}:${range.end.character + 1}`);
              // console.log('special block', lineNumber, characterNumber, isInSpecialBlock(lineNumber, characterNumber, specialBlocks));
            if ((!isInSpecialBlock(lineNumber, characterNumber, specialBlocks)) && (posColors[pos]) &&
              (shouldHighlightPOS(pos, config))) {
                const range = new vscode.Range(
                  new vscode.Position(lineNumber, characterNumber),
                  new vscode.Position(lineNumber, characterNumber + term.text.length)
                );
                var specialblock = false;
                builder.push(range, posColors[pos]);
              }            

            // Handle the term text, including any embedded punctuation
            // if ((lineNumber === 19) || (lineNumber === 18)) {
            //   console.log('term.text:', lineNumber, characterNumber, term.text);
            // }
            for (const char of term.text) {
              if (char === '\n') {
                lineNumber++;
                characterNumber = 0;
              } else {
                // console.log('characterNumber:', lineNumber, characterNumber, char);
                characterNumber++;
              }
            }

            // Handle punctuation and spaces after the term
            const afterText = term.post;
            // if ((lineNumber === 19) || (lineNumber === 18)){
            //   console.log('afterText:', lineNumber, characterNumber, afterText);
            // }
            for (const char of afterText) {
              if (char === '\n') {
                lineNumber++;
                characterNumber = 0;
              } else {
                characterNumber++;
              }
            }

            // if ((lineNumber === 19) || (lineNumber === 18)){
            //   console.log('characterNumber:', lineNumber, characterNumber);
            // }
            if (isInSpecialBlock(lineNumber, characterNumber, specialBlocks)){
              characterNumber = 0;
              specialblock = true;
              // console.log('lineNumber:', lineNumber, 'characterNumber:', characterNumber);
            }
          }
        }
        const tokens = builder.build();
        // console.log('Built tokens:', tokens);
        return tokens
      } catch (error) {
        console.error('Error in provideDocumentSemanticTokens:', error);
        return null;
      }
    }  
  };
  // Register the semantic tokens provider
  const selector = { language: 'notesnlh', scheme: 'file' };
  const legend = new vscode.SemanticTokensLegend(tokenTypes);
  context.subscriptions.push(
    vscode.languages.registerDocumentSemanticTokensProvider(
      selector,
      semanticTokensProvider,
      legend
    )
  );

  const taskScheduler = TaskScheduler.getInstance();
  taskScheduler.start();
  context.subscriptions.push({
    dispose: () => {
      taskScheduler.stop();
    }
  });
};
