import fs from 'node:fs';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const minimum = Number(process.env.LH_MIN || 95);
const targets = [
  { name: 'home-mobile', pathname: '/', config: undefined },
  { name: 'work-mobile', pathname: '/work/', config: undefined },
  { name: 'study-mobile', pathname: '/work/smoke-trails/', config: undefined },
  { name: 'about-mobile', pathname: '/about/', config: undefined },
  { name: 'notes-mobile', pathname: '/notes/', config: undefined },
  { name: 'contact-mobile', pathname: '/contact/', config: undefined },
  { name: 'home-desktop', pathname: '/', config: desktopConfig },
];

const chrome = await launch({
  chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  chromePath: process.env.CHROME_PATH,
});

const summary = [];
let failed = false;

try {
  for (const target of targets) {
    const url = new URL(target.pathname, base).href;
    const runner = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      logLevel: 'error',
      onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    }, target.config);
    const scores = Object.fromEntries(
      Object.entries(runner.lhr.categories).map(([key, category]) => [key, Math.round((category.score ?? 0) * 100)]),
    );
    const low = Object.entries(scores).filter(([, score]) => score < minimum);
    summary.push({ name: target.name, url, scores, low: low.map(([key]) => key) });
    console.log(`${low.length ? 'FAIL' : 'ok'} ${target.name} ${JSON.stringify(scores)}`);
    if (low.length) failed = true;
  }
} finally {
  chrome.kill();
}

const reportDir = path.resolve('docs/verification');
fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(path.join(reportDir, 'lighthouse.json'), JSON.stringify({ minimum, summary }, null, 2));

if (failed) {
  console.error(`Lighthouse scores below ${minimum}`);
  process.exit(1);
}
console.log(`Lighthouse checks passed at ${minimum}+`);
