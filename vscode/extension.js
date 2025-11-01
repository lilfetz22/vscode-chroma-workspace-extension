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


exports.activate = async function activate(context) {
  context.subscriptions.push(
    commands.registerTextEditorCommand(
      "notesnlh.cycleTaskForwardNew",
      cycleTaskForwardNew
    ),
    commands.registerTextEditorCommand(
      "notesnlh.cycleTaskBackwardNew",
      cycleTaskBackwardNew
    )
  );
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('notesnlh')) {
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
      linkPatterns = vscode.workspace.getConfiguration("notesnlh")["linkPatterns"];
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
    switch (pos.toLowerCase()) {
      case 'noun':
        return config.get('highlightNouns');
      case 'verb':
        return config.get('highlightVerbs');
      case 'adjective':
        return config.get('highlightAdjectives');
      case 'adverb':
        return config.get('highlightAdverbs');
      case 'value':
        return config.get('highlightNumbers');
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
        const config = vscode.workspace.getConfiguration('notesnlh');

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
};
