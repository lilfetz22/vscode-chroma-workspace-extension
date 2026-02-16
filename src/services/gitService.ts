import * as vscode from 'vscode';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs';
import { getDebugLogger } from '../logic/DebugLogger';

const execPromise = promisify(exec);

export interface GitSyncResult {
  success: boolean;
  message: string;
  needsAttention?: boolean;
}

export class GitService {
  private syncInProgress = false;
  private autoSyncTimeout: NodeJS.Timeout | null = null;
  private lastSyncTime = 0;
  private fileWatcher: vscode.FileSystemWatcher | null = null;
  private readonly DEBOUNCE_DELAY = 10000; // 10 seconds
  private readonly MIN_SYNC_INTERVAL = 5000; // Minimum 5 seconds between syncs
  private gitRepositoryRoot: string | null = null;

  constructor(private databasePath: string) {}

  /**
   * Check if Git sync is enabled in settings
   */
  private isGitSyncEnabled(): boolean {
    const config = vscode.workspace.getConfiguration('chroma.sync');
    return config.get<boolean>('enableGitSync', false);
  }

  /**
   * Check if auto-push on changes is enabled
   */
  private isAutoPushEnabled(): boolean {
    const config = vscode.workspace.getConfiguration('chroma.sync');
    return config.get<boolean>('autoPushOnChanges', true);
  }

  /**
   * Get the directory containing the database
   */
  private getDatabaseDirectory(): string {
    return path.dirname(this.databasePath);
  }

  /**
   * Find the Git repository root by traversing up from the database directory
   */
  private async findGitRepository(): Promise<string | null> {
    let currentDir = this.getDatabaseDirectory();
    const root = path.parse(currentDir).root;

    // Traverse up the directory tree looking for .git
    while (currentDir !== root) {
      const gitDir = path.join(currentDir, '.git');
      if (fs.existsSync(gitDir)) {
        return currentDir;
      }
      const parentDir = path.dirname(currentDir);
      if (parentDir === currentDir) {
        break; // Reached the root without finding .git
      }
      currentDir = parentDir;
    }

    return null;
  }

  /**
   * Get the Git repository root (caches the result)
   */
  private async getGitRepositoryRoot(): Promise<string | null> {
    if (this.gitRepositoryRoot === null) {
      this.gitRepositoryRoot = await this.findGitRepository();
    }
    return this.gitRepositoryRoot;
  }

  /**
   * Check if we can find a Git repository
   */
  private async isGitRepository(): Promise<boolean> {
    const gitRoot = await this.getGitRepositoryRoot();
    return gitRoot !== null;
  }

  /**
   * Execute a Git command in the Git repository root
   */
  private async executeGitCommand(command: string): Promise<{ stdout: string; stderr: string }> {
    const gitRoot = await this.getGitRepositoryRoot();
    if (!gitRoot) {
      getDebugLogger().log('Git Sync: No Git repository root found');
      throw new Error('Git repository not found');
    }
    try {
      getDebugLogger().log(`Git Sync: Executing command: ${command}`);
      getDebugLogger().log(`Git Sync: Working directory: ${gitRoot}`);
      const result = await execPromise(command, {
        cwd: gitRoot,
        timeout: 30000, // 30 second timeout
      });
      if (result.stdout) {
        getDebugLogger().log(`Git Sync: stdout: ${result.stdout}`);
      }
      if (result.stderr) {
        getDebugLogger().log(`Git Sync: stderr: ${result.stderr}`);
      }
      return result;
    } catch (error: any) {
      getDebugLogger().log(`Git Sync: Command failed: ${command}`);
      getDebugLogger().log(`Git Sync: Error: ${error.message}`);
      if (error.stderr) {
        getDebugLogger().log(`Git Sync: Error stderr: ${error.stderr}`);
      }
      if (error.stdout) {
        getDebugLogger().log(`Git Sync: Error stdout: ${error.stdout}`);
      }
      throw new Error(`Git command failed: ${error.message}`);
    }
  }

  /**
   * Check if Git is installed
   */
  private async isGitInstalled(): Promise<boolean> {
    try {
      await execPromise('git --version');
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if there are uncommitted changes
   */
  private async hasUncommittedChanges(): Promise<boolean> {
    try {
      const { stdout } = await this.executeGitCommand('git status --porcelain');
      return stdout.trim().length > 0;
    } catch {
      return false;
    }
  }

  /**
   * Stash uncommitted changes
   */
  private async gitStash(): Promise<GitSyncResult> {
    try {
      await this.executeGitCommand('git stash push -m "Chroma auto-sync stash"');
      return {
        success: true,
        message: 'Stashed uncommitted changes',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to stash changes: ${error.message}`,
      };
    }
  }

  /**
   * Pop stashed changes
   */
  private async gitStashPop(): Promise<GitSyncResult> {
    try {
      const { stdout, stderr } = await this.executeGitCommand('git stash pop');
      
      // Check for conflicts when popping stash
      if (stderr.includes('CONFLICT') || stdout.includes('CONFLICT')) {
        return {
          success: false,
          message: 'Conflict occurred when reapplying stashed changes. Please resolve manually.',
          needsAttention: true,
        };
      }

      return {
        success: true,
        message: 'Reapplied stashed changes',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to reapply stashed changes: ${error.message}`,
        needsAttention: true,
      };
    }
  }

  /**
   * Perform a git pull with rebase, handling uncommitted changes
   */
  private async gitPull(): Promise<GitSyncResult> {
    let didStash = false;

    try {
      getDebugLogger().log('Git Sync: Starting pull operation');
      
      // Check if there are uncommitted changes
      const hasChanges = await this.hasUncommittedChanges();
      getDebugLogger().log(`Git Sync: Has uncommitted changes: ${hasChanges}`);
      
      if (hasChanges) {
        // Stash changes before pulling
        getDebugLogger().log('Git Sync: Stashing uncommitted changes');
        const stashResult = await this.gitStash();
        if (!stashResult.success) {
          return stashResult;
        }
        didStash = true;
      }

      // Use a simpler pull strategy to avoid "multiple branches" error
      // Instead of pull --rebase, use fetch + rebase explicitly
      getDebugLogger().log('Git Sync: Fetching from remote');
      
      try {
        // First, try to fetch from origin
        await this.executeGitCommand('git fetch origin');
      } catch (fetchError: any) {
        getDebugLogger().log('Git Sync: Fetch failed, trying simple fetch');
        await this.executeGitCommand('git fetch');
      }

      // Get current branch name
      const { stdout: branchOutput } = await this.executeGitCommand('git branch --show-current');
      const currentBranch = branchOutput.trim();
      getDebugLogger().log(`Git Sync: Current branch: ${currentBranch}`);

      if (!currentBranch) {
        getDebugLogger().log('Git Sync: Not on a branch (detached HEAD?)');
        return {
          success: true,
          message: 'Not on a branch - skipping pull',
        };
      }

      // Try to get the upstream branch
      try {
        const { stdout: upstreamOutput } = await this.executeGitCommand(`git rev-parse --abbrev-ref ${currentBranch}@{upstream}`);
        const upstream = upstreamOutput.trim();
        getDebugLogger().log(`Git Sync: Upstream branch: ${upstream}`);

        // Now rebase onto the upstream
        getDebugLogger().log(`Git Sync: Rebasing onto ${upstream}`);
        const { stdout, stderr } = await this.executeGitCommand(`git rebase ${upstream}`);
        
        // Check for conflicts
        if (stderr.includes('CONFLICT') || stdout.includes('CONFLICT')) {
          getDebugLogger().log('Git Sync: Conflict detected during rebase');
          return {
            success: false,
            message: 'Merge conflict detected during pull. Please resolve conflicts manually in the repository.',
            needsAttention: true,
          };
        }
      } catch (upstreamError: any) {
        getDebugLogger().log(`Git Sync: No upstream configured or error getting upstream: ${upstreamError.message}`);
        // If no upstream, that's okay for first-time setup
        if (didStash) {
          const popResult = await this.gitStashPop();
          if (!popResult.success) {
            return popResult;
          }
        }
        return {
          success: true,
          message: 'No upstream branch configured (this is normal for first-time setup)',
        };
      }

      // If we stashed changes, pop them back
      if (didStash) {
        getDebugLogger().log('Git Sync: Popping stashed changes');
        const popResult = await this.gitStashPop();
        if (!popResult.success) {
          return popResult;
        }
      }

      getDebugLogger().log('Git Sync: Pull completed successfully');
      return {
        success: true,
        message: 'Successfully pulled changes from remote',
      };
    } catch (error: any) {
      getDebugLogger().log(`Git Sync: Pull failed with error: ${error.message}`);
      
      // If we stashed and pull failed, try to pop the stash back
      if (didStash) {
        try {
          getDebugLogger().log('Git Sync: Attempting to restore stash after error');
          await this.gitStashPop();
        } catch (popError) {
          getDebugLogger().log(`Git Sync: Failed to restore stash: ${popError}`);
          // Ignore pop errors, the original error is more important
        }
      }

      // Handle case where remote doesn't exist yet
      if (error.message.includes('no tracking information') || 
          error.message.includes('refusing to merge unrelated histories') ||
          error.message.includes('no upstream branch')) {
        return {
          success: true,
          message: 'No remote tracking branch configured (this is normal for first-time setup)',
        };
      }
      
      return {
        success: false,
        message: `Failed to pull changes: ${error.message}`,
        needsAttention: true,
      };
    }
  }

  /**
   * Stage all changes in the database directory
   */
  private async gitAdd(): Promise<GitSyncResult> {
    try {
      await this.executeGitCommand('git add .');
      return {
        success: true,
        message: 'Staged changes',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `Failed to stage changes: ${error.message}`,
      };
    }
  }

  /**
   * Commit changes with a timestamped message
   */
  private async gitCommit(): Promise<GitSyncResult> {
    try {
      // Check if there are changes to commit
      const hasChanges = await this.hasUncommittedChanges();
      if (!hasChanges) {
        return {
          success: true,
          message: 'No changes to commit',
        };
      }

      const timestamp = new Date().toISOString();
      const commitMessage = `Chroma Workspace Auto-sync: ${timestamp}`;
      await this.executeGitCommand(`git commit -m "${commitMessage}"`);
      
      return {
        success: true,
        message: 'Committed changes',
      };
    } catch (error: any) {
      // If there's nothing to commit, that's not an error
      if (error.message.includes('nothing to commit')) {
        return {
          success: true,
          message: 'No changes to commit',
        };
      }
      return {
        success: false,
        message: `Failed to commit changes: ${error.message}`,
      };
    }
  }

  /**
   * Push changes to remote
   */
  private async gitPush(): Promise<GitSyncResult> {
    try {
      const { stdout, stderr } = await this.executeGitCommand('git push');
      return {
        success: true,
        message: 'Successfully pushed changes to remote',
      };
    } catch (error: any) {
      // Handle case where remote doesn't exist
      if (error.message.includes('No configured push destination') || 
          error.message.includes('no upstream branch')) {
        return {
          success: false,
          message: 'No remote repository configured. Please set up a remote with: git remote add origin <url>',
          needsAttention: true,
        };
      }
      return {
        success: false,
        message: `Failed to push changes: ${error.message}`,
        needsAttention: true,
      };
    }
  }

  /**
   * Perform the full sync operation (pull, add, commit, push)
   */
  async sync(): Promise<GitSyncResult> {
    getDebugLogger().log('=== Git Sync: Starting sync operation ===');
    
    // Check if sync is already in progress
    if (this.syncInProgress) {
      getDebugLogger().log('Git Sync: Sync already in progress, skipping');
      return {
        success: false,
        message: 'Sync already in progress',
      };
    }

    // Check if enough time has passed since last sync
    const now = Date.now();
    if (now - this.lastSyncTime < this.MIN_SYNC_INTERVAL) {
      getDebugLogger().log('Git Sync: Rate limited, skipping');
      return {
        success: false,
        message: 'Sync rate limited. Please wait a few seconds.',
      };
    }

    // Check if Git sync is enabled
    if (!this.isGitSyncEnabled()) {
      getDebugLogger().log('Git Sync: Sync is disabled in settings');
      return {
        success: false,
        message: 'Git sync is not enabled. Enable it in settings: chroma.sync.enableGitSync',
      };
    }

    this.syncInProgress = true;
    this.lastSyncTime = now;

    try {
      // Pre-flight checks
      getDebugLogger().log('Git Sync: Checking if Git is installed');
      const gitInstalled = await this.isGitInstalled();
      if (!gitInstalled) {
        getDebugLogger().log('Git Sync: Git is not installed');
        return {
          success: false,
          message: 'Git is not installed. Please install Git to use sync functionality.',
          needsAttention: true,
        };
      }

      getDebugLogger().log('Git Sync: Finding Git repository root');
      const gitRoot = await this.getGitRepositoryRoot();
      if (!gitRoot) {
        getDebugLogger().log('Git Sync: No Git repository found');
        return {
          success: false,
          message: `No Git repository found for the database at ${this.getDatabaseDirectory()}. Please initialize a Git repository in this directory or a parent directory with 'git init' and configure a remote.`,
          needsAttention: true,
        };
      }
      getDebugLogger().log(`Git Sync: Using Git repository at: ${gitRoot}`);

      // Step 1: Pull changes
      getDebugLogger().log('Git Sync: Step 1 - Pulling changes');
      const pullResult = await this.gitPull();
      if (!pullResult.success) {
        getDebugLogger().log(`Git Sync: Pull failed: ${pullResult.message}`);
        return pullResult;
      }
      getDebugLogger().log('Git Sync: Pull completed');

      // Step 2: Add changes
      getDebugLogger().log('Git Sync: Step 2 - Adding changes');
      const addResult = await this.gitAdd();
      if (!addResult.success) {
        getDebugLogger().log(`Git Sync: Add failed: ${addResult.message}`);
        return addResult;
      }
      getDebugLogger().log('Git Sync: Add completed');

      // Step 3: Commit changes
      getDebugLogger().log('Git Sync: Step 3 - Committing changes');
      const commitResult = await this.gitCommit();
      if (!commitResult.success) {
        getDebugLogger().log(`Git Sync: Commit failed: ${commitResult.message}`);
        return commitResult;
      }
      getDebugLogger().log(`Git Sync: Commit completed - ${commitResult.message}`);

      // Step 4: Push changes (only if there were changes to commit)
      if (commitResult.message !== 'No changes to commit') {
        getDebugLogger().log('Git Sync: Step 4 - Pushing changes');
        const pushResult = await this.gitPush();
        if (!pushResult.success) {
          getDebugLogger().log(`Git Sync: Push failed: ${pushResult.message}`);
          return pushResult;
        }
        getDebugLogger().log('Git Sync: Push completed');
      } else {
        getDebugLogger().log('Git Sync: No changes to push');
      }

      getDebugLogger().log('=== Git Sync: Sync operation completed successfully ===');
      return {
        success: true,
        message: 'Sync completed successfully',
      };
    } catch (error: any) {
      getDebugLogger().log(`Git Sync: Sync failed with unexpected error: ${error.message}`);
      if (error.stack) {
        getDebugLogger().log(`Git Sync: Stack trace: ${error.stack}`);
      }
      return {
        success: false,
        message: `Sync failed: ${error.message}`,
        needsAttention: true,
      };
    } finally {
      this.syncInProgress = false;
      getDebugLogger().log('Git Sync: Sync operation ended');
    }
  }

  /**
   * Perform sync with VS Code progress notification
   */
  async syncWithProgress(): Promise<void> {
    await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Chroma Workspace Sync',
        cancellable: false,
      },
      async (progress: vscode.Progress<{ message?: string; increment?: number }>) => {
        progress.report({ message: 'Syncing with Git repository...' });
        
        const result = await this.sync();
        
        if (result.success) {
          vscode.window.showInformationMessage(`Chroma Sync: ${result.message}`);
        } else {
          if (result.needsAttention) {
            vscode.window.showErrorMessage(`Chroma Sync: ${result.message}`);
          } else {
            vscode.window.showWarningMessage(`Chroma Sync: ${result.message}`);
          }
        }
      }
    );
  }

  /**
   * Perform a startup pull (pull only, no push)
   */
  async startupPull(): Promise<void> {
    if (!this.isGitSyncEnabled()) {
      getDebugLogger().log('Git Sync: Startup pull skipped (sync disabled)');
      return;
    }

    getDebugLogger().log('Git Sync: Starting startup pull');

    try {
      const gitInstalled = await this.isGitInstalled();
      if (!gitInstalled) {
        getDebugLogger().log('Git Sync: Git not installed, skipping startup pull');
        return; // Silently skip if Git not installed
      }

      const gitRoot = await this.getGitRepositoryRoot();
      if (!gitRoot) {
        getDebugLogger().log('Git Sync: No Git repository found, skipping startup pull');
        return; // Silently skip if not a Git repo
      }

      getDebugLogger().log(`Git Sync: Performing startup pull from ${gitRoot}`);
      const pullResult = await this.gitPull();
      if (pullResult.success) {
        getDebugLogger().log('Git Sync: Startup pull completed successfully');
        console.log('Startup pull completed successfully');
      } else if (pullResult.needsAttention) {
        getDebugLogger().log(`Git Sync: Startup pull needs attention: ${pullResult.message}`);
        vscode.window.showWarningMessage(`Chroma Sync: ${pullResult.message}`);
      } else {
        getDebugLogger().log(`Git Sync: Startup pull completed with message: ${pullResult.message}`);
      }
    } catch (error: any) {
      getDebugLogger().log(`Git Sync: Startup pull failed: ${error.message}`);
      console.error('Startup pull failed:', error);
    }
  }

  /**
   * Schedule an automatic sync after file changes
   */
  private scheduleAutoSync(): void {
    // Clear existing timeout
    if (this.autoSyncTimeout) {
      clearTimeout(this.autoSyncTimeout);
    }

    // Don't schedule if auto-push is disabled
    if (!this.isAutoPushEnabled()) {
      return;
    }

    // Schedule new sync after debounce delay
    this.autoSyncTimeout = setTimeout(() => {
      this.sync().then((result) => {
        if (!result.success && result.needsAttention) {
          vscode.window.showErrorMessage(`Chroma Auto-sync: ${result.message}`);
        }
      });
    }, this.DEBOUNCE_DELAY);
  }

  /**
   * Start watching for file changes to trigger auto-sync
   */
  async startWatching(): Promise<void> {
    if (!this.isGitSyncEnabled()) {
      return;
    }

    // Stop existing watcher if any
    this.stopWatching();

    // Watch the Git repository root if found, otherwise watch database directory
    const gitRoot = await this.getGitRepositoryRoot();
    const watchDir = gitRoot || this.getDatabaseDirectory();
    const watchPattern = new vscode.RelativePattern(watchDir, '**/*');
    
    this.fileWatcher = vscode.workspace.createFileSystemWatcher(watchPattern);

    this.fileWatcher.onDidChange(() => this.scheduleAutoSync());
    this.fileWatcher.onDidCreate(() => this.scheduleAutoSync());
    this.fileWatcher.onDidDelete(() => this.scheduleAutoSync());
  }

  /**
   * Stop watching for file changes
   */
  stopWatching(): void {
    if (this.fileWatcher) {
      this.fileWatcher.dispose();
      this.fileWatcher = null;
    }

    if (this.autoSyncTimeout) {
      clearTimeout(this.autoSyncTimeout);
      this.autoSyncTimeout = null;
    }
  }

  /**
   * Dispose of resources
   */
  dispose(): void {
    this.stopWatching();
  }
}
