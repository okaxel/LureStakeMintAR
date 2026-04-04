require('dotenv').config();
const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { signRequest } = require('@worldcoin/idkit-core/signing');

const PORT = parseInt(process.env.PORT || '80', 10);
const SSL_PORT = parseInt(process.env.SSL_PORT || '443', 10);
const SIGNING_KEY = process.env.SIGNING_KEY;
const CONTENT_DIR = process.env.CONTENT_DIR || '.content';
const SSL_KEY_FILE = process.env.SSL_KEY_FILE || path.join('.cert', 'key.pem');
const SSL_CERT_FILE = process.env.SSL_CERT_FILE || path.join('.cert', 'cert.pem');

const SERVE_STATIC = (() => {
    const v = process.env.SERVE_STATIC;
    if (typeof v === 'undefined' || v === null) return true;
    return String(v).toLowerCase() !== 'false';
})();

if (!SIGNING_KEY) {
    console.error('Missing SIGNING_KEY in environment. See .env.example');
    process.exit(1);
}

const baseDir = path.resolve(process.cwd(), CONTENT_DIR);

if (SERVE_STATIC && !fs.existsSync(baseDir)) {
    console.warn(`Warning: content directory "${baseDir}" does not exist. Create it to serve files.`);
}

function applyCors(res) {

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS,HEAD');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

}

function sendJson(res, statusCode, obj) {

    const body = JSON.stringify(obj);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body)
    });
    res.end(body);

}

function sendError(res, statusCode, message) {

    sendJson(res, statusCode, { error: message });

}

function parseJsonBody(req) {

    return new Promise((resolve, reject) => {
        let raw = '';
        req.on('data', chunk => {
            raw += chunk;
            if (raw.length > 1e6) {
                req.connection.destroy();
                reject(new Error('Request body too large'));
            }
        });
        req.on('end', () => {
            if (!raw) return resolve({});
            try {
                const parsed = JSON.parse(raw);
                resolve(parsed);
            } catch (err) {
                reject(new Error('Invalid JSON body'));
            }
        });
        req.on('error', err => reject(err));
    });

}

function contentTypeForFile(filePath) {

    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.html': return 'text/html; charset=utf-8';
        case '.css': return 'text/css; charset=utf-8';
        case '.js': return 'application/javascript; charset=utf-8';
        case '.json': return 'application/json; charset=utf-8';
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.svg': return 'image/svg+xml';
        case '.txt': return 'text/plain; charset=utf-8';
        case '.ico': return 'image/x-icon';
        default: return 'application/octet-stream';
    }

}

function streamFile(filePath, req, res) {

    const rel = path.relative(baseDir, filePath);
    const segs = rel.split(path.sep);
    if (segs.some(s => s.startsWith('.'))) {
        sendError(res, 404, 'Not found');
        return;
    }
    let stat;
    try {
        stat = fs.statSync(filePath);
    } catch (e) {
        sendError(res, 404, 'Not found');
        return;
    }
    const ct = contentTypeForFile(filePath);
    res.writeHead(200, {
        'Content-Type': ct,
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache'
    });
    if (req.method === 'HEAD') {
        res.end();
        return;
    }
    const stream = fs.createReadStream(filePath);
    stream.on('error', () => {
        sendError(res, 500, 'Internal server error');
    });
    stream.pipe(res);

}

function serveStatic(req, res) {

    if (!SERVE_STATIC) {
        sendError(res, 404, 'Not found');
        return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') {
        sendError(res, 405, 'Method not allowed');
        return;
    }
    const rawUrl = req.url.split('?')[0];
      let decoded;
    try {
        decoded = decodeURIComponent(rawUrl);
    } catch (err) {
        sendError(res, 400, 'Bad request path');
        return;
    }
    let relPath = decoded.replace(/^\/+/, '');
    if (decoded === '/' || decoded === '' || decoded.endsWith('/')) {
        relPath = path.posix.join(relPath, 'index.html');
    }
    const segments = relPath === '' ? [] : relPath.split('/');
    if (segments.some(seg => seg.startsWith('.'))) {
        sendError(res, 404, 'Not found');
        return;
    }
    const resolvedPath = path.resolve(baseDir, relPath || 'index.html');
    const normalizedBase = baseDir.endsWith(path.sep) ? baseDir : baseDir + path.sep;
    if (!(resolvedPath === baseDir || resolvedPath.startsWith(normalizedBase))) {
        sendError(res, 403, 'Forbidden');
        return;
    }
    fs.stat(resolvedPath, (err, stats) => {
        if (err) {
            sendError(res, 404, 'Not found');
            return;
        }
        if (stats.isDirectory()) {
            const indexPath = path.join(resolvedPath, 'index.html');
            fs.stat(indexPath, (ie, istats) => {
                if (ie || !istats.isFile()) {
                    sendError(res, 404, 'Not found');
                    return;
                }
                streamFile(indexPath, req, res);
            });
            return;
        }
        if (stats.isFile()) {
            streamFile(resolvedPath, req, res);
            return;
        }
        sendError(res, 404, 'Not found');
    });

}

async function requestHandler(req, res) {

    applyCors(res);
    try {
        if (req.method === 'POST' && req.url === '/id-kit-connect') {
            const body = await parseJsonBody(req);
            const action = body && body.action;
            if (!action) {
                return sendJson(res, 400, { error: 'Missing required field: action' });
            }
            const { sig, nonce, createdAt, expiresAt } = signRequest({
                signingKeyHex: SIGNING_KEY, action
            });
            return sendJson(res, 200, {sig, nonce, created_at: createdAt,
                expires_at: expiresAt
            });
        }
        if (req.method === 'POST' && req.url === '/pay') {
            const body = await parseJsonBody(req);
            try {
                const result = await processPayment(body);
                return sendJson(res, 200, { result });
            } catch (err) {
                return sendJson(res, 400, { error: err.message || 'Payment processing failed' });
            }
        }
        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            return res.end();
        }
        if (req.method === 'GET' || req.method === 'HEAD') {
            return serveStatic(req, res);
        }
        sendError(res, 404, 'Not found');
    } catch (err) {
        sendJson(res, 500, { error: err.message || 'Internal server error' });
    }

}

function loadSslCredentials() {

    try {
        const keyPath = path.resolve(process.cwd(), SSL_KEY_FILE);
        const certPath = path.resolve(process.cwd(), SSL_CERT_FILE);
        if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
            return null;
        }

        const key = fs.readFileSync(keyPath, 'utf8');
        const cert = fs.readFileSync(certPath, 'utf8');
        return { key, cert };
    } catch (err) {
        console.warn('Failed to load SSL credentials:', err.message || err);
        return null;
    }

}

const sslCredentials = loadSslCredentials();

if (sslCredentials) {
    const httpsServer = https.createServer(sslCredentials, requestHandler);
    httpsServer.listen(SSL_PORT, () => {
        console.log(`HTTPS server listening on https://localhost:${SSL_PORT}`);
        console.log(`Serving static files from: ${baseDir} (enabled: ${SERVE_STATIC})`);
    });
    const redirectServer = http.createServer((req, res) => {
        const host = req.headers.host ? req.headers.host.split(':')[0] : 'localhost';
        const target = `https://${host}:${SSL_PORT}${req.url}`;
        res.writeHead(301, { Location: target });
        res.end();
    });
    redirectServer.listen(PORT, () => {
        console.log(`HTTP redirect server listening on http://localhost:${PORT} -> https://localhost:${SSL_PORT}`);
    });
} else {
    const httpServer = http.createServer(requestHandler);
    httpServer.listen(PORT, () => {
        console.warn('SSL credentials not found. Starting HTTP server (insecure).');
        console.log(`HTTP server listening on http://localhost:${PORT}`);
        console.log(`Serving static files from: ${baseDir} (enabled: ${SERVE_STATIC})`);
    });
}