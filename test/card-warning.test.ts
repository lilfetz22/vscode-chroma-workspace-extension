import { SettingsService } from '../src/logic/SettingsService';

// Mock vscode configuration
let mockConfig: { [key: string]: any } = {};

jest.mock('vscode', () => {
  const mockConfiguration = {
    get: jest.fn((key: string, defaultValue?: any) => {
      return mockConfig[key] !== undefined ? mockConfig[key] : defaultValue;
    }),
    update: jest.fn(async (key: string, value: any) => {
      mockConfig[key] = value;
      return Promise.resolve();
    }),
  };

  return {
    workspace: {
      getConfiguration: jest.fn(() => mockConfiguration),
      onDidChangeConfiguration: jest.fn(() => ({ dispose: jest.fn() })),
    },
    window: {
      showWarningMessage: jest.fn(),
    },
    ConfigurationTarget: { Global: 1, Workspace: 2, WorkspaceFolder: 3 },
  };
});

describe('Vacation mode board targeting for card warnings', () => {
  let settings: SettingsService;

  beforeEach(() => {
    mockConfig = {};
    mockConfig['tasks.vacationMode'] = false;
    mockConfig['tasks.vacationModeBoards'] = [];
    settings = new SettingsService();
  });

  afterEach(() => {
    settings.dispose();
  });

  test('returns false when vacation mode is off', () => {
    mockConfig['tasks.vacationMode'] = false;
    expect(settings.isVacationModeActiveForBoard('board-1')).toBe(false);
    expect(settings.isVacationModeActiveForBoard(undefined)).toBe(false);
  });

  test('returns true for all boards when boards list is empty array', () => {
    mockConfig['tasks.vacationMode'] = true;
    mockConfig['tasks.vacationModeBoards'] = [];
    expect(settings.isVacationModeActiveForBoard('board-1')).toBe(true);
    expect(settings.isVacationModeActiveForBoard('board-2')).toBe(true);
    expect(settings.isVacationModeActiveForBoard(undefined)).toBe(true);
  });

  test('returns true for all boards when boards list is null', () => {
    mockConfig['tasks.vacationMode'] = true;
    // Simulate null configured list
    mockConfig['tasks.vacationModeBoards'] = null;
    expect(settings.isVacationModeActiveForBoard('board-1')).toBe(true);
    expect(settings.isVacationModeActiveForBoard('board-2')).toBe(true);
    expect(settings.isVacationModeActiveForBoard(undefined)).toBe(true);
  });

  test('returns true only for boards in list when list has entries (by id)', () => {
    mockConfig['tasks.vacationMode'] = true;
    mockConfig['tasks.vacationModeBoards'] = ['board-1'];
    expect(settings.isVacationModeActiveForBoard('board-1')).toBe(true);
    expect(settings.isVacationModeActiveForBoard('board-2')).toBe(false);
    expect(settings.isVacationModeActiveForBoard(undefined)).toBe(false);
  });

  test('matches by exact board name (case-insensitive)', () => {
    mockConfig['tasks.vacationMode'] = true;
    mockConfig['tasks.vacationModeBoards'] = ['Personal Board'];
    expect(settings.isVacationModeActiveForBoard('board-1', 'Personal Board')).toBe(true);
    expect(settings.isVacationModeActiveForBoard('board-2', 'personal board')).toBe(true);
    expect(settings.isVacationModeActiveForBoard('board-3', 'Another Board')).toBe(false);
  });
});
