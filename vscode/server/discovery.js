// Manages the .chroma/api.json discovery file. External callers (Claude Code skill,
// other LLM tools) read this to find the running extension's HTTP port + auth token.
// File is rewritten on each activation (token rotates per session) and deleted on shutdown.

const fs = require('fs');
const path = require('path');

const FILENAME = 'api.json';

function discoveryPath(dbDir) {
  return path.join(dbDir, FILENAME);
}

function writeDiscoveryFile(dbDir, info) {
  fs.mkdirSync(dbDir, { recursive: true });
  const filePath = discoveryPath(dbDir);
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

function removeDiscoveryFile(dbDir) {
  if (!dbDir) return;
  const filePath = discoveryPath(dbDir);
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    if (e.code === 'ENOENT') return;
    // Unlink failed (e.g. permission error on Windows). Write a sentinel so
    // external callers can tell the server is gone even if the file lingers.
    try {
      fs.writeFileSync(filePath, JSON.stringify({ active: false }), { encoding: 'utf8' });
    } catch {
      // Best-effort; nothing more we can do at shutdown time.
    }
    throw e;
  }
}

module.exports = { writeDiscoveryFile, removeDiscoveryFile, discoveryPath };
