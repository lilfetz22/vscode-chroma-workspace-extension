// Manages the .chroma/api.json discovery file. External callers (Claude Code skill,
// other LLM tools) read this to find the running extension's HTTP port + auth token.
// File is rewritten on each activation (token rotates per session) and deleted on shutdown.

const fs = require('fs');
const path = require('path');

const FILENAME = 'api.json';

function discoveryPath(workspaceRoot) {
  return path.join(workspaceRoot, '.chroma', FILENAME);
}

function writeDiscoveryFile(workspaceRoot, info) {
  const dir = path.join(workspaceRoot, '.chroma');
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e) {
    if (e.code !== 'EEXIST') throw e;
  }
  const filePath = discoveryPath(workspaceRoot);
  const payload = JSON.stringify({
    port: info.port,
    token: info.token,
    pid: process.pid,
    version: info.version,
    startedAt: new Date().toISOString(),
  }, null, 2);

  fs.writeFileSync(filePath, payload, { encoding: 'utf8' });
  try {
    fs.chmodSync(filePath, 0o600);
  } catch {
    // best-effort; Windows ignores POSIX modes
  }
  return filePath;
}

function removeDiscoveryFile(workspaceRoot) {
  if (!workspaceRoot) return;
  const filePath = discoveryPath(workspaceRoot);
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
}

module.exports = { writeDiscoveryFile, removeDiscoveryFile, discoveryPath };
