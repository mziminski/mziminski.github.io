import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve('dist');
const port = Number(process.env.PORT || 4321);
const compressible = new Set(['.html', '.css', '.js', '.svg', '.xml', '.txt', '.json', '.map']);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.ico': 'image/x-icon',
  '.json': 'application/json',
  '.woff2': 'font/woff2',
  '.map': 'application/json',
};

function fileFor(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const rel = decoded.endsWith('/') ? `${decoded}index.html` : decoded;
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) return null;
  if (fs.existsSync(file) && fs.statSync(file).isFile()) return file;
  return null;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url ?? '/', `http://127.0.0.1:${port}`);
  let file = fileFor(url.pathname);
  let status = 200;
  if (!file) {
    file = path.join(root, '404.html');
    status = 404;
  }
  const ext = path.extname(file);
  const body = fs.readFileSync(file);
  const headers = {
    'Content-Type': types[ext] ?? 'application/octet-stream',
    'Cache-Control': ext === '.html' || ext === '.xml' || ext === '.txt' ? 'no-cache' : 'public, max-age=31536000, immutable',
    'X-Content-Type-Options': 'nosniff',
  };
  const acceptsGzip = (req.headers['accept-encoding'] ?? '').includes('gzip') && compressible.has(ext);
  if (acceptsGzip) {
    const gzipped = zlib.gzipSync(body);
    headers['Content-Encoding'] = 'gzip';
    headers['Content-Length'] = String(gzipped.length);
    headers.Vary = 'Accept-Encoding';
    res.writeHead(status, headers);
    res.end(gzipped);
    return;
  }
  headers['Content-Length'] = String(body.length);
  res.writeHead(status, headers);
  res.end(body);
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`);
});
