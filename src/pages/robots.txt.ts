import type { APIRoute } from 'astro';
export const GET: APIRoute = ({ site }) =>
  new Response(
    `User-agent: *\nAllow: /\n${import.meta.env.SITE_INDEXABLE ? `Sitemap: ${new URL('sitemap-index.xml', site).href}\n` : '# Preview: every HTML page and response is marked noindex; no sitemap is published.\n'}`,
    {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    },
  );
