import * as vscode from 'vscode';
import { SettingsService } from '../src/logic/SettingsService';

// Mock vscode configuration
let mockConfig: { [key: string]: any } = {};
let configChangeCallback: ((event: vscode.ConfigurationChangeEvent) => void) | null = null;

jest.mock('vscode', () => {
    const mockConfiguration = {
        get: jest.fn((key: string, defaultValue?: any) => {
            return mockConfig[key] !== undefined ? mockConfig[key] : defaultValue;
        }),
        update: jest.fn(async (key: string, value: any) => {
            mockConfig[key] = value;
            return Promise.resolve();
        })
    };

    const mockWorkspace = {
        getConfiguration: jest.fn(() => mockConfiguration),
        onDidChangeConfiguration: jest.fn((callback: any) => {
            configChangeCallback = callback;
            return { dispose: jest.fn() };
        })
    };

    const mockConfigurationTarget = {
        Global: 1,
        Workspace: 2,
        WorkspaceFolder: 3
    };

    return {
        workspace: mockWorkspace,
        ConfigurationTarget: mockConfigurationTarget,
        window: {
            showErrorMessage: jest.fn(),
            showInformationMessage: jest.fn()
        }
    };
});

describe('SettingsService', () => {
    let settingsService: SettingsService;

    beforeEach(() => {
        // Reset mock config before each test
        mockConfig = {
            'nlh.enabled': true,
            'nlh.colors.nouns': '#569CD6',
            'nlh.colors.verbs': '#4EC9B0',
            'nlh.colors.adjectives': '#C586C0',
            'nlh.colors.adverbs': '#DCDCAA',
            'nlh.colors.numbers': '#B5CEA8',
            'nlh.colors.properNouns': '#4FC1FF',
            'tasks.enableNotifications': true,
            'tasks.notificationFrequency': 'once',
            'tasks.showInStatusBar': true,
            'export.defaultDateRangeMonths': 6,
            'export.includeDescriptions': true,
            'export.groupRecurringTasks': true,
            'database.path': '.chroma/chroma.db'
        };
        settingsService = new SettingsService();
    });

    describe('getSettings', () => {
        test('should return all settings with correct default values', () => {
            const settings = settingsService.getSettings();
            
            expect(settings.nlh.enabled).toBe(true);
            expect(settings.nlh.colors.nouns).toBe('#569CD6');
            expect(settings.tasks.enableNotifications).toBe(true);
            expect(settings.export.defaultDateRangeMonths).toBe(6);
            expect(settings.database.path).toBe('.chroma/chroma.db');
        });

        test('should return correct settings structure', () => {
            const settings = settingsService.getSettings();
            
            expect(settings).toHaveProperty('nlh');
            expect(settings).toHaveProperty('tasks');
            expect(settings).toHaveProperty('export');
            expect(settings).toHaveProperty('database');
            expect(settings.nlh).toHaveProperty('colors');
        });
    });

    describe('getNlhSettings', () => {
        test('should return NLH settings', () => {
            const nlhSettings = settingsService.getNlhSettings();
            
            expect(nlhSettings.enabled).toBe(true);
            expect(nlhSettings.colors.nouns).toBe('#569CD6');
            expect(nlhSettings.colors.verbs).toBe('#4EC9B0');
        });

        test('should handle disabled NLH', () => {
            mockConfig['nlh.enabled'] = false;
            const nlhSettings = settingsService.getNlhSettings();
            
            expect(nlhSettings.enabled).toBe(false);
        });
    });

    describe('getTaskSettings', () => {
        test('should return task settings', () => {
            const taskSettings = settingsService.getTaskSettings();
            
            expect(taskSettings.enableNotifications).toBe(true);
            expect(taskSettings.notificationFrequency).toBe('once');
            expect(taskSettings.showInStatusBar).toBe(true);
        });

        test('should handle different notification frequencies', () => {
            mockConfig['tasks.notificationFrequency'] = 'hourly';
            let taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.notificationFrequency).toBe('hourly');

            mockConfig['tasks.notificationFrequency'] = 'daily';
            taskSettings = settingsService.getTaskSettings();
            expect(taskSettings.notificationFrequency).toBe('daily');
        });
    });

    describe('getExportSettings', () => {
        test('should return export settings', () => {
            const exportSettings = settingsService.getExportSettings();
            
            expect(exportSettings.defaultDateRangeMonths).toBe(6);
            expect(exportSettings.includeDescriptions).toBe(true);
            expect(exportSettings.groupRecurringTasks).toBe(true);
        });

        test('should handle custom date range months', () => {
            mockConfig['export.defaultDateRangeMonths'] = 12;
            const exportSettings = settingsService.getExportSettings();
            
            expect(exportSettings.defaultDateRangeMonths).toBe(12);
        });
    });

    describe('getDatabaseSettings', () => {
        test('should return database settings', () => {
            const dbSettings = settingsService.getDatabaseSettings();
            
            expect(dbSettings.path).toBe('.chroma/chroma.db');
        });

        test('should handle custom database path', () => {
            mockConfig['database.path'] = 'custom/path/db.db';
            const dbSettings = settingsService.getDatabaseSettings();
            
            expect(dbSettings.path).toBe('custom/path/db.db');
        });
    });

    describe('updateSetting', () => {
        test('should update a setting', async () => {
            await settingsService.updateSetting('nlh.enabled', false);
            
            expect(mockConfig['nlh.enabled']).toBe(false);
        });

        test('should update nested settings', async () => {
            await settingsService.updateSetting('nlh.colors.nouns', '#FF0000');
            
            expect(mockConfig['nlh.colors.nouns']).toBe('#FF0000');
        });
    });

    describe('isValidHexColor', () => {
        test('should validate correct hex colors', () => {
            expect(settingsService.isValidHexColor('#569CD6')).toBe(true);
            expect(settingsService.isValidHexColor('#FFFFFF')).toBe(true);
            expect(settingsService.isValidHexColor('#000000')).toBe(true);
            expect(settingsService.isValidHexColor('#abc123')).toBe(true);
        });

        test('should reject invalid hex colors', () => {
            expect(settingsService.isValidHexColor('#56')).toBe(false);
            expect(settingsService.isValidHexColor('569CD6')).toBe(false);
            expect(settingsService.isValidHexColor('#GGGGGG')).toBe(false);
            expect(settingsService.isValidHexColor('#56-CD6')).toBe(false);
            expect(settingsService.isValidHexColor('')).toBe(false);
        });
    });

    describe('isValidDatabasePath', () => {
        test('should validate correct database paths', () => {
            expect(settingsService.isValidDatabasePath('.chroma/chroma.db')).toBe(true);
            expect(settingsService.isValidDatabasePath('data/db.db')).toBe(true);
            expect(settingsService.isValidDatabasePath('custom.db')).toBe(true);
        });

        test('should reject invalid database paths', () => {
            expect(settingsService.isValidDatabasePath('/absolute/path.db')).toBe(false);
            expect(settingsService.isValidDatabasePath('\\windows\\path.db')).toBe(false);
            expect(settingsService.isValidDatabasePath('.chroma/chroma.txt')).toBe(false);
            expect(settingsService.isValidDatabasePath('no-extension')).toBe(false);
        });
    });

    describe('validateSettings', () => {
        test('should pass validation with valid settings', () => {
            const result = settingsService.validateSettings();
            
            expect(result.valid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should fail validation with invalid hex color', () => {
            mockConfig['nlh.colors.nouns'] = 'invalid';
            const result = settingsService.validateSettings();
            
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toContain('Invalid hex color');
        });

        test('should fail validation with invalid date range', () => {
            mockConfig['export.defaultDateRangeMonths'] = 100;
            const result = settingsService.validateSettings();
            
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toContain('Invalid defaultDateRangeMonths');
        });

        test('should fail validation with invalid database path', () => {
            mockConfig['database.path'] = '/absolute/path.db';
            const result = settingsService.validateSettings();
            
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(0);
            expect(result.errors[0]).toContain('Invalid database path');
        });

        test('should collect multiple validation errors', () => {
            mockConfig['nlh.colors.nouns'] = 'invalid';
            mockConfig['nlh.colors.verbs'] = 'bad';
            mockConfig['export.defaultDateRangeMonths'] = 0;
            const result = settingsService.validateSettings();
            
            expect(result.valid).toBe(false);
            expect(result.errors.length).toBeGreaterThan(2);
        });
    });

    describe('onDidChangeSettings', () => {
        test('should register callback for settings changes', () => {
            const callback = jest.fn();
            settingsService.onDidChangeSettings(callback);
            
            expect(callback).not.toHaveBeenCalled();
        });

        test('should invoke callback when settings change', () => {
            const callback = jest.fn();
            settingsService.onDidChangeSettings(callback);
            
            // Simulate configuration change
            if (configChangeCallback) {
                const mockEvent = {
                    affectsConfiguration: (section: string) => section === 'chroma'
                } as vscode.ConfigurationChangeEvent;
                configChangeCallback(mockEvent);
            }
            
            expect(callback).toHaveBeenCalled();
        });
    });

    describe('Edge Cases', () => {
        test('should handle missing configuration values with defaults', () => {
            mockConfig = {}; // Empty config
            const settings = settingsService.getSettings();
            
            expect(settings.nlh.enabled).toBe(true);
            expect(settings.tasks.enableNotifications).toBe(true);
            expect(settings.export.defaultDateRangeMonths).toBe(6);
        });

        test('should handle boundary values for date range', () => {
            mockConfig['export.defaultDateRangeMonths'] = 1;
            let result = settingsService.validateSettings();
            expect(result.valid).toBe(true);

            mockConfig['export.defaultDateRangeMonths'] = 60;
            result = settingsService.validateSettings();
            expect(result.valid).toBe(true);
        });

        test('should validate all color properties', () => {
            const colorKeys = ['nouns', 'verbs', 'adjectives', 'adverbs', 'numbers', 'properNouns'];
            colorKeys.forEach(key => {
                mockConfig[`nlh.colors.${key}`] = '#FFFFFF';
            });
            
            const result = settingsService.validateSettings();
            expect(result.valid).toBe(true);
        });
    });
});
