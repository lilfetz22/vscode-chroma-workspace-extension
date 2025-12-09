import * as fs from 'fs';
import * as path from 'path';

class DebugLogger {
    private logFile: string;
    private stream: fs.WriteStream | null = null;

    constructor(workspaceRoot?: string) {
        const logDir = workspaceRoot || process.cwd();
        this.logFile = path.join(logDir, 'chroma-debug.log');
        this.initLogFile();
    }

    private initLogFile() {
        try {
            // Ensure directory exists so log file can be created alongside the database
            fs.mkdirSync(path.dirname(this.logFile), { recursive: true });
            // Create new log file, overwriting if exists
            this.stream = fs.createWriteStream(this.logFile, { flags: 'w' });
            this.log('=== Chroma Debug Log Started ===');
            this.log(`Timestamp: ${new Date().toISOString()}`);
            this.log(`Log file: ${this.logFile}`);
            this.log('');
        } catch (err) {
            console.error('Failed to create debug log file:', err);
        }
    }

    log(...args: any[]) {
        const timestamp = new Date().toISOString();
        const message = args.map(arg => {
            if (typeof arg === 'object') {
                try {
                    return JSON.stringify(arg, null, 2);
                } catch {
                    return String(arg);
                }
            }
            return String(arg);
        }).join(' ');

        const logLine = `[${timestamp}] ${message}\n`;

        // Write to file
        if (this.stream) {
            this.stream.write(logLine);
        }

        // Also log to console
        console.log(...args);
    }

    close() {
        if (this.stream) {
            this.stream.end();
            this.stream = null;
        }
    }
}

let debugLogger: DebugLogger | null = null;

export function initDebugLogger(workspaceRoot?: string): DebugLogger {
    if (!debugLogger) {
        debugLogger = new DebugLogger(workspaceRoot);
    }
    return debugLogger;
}

export function getDebugLogger(): DebugLogger {
    if (!debugLogger) {
        debugLogger = new DebugLogger();
    }
    return debugLogger;
}

export function closeDebugLogger() {
    if (debugLogger) {
        debugLogger.close();
        debugLogger = null;
    }
}
