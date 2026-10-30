// HTTP checks of our own deployment only. Never follow product/affiliate links.
import { readdir, readFile } from 'node:fs/promises';
import { deployment } from './deployment-env.mjs';
import { amazonLinkFor, resolveAmazonStoreId } from '../src/lib/affiliate.ts';
import { resolveAnalyticsConfig } from '../src/lib/analytics.ts';
const analytics = resolveAnalyticsConfig(process.env);
if (!process.argv[2])
  throw new Error('Usage: npm run check:deployment -- https://YOUR-ACTUAL-PROJECT.pages.dev');
const origin = new URL(process.argv[2]).origin;
if (!origin.startsWith('https://') && !/^http:\/\/(localhost|127\.0\.0\.1)(:|$)/.test(origin))
  throw new Error('Use the actual HTTPS deployment origin, or localhost for a local smoke check.');
const local = origin.startsWith('http://');
const canonicalOrigin = local ? deployment.site : origin;
const failures = [];
const assets = new Set();
const artifactFiles = (await readdir('dist', { recursive: true })).map((name) =>
  name.replaceAll('\\', '/'),
);
const routes = artifactFiles
  .filter((name) => name === 'index.html' || name.endsWith('/index.html'))
  .map((name) => `/${name.replace(/index\.html$/, '')}`);
routes.push('/compare/?printers=rollo-wireless,brother-ql1110nwb');
const amazonTag = resolveAmazonStoreId(process.env.PUBLIC_AMAZON_ASSOCIATE_TAG);
let paidLinks = 0;
async function get(route) {
  return fetch(new URL(route, origin), { signal: AbortSignal.timeout(15000) });
}
for (const route of routes) {
  const response = await get(route);
  const html = await response.text();
  if (response.status !== 200) failures.push(`${route}: HTTP ${response.status}`);
  const htmlNoindex = /name="robots" content="[^"]*noindex/.test(html);
  const headerNoindex = response.headers.get('x-robots-tag')?.includes('noindex') || false;
  if (htmlNoindex === deployment.indexable || (!local && headerNoindex === deployment.indexable))
    failures.push(`${route}: public indexing policy differs from the intended build`);
  const canonical = html.match(/rel="canonical"\s+href="([^"]+)"/)?.[1];
  if (!canonical || new URL(canonical).origin !== canonicalOrigin)
    failures.push(`${route}: canonical differs from the stable URL`);
  if (canonical && new URL(canonical).pathname !== new URL(route, origin).pathname)
    failures.push(`${route}: canonical path differs from the requested editorial page`);
  if (!html.includes('As an Amazon Associate I earn from qualifying purchases.'))
    failures.push(`${route}: missing public Amazon disclosure`);
  if (
    /<script\b[^>]*src="https?:\/\/[^\"]*(?:cloudflareinsights|googletagmanager|google-analytics)/i.test(
      html,
    )
  )
    failures.push(`${route}: third-party measurement script must not load before consent`);
  const measurementId = html.match(/data-measurement-id="([^"]+)"/)?.[1];
  if (analytics.enabled && measurementId !== analytics.measurementId)
    failures.push(`${route}: missing or mismatched consent-gated measurement destination`);
  if (!analytics.enabled && measurementId)
    failures.push(`${route}: measurement controls present while integration is disabled`);
  for (const match of html.matchAll(/<a\b[^>]*data-link-kind="affiliate"[^>]*>[\s\S]*?<\/a>/g)) {
    const anchor = match[0];
    const id = anchor.match(/data-printer-id="([^"]+)"/)?.[1];
    const href = anchor.match(/href="([^"]+)"/)?.[1]?.replaceAll('&amp;', '&');
    if (
      !id ||
      href !== amazonLinkFor(id, amazonTag) ||
      !anchor.includes('(Paid link)') ||
      !anchor.includes('target="_blank"') ||
      !anchor.includes('rel="sponsored nofollow noopener noreferrer"')
    )
      failures.push(`${route}: invalid public paid link`);
    paidLinks++;
  }
  const localName =
    new URL(route, origin).pathname === '/'
      ? 'index.html'
      : `${new URL(route, origin).pathname.slice(1)}index.html`;
  const localHtml = await readFile(`dist/${localName}`, 'utf8');
  const expected = [...localHtml.matchAll(/<a\b[^>]*data-link-kind="affiliate"/g)].length;
  if ([...html.matchAll(/<a\b[^>]*data-link-kind="affiliate"/g)].length !== expected)
    failures.push(`${route}: paid-link count differs from the verified local artifact`);
  if (
    ['/about/', '/contact/', '/privacy/'].includes(route) &&
    !html.includes('mailto:hello.jclabs@gmail.com')
  )
    failures.push(`${route}: missing real contact email`);
  if (
    route === '/privacy/' &&
    (!html.includes('12 months') || html.includes('Provisional notice') === deployment.indexable)
  )
    failures.push('Privacy: retention or legal launch status differs from the intended build');
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
  ...(deployment.indexable ? [] : ['/sitemap-index.xml', '/sitemap-0.xml']),
]) {
  const response = await get(route);
  await response.body?.cancel();
  if (response.status !== 404) failures.push(`${route}: expected 404, got ${response.status}`);
  console.log(`${response.status} ${route}`);
}
const robots = await (await get('/robots.txt')).text();
if (!deployment.indexable && /Sitemap:/i.test(robots))
  failures.push('Preview robots must not advertise a sitemap');
if (deployment.indexable) {
  if (!robots.includes(`${canonicalOrigin}/sitemap-index.xml`))
    failures.push('Production sitemap is not advertised correctly');
  for (const route of ['/sitemap-index.xml', '/sitemap-0.xml']) {
    const response = await get(route);
    const xml = await response.text();
    if (!response.ok || !xml.includes(canonicalOrigin))
      failures.push(`${route}: invalid public sitemap`);
  }
}
const verificationName = 'google7bb345f95d638147.html';
const verification = await get(`/${verificationName}`);
if (
  verification.status !== 200 ||
  (await verification.text()) !== (await readFile(`public/${verificationName}`, 'utf8'))
)
  failures.push('Public Google verification file does not match the original payload');
for (const asset of assets) {
  const response = await get(asset);
  await response.body?.cancel();
  if (!response.ok) failures.push(`${asset}: HTTP ${response.status}`);
}
console.log(
  `Checked ${routes.length} page requests, ${assets.size} assets, ${paidLinks} paid-link occurrences (without requesting Amazon), contact, privacy, Google verification, private paths, robots, canonicals and indexing policy.`,
);
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
