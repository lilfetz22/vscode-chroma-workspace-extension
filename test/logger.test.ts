import { Logger, LogLevel, ScopedLogger } from '../src/logic/Logger';
import * as vscode from 'vscode';

jest.mock('vscode');

describe('Logger', () => {
    let logger: Logger;
    let mockOutputChannel: any;

    beforeEach(() => {
        mockOutputChannel = {
            appendLine: jest.fn(),
            show: jest.fn(),
            clear: jest.fn(),
            dispose: jest.fn()
        };
        
        (vscode.window.createOutputChannel as jest.Mock).mockReturnValue(mockOutputChannel);
        
        // Reset the singleton instance for each test
        (Logger as any).instance = undefined;
        logger = Logger.getInstance();
    });

    afterEach(() => {
        logger.dispose();
    });

    describe('Singleton Pattern', () => {
        it('should return the same instance', () => {
            const logger1 = Logger.getInstance();
            const logger2 = Logger.getInstance();
            expect(logger1).toBe(logger2);
        });

        it('should create output channel once per instance', () => {
            // Clear the mock call history
            (vscode.window.createOutputChannel as jest.Mock).mockClear();
            
            // Reset the singleton
            (Logger as any).instance = undefined;
            
            Logger.getInstance();
            Logger.getInstance();
            expect(vscode.window.createOutputChannel).toHaveBeenCalledTimes(1);
        });
    });

    describe('Log Levels', () => {
        it('should respect log level for debug', () => {
            logger.setLogLevel(LogLevel.INFO);
            logger.debug('Debug message');
            expect(mockOutputChannel.appendLine).not.toHaveBeenCalled();
        });

        it('should log info when level is INFO', () => {
            logger.setLogLevel(LogLevel.INFO);
            logger.info('Info message');
            expect(mockOutputChannel.appendLine).toHaveBeenCalled();
        });

        it('should log warnings when level is INFO', () => {
            logger.setLogLevel(LogLevel.INFO);
            logger.warn('Warning message');
            expect(mockOutputChannel.appendLine).toHaveBeenCalled();
        });

        it('should log errors when level is INFO', () => {
            logger.setLogLevel(LogLevel.INFO);
            logger.error('Error message');
            expect(mockOutputChannel.appendLine).toHaveBeenCalled();
        });

        it('should only log errors when level is ERROR', () => {
            logger.setLogLevel(LogLevel.ERROR);
            logger.debug('Debug');
            logger.info('Info');
            logger.warn('Warning');
            logger.error('Error');
            
            expect(mockOutputChannel.appendLine).toHaveBeenCalledTimes(1);
        });

        it('should log all levels when level is DEBUG', () => {
            logger.setLogLevel(LogLevel.DEBUG);
            logger.debug('Debug');
            logger.info('Info');
            logger.warn('Warning');
            logger.error('Error');
            
            expect(mockOutputChannel.appendLine).toHaveBeenCalledTimes(4);
        });
    });

    describe('Context', () => {
        it('should include context in log messages', () => {
            logger.setContext('TestContext');
            logger.info('Test message');
            
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('[TestContext]');
            expect(call).toContain('Test message');
        });

        it('should clear context', () => {
            logger.setContext('TestContext');
            logger.info('Message 1');
            
            logger.clearContext();
            logger.info('Message 2');
            
            const call1 = mockOutputChannel.appendLine.mock.calls[0][0];
            const call2 = mockOutputChannel.appendLine.mock.calls[1][0];
            
            expect(call1).toContain('[TestContext]');
            expect(call2).not.toContain('[TestContext]');
        });
    });

    describe('Log Message Format', () => {
        it('should include timestamp in log messages', () => {
            logger.info('Test message');
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toMatch(/\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
        });

        it('should include log level in messages', () => {
            logger.info('Test message');
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('[INFO]');
        });

        it('should format error objects', () => {
            const error = new Error('Test error');
            logger.error('Error occurred', error);
            
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('Error occurred');
            expect(call).toContain('Test error');
        });

        it('should include additional arguments', () => {
            logger.info('Test message', { key: 'value' }, 123);
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('"key":"value"');
            expect(call).toContain('123');
        });
    });

    describe('Output Channel Methods', () => {
        it('should show output channel', () => {
            logger.show();
            expect(mockOutputChannel.show).toHaveBeenCalled();
        });

        it('should clear output channel', () => {
            logger.clear();
            expect(mockOutputChannel.clear).toHaveBeenCalled();
        });

        it('should dispose output channel', () => {
            logger.dispose();
            expect(mockOutputChannel.dispose).toHaveBeenCalled();
        });
    });

    describe('Scoped Logger', () => {
        it('should create scoped logger with context', () => {
            const scopedLogger = logger.createScoped('ScopedContext');
            expect(scopedLogger).toBeInstanceOf(ScopedLogger);
        });

        it('should prefix messages with scope context', () => {
            const scopedLogger = logger.createScoped('ScopedContext');
            scopedLogger.info('Test message');
            
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('[ScopedContext]');
            expect(call).toContain('Test message');
        });

        it('should not affect parent logger context', () => {
            logger.setContext('ParentContext');
            const scopedLogger = logger.createScoped('ScopedContext');
            
            scopedLogger.info('Scoped message');
            logger.info('Parent message');
            
            const call1 = mockOutputChannel.appendLine.mock.calls[0][0];
            const call2 = mockOutputChannel.appendLine.mock.calls[1][0];
            
            expect(call1).toContain('[ScopedContext]');
            expect(call2).toContain('[ParentContext]');
        });

        it('should support all log levels', () => {
            logger.setLogLevel(LogLevel.DEBUG);
            const scopedLogger = logger.createScoped('Scoped');
            
            scopedLogger.debug('Debug');
            scopedLogger.info('Info');
            scopedLogger.warn('Warning');
            scopedLogger.error('Error');
            
            expect(mockOutputChannel.appendLine).toHaveBeenCalledTimes(4);
        });
    });

    describe('Error Handling', () => {
        it('should handle Error objects', () => {
            const error = new Error('Test error');
            error.stack = 'Error stack trace';
            logger.error('Error occurred', error);
            
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('Test error');
            expect(call).toContain('Error stack trace');
        });

        it('should handle non-Error objects', () => {
            const errorObj = { code: 'ERR001', message: 'Custom error' };
            logger.error('Error occurred', errorObj);
            
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('ERR001');
            expect(call).toContain('Custom error');
        });

        it('should handle undefined error', () => {
            logger.error('Error occurred');
            const call = mockOutputChannel.appendLine.mock.calls[0][0];
            expect(call).toContain('Error occurred');
        });
    });

    describe('Console Integration', () => {
        let consoleErrorSpy: jest.SpyInstance;
        let consoleWarnSpy: jest.SpyInstance;

        beforeEach(() => {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
            consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
        });

        afterEach(() => {
            consoleErrorSpy.mockRestore();
            consoleWarnSpy.mockRestore();
        });

        it('should output errors to console', () => {
            logger.error('Error message');
            expect(consoleErrorSpy).toHaveBeenCalled();
        });

        it('should output warnings to console', () => {
            logger.warn('Warning message');
            expect(consoleWarnSpy).toHaveBeenCalled();
        });

        it('should not output info to console', () => {
            logger.info('Info message');
            expect(consoleErrorSpy).not.toHaveBeenCalled();
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });
    });
});
