import * as vscode from 'vscode';
import { getDebugLogger } from './DebugLogger';

export enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}

/**
 * Logger service for Chroma Workspace extension
 * Provides centralized logging with different log levels and output to VS Code Output channel
 */
export class Logger {
    private static instance: Logger;
    private outputChannel: vscode.OutputChannel;
    private logLevel: LogLevel = LogLevel.INFO;
    private context: string = '';

    private constructor() {
        this.outputChannel = vscode.window.createOutputChannel('Chroma Workspace');
    }

    /**
     * Get the singleton instance of Logger
     */
    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    /**
     * Set the minimum log level
     */
    public setLogLevel(level: LogLevel): void {
        this.logLevel = level;
    }

    /**
     * Set context for subsequent log messages
     */
    public setContext(context: string): void {
        this.context = context;
    }

    /**
     * Clear the context
     */
    public clearContext(): void {
        this.context = '';
    }

    /**
     * Get the current context
     */
    public getContext(): string | undefined {
        return this.context;
    }

    /**
     * Log a debug message
     */
    public debug(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.DEBUG) {
            this.log(LogLevel.DEBUG, message, ...args);
        }
    }

    /**
     * Log an info message
     */
    public info(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.INFO) {
            this.log(LogLevel.INFO, message, ...args);
            // Also write to debug log file
            try {
                const debugLogger = getDebugLogger();
                const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
                debugLogger.log(`[INFO] ${message}${argsStr}`);
            } catch (e) {
                // Silently fail if debug logger not available
            }
        }
    }

    /**
     * Log a warning message
     */
    public warn(message: string, ...args: any[]): void {
        if (this.logLevel <= LogLevel.WARN) {
            this.log(LogLevel.WARN, message, ...args);
            // Also write to debug log file
            try {
                const debugLogger = getDebugLogger();
                const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
                debugLogger.log(`[WARN] ${message}${argsStr}`);
            } catch (e) {
                // Silently fail if debug logger not available
            }
        }
    }

    /**
     * Log an error message
     */
    public error(message: string, error?: Error | any, ...args: any[]): void {
        if (this.logLevel <= LogLevel.ERROR) {
            const errorMessage = error instanceof Error 
                ? `${message}: ${error.message}\n${error.stack}` 
                : `${message}: ${JSON.stringify(error) || ''}`;
            this.log(LogLevel.ERROR, errorMessage, ...args);
            // Also write to debug log file with full details
            try {
                const debugLogger = getDebugLogger();
                const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
                debugLogger.log(`[ERROR] ${errorMessage}${argsStr}`);
            } catch (e) {
                // Silently fail if debug logger not available
            }
        }
    }

    /**
     * Log a message with timestamp and context
     */
    private log(level: LogLevel, message: string, ...args: any[]): void {
        const timestamp = new Date().toISOString();
        const levelStr = LogLevel[level];
        const contextStr = this.context ? `[${this.context}] ` : '';
        const argsStr = args.length > 0 ? ` ${JSON.stringify(args)}` : '';
        
        const logMessage = `[${timestamp}] [${levelStr}] ${contextStr}${message}${argsStr}`;
        this.outputChannel.appendLine(logMessage);

        // For errors and warnings, also show in console
        if (level === LogLevel.ERROR) {
            console.error(logMessage);
        } else if (level === LogLevel.WARN) {
            console.warn(logMessage);
        }
    }

    /**
     * Show the output channel
     */
    public show(): void {
        this.outputChannel.show();
    }

    /**
     * Clear the output channel
     */
    public clear(): void {
        this.outputChannel.clear();
    }

    /**
     * Dispose the logger
     */
    public dispose(): void {
        this.outputChannel.dispose();
    }

    /**
     * Create a scoped logger with a specific context
     */
    public createScoped(context: string): ScopedLogger {
        return new ScopedLogger(this, context);
    }
}

/**
 * Scoped logger that automatically prefixes all messages with a context
 */
export class ScopedLogger {
    constructor(
        private logger: Logger,
        private scopeContext: string
    ) {}

    public debug(message: string, ...args: any[]): void {
        const originalContext = this.logger['context'];
        this.logger.setContext(this.scopeContext);
        this.logger.debug(message, ...args);
        this.logger['context'] = originalContext;
    }

    public info(message: string, ...args: any[]): void {
        const originalContext = this.logger['context'];
        this.logger.setContext(this.scopeContext);
        this.logger.info(message, ...args);
        this.logger['context'] = originalContext;
    }

    public warn(message: string, ...args: any[]): void {
        const originalContext = this.logger['context'];
        this.logger.setContext(this.scopeContext);
        this.logger.warn(message, ...args);
        this.logger['context'] = originalContext;
    }

    public error(message: string, error?: Error | any, ...args: any[]): void {
        const originalContext = this.logger['context'];
        this.logger.setContext(this.scopeContext);
        this.logger.error(message, error, ...args);
        this.logger['context'] = originalContext;
    }
}

// Export convenience functions
export const logger = Logger.getInstance();
export const createLogger = (context: string): ScopedLogger => logger.createScoped(context);
