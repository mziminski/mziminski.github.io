import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = process.cwd();
const outDir = path.join(root, 'public', 'og');
fs.mkdirSync(outDir, { recursive: true });

const serif = fs
  .readFileSync(path.join(root, 'node_modules/@fontsource/source-serif-4/files/source-serif-4-latin-600-normal.woff2'))
  .toString('base64');
const sans = fs
  .readFileSync(path.join(root, 'node_modules/@fontsource/source-sans-3/files/source-sans-3-latin-400-normal.woff2'))
  .toString('base64');
const mono = fs
  .readFileSync(path.join(root, 'node_modules/@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-400-normal.woff2'))
  .toString('base64');

function escapeXml(value) {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
}

function wrap(text, max) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > max && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 4);
}

function card({ kicker, title }) {
  const lines = wrap(title, 26);
  const titleSvg = lines
    .map((line, index) => `<text x="72" y="${236 + index * 78}" class="title">${escapeXml(line)}</text>`)
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face { font-family: "Source Serif 4"; src: url("data:font/woff2;base64,${serif}") format("woff2"); font-weight: 600; }
    @font-face { font-family: "Source Sans 3"; src: url("data:font/woff2;base64,${sans}") format("woff2"); font-weight: 400; }
    @font-face { font-family: "IBM Plex Mono"; src: url("data:font/woff2;base64,${mono}") format("woff2"); font-weight: 400; }
    .kicker { font-family: "IBM Plex Mono", monospace; font-size: 22px; letter-spacing: 3px; fill: #6b3a0e; }
    .title { font-family: "Source Serif 4", Georgia, serif; font-size: 64px; fill: #1a1714; }
    .foot { font-family: "Source Sans 3", sans-serif; font-size: 26px; fill: #3f3a34; }
  </style>
  <rect width="1200" height="630" fill="#f3efe4"/>
  <rect width="16" height="630" fill="#0b5f5a"/>
  <circle cx="1088" cy="118" r="52" fill="none" stroke="#0b5f5a" stroke-width="3"/>
  <path d="M1088 78v80M1048 118h80" stroke="#0b5f5a" stroke-width="2"/>
  <circle cx="1088" cy="118" r="16" fill="none" stroke="#6b3a0e" stroke-width="3"/>
  <circle cx="1088" cy="118" r="3.5" fill="#0b5f5a"/>
  <text x="72" y="148" class="kicker">${escapeXml(kicker.toUpperCase())}</text>
  ${titleSvg}
  <text x="72" y="568" class="foot">Matt Ziminski  ·  mziminski.github.io</text>
</svg>`;
}

function frontMatter(file) {
  const text = fs.readFileSync(file, 'utf8');
  const body = text.split('---')[1] ?? '';
  const title = body.match(/^title:\s*(.+)$/m)?.[1]?.trim().replace(/^["']|["']$/g, '') ?? 'Matt Ziminski';
  return { title };
}

const pages = [
  { file: 'home.png', kicker: 'Geospatial · Software · AI systems', title: 'Maps, models, and the systems between them.' },
  { file: 'work.png', kicker: 'Work', title: 'Studies, not a client list.' },
  { file: 'about.png', kicker: 'About', title: 'A practice in three directions.' },
  { file: 'notes.png', kicker: 'Notes', title: 'Short drafts, labeled as drafts.' },
  { file: 'resume.png', kicker: 'Resume', title: 'Resume file not published yet.' },
  { file: 'contact.png', kicker: 'Contact', title: 'Links, not a form.' },
  { file: '404.png', kicker: '404', title: 'This page is not on the map.' },
];

for (const file of fs.readdirSync(path.join(root, 'src/content/work'))) {
  if (!file.endsWith('.mdx')) continue;
  const slug = file.replace(/\.mdx$/, '');
  const { title } = frontMatter(path.join(root, 'src/content/work', file));
  pages.push({ file: `work-${slug}.png`, kicker: 'Work', title });
}

for (const file of fs.readdirSync(path.join(root, 'src/content/notes'))) {
  if (!file.endsWith('.md')) continue;
  const slug = file.replace(/\.md$/, '');
  const { title } = frontMatter(path.join(root, 'src/content/notes', file));
  pages.push({ file: `note-${slug}.png`, kicker: 'Draft note', title });
}

for (const page of pages) {
  const png = await sharp(Buffer.from(card(page))).png().toBuffer();
  fs.writeFileSync(path.join(outDir, page.file), png);
}

const icon = await sharp(path.join(root, 'public/favicon.svg')).resize(32, 32).png().toBuffer();
fs.writeFileSync(path.join(root, 'public/favicon-32.png'), icon);
const apple = await sharp(path.join(root, 'public/favicon.svg')).resize(180, 180).png().toBuffer();
fs.writeFileSync(path.join(root, 'public/apple-touch-icon.png'), apple);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
const entry = Buffer.alloc(16);
entry.writeUInt8(32, 0);
entry.writeUInt8(32, 1);
entry.writeUInt16LE(1, 4);
entry.writeUInt16LE(32, 6);
entry.writeUInt32LE(icon.length, 8);
entry.writeUInt32LE(22, 12);
fs.writeFileSync(path.join(root, 'public/favicon.ico'), Buffer.concat([header, entry, icon]));

fs.copyFileSync(
  path.join(root, 'node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs'),
  path.join(root, 'public/maplibre-gl-worker.js'),
);

console.log(`Wrote ${pages.length} Open Graph images, favicon files, and the map worker.`);
