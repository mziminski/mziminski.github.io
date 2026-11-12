import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const site = 'https://mziminski.github.io';

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(full));
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

function resolveInternal(url) {
  const parsed = new URL(url, `${site}/`);
  if (parsed.origin !== new URL(site).origin) return { external: parsed.href };
  let pathname = decodeURIComponent(parsed.pathname);
  if (pathname === '/404' || pathname === '/404/' || pathname === '/404.html') {
    return { file: path.join(dist, '404.html'), hash: parsed.hash.replace(/^#/, ''), from: url };
  }
  if (pathname.endsWith('/')) pathname += 'index.html';
  const file = path.normalize(path.join(dist, pathname));
  if (!file.startsWith(dist)) return { missing: url };
  return { file, hash: parsed.hash.replace(/^#/, ''), from: url };
}

const pages = walk(dist);
const refs = new Map();
const attr = /\b(?:href|src)=["']([^"']+)["']/g;

for (const page of pages) {
  const html = fs.readFileSync(page, 'utf8');
  for (const match of html.matchAll(attr)) {
    const value = match[1].trim();
    if (!value || value.startsWith('mailto:') || value.startsWith('data:') || value.startsWith('#')) continue;
    const key = `${page} -> ${value}`;
    refs.set(key, { page, value });
  }
}

const failures = [];
const external = new Set();

for (const { page, value } of refs.values()) {
  const resolved = resolveInternal(value);
  if (resolved.external) {
    external.add(resolved.external);
    continue;
  }
  if (resolved.missing || !resolved.file || !fs.existsSync(resolved.file)) {
    failures.push(`Missing ${value} from ${path.relative(dist, page)}`);
    continue;
  }
  if (resolved.hash) {
    const html = fs.readFileSync(resolved.file, 'utf8');
    const id = resolved.hash.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    if (!new RegExp(`id=["']${id}["']`).test(html)) {
      failures.push(`Missing #${resolved.hash} in ${value} from ${path.relative(dist, page)}`);
    }
  }
}

async function statusOf(url) {
  const response = await fetch(url, {
    redirect: 'follow',
    headers: { 'user-agent': 'Mozilla/5.0 (compatible; portfolio-link-check/1.0)' },
    signal: AbortSignal.timeout(20000),
  });
  return response.status;
}

for (const url of external) {
  let status = 0;
  let error = '';
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      status = await statusOf(url);
      error = '';
      if (status < 500) break;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : String(cause);
    }
  }
  const linkedin = url.includes('linkedin.com') && (status === 999 || status === 405 || status === 429);
  const ok = (status >= 200 && status < 400) || linkedin;
  console.log(`${ok ? 'ok' : 'FAIL'} ${status || 'ERR'} ${url}${error ? ` (${error})` : ''}`);
  if (!ok) failures.push(`${url} returned ${status || error}`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Checked ${refs.size} references, ${external.size} external URLs.`);
