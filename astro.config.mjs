import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const site = 'https://mziminski.github.io';

function draftNoteSlugs() {
  const dir = path.join(process.cwd(), 'src/content/notes');
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith('.md'))
    .filter((file) => {
      const text = fs.readFileSync(path.join(dir, file), 'utf8');
      const front = text.split('---')[1] ?? '';
      return /draft:\s*true/.test(front);
    })
    .map((file) => file.replace(/\.md$/, ''));
}

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [
    mdx(),
    sitemap({
      filter(page) {
        if (page.endsWith('/404.html') || page.endsWith('/404/')) return false;
        return !draftNoteSlugs().some((slug) => page.includes(`/notes/${slug}/`));
      },
      namespaces: {
        news: false,
        video: false,
        image: false,
      },
    }),
  ],
  build: {
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // MapLibre is a dynamic import on the home-page map button, not part of the first load.
      chunkSizeWarningLimit: 1200,
    },
  },
});
