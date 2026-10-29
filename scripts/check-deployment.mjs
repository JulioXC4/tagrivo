// Smoke-check a real public test URL after Pages reports a successful deployment.
import { deployment } from './deployment-env.mjs';
if (!process.argv[2])
  throw new Error('Usage: npm run check:deployment -- https://YOUR-ACTUAL-PROJECT.pages.dev');
const origin = new URL(process.argv[2]).origin;
if (!origin.startsWith('https://') && !/^http:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(origin))
  throw new Error('Use the actual HTTPS deployment origin, or localhost for a local smoke check.');
const local = origin.startsWith('http://');
const canonicalOrigin = local ? deployment.site : origin;
const failures = [];
const assets = new Set();
const routes = [
  '/',
  '/printer-finder/',
  '/compare/?printers=rollo-wireless,brother-ql1110nwb',
  '/cost-calculator/',
  '/guides/',
  '/guides/choose-label-printer/',
  '/printers/rollo-wireless/',
  '/privacy/',
  '/affiliate-disclosure/',
];
async function get(route) {
  return fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
}
for (const route of routes) {
  const response = await get(route);
  const html = await response.text();
  if (response.status !== 200) failures.push(`${route}: HTTP ${response.status}`);
  if (!html.includes('content="noindex, nofollow"'))
    failures.push(`${route}: missing HTML noindex`);
  if (!local && !response.headers.get('x-robots-tag')?.includes('noindex'))
    failures.push(`${route}: missing HTTP noindex`);
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (!canonical || new URL(canonical).origin !== canonicalOrigin)
    failures.push(`${route}: canonical differs from the stable URL`);
  for (const match of html.matchAll(/(?:src|href)="(\/(?:_astro|images)\/[^"?#]+)"/g))
    assets.add(match[1]);
  console.log(`${response.status} ${route}`);
}
for (const route of [
  '/does-not-exist-deployment-check/',
  '/.env',
  '/.git/config',
  '/src/data/printers.ts',
  '/README.md',
  '/sitemap-index.xml',
]) {
  const response = await get(route);
  await response.body?.cancel();
  if (response.status !== 404) failures.push(`${route}: expected 404, got ${response.status}`);
  console.log(`${response.status} ${route}`);
}
const robots = await (await get('/robots.txt')).text();
if (/Sitemap:/i.test(robots)) failures.push('Preview robots must not advertise a sitemap');
for (const asset of assets) {
  const response = await get(asset);
  await response.body?.cancel();
  if (!response.ok) failures.push(`${asset}: HTTP ${response.status}`);
}
console.log(
  `Checked ${routes.length} pages, ${assets.size} assets, 404/private paths, preview robots, canonical origins and noindex.`,
);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
