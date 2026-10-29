import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    seoTitle: z.string().optional(),
    readingTime: z.number(),
    featured: z.boolean().default(false),
    image: z.string().optional(),
  }),
});
export const collections = { guides };
