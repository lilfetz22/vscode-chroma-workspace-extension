import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Type-safe interface for all Chroma Workspace settings
 */
export interface ChromaSettings {
    nlh: {
        enabled: boolean;
        colors: {
            nouns: string;
            verbs: string;
            adjectives: string;
            adverbs: string;
            numbers: string;
            properNouns: string;
        };
    };
    tasks: {
        enableNotifications: boolean;
        notificationFrequency: 'once' | 'hourly' | 'daily';
        showInStatusBar: boolean;
        vacationMode: boolean;
    };
    kanban: {
        taskCreationColumn: string;
        completionColumn: string;
    };
    export: {
        defaultDateRangeMonths: number;
        includeDescriptions: boolean;
        groupRecurringTasks: boolean;
    };
    database: {
        path: string;
    };
}

/**
 * Service for managing VS Code settings for Chroma Workspace
 */
export class SettingsService {
    private static readonly CONFIG_SECTION = 'chroma';
    private changeCallbacks: Set<() => void> = new Set();
    private configChangeDisposable: vscode.Disposable;

    constructor(context?: vscode.ExtensionContext) {
        // Listen for configuration changes
        this.configChangeDisposable = vscode.workspace.onDidChangeConfiguration((event) => {
            if (event.affectsConfiguration(SettingsService.CONFIG_SECTION)) {
                // Invoke all registered callbacks
                this.changeCallbacks.forEach(callback => {
                    try {
                        callback();
                    } catch (error) {
                        console.error('Error in settings change callback:', error);
                    }
                });
            }
        });

        // If context is provided, add to subscriptions for automatic cleanup
        if (context) {
            context.subscriptions.push(this.configChangeDisposable);
        }
    }

    /**
     * Dispose of the settings service and clean up resources
     */
    public dispose(): void {
        this.configChangeDisposable.dispose();
        this.changeCallbacks.clear();
    }

    /**
     * Register a callback to be invoked when settings change.
     * Returns a Disposable that can be used to unregister the callback.
     * 
     * @param callback Function to call when settings change
     * @returns Disposable to unregister the callback
     * 
     * @example
     * const disposable = settingsService.onDidChangeSettings(() => {
     *     console.log('Settings changed!');
     * });
     * // Later, to unregister:
     * disposable.dispose();
     */
    public onDidChangeSettings(callback: () => void): vscode.Disposable {
        this.changeCallbacks.add(callback);
        
        return {
            dispose: () => {
                this.changeCallbacks.delete(callback);
            }
        };
    }

    /**
     * Get all Chroma settings with type safety
     */
    public getSettings(): ChromaSettings {
        const config = vscode.workspace.getConfiguration(SettingsService.CONFIG_SECTION);

        return {
            nlh: {
                enabled: config.get<boolean>('nlh.enabled', true),
                colors: {
                    nouns: config.get<string>('nlh.colors.nouns', '#569CD6'),
                    verbs: config.get<string>('nlh.colors.verbs', '#4EC9B0'),
                    adjectives: config.get<string>('nlh.colors.adjectives', '#C586C0'),
                    adverbs: config.get<string>('nlh.colors.adverbs', '#DCDCAA'),
                    numbers: config.get<string>('nlh.colors.numbers', '#B5CEA8'),
                    properNouns: config.get<string>('nlh.colors.properNouns', '#4FC1FF')
                }
            },
            tasks: {
                enableNotifications: config.get<boolean>('tasks.enableNotifications', true),
                notificationFrequency: config.get<'once' | 'hourly' | 'daily'>('tasks.notificationFrequency', 'once'),
                showInStatusBar: config.get<boolean>('tasks.showInStatusBar', true),
                vacationMode: config.get<boolean>('tasks.vacationMode', false)
            },
            kanban: {
                taskCreationColumn: config.get<string>('kanban.taskCreationColumn', 'To Do'),
                completionColumn: config.get<string>('kanban.completionColumn', 'Done')
            },
            export: {
                defaultDateRangeMonths: config.get<number>('export.defaultDateRangeMonths', 6),
                includeDescriptions: config.get<boolean>('export.includeDescriptions', true),
                groupRecurringTasks: config.get<boolean>('export.groupRecurringTasks', true)
            },
            database: {
                path: config.get<string>('database.path', '.chroma/chroma.db')
            }
        };
    }

    /**
     * Get NLH settings
     */
    public getNlhSettings() {
        return this.getSettings().nlh;
    }

    /**
     * Get task settings
     */
    public getTaskSettings() {
        return this.getSettings().tasks;
    }

    /**
     * Get kanban settings
     */
    public getKanbanSettings() {
        return this.getSettings().kanban;
    }

    /**
     * Get export settings
     */
    public getExportSettings() {
        return this.getSettings().export;
    }

    /**
     * Get database settings
     */
    public getDatabaseSettings() {
        return this.getSettings().database;
    }

    /**
     * Update a specific setting
     */
    public async updateSetting(
        key: string,
        value: any,
        target: vscode.ConfigurationTarget = vscode.ConfigurationTarget.Workspace
    ): Promise<void> {
        const config = vscode.workspace.getConfiguration(SettingsService.CONFIG_SECTION);
        await config.update(key, value, target);
    }

    /**
     * Reset all settings to defaults
     */
    public async resetToDefaults(): Promise<void> {
        const config = vscode.workspace.getConfiguration(SettingsService.CONFIG_SECTION);
        const keys = [
            'nlh.enabled',
            'nlh.colors.nouns',
            'nlh.colors.verbs',
            'nlh.colors.adjectives',
            'nlh.colors.adverbs',
            'nlh.colors.numbers',
            'nlh.colors.properNouns',
            'tasks.enableNotifications',
            'tasks.notificationFrequency',
            'tasks.showInStatusBar',
            'tasks.vacationMode',
            'kanban.taskCreationColumn',
            'kanban.completionColumn',
            'export.defaultDateRangeMonths',
            'export.includeDescriptions',
            'export.groupRecurringTasks',
            'database.path'
        ];

        for (const key of keys) {
            await config.update(key, undefined, vscode.ConfigurationTarget.Workspace);
        }
    }

    /**
     * Validate color hex format
     */
    public isValidHexColor(color: string): boolean {
        return /^#[0-9A-Fa-f]{6}$/.test(color);
    }

    /**
     * Validate database path
     * Supports both relative paths (within workspace) and absolute paths (shared database)
     */
    public isValidDatabasePath(dbPath: string): boolean {
        // Must end with .db extension
        if (!dbPath.endsWith('.db')) {
            return false;
        }

        // Additional security: path should not contain null bytes
        if (dbPath.includes('\0')) {
            return false;
        }

        // For absolute paths, we trust the user's explicit configuration
        // They know the database is outside the workspace since relative is the default
        if (path.isAbsolute(dbPath)) {
            return true;
        }

        // For relative paths, apply path traversal protection
        // Normalize the path and check for path traversal attempts
        const normalizedPath = path.normalize(dbPath);
        
        // After normalization, the path should not start with '..' or contain '../'
        // This prevents traversal attacks like '../../../etc/passwd.db'
        if (normalizedPath.startsWith('..') || normalizedPath.includes(`..${path.sep}`)) {
            return false;
        }

        return true;
    }

    /**
     * Validate all current settings
     */
    public validateSettings(): { valid: boolean; errors: string[] } {
        const settings = this.getSettings();
        const errors: string[] = [];

        // Validate colors
        const colors = settings.nlh.colors;
        for (const [key, value] of Object.entries(colors)) {
            if (!this.isValidHexColor(value)) {
                errors.push(`Invalid hex color for nlh.colors.${key}: ${value}`);
            }
        }

        // Validate export months
        if (settings.export.defaultDateRangeMonths < 1 || settings.export.defaultDateRangeMonths > 60) {
            errors.push(`Invalid defaultDateRangeMonths: ${settings.export.defaultDateRangeMonths}. Must be between 1 and 60.`);
        }

        // Validate database path
        if (!this.isValidDatabasePath(settings.database.path)) {
            errors.push(`Invalid database path: ${settings.database.path}. Must be relative and end with .db`);
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

/**
 * Global singleton instance
 */
let settingsServiceInstance: SettingsService | null = null;

/**
 * Get the global settings service instance
 */
export function getSettingsService(): SettingsService {
    if (!settingsServiceInstance) {
        settingsServiceInstance = new SettingsService();
    }
    return settingsServiceInstance;
}

/**
 * Initialize the settings service (called from extension activation)
 * @param context Extension context for automatic disposal management
 */
export function initializeSettingsService(context?: vscode.ExtensionContext): SettingsService {
    // Dispose of existing instance if present
    if (settingsServiceInstance) {
        settingsServiceInstance.dispose();
    }
    settingsServiceInstance = new SettingsService(context);
    return settingsServiceInstance;
}
