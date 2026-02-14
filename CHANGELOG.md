## [2.19.1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.19.0...v2.19.1) (2026-02-14)


### Bug Fixes

* **package.json:** revert vs code api version ([384b66a](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/384b66ad436905c4940007e8457e7212e5cb8d19))

# [2.19.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.18.1...v2.19.0) (2026-02-01)


### Features

* **tags:** implement case-insensitive alphabetical sorting ([59dc777](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/59dc77737d090e800f0bbddf64b4a17380a0d2e5))

## [2.18.1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.18.0...v2.18.1) (2026-01-13)


### Bug Fixes

* reschedule recurring tasks when converted to card ([05b8242](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/05b82426920bba81cfb8ad77ac93bd0985c14345))

# [2.18.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.17.0...v2.18.0) (2026-01-07)


### Bug Fixes

* **tests:** retrieve completion column from settings in test-database ([1e48d95](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1e48d9515633fee0f9296e774c5424035843f3fa))


### Features

* **kanban:** auto-normalize card positions on startup ([b3b1700](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b3b170011f9017a097a472b4b5ef00c87b67a8a6)), closes [#43](https://github.com/lilfetz22/vscode-chroma-workspace-extension/issues/43) [#44](https://github.com/lilfetz22/vscode-chroma-workspace-extension/issues/44)

# [2.17.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.16.3...v2.17.0) (2026-01-07)


### Features

* **settings:** expose Kanban column names in Settings UI ([56fe83e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/56fe83eaf3fa626fe2ec6355961edb6f3b7aa1af))

## [2.16.3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.16.2...v2.16.3) (2026-01-06)


### Bug Fixes

* **kanban:** update card positions after converting to task ([c485927](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/c485927593c55965065d834be3ffbc9c9b3635fc))

## [2.16.2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.16.1...v2.16.2) (2026-01-03)


### Bug Fixes

* **release:** bump engines.vscode to ^1.107.0 to match @types/vscode ([c0c4b96](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/c0c4b96aa9fcfb956839e82b4f1c7bbb8aab31da))

## [2.16.1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.16.0...v2.16.1) (2026-01-02)


### Bug Fixes

* **tasks:** convert cards to tasks reliably ([06bc9ab](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/06bc9abcf7c3ed98b763f83571ce1d0398e8c3df))
* **tasks:** delete card after successful conversion to task ([f6ba6f4](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f6ba6f44b920533a2ac2a702a78b3fe7a7eee2e9))
* **ui:** refresh Kanban view after card-to-task conversion ([2d00b5c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/2d00b5cbcf7707c7874864504390a45f4897219e))

# [2.16.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.15.0...v2.16.0) (2025-12-20)


### Bug Fixes

* **kanban:** import copyBoardId function from Board.js ([85b95d1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/85b95d1b76365d413361da2efb57c9d0ab8abb0e))
* **kanban:** remove duplicate Cancel buttons from vacation mode warnings\n\nModal dialogs automatically include a Cancel button, so explicit Cancel options created duplicates. ([578e7c7](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/578e7c712fb5d34c54d0d1489669b18d2a7030e0))
* **kanban:** scope vacation-mode warnings to selected boards\n\nAdd SettingsService.isVacationModeActiveForBoard and tests to apply warnings only on boards listed in vacationModeBoards; empty or null list applies globally. ([d8abc9e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d8abc9e766e938334026c5b953ed468eda06fc5c))
* **settings:** allow board names in Vacation Mode boards list\n\n- Extend isVacationModeActiveForBoard(boardId, boardTitle) to match by exact board name (case-insensitive) or ID\n- Update Card warnings to pass board title for correct scoping\n- Simplify settings description to use board names only ([895b36f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/895b36fc0c86f5d37b458944cc370223b5d633f3))


### Features

* **kanban:** add Copy Board ID button and board ID tooltips ([155d1aa](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/155d1aaef28a6a568781f4d631ef1f6615499672))

# [2.15.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.14.0...v2.15.0) (2025-12-20)


### Bug Fixes

* **export:** query completed_at using local time format ([f4aec00](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f4aec00fd3479f86ae46bbfa8aac76a027374123))
* **kanban:** save edited completed_at in local time format ([215f71e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/215f71eafcd57e4043579c5877e1ac0866e7b0fe))


### Features

* **kanban:** add ability to edit completed date for cards ([b87e9b3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b87e9b3521332c7b18cd0cc61e47136d35e8d79c))

# [2.14.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.13.0...v2.14.0) (2025-12-19)


### Features

* **tasks:** add vacation mode per-board multi-select and scheduler support ([501f7c7](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/501f7c7ce870d0eb65ac6189d4b24e2617d442d8))

# [2.13.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.12.0...v2.13.0) (2025-12-11)


### Bug Fixes

* **database:** use positional parameters instead of named parameters for sql.js compatibility ([b501066](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b50106670b40eef62873883e0480b977d9045fb9))
* **notes:** track current path across rename and use for deletion ([f10bb64](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f10bb64d938b208fa5a7d04c574d09c66295a274))


### Features

* **notes:** add 'Add Note' button to Notes view ([ee12751](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/ee12751c2963d540d99b395a552ecf2e75ff182f))
* **notes:** add configurable sorting to NotesProvider ([41cef39](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/41cef3951b0846f2c3c7733b37501f1e8279439e))
* **notes:** implement edit note with multi-step flow ([0a69d7d](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/0a69d7d5d15f055b05b091f647b31bcddc766cd0))
* **notes:** register edit note command in extension ([91849d3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/91849d36b782654de63fc9929b062f8114945a5b))
* **settings): add configurable notes sort order (lastModified | alphabetical)\n\nAdds a new setting chroma.notes.sortOrder to control how notes are ordered in the Notes view. The setting supports two values:\n- lastModified (default:** shows most recently modified notes first\n- lphabetical: sorts by note filename A-Z\n\nMotivation:\n- Give users flexibility in viewing notes, accommodating both recency and alphabetical workflows.\n- Default remains lastModified to show recent work by default.\n\nTests / Verification:\n- Tests added for sorting behavior are included in 	est/notes-sorting.test.ts (alphabetical/lastModified behavior and default handling). ([b62a501](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b62a501b14e1de9315d86dc7699af028529b4747))
* **ui:** add edit note command to sidebar context menu ([1c9785c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1c9785c3d1547513f4c43d9a7a8f5b743c73f978))
* **ui:** reorder sidebar views to place Notes second after Kanban ([9eac940](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9eac940f8424d759697c473f1dc0b0d8da6b2107))
* **utils:** add notesFolder utility for determining note storage directory ([e297b70](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e297b70ea18cf51e79cb3f56464f673e66a8609e))
* **views:** add Notes view to display .notesnlh files from notes folder ([de70c31](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/de70c31451b97d60651a6ad90a0dcc05e0903ebf))

# [2.12.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.11.0...v2.12.0) (2025-12-10)


### Bug Fixes

* **export:** correct grouping logic for non-recurring tasks and fix tag query join ([1a0c6bb](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1a0c6bb7cb5644246c0a16c26024e6cfbfaef2ff))
* **export:** optimize tag fetching by using a prepared statement ([2d85bd1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/2d85bd14208dfeca707ebcfe2893056e85aeff6e))


### Features

* **export:** add board-specific accomplishments export from Done column ([a12c64c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/a12c64c6062ed2f78da903bf2b6c46c972624ff1))
* **export:** include tags and improve grouping/CSV for ExportAccomplishments ([b94c52c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b94c52c08c08fe97d247e5c7c3e33494bfb4c7be))

# [2.11.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.10.3...v2.11.0) (2025-12-10)


### Features

* **extension:** register convert task to card command ([859b29f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/859b29fe3a8e542938ac545fb75aad5fd8837310))
* **tasks:** add convert to card command for scheduled tasks ([001123f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/001123f2dbb584189d4fd676ae16e76cb8258e92))
* **tasks:** add manual task to card conversion functionality ([734cd76](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/734cd763bb566735daec427a790b918a06ab942f))

## [2.10.3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.10.2...v2.10.3) (2025-12-09)


### Bug Fixes

* reorder card positions when deleting cards ([26ec0cd](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/26ec0cd6bcfaa2ef4b5641c8eddebf1a5011ef65))

## [2.10.2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.10.1...v2.10.2) (2025-12-09)


### Bug Fixes

* **build:** correct indentation in esbuild configuration ([b5347f7](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b5347f7a16d2c621c961aa73c9e30f5bbf5d5eea))
* **database:** synchronize global registry for database persistence ([cb2f47b](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/cb2f47b5e321026331e2bf3c8295ece9834273ee))
* **extension:** initialize debug logger with correct database directory ([65b616e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/65b616e6691f4ef9ef50f8798175a3f71de9d2f9))
* **kanban:** ensure database persistence for board and column operations ([d62ee2e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d62ee2e0fa79e0beb41d1f995d2b551120ebb105))
* **kanban:** ensure database persistence for card operations ([c20f227](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/c20f22764919721b9dec9da62a0ee70e16868ac7))
* **logger:** ensure log directory exists before creating log file ([f2f2912](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f2f2912cf9b62aaf48fa912214b58f1cf242bf70))
* **tags:** ensure database persistence for tag operations ([a6e0765](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/a6e07655eb71ce9d20052902ea782c553b326cb0))
* **tasks:** ensure database persistence for all task operations ([a9f6329](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/a9f63298449bf13e36c7e47b8b88f426ee0ff510))
* **tasks:** persist database after task scheduler creates cards ([e20b744](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e20b7441147193798a73128bfbcd247b0629ddcc))

## [2.10.1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.10.0...v2.10.1) (2025-12-08)


### Bug Fixes

* **tasks:** correct position numbering for scheduled task cards ([913fbde](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/913fbde0033e45e0393ad366ae3299c17683430d))

# [2.10.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.9.0...v2.10.0) (2025-12-07)


### Features

* **kanban:** add 'Current' position option in edit card flow ([b2ded19](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b2ded19807cb2dd5c7b5909d864dc7232c77f155))
* **kanban:** split long text in kanban tree view ([abc5126](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/abc51263784f9b60fca4e9fa3dfaab9c81598b0f))
* **task:** split long task titles in tree view ([b8bfa4d](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b8bfa4d21f6040da3692fc60e1276f86f0a72da3))
* **utils:** add treeItemHelpers utility for text splitting ([af614ef](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/af614ef07aa908ca6414798daecad1f8cb6af7e6))

# [2.9.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.8.0...v2.9.0) (2025-12-07)


### Features

* **database:** add reorderCardsOnInsert and reorderCardsOnRemove utilities for card position adjustments ([4884ee3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/4884ee3c1beddb3913ad69685d1dab6770c0a397))
* **kanban/card:** add interactive card position QuickPick and reordering logic; support edit/move/add position changes ([fd88dbc](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/fd88dbcc65a59e42fdd20e21291f87f6b2d1a4ff))
* **kanban/provider:** display card positions in labels and hide them for completion column ([c39d5ab](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/c39d5ab9c4f5f1ad0bf3a2ac29d2f3e9f4b6d51d))
* **migrations:** add v12 migration to assign sequential positions to existing cards ([d0444df](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d0444dfd3fdb8fb9e248b1b135c8aed79cecc857))

# [2.8.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.7.0...v2.8.0) (2025-12-06)


### Bug Fixes

* **database:** stabilize DB instance across modules; safe reload and ordered Done column by completed_at ([29a2794](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/29a2794ed5787a0f136e6b3ef11a1a033f8bc204))
* **kanban:** show 4-digit year in completed date ([3c590be](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/3c590be441866f3d23072e12b9ca1aeb60bf401a))


### Features

* **kanban:** preselect current tags when editing card ([794aeb9](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/794aeb980cba06a55d150bd50ebc5af7dfb40ea4))
* **tag:** add random color option and improve tag selection UI; robust deletion ([205adcc](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/205adcc0e0bd36c387a1c6a20aac955784ec7f0e))
* **task-scheduler:** bulk-copy tags when creating cards from tasks with fallback ([c5df588](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/c5df58885d46f2bb901931f0f2c7ff34a322be0f))

# [2.7.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.6.0...v2.7.0) (2025-11-29)


### Features

* **tasks:** add vacation mode to pause scheduled task-to-card conversion ([f72c856](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f72c856f7fa8e9d5c4a7fb03e0416a982196bf08))

# [2.6.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.5.0...v2.6.0) (2025-11-29)


### Features

* **database:** expose getDatabaseFilePath for callers\n\nAdd getDatabaseFilePath() to return the resolved DB filepath after initDatabase. This helps reinitialize loggers or compute DB directory in other modules. ([018f602](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/018f602e6795778f76d0febb7e037fc449bf68a7))
* **extension:** reinitialize debug logger with DB path and remove assign/remove tag commands\n\nImport getDatabaseFilePath and reinitialize debug logger to use database directory after initDatabase; drop legacy assign/remove tag commands and menu handlers from command list to keep extension command set consistent with VSCode API and views. ([5c6a8b0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/5c6a8b0ebce6558aee7929b5484527f657b7cbbd))
* **kanban/card:** integrate tag editing into editCard and add tag removal support\n\nUpdate editCard flow to show selected tags, add tag creation during edit, and handle add/remove operations with debug logging for failures. ([e247497](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e24749717bd751fd12277c9f44d201a5f97d5644))
* **kanban:** display tag children with composite icons and simplify card labels\n\nCreate tag child items (with composite or single icons) for cards and keep card titles free from inline tag labels. Also show 'New' flag and completed dates in card labels. ([86629a1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/86629a1af78ad519205e57442a7ee1a68f45ff81))
* **tags:** display colored icons for tags in Tags view\n\nUse ensureSingleColorIcon to provide a colored square icon for each tag in the Tags tree view, improving visual identification. ([411e339](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/411e3390793cd1755733497ffa8059b6a9bc43c5))
* **task:** integrate tag editing flow into editTask and support tag removal\n\nAdd imports for removeTagFromTask and getTagsByTaskId; update editTask to allow adding/removing tags on edit. Improved robustness by logging failures when tag ops fail. ([0999153](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/09991531bfd4cc30e85b1765f60b44cc056c1b23))
* **tasks:** render tags as child items with icons and simplify task labels\n\nTags are now shown as children with individual colored icons rather than inlining tags in the task label. Simplifies the task title UX and aligns with Kanban card/tag presentations. ([cef8ded](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/cef8ded764c5ce32f32dfead42587aff0d8830bc))
* **utils:** add tag icon utilities for single and composite icons\n\nNew utilities ensureSingleColorIcon and generateTagCompositeIcon generate workspace-local SVG icons for tag colors, and support tailwind-like classes and hex normalization. ([1ae9bdf](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1ae9bdfacca5e8e130b5c1103f1db970ea7f989e))

# [2.5.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.4.0...v2.5.0) (2025-11-28)


### Features

* **migration:** add support for scheduled_tasks in import/export functions ([19ded47](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/19ded4746916d196cc31110f2aec9773008f81f9))
* **recurrence:** support weekdays, bi-weekly and custom weekly recurrence patterns ([e133b0a](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e133b0a141a7968b7faa2d2bfb8ae9102a5c1fa8))
* **tasks:** add Weekdays, Bi-weekly and Custom Weekly recurrence options + UI pickers ([75027f8](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/75027f8895de1ce968a3412fffb082b7f6778ddd))
* **tasks:** show human-readable recurrence labels in task tooltip ([0e5c556](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/0e5c55615f5074cc59b97debc19a742a592f8d1e))

# [2.4.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.3.0...v2.4.0) (2025-11-28)


### Features

* **database:** convert FTS5 virtual table to regular table for compatibility ([b8e8de7](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b8e8de7f32f4236af75058a5fa674e4cfb45492a))

# [2.3.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.2.0...v2.3.0) (2025-11-28)


### Features

* **database:** ensure FTS5 compatibility during database initialization ([88c6a08](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/88c6a08653925eb185107ce5cdec2b29e2a24f2e))
* **migration:** enhance database preparation handling for import/export functions ([9c1f3cb](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9c1f3cb544f3e41fc6185375905577950f4d46f1))

# [2.2.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.1.0...v2.2.0) (2025-11-28)


### Bug Fixes

* **migration:** use prepare wrapper and improve import/export robustness ([20df887](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/20df88749337dfec322b749c785e52d4c3692f9b))


### Features

* **logging:** add DebugLogger output and SQL-level debug logs ([35be429](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/35be4293e36a304116a8d79f25bfb9cb6f840eeb))

# [2.1.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.0.3...v2.1.0) (2025-11-27)


### Features

* **database:** support absolute/shared database path & cross-workspace sync ([7fc73d8](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/7fc73d8cb8c05c7a169620f7fd5c766d5fa811da))

## [2.0.3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.0.2...v2.0.3) (2025-11-27)


### Bug Fixes

* **extension:** initialize database before creating providers ([e4f003f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e4f003feaeab8622256dbb86d657601003d2ae7f))
* **migrations:** handle duplicate column errors for sql.js compatibility ([b278693](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b27869354ad0c65f178b2a9ba6f79471b0d958b1))
* **migrations:** remove pragma calls incompatible with sql.js ([95b15aa](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/95b15aa656ca6cc969d40f7fb6f817e3256e44d4))

## [2.0.2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.0.1...v2.0.2) (2025-11-27)


### Bug Fixes

* **database:** replace FTS5 with LIKE-based search for sql.js compatibility ([a8c9377](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/a8c9377f4fc8c01c30f35b57b4d679b7872e7bdd))

## [2.0.1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v2.0.0...v2.0.1) (2025-11-27)


### Bug Fixes

* **build:** copy sql-wasm.wasm to dist folder for runtime loading ([e9a4d38](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e9a4d38427ab33d69de54030413c312f76188693))

# [2.0.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.2.0...v2.0.0) (2025-11-27)


### Bug Fixes

* **database:** migrate from better-sqlite3 to sql.js for cross-platform compatibility ([34e929f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/34e929f0d17a0cc5c1f61db53de4db7717b212e1))


### BREAKING CHANGES

* **database:** Database backend changed from better-sqlite3 to sql.js

- Replace better-sqlite3 with sql.js (WebAssembly-based SQLite)
- No more native module compilation required
- Works on Windows, Mac, Linux without build tools
- Add file persistence layer for sql.js in-memory database
- Auto-save database after write operations
- Update all database queries to use sql.js API
- Remove transaction support (sql.js limitation)
- Update esbuild config to bundle sql.js completely
- Remove better-sqlite3 specific workarounds from .vscodeignore
- Update INSTALL.md with simplified installation instructions
- Remove electron-rebuild dependency
- Fixes 'not a valid Win32 application' error on Windows
- Users can now install VSIX without NPM or build tools

# [1.2.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.1.0...v1.2.0) (2025-11-26)


### Features

* **release:** enable publishing for semantic-release-vsce ([b3bfad4](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b3bfad4992158549c56936659bf98387d15026f9))

# [1.1.0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.0.4...v1.1.0) (2025-11-26)


### Bug Fixes

* **icon:** fixing the icon location ([d62931e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d62931e754c54fbb83108b04e617f88db9bcae06))


### Features

* **branding:** update extension icon to new design ([23aba68](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/23aba681daad5da787be1a4122cb8f9969593724))
* **images:** new extension icons ([0794ec2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/0794ec23254f165991019c86e6546e3f5beac157))

## [1.0.4](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.0.3...v1.0.4) (2025-11-26)


### Bug Fixes

* **docs:** update installation instructions to use 'npm rebuild' instead of 'npm install --build-from-source' ([880214d](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/880214d1e6c4581af1d29f69eca5dabd558e7043))

## [1.0.3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.0.2...v1.0.3) (2025-11-26)


### Bug Fixes

* **package:** exclude prebuilt native binaries, include source for rebuild ([6ae64fc](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/6ae64fce422eb0a2973d6058f446779ac19461f8))

## [1.0.2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.0.1...v1.0.2) (2025-11-26)


### Bug Fixes

* **package:** include bindings and file-uri-to-path modules in VSIX ([f7cc555](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f7cc5554da7a28752661bebd90cb55ad1e1188a1))

## [1.0.1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/compare/v1.0.0...v1.0.1) (2025-11-26)


### Bug Fixes

* **package:** improve description to emphasize local storage ([c177db3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/c177db3282814cea1f314dcf660465396e37a27f))

# 1.0.0 (2025-11-26)


### Bug Fixes

* Add disposal and improve path validation in SettingsService ([e5e8ea2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e5e8ea2b716fb454a599a05234a683544f3f1e8c))
* **assignTag, removeTag:** handle missing card ID and improve error messaging ([348958d](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/348958dbba469575951840c079f3ba3511d61fe4))
* **build:** externalize bindings and file-uri-to-path modules in esbuild config ([0b568bb](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/0b568bb387b99b883b2f961e6bb96fcc55a88f2b))
* **ci:** add semantic-release-vsce plugin to devDependencies ([19136b0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/19136b054f77d1531c68a8b436c689b298f89aa6))
* **ci:** configure release workflow to run on master branch ([eabb6aa](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/eabb6aa9842267f14bdbb523cddf07dc74132b5b))
* **ci:** disable marketplace publishing in semantic-release ([d4552f5](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d4552f5755570b56578a3a3b850cfaaf62473bae))
* **ci:** update Node.js version to 22 for semantic-release compatibility ([08c75fc](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/08c75fc8e55ae72857c0370e2372c0f69dd12ad4))
* **database:** add converted_from_task_at to createCard and updateCard ([cd09ae4](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/cd09ae420283bfc1f73a2b72c4eb9b1db74073c2))
* **database:** avoid better-sqlite3 binding crash by externalizing native module and initialize DB in workspace ([3e72adb](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/3e72adb7726cbe66897a6f2403622bb5d63c0957))
* **database:** improve error logging during database initialization and remove duplicate initialization block ([9bbdad3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9bbdad390b51a7b307f8ae80d3f35b071c98dd07))
* declare linkPatterns as a constant in activate function ([68ab8e9](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/68ab8e931e6b6e5ede678c40b8cb088c9dfc64a7))
* **extension): correct file watcher onDidChange handler\n\ndocs(roadmap:** mark Phase 3 (Notes Integration) as complete\n\n- Fixes duplicate/malformed code in watcher.onDidChange handler which could cause runtime errors when notes changed.\n- Updates ROADMAP.md to mark Phase 3 complete and advance the current phase to Phase 4. ([13eb158](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/13eb158a6208805d5c27e6b05a65256dc340c4c2))
* **gitignore:** add next_task_instructions.md to ignore list ([4b55e32](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/4b55e32e368f8387da807170f91609d516f73cb4))
* Improve logger initialization in database module ([e2ae0f3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e2ae0f3ab4667125117999ac1a56a1fc7795517d))
* Improve SettingsService callback handling ([9ae3118](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9ae3118c54dc029a2d22e5138bff849c53de269a))
* **Migration:** update database schema references for boards and columns; adjust import/export logic for compatibility ([8adb0e4](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/8adb0e4e873cc9ce60aa09dd1495f31a05b80c7f))
* Move Note import to top of file with other imports ([0023e3f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/0023e3f76ed8c0462387c8ecb4d6764ff00f7ed2))
* **package:** update version to 1.0.0 ([55ce3b2](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/55ce3b2bda54080899425e63700b321290ecbb2b))
* **pickDueDate:** prevent premature resolution and ensure proper disposal of quick pick ([bc02857](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/bc0285789b4c67cf4e63c9e72f4bbc46c9e92166))
* **quickstart:** correct typo in completion message ([debc2d3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/debc2d3c3871500851530fe824e4d025197c4a56))
* **tags:** correct database import path ([84a011f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/84a011f1ba378f031e56402cf7e9502007d0781e))
* **task:** normalize card ID handling in convertCardToTask function ([9fc5235](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9fc5235f081cf7052fe0ec09d9d7d48669b5ed41))
* **TaskProvider:** refine SQL query to select specific task fields for improved data handling ([5e82281](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/5e822812599b5a63df8b258dc3d3dd85126dfaa4))
* **TaskScheduler:** refine SQL query to select specific task fields for improved data retrieval ([ff63ebe](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/ff63ebeec961314979efeb353bf4c1220d9b410d))
* **tests:** improve comment clarity for card priority expectation ([9be313f](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9be313f0b8765e9247ef4a6a43a55be1cc61dbff))
* **tests:** preserve empty string content in createNote ([d5164af](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d5164af1db96be5abb349bc82da2ac84c09a1417))
* update electron-rebuild version in postinstall script ([d8b466c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d8b466c1e5c340c0256e8d6a25406af751b697c6))
* Use os.homedir() instead of process.cwd() for default export path ([d16696e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d16696e4431092fb66ffed4ff4a0b5bbc412eccd))


### Features

* **board:** automatically create default columns when a new board is created ([b9e9aad](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b9e9aad22a354726d6d8776f9a597e79bff7e4da))
* **color-picker:** implement color selection with classic and custom options ([f64d817](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f64d817647d6181db2049ffee96c777cc8e9633d))
* **copilot-instructions:** new copilot instructions ([3f87cfa](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/3f87cfa96f7ebc55e318a07310dec51127895d90))
* **database:** add logging and validation to initDatabase and addTagToCard ([20b3caf](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/20b3caf590f2cf0d34f40e1880a88e41ceb6a0fb))
* **database:** add migration system, integrate migrations, and add tests ([78f5b01](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/78f5b01cc8bf81f591a0dcc4f54ca9a7d3f4e370))
* **database:** enable foreign key constraints on database initialization ([9b97b2a](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/9b97b2a9ffeff99729e1c21f2936d55fda00713b))
* **database:** enhance logging for database path changes and initialization errors ([baae140](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/baae140d153c7b99526c7c2b1f81f757e8ee2744))
* **db:** align SQLite schema with DATABASE_SCHEMA.md ([b3246ea](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b3246ea108b998ff1f62ac0bb722f0f108c1b0b4))
* **gitignore:** add import_jsons and import_notes_txts to .gitignore ([a842e3b](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/a842e3b8a79bbe205595fd487d8251ac6f4491ea))
* Implement Global Search (Phase 7) ([b272eae](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/b272eae416837de46b9fa41932bb06b83bcfc273))
* Implement Kanban board view ([0e72823](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/0e72823c7a686dc0842e46076fe9c589da049527))
* Implement Phase 11 Migration Tools ([73997b0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/73997b0004b4381e52646cff1fe25d60181a8091))
* Implement Phase 3 - Notes Integration ([363ea29](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/363ea2938813a59034857674b3bcb81be1a631a7))
* Implement Phase 5 - Task Scheduling ([6c37b54](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/6c37b54041840ba944d35d695470962e181edcf3))
* Implement Phase 6 Tagging System ([1900e73](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1900e73453a6b7f2a5cec67f2ee7f3569c0920c8))
* Implement Phase 8 - Export Accomplishments ([3ac7dc9](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/3ac7dc9df25ffb353e762e59fde1a6a733052e31))
* Implement Phase 9 - Settings & Configuration ([e43085c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e43085c417fb6ddc9ed522fa38c2b2025c149854))
* **import:** enhance data normalization and validation for JSON imports ([04efa5e](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/04efa5e3a2dbf0bb06d98eb38379a2f4e1a0d069))
* **import:** enhance import functionality to support arrays of boards and columns ([1d5310b](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1d5310bba16309bc23b0bc1acebca280dd844a45))
* Integrate SQLite database for local-first storage ([87f15f3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/87f15f371775dba154319f4562e1b4427660fcd7))
* **kanban/card:** add debug logging and validate card creation; update imports ([935b4d3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/935b4d3e7a0774ee105bce5f12c9eb4b26b199d5))
* **kanban/provider:** show tags in card labels and update DB imports ([dd74c96](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/dd74c962f7868054620495b7f430a6fd2f1a5315))
* **kanban/tags:** add configurable kanban columns; centralize color utilities; improve TaskScheduler logging and error handling ([d2daa28](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d2daa28043cea0be64f2bee0826a8162cd15d0f7))
* **kanban/tasks:** add (New) flag for cards converted from scheduled tasks\n\n- Add migration v10 to add converted_from_task_at column to cards\n- Update Card model to include converted_from_task_at\n- Set converted_from_task_at when creating cards from scheduled tasks (TaskScheduler)\n- Display (New) on Kanban cards for 3 hours after conversion (KanbanProvider)\n- Update DATABASE_SCHEMA.md\n\nThis shows (New) next to cards converted from scheduled tasks for the first 3 hours after conversion. ([28ab6e7](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/28ab6e7ee44f9918f908b58bd7581fc6ff90c81e))
* **logging:** add DebugLogger to allow file-based debug logs ([30919bb](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/30919bb002b8c82035ad2eba4f04f0e94a640f00))
* **migration:** align JSON import/export with updated Kanban schema ([40c144d](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/40c144d0126ecca3b1c14c4db78d20704485f042))
* **migrations:** align DB schema with documentation (v8) and convert priority to integer ([e2cbe9c](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/e2cbe9c64c796e9ed96a8847f75b32521293e256))
* **migrations:** restructure tables and add missing updated_at column to cards ([f0f148d](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f0f148d1f579614d20e2da64daa187b23078d2ea))
* **notes:** add script to update notes from text files and write back to JSON ([2be6bf4](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/2be6bf46e5340318e3c3acb1c4b304fdd1e4bb0a))
* **tag:** add debug logging and improve tag assignment UI ([187b1a1](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/187b1a18880720a7c3b26a95d466ff7bb90c4086))
* **tags:** add CSS color mapping and tooltip enhancement for tags ([d62c0bf](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d62c0bf2ac0ee5f4792d3419b048295ab6f7c763))
* **tags:** add tag selection for cards and tasks; introduce task_tags and APIs ([a2bb312](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/a2bb3127fc3a1fb9678120f6ca569f5de86d1b93))
* **tags:** finalize tagging system tests with sql.js and mark Phase 6 complete ([bb37185](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/bb37185d0301ba6402a4f425882a472a5e73ce29))
* **task-scheduler:** create kanban card for due tasks, copy tags, refresh views, and improve recurrence handling ([3597afd](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/3597afdd770ad52059a44d43b6a8086a0c7cc229))
* **task:** add due date picker for task creation and editing ([f3010fd](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/f3010fd86126794ef62460b7d82d9d42330e22bd))
* **Task:** add optional description input for task creation and editing ([db33493](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/db33493f9b1293720f16c080c287bc4bc2e19f73))
* **tasks:** add board selection for scheduled tasks ([12a62c6](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/12a62c6162ee1d12f4e6e00d551c858f351dbbcc))
* **tasks:** add time picker and improve due date + recurrence handling ([ece3655](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/ece3655043d0294276347c9058c6c6ffb8c63c63))
* **ui:** add activity bar icon (dark theme) ([831b4fd](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/831b4fd35ab47a3539b37ab71676fdcf4724ce50))
* **ui:** add activity bar icon (light theme) ([1da5f82](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/1da5f82df3a9a6c759117c86b5a5184c390990be))
* **ui:** add extension icon SVG ([fb477a3](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/fb477a31514d349fd10576112581119714199bea))
* **views/tasks:** display tags and recurrence in scheduled task tree ([d6198f0](https://github.com/lilfetz22/vscode-chroma-workspace-extension/commit/d6198f0a4a3b082da38a127f241afb8b8743fd71))

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
