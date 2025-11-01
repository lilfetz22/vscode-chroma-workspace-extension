# Change Log

## [0.0.1] - Natural Language Highlighting Edition

### Added
- **Natural Language Highlighting (NLH)** - Real-time part-of-speech highlighting using Compromise NLP library
  - Automatic colorization of nouns, verbs, adjectives, adverbs, and numbers
  - Semantic token highlighting for better visual parsing of text
  - Configurable highlighting options for each part of speech
- New file extension `.notesnlh` for natural language highlighted notes
- Configuration settings:
  - `notesnlh.highlightNouns` - Toggle noun highlighting
  - `notesnlh.highlightVerbs` - Toggle verb highlighting
  - `notesnlh.highlightAdjectives` - Toggle adjective highlighting
  - `notesnlh.highlightAdverbs` - Toggle adverb highlighting
  - `notesnlh.highlightNumbers` - Toggle number highlighting
  - `notesnlh.linkPatterns` - Custom link patterns (replaces `notes.predefinedLinks`)
- Semantic token types for customizable colors:
  - `entity_name_type` (Nouns)
  - `entity_name_function` (Verbs)
  - `entity_other_attribute_name` (Adjectives)
  - `adverb_language` (Adverbs)
  - `value_type` (Numbers)
- Smart NLP analysis that excludes code blocks, comments, and TODO items
- Example file `examples/natural_language_highlighting.notesnlh` demonstrating the feature
- Dependency on Compromise NLP library for natural language processing

### Changed
- Package name changed to `notesnlh`
- Display name changed to `Notes_NLH`
- Repository URL updated to `https://github.com/lilfetz22/vscode-notes`
- All references to `.notes` file extension updated to `.notesnlh`
- Updated icon to reflect Natural Language Highlighting feature
- Extension language ID changed from `notes` to `notesnlh`
- Scope names updated from `source.notes` to `source.notesnlh`

### Technical Details
- Uses `compromise` v14.14.0 for NLP analysis
- Implements VS Code Semantic Tokens Provider API
- Real-time highlighting with automatic refresh on configuration changes
- Efficient processing that preserves performance while typing

---

## Previous Versions (from original vscode-notes)

### [1.1.0]

- Add "High Priority" state (`[!]`) to TODO list cycle command (Cmd-`L`)
- Add color to square brackets in TODO lists
- Neutral color text for anything other than `[!]`, `[x]`, `[√]` for check lists.

### [1.0.2]

- Fix that a colon in a bullet would always be considered a label/title even if inside a URL
- Add section to README indicating which languages are supported for syntax highlighting

### [1.0.1]

- Fix emphasis so that numbers, symbols are included ("*hello '123'*") [Thanks  `h7x4ABk3g`]

### [1.0.0]

- Add custom outgoing links, configurable on a per-file basis

  For example, to create links to tickets on Atlassian with prefix "ABC-", you could do something like this:
  [/ABC-\d+/ -> https://abc-company.atlassian.net/browse/$0]

  Now, the following pattern will be recognized as a clickable link in your note file:
  (ABC-1234)

### [0.9.3]

- Fix that highlights on ordered/unordered lists should not extend beyond a single colon (':')

### [0.9.2]

- Allow more characters in highlighted portion before colon (':') on ordered & unordered lists

### [0.9]

- Update sample image in readme

### [0.8.2]

- Fix minor issue with placement of `[ ]` square brackets when cursor is on a blank line.
- Add examples directory to show `*.notes` filetype capabilities.
- Update sample image showing syntax highlighting and other features.
- Add `syntaxes/custom-colors.json` for those who want to override their editor theme's colors use `notes` default colors.

### [0.8.1]

- Fix embedded links for notes files.

## [0.8]

- Enable relative and absolute file cross-linking. Also allow tilde (`~`) to refer to home dir.

## [0.7]

- Add icon to vscode extension. Modified from source: <a href="http://www.onlinewebfonts.com">Online Web Fonts</a>. License: CC-BY.

## [0.6]

- Added ability to cross-link between notes by referencing the name of another \*.notes file in current workspace
- Added double-quotes around notes filenames as a way to link to files with spaces in the name

## [0.5]

- improved insertion of todo-list item checkbox so it is placed before the first text at the beginning of a line, rather than always at the first character of the line
- switched to using "cmd+L" and "alt+L" for new todo-list item, or cycling between states

## [0.4]

- improved

## [0.3]

- Add `newday` snippet: adds the day as well as the following 4 subheadings:
  - Notes
  - Ideas
  - TODO
  - Activity Log
- Task cycling on a line that does not contain `[ ]` will insert
  a `[ ]` at the beginning of the line.

## [0.2]

- Changed heading color to use markup.heading.notes
- Add new "date" heading syntax with highlight, e.g. `[2018-08-04]`
- Added taskCycleForward / taskCycleBackward to check tasks
  as incomplete, complete, or canceled:

  [ ] task
  [√] done task
  [x] canceled task

  By default, bound to Option+L and Option+H respectively.

## [0.1]

- Initial release
- Copied from https://github.com/tbh1/sublime-notes
- Adapted for Visual Studio Code
