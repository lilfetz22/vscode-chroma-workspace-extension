import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { getDb } from '../database';
import { createLogger } from './Logger';
import { randomUUID } from 'crypto';

const logger = createLogger('Migration');

/**
 * Supabase/Chroma Parse Notes data format
 */
export interface SupabaseNote {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    user_id?: string;
}

export interface SupabaseBoard {
    id: string;
    title: string;
    created_at: string;
    user_id?: string;
}

export interface SupabaseColumn {
    id: string;
    board_id: string;
    title: string;
    position: number;
    created_at: string;
}

export interface SupabaseCard {
    id: string;
    column_id: string;
    position: number;
    card_type: 'simple' | 'linked';
    title: string;
    content: string | null;
    note_id: string | null;
    summary: string | null;
    priority: number;
    scheduled_at: string | null;
    recurrence: string | null;
    activated_at: string | null;
    completed_at: string | null;
    created_at: string;
}

export interface SupabaseTag {
    id: string;
    name: string;
    color: string;
    created_at: string;
}

export interface SupabaseCardTag {
    card_id: string;
    tag_id: string;
}

export interface SupabaseTask {
    id: string;
    title: string;
    description: string | null;
    due_date: string;
    recurrence: string | null;
    status: string;
    card_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface SupabaseExportData {
    notes?: SupabaseNote[];
    boards?: SupabaseBoard[];
    columns?: SupabaseColumn[];
    cards?: SupabaseCard[];
    tags?: SupabaseTag[];
    card_tags?: SupabaseCardTag[];
    tasks?: SupabaseTask[];
}

/**
 * Validation errors and warnings
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
    stats: {
        notes: number;
        boards: number;
        columns: number;
        cards: number;
        tags: number;
        card_tags: number;
        tasks: number;
    };
}

/**
 * Migration progress callback
 */
export type ProgressCallback = (message: string, percentage: number) => void;

/**
 * Validate JSON data structure before import
 */
export function validateImportData(data: any): ValidationResult {
    logger.info('Validating import data');
    
    const result: ValidationResult = {
        valid: true,
        errors: [],
        warnings: [],
        stats: {
            notes: 0,
            boards: 0,
            columns: 0,
            cards: 0,
            tags: 0,
            card_tags: 0,
            tasks: 0
        }
    };

    // Check if data is an object
    if (!data || typeof data !== 'object') {
        result.valid = false;
        result.errors.push('Import data must be a JSON object');
        return result;
    }

    // Validate notes
    if (data.notes) {
        if (!Array.isArray(data.notes)) {
            result.valid = false;
            result.errors.push('Notes must be an array');
        } else {
            result.stats.notes = data.notes.length;
            data.notes.forEach((note: any, index: number) => {
                if (!note.id || typeof note.id !== 'string') {
                    result.errors.push(`Note ${index}: missing or invalid id`);
                    result.valid = false;
                }
                if (!note.title || typeof note.title !== 'string') {
                    result.errors.push(`Note ${index}: missing or invalid title`);
                    result.valid = false;
                }
                if (note.content && typeof note.content !== 'string') {
                    result.warnings.push(`Note ${index}: content should be a string`);
                }
            });
        }
    }

    // Validate boards
    if (data.boards) {
        if (!Array.isArray(data.boards)) {
            result.valid = false;
            result.errors.push('Boards must be an array');
        } else {
            result.stats.boards = data.boards.length;
            data.boards.forEach((board: any, index: number) => {
                if (!board.id || typeof board.id !== 'string') {
                    result.errors.push(`Board ${index}: missing or invalid id`);
                    result.valid = false;
                }
                if (!board.title || typeof board.title !== 'string') {
                    result.errors.push(`Board ${index}: missing or invalid title`);
                    result.valid = false;
                }
            });
        }
    }

    // Validate columns
    if (data.columns) {
        if (!Array.isArray(data.columns)) {
            result.valid = false;
            result.errors.push('Columns must be an array');
        } else {
            result.stats.columns = data.columns.length;
            data.columns.forEach((column: any, index: number) => {
                if (!column.id || typeof column.id !== 'string') {
                    result.errors.push(`Column ${index}: missing or invalid id`);
                    result.valid = false;
                }
                if (!column.board_id || typeof column.board_id !== 'string') {
                    result.errors.push(`Column ${index}: missing or invalid board_id`);
                    result.valid = false;
                }
                if (!column.title || typeof column.title !== 'string') {
                    result.errors.push(`Column ${index}: missing or invalid title`);
                    result.valid = false;
                }
                if (typeof column.position !== 'number') {
                    result.errors.push(`Column ${index}: missing or invalid position`);
                    result.valid = false;
                }
            });
        }
    }

    // Validate cards
    if (data.cards) {
        if (!Array.isArray(data.cards)) {
            result.valid = false;
            result.errors.push('Cards must be an array');
        } else {
            result.stats.cards = data.cards.length;
            data.cards.forEach((card: any, index: number) => {
                if (!card.id || typeof card.id !== 'string') {
                    result.errors.push(`Card ${index}: missing or invalid id`);
                    result.valid = false;
                }
                if (!card.column_id || typeof card.column_id !== 'string') {
                    result.errors.push(`Card ${index}: missing or invalid column_id`);
                    result.valid = false;
                }
                if (!card.title || typeof card.title !== 'string') {
                    result.errors.push(`Card ${index}: missing or invalid title`);
                    result.valid = false;
                }
                if (card.card_type && !['simple', 'linked'].includes(card.card_type)) {
                    result.errors.push(`Card ${index}: card_type must be 'simple' or 'linked'`);
                    result.valid = false;
                }
                if (typeof card.position !== 'number') {
                    result.errors.push(`Card ${index}: missing or invalid position`);
                    result.valid = false;
                }
            });
        }
    }

    // Validate tags
    if (data.tags) {
        if (!Array.isArray(data.tags)) {
            result.valid = false;
            result.errors.push('Tags must be an array');
        } else {
            result.stats.tags = data.tags.length;
            data.tags.forEach((tag: any, index: number) => {
                if (!tag.id || typeof tag.id !== 'string') {
                    result.errors.push(`Tag ${index}: missing or invalid id`);
                    result.valid = false;
                }
                if (!tag.name || typeof tag.name !== 'string') {
                    result.errors.push(`Tag ${index}: missing or invalid name`);
                    result.valid = false;
                }
                if (tag.color && !/^#[0-9A-Fa-f]{6}$/.test(tag.color)) {
                    result.warnings.push(`Tag ${index}: color should be in hex format (#RRGGBB)`);
                }
            });
        }
    }

    // Validate card_tags
    if (data.card_tags) {
        if (!Array.isArray(data.card_tags)) {
            result.valid = false;
            result.errors.push('Card tags must be an array');
        } else {
            result.stats.card_tags = data.card_tags.length;
            data.card_tags.forEach((cardTag: any, index: number) => {
                if (!cardTag.card_id || typeof cardTag.card_id !== 'string') {
                    result.errors.push(`Card tag ${index}: missing or invalid card_id`);
                    result.valid = false;
                }
                if (!cardTag.tag_id || typeof cardTag.tag_id !== 'string') {
                    result.errors.push(`Card tag ${index}: missing or invalid tag_id`);
                    result.valid = false;
                }
            });
        }
    }

    // Validate tasks
    if (data.tasks) {
        if (!Array.isArray(data.tasks)) {
            result.valid = false;
            result.errors.push('Tasks must be an array');
        } else {
            result.stats.tasks = data.tasks.length;
            data.tasks.forEach((task: any, index: number) => {
                if (!task.id || typeof task.id !== 'string') {
                    result.errors.push(`Task ${index}: missing or invalid id`);
                    result.valid = false;
                }
                if (!task.title || typeof task.title !== 'string') {
                    result.errors.push(`Task ${index}: missing or invalid title`);
                    result.valid = false;
                }
                if (!task.due_date || typeof task.due_date !== 'string') {
                    result.errors.push(`Task ${index}: missing or invalid due_date`);
                    result.valid = false;
                }
            });
        }
    }

    logger.info('Validation complete', result);
    return result;
}

/**
 * Import data from JSON file with progress tracking
 */
export async function importFromJson(
    jsonPath: string,
    workspaceRoot: string,
    progressCallback?: ProgressCallback,
    testDb?: any
): Promise<{ success: boolean; message: string; errors?: string[] }> {
    try {
        logger.info('Starting import from JSON', { jsonPath });
        
        // Update progress
        if (progressCallback) {
            progressCallback('Reading JSON file...', 0);
        }

        // Read and parse JSON file
        const jsonContent = fs.readFileSync(jsonPath, 'utf-8');
        const data: SupabaseExportData = JSON.parse(jsonContent);

        // Validate data
        if (progressCallback) {
            progressCallback('Validating data...', 10);
        }

        const validation = validateImportData(data);
        if (!validation.valid) {
            logger.error('Validation failed', validation.errors);
            return {
                success: false,
                message: 'Data validation failed',
                errors: validation.errors
            };
        }

        // Get database
        const db = testDb || getDb();
        if (!db) {
            throw new Error('Database not initialized');
        }

        // Begin transaction
        logger.info('Starting database transaction');
        db.exec('BEGIN TRANSACTION');

        try {
            let progressStep = 20;
            const totalSteps = 7;
            const stepIncrement = 70 / totalSteps; // Reserve 20% for validation, 10% for completion

            // Import notes
            if (data.notes && data.notes.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.notes.length} notes...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertNote = db.prepare(`
                    INSERT INTO notes (id, title, content, file_path, nlh_enabled, created_at, updated_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `);

                for (const note of data.notes) {
                    const filePath = path.join(workspaceRoot, 'notes', `${note.title.replace(/[^a-z0-9]/gi, '_')}.notesnlh`);
                    insertNote.run(
                        note.id,
                        note.title,
                        note.content || '',
                        filePath,
                        1, // nlh_enabled default
                        note.created_at || new Date().toISOString(),
                        note.updated_at || new Date().toISOString()
                    );

                    // Create note file
                    const noteDir = path.dirname(filePath);
                    if (!fs.existsSync(noteDir)) {
                        fs.mkdirSync(noteDir, { recursive: true });
                    }
                    fs.writeFileSync(filePath, note.content || '', 'utf-8');
                }
                logger.info(`Imported ${data.notes.length} notes`);
            }

            // Import boards
            if (data.boards && data.boards.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.boards.length} boards...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertBoard = db.prepare(`
                    INSERT INTO boards (id, title, created_at)
                    VALUES (?, ?, ?)
                `);

                for (const board of data.boards) {
                    insertBoard.run(
                        board.id,
                        board.title,
                        board.created_at || new Date().toISOString()
                    );
                }
                logger.info(`Imported ${data.boards.length} boards`);
            }

            // Import columns
            if (data.columns && data.columns.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.columns.length} columns...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertColumn = db.prepare(`
                    INSERT INTO columns (id, board_id, title, position, created_at)
                    VALUES (?, ?, ?, ?, ?)
                `);

                for (const column of data.columns) {
                    insertColumn.run(
                        column.id,
                        column.board_id,
                        column.title,
                        column.position,
                        column.created_at || new Date().toISOString()
                    );
                }
                logger.info(`Imported ${data.columns.length} columns`);
            }

            // Import cards
            if (data.cards && data.cards.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.cards.length} cards...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertCard = db.prepare(`
                    INSERT INTO cards (
                        id, column_id, position, card_type, title, content, note_id, 
                        summary, priority, scheduled_at, recurrence, activated_at, 
                        completed_at, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                for (const card of data.cards) {
                    insertCard.run(
                        card.id,
                        card.column_id,
                        card.position,
                        card.card_type || 'simple',
                        card.title,
                        card.content,
                        card.note_id,
                        card.summary,
                        card.priority || 0,
                        card.scheduled_at,
                        card.recurrence,
                        card.activated_at,
                        card.completed_at,
                        card.created_at || new Date().toISOString()
                    );
                }
                logger.info(`Imported ${data.cards.length} cards`);
            }

            // Import tags
            if (data.tags && data.tags.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.tags.length} tags...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertTag = db.prepare(`
                    INSERT INTO tags (id, name, color, created_at)
                    VALUES (?, ?, ?, ?)
                `);

                for (const tag of data.tags) {
                    insertTag.run(
                        tag.id,
                        tag.name,
                        tag.color || '#808080',
                        tag.created_at || new Date().toISOString()
                    );
                }
                logger.info(`Imported ${data.tags.length} tags`);
            }

            // Import card_tags
            if (data.card_tags && data.card_tags.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.card_tags.length} card-tag associations...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertCardTag = db.prepare(`
                    INSERT INTO card_tags (card_id, tag_id)
                    VALUES (?, ?)
                `);

                for (const cardTag of data.card_tags) {
                    insertCardTag.run(cardTag.card_id, cardTag.tag_id);
                }
                logger.info(`Imported ${data.card_tags.length} card-tag associations`);
            }

            // Import tasks
            if (data.tasks && data.tasks.length > 0) {
                if (progressCallback) {
                    progressCallback(`Importing ${data.tasks.length} tasks...`, progressStep);
                }
                progressStep += stepIncrement;

                const insertTask = db.prepare(`
                    INSERT INTO tasks (
                        id, title, description, due_date, recurrence, status, 
                        card_id, created_at, updated_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);

                for (const task of data.tasks) {
                    insertTask.run(
                        task.id,
                        task.title,
                        task.description,
                        task.due_date,
                        task.recurrence,
                        task.status || 'pending',
                        task.card_id,
                        task.created_at || new Date().toISOString(),
                        task.updated_at || new Date().toISOString()
                    );
                }
                logger.info(`Imported ${data.tasks.length} tasks`);
            }

            // Commit transaction
            db.exec('COMMIT');
            logger.info('Transaction committed successfully');

            if (progressCallback) {
                progressCallback('Import complete!', 100);
            }

            return {
                success: true,
                message: `Successfully imported ${validation.stats.notes} notes, ${validation.stats.boards} boards, ${validation.stats.columns} columns, ${validation.stats.cards} cards, ${validation.stats.tags} tags, and ${validation.stats.tasks} tasks`
            };

        } catch (error) {
            // Rollback on error
            db.exec('ROLLBACK');
            logger.error('Transaction rolled back due to error', error);
            throw error;
        }

    } catch (error) {
        logger.error('Import failed', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred',
            errors: [error instanceof Error ? error.message : 'Unknown error']
        };
    }
}

/**
 * Export current database to Supabase-compatible JSON format
 */
export async function exportToJson(
    outputPath: string,
    progressCallback?: ProgressCallback,
    testDb?: any
): Promise<{ success: boolean; message: string }> {
    try {
        logger.info('Starting export to JSON', { outputPath });

        if (progressCallback) {
            progressCallback('Exporting data...', 0);
        }

        const db = testDb || getDb();
        if (!db) {
            throw new Error('Database not initialized');
        }

        const exportData: SupabaseExportData = {};

        // Export notes
        if (progressCallback) {
            progressCallback('Exporting notes...', 15);
        }
        const notes = db.prepare('SELECT * FROM notes ORDER BY created_at').all();
        exportData.notes = notes as SupabaseNote[];
        logger.info(`Exported ${notes.length} notes`);

        // Export boards
        if (progressCallback) {
            progressCallback('Exporting boards...', 30);
        }
        const boards = db.prepare('SELECT * FROM boards ORDER BY created_at').all();
        exportData.boards = boards as SupabaseBoard[];
        logger.info(`Exported ${boards.length} boards`);

        // Export columns
        if (progressCallback) {
            progressCallback('Exporting columns...', 45);
        }
        const columns = db.prepare('SELECT * FROM columns ORDER BY board_id, position').all();
        exportData.columns = columns as SupabaseColumn[];
        logger.info(`Exported ${columns.length} columns`);

        // Export cards
        if (progressCallback) {
            progressCallback('Exporting cards...', 60);
        }
        const cards = db.prepare('SELECT * FROM cards ORDER BY column_id, position').all();
        exportData.cards = cards as SupabaseCard[];
        logger.info(`Exported ${cards.length} cards`);

        // Export tags
        if (progressCallback) {
            progressCallback('Exporting tags...', 75);
        }
        const tags = db.prepare('SELECT * FROM tags ORDER BY name').all();
        exportData.tags = tags as SupabaseTag[];
        logger.info(`Exported ${tags.length} tags`);

        // Export card_tags
        if (progressCallback) {
            progressCallback('Exporting card-tag associations...', 85);
        }
        const cardTags = db.prepare('SELECT * FROM card_tags').all();
        exportData.card_tags = cardTags as SupabaseCardTag[];
        logger.info(`Exported ${cardTags.length} card-tag associations`);

        // Export tasks
        if (progressCallback) {
            progressCallback('Exporting tasks...', 90);
        }
        const tasks = db.prepare('SELECT * FROM tasks ORDER BY created_at').all();
        exportData.tasks = tasks as SupabaseTask[];
        logger.info(`Exported ${tasks.length} tasks`);

        // Write to file
        if (progressCallback) {
            progressCallback('Writing to file...', 95);
        }

        const outputDir = path.dirname(outputPath);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }

        fs.writeFileSync(outputPath, JSON.stringify(exportData, null, 2), 'utf-8');
        logger.info('Export complete', { outputPath });

        if (progressCallback) {
            progressCallback('Export complete!', 100);
        }

        return {
            success: true,
            message: `Successfully exported data to ${outputPath}`
        };

    } catch (error) {
        logger.error('Export failed', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}
