import fs from 'node:fs';

const css = fs.readFileSync(new URL('../src/styles/global.css', import.meta.url), 'utf8');

function channel(value) {
  const normalized = value / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const raw = hex.replace('#', '');
  const r = channel(parseInt(raw.slice(0, 2), 16));
  const g = channel(parseInt(raw.slice(2, 4), 16));
  const b = channel(parseInt(raw.slice(4, 6), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  const left = luminance(a);
  const right = luminance(b);
  const [high, low] = left > right ? [left, right] : [right, left];
  return (high + 0.05) / (low + 0.05);
}

function tokens(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = css.match(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`));
  if (!match) throw new Error(`Missing CSS block ${selector}`);
  const values = {};
  for (const part of match[1].split(';')) {
    const found = part.match(/(--[\w-]+)\s*:\s*(#[0-9a-fA-F]{6})/);
    if (found) values[found[1]] = found[2].toLowerCase();
  }
  return values;
}

const pairs = [
  ['--ink', '--bg', 4.5],
  ['--muted', '--bg', 4.5],
  ['--muted', '--surface', 4.5],
  ['--accent', '--bg', 4.5],
  ['--on-accent', '--accent', 4.5],
  ['--copper', '--bg', 4.5],
  ['--ink', '--surface', 4.5],
  ['--ink', '--chip', 4.5],
  ['--ok', '--bg', 4.5],
  ['--warn', '--bg', 4.5],
  ['--closed', '--bg', 4.5],
  ['--bg', '--ink', 4.5],
];

let failed = 0;
for (const selector of ['html[data-theme="light"]', 'html[data-theme="dark"]']) {
  const palette = tokens(selector);
  for (const [fore, back, minimum] of pairs) {
    const ratio = contrast(palette[fore], palette[back]);
    const ok = ratio >= minimum;
    if (!ok) failed += 1;
    console.log(`${ok ? 'ok' : 'FAIL'} ${ratio.toFixed(2)} ${selector} ${fore} on ${back}`);
  }
}

if (!css.includes('prefers-reduced-motion')) {
  console.error('FAIL global.css does not mention prefers-reduced-motion');
  failed += 1;
}

if (failed) {
  console.error(`${failed} contrast checks failed`);
  process.exit(1);
}
console.log('Contrast checks passed.');
