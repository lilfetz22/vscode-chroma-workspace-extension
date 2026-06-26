// Jest tests for the HTTP API router (makeRouter) in vscode/server/apiServer.js.
//
// IMPORTANT: jest.config.js has an unanchored moduleNameMapper pattern "vscode"
// that intercepts any require path containing "vscode", including
// require('../vscode/server/apiServer'). We bypass this by loading the file
// directly via Node's vm module, injecting the Jest vscode mock as the only
// special dependency so assertions on vscode.commands.executeCommand still work.

/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');
const vm = require('vm');
const { createRequire } = require('module');

// Load the Jest vscode mock first so we hold a shared reference.
const vscode = require('vscode');

// ── load apiServer bypassing moduleNameMapper ─────────────────────────────────

const _apiServerPath = path.resolve(__dirname, '../vscode/server/apiServer.js');
const _apiServerCode: string = fs.readFileSync(_apiServerPath, 'utf8');
const _nativeReq = createRequire(_apiServerPath);

function _customRequire(name: string): any {
  if (name === 'vscode') return vscode;   // inject the shared Jest mock
  return _nativeReq(name);                // built-ins + relative deps via native Node
}
(_customRequire as any).resolve = _nativeReq.resolve.bind(_nativeReq);
(_customRequire as any).cache = _nativeReq.cache;
(_customRequire as any).extensions = (_nativeReq as any).extensions;
(_customRequire as any).main = (_nativeReq as any).main;

const _apiServerMod: any = { exports: {} };
const _fn = vm.runInThisContext(
  `(function(require,module,exports,__dirname,__filename){\n${_apiServerCode}\n})`,
  { filename: _apiServerPath },
);
_fn(_customRequire, _apiServerMod, _apiServerMod.exports,
    path.dirname(_apiServerPath), _apiServerPath);

const { makeRouter, generateToken } = _apiServerMod.exports;

// ── helpers ───────────────────────────────────────────────────────────────────

function mockReq(opts: { method: string; url: string; host?: string; auth?: string; body?: string }) {
  const handlers: Record<string, Function[]> = { data: [], end: [], error: [] };
  const req: any = {
    url: opts.url,
    method: opts.method,
    headers: { host: opts.host ?? '127.0.0.1' },
    on(event: string, cb: Function) { handlers[event].push(cb); return req; },
    destroy() {},
  };
  if (opts.auth) req.headers.authorization = `Bearer ${opts.auth}`;
  // Fire body events asynchronously so handlers can be attached first.
  setImmediate(() => {
    if (opts.body) handlers.data.forEach((cb) => cb(Buffer.from(opts.body!)));
    handlers.end.forEach((cb) => cb());
  });
  return req;
}

function mockRes() {
  const res: any = {
    statusCode: 0,
    headers: {} as Record<string, string>,
    body: '',
    writeHead(status: number, headers: any) { res.statusCode = status; Object.assign(res.headers, headers); },
    setHeader(name: string, value: any) { res.headers[name] = value; },
    end(body: string) { res.body = body; res._done?.(); },
  };
  res.done = new Promise<void>((resolve) => { res._done = resolve; });
  return res;
}

// ── test setup ────────────────────────────────────────────────────────────────

const TOKEN = 'test-token-1234567890';
const router = makeRouter({ token: TOKEN, version: '9.9.9', debugLog: () => {} });

beforeEach(() => {
  (vscode.commands.executeCommand as jest.Mock).mockReset();
});

// ── tests ─────────────────────────────────────────────────────────────────────

describe('GET /health', () => {
  it('returns 200 with ok, version, pid — no auth required', async () => {
    const req = mockReq({ method: 'GET', url: '/health' });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
    expect(body.version).toBe('9.9.9');
    expect(typeof body.pid).toBe('number');
  });
});

describe('GET /commands — auth checks', () => {
  it('returns 401 when no Authorization header is provided', async () => {
    const req = mockReq({ method: 'GET', url: '/commands' });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(401);
    expect(JSON.parse(res.body).ok).toBe(false);
  });

  it('returns 401 with wrong Bearer token', async () => {
    const req = mockReq({ method: 'GET', url: '/commands', auth: 'wrong-token' });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(401);
  });

  it('returns 200 with valid token — data is non-empty array containing chroma.addBoard', async () => {
    const req = mockReq({ method: 'GET', url: '/commands', auth: TOKEN });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.data.some((c: any) => c.id === 'chroma.addBoard')).toBe(true);
  });
});

describe('POST /commands/chroma.addBoard', () => {
  it('returns 200 and calls executeCommand with merged __api flag', async () => {
    (vscode.commands.executeCommand as jest.Mock).mockResolvedValue({ id: 'b1', title: 'Test Board' });
    const req = mockReq({
      method: 'POST',
      url: '/commands/chroma.addBoard',
      auth: TOKEN,
      body: JSON.stringify({ title: 'Test Board' }),
    });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(200);
    expect(vscode.commands.executeCommand).toHaveBeenCalledTimes(1);
    expect(vscode.commands.executeCommand).toHaveBeenCalledWith(
      'chroma.addBoard',
      { __api: true, title: 'Test Board' },
    );
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(true);
    expect(body.data).toEqual({ id: 'b1', title: 'Test Board' });
  });

  it('returns 400 with details array when required param title is missing', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/commands/chroma.addBoard',
      auth: TOKEN,
      body: JSON.stringify({}),
    });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(400);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.some((d: string) => d.includes('title'))).toBe(true);
  });
});

describe('POST /commands/chroma.unknown', () => {
  it('returns 404 for an unregistered command id', async () => {
    const req = mockReq({
      method: 'POST',
      url: '/commands/chroma.unknown',
      auth: TOKEN,
      body: '{}',
    });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(404);
    expect(JSON.parse(res.body).ok).toBe(false);
  });
});

describe('Method not allowed', () => {
  it('returns 405 with Allow header for PUT requests', async () => {
    const req = mockReq({ method: 'PUT', url: '/commands/chroma.addBoard', auth: TOKEN });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(405);
    expect(res.headers['Allow']).toBe('GET, POST');
  });
});

describe('Host header check', () => {
  it('returns 403 for requests from a non-localhost host', async () => {
    const req = mockReq({ method: 'GET', url: '/health', host: 'evil.com' });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(403);
    expect(JSON.parse(res.body).ok).toBe(false);
  });
});

describe('executeCommand error handling', () => {
  it('returns 500 with ok:false and the error message when executeCommand rejects', async () => {
    (vscode.commands.executeCommand as jest.Mock).mockRejectedValue(new Error('boom'));
    const req = mockReq({
      method: 'POST',
      url: '/commands/chroma.addBoard',
      auth: TOKEN,
      body: JSON.stringify({ title: 'Test Board' }),
    });
    const res = mockRes();
    router(req, res);
    await res.done;
    expect(res.statusCode).toBe(500);
    const body = JSON.parse(res.body);
    expect(body.ok).toBe(false);
    expect(body.error).toBe('boom');
  });
});

describe('generateToken', () => {
  it('returns a 64-character hex string', () => {
    const token = generateToken();
    expect(typeof token).toBe('string');
    expect(token).toMatch(/^[0-9a-f]{64}$/);
  });
});
