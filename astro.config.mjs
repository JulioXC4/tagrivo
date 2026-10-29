import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { deployment } from './scripts/deployment-env.mjs';

export default defineConfig({
  site: deployment.site,
  output: 'static',
  trailingSlash: 'always',
  integrations: [react(), ...(deployment.indexable ? [sitemap()] : [])],
  vite: {
    plugins: [tailwindcss()],
    define: { 'import.meta.env.SITE_INDEXABLE': JSON.stringify(deployment.indexable) },
  },
  devToolbar: { enabled: false },
});
