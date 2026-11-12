import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import { site } from '../data/site';

export async function GET(context: APIContext) {
  const notes = (await getCollection('notes')).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  return rss({
    title: `${site.name} — Notes`,
    description: 'Draft and published notes on geospatial systems, software, and AI systems engineering.',
    site: context.site ?? site.url,
    trailingSlash: true,
    customData: '<language>en-us</language>',
    items: notes.map((note) => ({
      title: note.data.draft ? `[Draft] ${note.data.title}` : note.data.title,
      pubDate: note.data.date,
      description: note.data.description,
      link: `/notes/${note.id}/`,
    })),
  });
}
