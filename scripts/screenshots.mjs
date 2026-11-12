import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const base = process.env.BASE_URL ?? 'http://127.0.0.1:4321';
const chromePath = process.env.CHROME_PATH || '/usr/local/bin/google-chrome';
const outDir = path.resolve('docs/screenshots');
fs.mkdirSync(outDir, { recursive: true });

const pages = [
  { name: 'home', pathname: '/', map: true },
  { name: 'work', pathname: '/work/' },
  { name: 'study', pathname: '/work/smoke-trails/' },
  { name: 'about', pathname: '/about/' },
  { name: 'notes', pathname: '/notes/' },
  { name: 'note', pathname: '/notes/what-ai-systems-engineering-means/' },
  { name: 'resume', pathname: '/resume/' },
  { name: 'contact', pathname: '/contact/' },
  { name: 'not-found', pathname: '/missing-page/' },
];

const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'mobile', width: 390, height: 844 },
];

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage'],
});

for (const theme of ['light', 'dark']) {
  for (const viewport of viewports) {
    for (const item of pages) {
      const page = await browser.newPage();
      await page.setViewport({ width: viewport.width, height: viewport.height, deviceScaleFactor: 1 });
      await page.evaluateOnNewDocument((value) => {
        localStorage.setItem('mz-theme', value);
      }, theme);
      await page.goto(new URL(item.pathname, base).href, { waitUntil: 'networkidle0', timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      if (item.map) {
        await page.click('#load-map');
        await page.waitForSelector('.maplibregl-canvas', { timeout: 20000 });
        await new Promise((resolve) => setTimeout(resolve, 2800));
        await page.evaluate(() => document.querySelector('#map-stage')?.scrollIntoView({ block: 'center' }));
        await new Promise((resolve) => setTimeout(resolve, 400));
        const mapFile = path.join(outDir, `home-map-${viewport.name}-${theme}.jpg`);
        await page.screenshot({ path: mapFile, type: 'jpeg', quality: 74, fullPage: false });
        console.log(path.relative(process.cwd(), mapFile));
        await page.evaluate(() => window.scrollTo(0, 0));
      }
      const file = path.join(outDir, `${item.name}-${viewport.name}-${theme}.jpg`);
      await page.screenshot({ path: file, type: 'jpeg', quality: 74, fullPage: false });
      console.log(path.relative(process.cwd(), file));
      await page.close();
    }
  }
}

await browser.close();
