// Localhost HTTP API exposing a curated set of Chroma extension commands so external
// tools (Claude Code skill, GitHub Copilot, etc.) can drive the running extension
// instead of editing chroma.db directly. Driving via commands lets VS Code's in-memory
// sql.js state stay authoritative — no more silent overwrites of external SQLite edits.

const http = require('http');
const crypto = require('crypto');
const vscode = require('vscode');
const { listCommands, getCommandSpec, validateArgs } = require('./commandRegistry');
const { writeDiscoveryFile, removeDiscoveryFile } = require('./discovery');

const MAX_BODY_BYTES = 1024 * 1024; // 1 MB
const ALLOWED_HOSTS = new Set(['127.0.0.1', 'localhost']);

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function sendJson(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(body),
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function isAuthorized(req, token) {
  const header = req.headers['authorization'];
  if (!header || typeof header !== 'string') return false;
  const prefix = 'Bearer ';
  if (!header.startsWith(prefix)) return false;
  const presented = Buffer.from(header.slice(prefix.length));
  const expected = Buffer.from(token);
  if (presented.length !== expected.length) return false;
  return crypto.timingSafeEqual(presented, expected);
}

function isLocalHost(req) {
  const host = (req.headers['host'] || '').split(':')[0];
  return ALLOWED_HOSTS.has(host);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let received = 0;
    const chunks = [];
    req.on('data', (chunk) => {
      received += chunk.length;
      if (received > MAX_BODY_BYTES) {
        reject(Object.assign(new Error('request body too large'), { status: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      if (chunks.length === 0) return resolve({});
      const raw = Buffer.concat(chunks).toString('utf8');
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(Object.assign(new Error('invalid JSON body'), { status: 400 }));
      }
    });
    req.on('error', reject);
  });
}

function makeRouter({ token, version, debugLog }) {
  return async function handleRequest(req, res) {
    const url = req.url || '/';
    const method = req.method || 'GET';

    debugLog?.(`api: ${method} ${url}`);

    if (!isLocalHost(req)) {
      sendJson(res, 403, { ok: false, error: 'host not allowed' });
      return;
    }

    if (method !== 'GET' && method !== 'POST') {
      res.setHeader('Allow', 'GET, POST');
      sendJson(res, 405, { ok: false, error: 'method not allowed' });
      return;
    }

    if (method === 'GET' && url === '/health') {
      sendJson(res, 200, { ok: true, version, pid: process.pid });
      return;
    }

    if (!isAuthorized(req, token)) {
      sendJson(res, 401, { ok: false, error: 'unauthorized' });
      return;
    }

    if (method === 'GET' && url === '/commands') {
      sendJson(res, 200, { ok: true, data: listCommands() });
      return;
    }

    const postMatch = method === 'POST' && url.match(/^\/commands\/([^/?]+)$/);
    if (postMatch) {
      const commandId = decodeURIComponent(postMatch[1]);
      const spec = getCommandSpec(commandId);
      if (!spec) {
        sendJson(res, 404, { ok: false, error: `command not exposed: ${commandId}` });
        return;
      }

      let body;
      try {
        body = await readBody(req);
      } catch (e) {
        sendJson(res, e.status || 400, { ok: false, error: e.message });
        return;
      }

      const validationErrors = validateArgs(spec, body);
      if (validationErrors.length > 0) {
        sendJson(res, 400, { ok: false, error: 'validation failed', details: validationErrors });
        return;
      }

      try {
        const result = await vscode.commands.executeCommand(commandId, { __api: true, ...body });
        sendJson(res, 200, { ok: true, data: result ?? null });
      } catch (e) {
        debugLog?.(`api: command ${commandId} failed: ${e?.message || String(e)}`);
        sendJson(res, 500, { ok: false, error: e?.message || String(e) });
      }
      return;
    }

    sendJson(res, 404, { ok: false, error: 'not found' });
  };
}

async function startApiServer({ workspaceRoot, version, debugLog }) {
  if (!workspaceRoot) {
    debugLog?.('api: no workspace root, skipping HTTP server start');
    return { stop: () => {} };
  }

  const token = generateToken();
  const server = http.createServer(makeRouter({ token, version, debugLog }));

  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.removeListener('error', reject);
      resolve();
    });
  });

  const address = server.address();
  const port = typeof address === 'object' && address ? address.port : 0;

  let discoveryFilePath;
  try {
    discoveryFilePath = writeDiscoveryFile(workspaceRoot, { port, token, version });
    debugLog?.(`api: listening on 127.0.0.1:${port}, discovery file: ${discoveryFilePath}`);
  } catch (e) {
    debugLog?.(`api: failed to write discovery file: ${e?.message || String(e)}`);
    server.close();
    throw e;
  }

  return {
    port,
    token,
    stop() {
      try {
        server.close();
      } catch (e) {
        debugLog?.(`api: server close error: ${e?.message || String(e)}`);
      }
      try {
        removeDiscoveryFile(workspaceRoot);
      } catch (e) {
        debugLog?.(`api: failed to remove discovery file: ${e?.message || String(e)}`);
      }
    },
  };
}

module.exports = { startApiServer, makeRouter, generateToken };
