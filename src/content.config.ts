import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    order: z.number(),
    featured: z.boolean().default(false),
    theme: z.enum(['Geospatial', 'AI systems', 'Software']),
    stack: z.array(z.string()).min(1),
    // TODO(matt): set these when a study is tied to real work.
    timeframe: z.string().default(''),
    role: z.string().default(''),
    repository: z.string().default(''),
    diagram: z.string(),
  }),
});

const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    draft: z.boolean().default(true),
  }),
});

export const collections = { work, notes };
