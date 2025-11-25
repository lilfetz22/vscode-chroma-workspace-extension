Purpose
-------
This file gives concise, repo-specific guidance so an AI coding agent can be immediately productive working on the Chroma Workspace VS Code extension.

Quick orientation (big picture)
-------------------------------
- TypeScript source lives under `src/` and compiles to `./out` (see `tsconfig.json`). The extension entry used in development is `vscode/extension.js` which requires compiled files from `../out`.
- The final bundled extension is produced by the bundler script (`esbuild.js`) into `./dist/extension_bundled.js` (see `package.json` `main`).
- All persistent data is a local SQLite DB stored by default at `.chroma/chroma.db`. Core DB logic and migrations are in `src/database.ts` and `src/migrations.ts`.
- Key runtime pieces:
  - extension activation and command wiring: `vscode/extension.js`
  - database adapter (runtime vs tests): `src/database-adapter.ts`
  - settings & validation: `src/logic/SettingsService.ts`
  - search/FTS: `src/logic/search.ts`

Developer workflows & exact commands
----------------------------------
- Install deps: `npm install`
- Type-check & compile TS to `out`: `npm run compile` (runs `tsc -p ./`)
- Build bundle: `npm run build` (same as `npm run compile && node esbuild.js`)
- Package VSIX: `npm run package` (requires `vsce` global tool)
- Run tests: `npm test` (Jest + ts-jest). Mocks: `__mocks__/vscode.js`, `__mocks__/uuid.js` are used by tests.
- Development in VS Code: open folder and press F5 (launches Extension Development Host).

- Windows PowerShell: when starting a new terminal session on Windows PowerShell, always run the following to allow running local build/package scripts for the session only:
  `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`
  This sets the execution policy only for the current process and avoids needing a persistent policy change while allowing scripts like `esbuild.js` or `vsce` to run.

Important project-specific conventions & gotchas
-------------------------------------------
- Database path must be a relative path ending with `.db`. `SettingsService.isValidDatabasePath()` enforces this. Use `setDatabasePath()` before `initDatabase()` when changing path.
- Migrations auto-run on `initDatabase()` — prefer editing `src/migrations.ts` to add migrations (append new versions). Migrations track versions in `schema_migrations`.
- FTS search uses an FTS5 virtual table called `search_index`. The `search()` implementation quotes terms for FTS5 (`src/logic/search.ts`). Keep queries FTS5-compatible.
- Tests expect DB isolation: tests may use the in-memory adapter (`:memory:` / sql.js). See `src/database-adapter.ts` for testing vs production adapters.
- The extension activates on `onLanguage:notesnlh` and watches `**/*.notesnlh`. If changing activation semantics or file globs, update `package.json` `activationEvents` and `languages`.
- Compiled output location vs. bundle: authors reference `../out` in `vscode/extension.js` during development; final packaging uses `dist/extension_bundled.js` produced by `esbuild.js`. When changing module paths, ensure both `tsc` and `esbuild` inputs/outputs remain consistent.

Integration points & external deps
---------------------------------
- SQLite via `better-sqlite3` for runtime. Tests use `sql.js` adapter (see `src/database-adapter.ts`).
- NLP: `compromise` is used for Natural Language Highlighting in `vscode/extension.js` and the NLH logic.
- Packaging & release: uses `semantic-release` and `vsce`. Releases require `GITHUB_TOKEN` and (for marketplace) `VSCE_PAT`.

How to change code safely (contract + checks)
-------------------------------------------
- When changing DB schema:
  - Add a new migration entry in `src/migrations.ts` with increased `version` and an `up(db)` migration.
  - Run `npm run compile` then run the extension or tests to verify migrations apply.
- When modifying settings shape or keys:
  - Update `src/logic/SettingsService.ts` and `package.json` configuration section together (keys must match).
  - Use `SettingsService.isValidDatabasePath()` rules as the canonical validation.
- Before opening PRs: run `npm run compile` and `npm test` locally. CI expects TypeScript compile to pass and tests to be green.

Files to consult for examples
----------------------------
- DB & migrations: `src/database.ts`, `src/migrations.ts`, `src/database-adapter.ts`
- Extension entry & command wiring: `vscode/extension.js`
- Settings & validation: `src/logic/SettingsService.ts`
- Search implementation: `src/logic/search.ts`
- Build & scripts: `package.json`, `esbuild.js`, `BUILD.md`
- Tests & mocks: `test/` and `__mocks__/`

When unsure, prefer non-breaking edits
-------------------------------------
- Prefer adding migrations and feature flags instead of in-place destructive schema changes.
- Preserve public command IDs (see `package.json` `contributes.commands`) unless you update all consumers.

If anything in this summary is unclear or you'd like more examples (small diffs for a common change, a test scaffold, or a migration template), tell me which part to expand and I'll update this file.
