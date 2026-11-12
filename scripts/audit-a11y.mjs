import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';
import axe from 'axe-core';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const pages = ['/', '/work/', '/about/', '/notes/', '/resume/', '/contact/', '/work/smoke-trails/', '/notes/what-ai-systems-engineering-means/', '/missing-page/'];

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

const failures = [];

async function runAxe(page, label) {
  await page.evaluate(axe.source);
  const results = await page.evaluate(async () => {
    const outcome = await window.axe.run(document, {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'] },
    });
    return {
      violations: outcome.violations.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        help: violation.help,
        nodes: violation.nodes.slice(0, 5).map((node) => node.target.join(' ')),
      })),
    };
  });
  if (results.violations.length) {
    failures.push({ label, violations: results.violations });
    console.error(`FAIL ${label}`);
    for (const violation of results.violations) {
      console.error(`  ${violation.id} (${violation.impact}) ${violation.help}`);
      for (const node of violation.nodes) console.error(`    ${node}`);
    }
  } else {
    console.log(`ok ${label}`);
  }
}

for (const theme of ['light', 'dark']) {
  for (const pathname of pages) {
    const page = await browser.newPage();
    await page.evaluateOnNewDocument((value) => {
      localStorage.setItem('mz-theme', value);
    }, theme);
    await page.setViewport({ width: 1280, height: 900 });
    const response = await page.goto(new URL(pathname, base).href, { waitUntil: 'networkidle0', timeout: 30000 });
    if (pathname === '/missing-page/' && response?.status() !== 404) {
      failures.push({ label: `${theme} ${pathname}`, violations: [{ id: 'status', impact: 'serious', help: `expected 404, got ${response?.status()}`, nodes: [] }] });
    }
    await page.evaluate(() => document.fonts.ready);
    await runAxe(page, `${theme} ${pathname}`);
    await page.close();
  }
}

const home = await browser.newPage();
await home.setViewport({ width: 1280, height: 900 });
await home.goto(new URL('/', base).href, { waitUntil: 'networkidle0' });
await home.click('#load-map');
await home.waitForSelector('.maplibregl-canvas', { timeout: 20000 });
await home.waitForNetworkIdle({ idleTime: 800, timeout: 20000 }).catch(() => {});
await runAxe(home, 'light / with map');

const toggle = await home.$('[data-theme-toggle]');
const before = await home.evaluate(() => document.documentElement.dataset.theme);
await toggle?.click();
const after = await home.evaluate(() => document.documentElement.dataset.theme);
if (!before || before === after) failures.push({ label: 'theme toggle', violations: [{ id: 'theme', impact: 'serious', help: `theme stayed ${before}`, nodes: [] }] });
else console.log(`ok theme toggle ${before} -> ${after}`);

await home.setViewport({ width: 390, height: 844 });
const expanded = await home.$eval('[data-nav-toggle]', (button) => button.getAttribute('aria-expanded'));
await home.click('[data-nav-toggle]');
const opened = await home.$eval('[data-nav-toggle]', (button) => button.getAttribute('aria-expanded'));
if (expanded !== 'false' || opened !== 'true') {
  failures.push({ label: 'mobile nav', violations: [{ id: 'nav', impact: 'serious', help: `aria-expanded ${expanded} -> ${opened}`, nodes: [] }] });
} else {
  console.log('ok mobile nav toggle');
}
await home.close();

await browser.close();

const reportDir = path.resolve('docs/verification');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'axe.json'), JSON.stringify({ failures }, null, 2));

if (failures.length) {
  console.error(`${failures.length} accessibility checks failed`);
  process.exit(1);
}
console.log('axe checks passed');
